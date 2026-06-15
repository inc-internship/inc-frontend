'use client'

import { useCallback, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useCreatePaymentMutation, useLazyGetCurrentSubscriptionQuery } from '@/entities/billing'
import {
  apiTypeToSubscriptionPlan,
  DEFAULT_ACCOUNT_TYPE,
  DEFAULT_SUBSCRIPTION_PLAN,
  paymentProviderToApiType,
  subscriptionAmounts,
  subscriptionOptions,
  subscriptionPlanToApiType,
} from './accountManagement.constants'
import type { AccountType, PaymentProvider, SubscriptionPlan } from './accountManagement.types'
import { readPendingPayment, removePendingPayment, savePendingPayment } from './pendingPayment'

type PaymentReturnStatus = 'error' | 'success'

type SearchParamsReader = {
  get: (name: string) => string | null
}

const successStatuses = new Set(['success', 'succeeded', 'paid'])
const errorStatuses = new Set(['error', 'failed', 'cancelled', 'canceled'])

const normalizePaymentStatus = (status: string | null) => {
  return status?.trim().toLowerCase() ?? null
}

const getPaymentReturnStatus = (searchParams: SearchParamsReader): PaymentReturnStatus | null => {
  const rawStatus =
    searchParams.get('paymentStatus') ??
    searchParams.get('payment_status') ??
    searchParams.get('status') ??
    searchParams.get('result')
  const normalizedStatus = normalizePaymentStatus(rawStatus)

  if (successStatuses.has(normalizedStatus ?? '') || searchParams.get('success') === 'true') {
    return 'success'
  }

  if (
    errorStatuses.has(normalizedStatus ?? '') ||
    searchParams.get('failed') === 'true' ||
    searchParams.get('cancel') === 'true' ||
    searchParams.get('cancelled') === 'true' ||
    searchParams.get('canceled') === 'true'
  ) {
    return 'error'
  }

  return null
}

export const usePaymentFlow = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [createPayment, createPaymentState] = useCreatePaymentMutation()
  const [getCurrentSubscription, currentSubscriptionState] = useLazyGetCurrentSubscriptionQuery()
  const [accountType, setAccountType] = useState<AccountType>(DEFAULT_ACCOUNT_TYPE)
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan>(DEFAULT_SUBSCRIPTION_PLAN)
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<PaymentProvider | null>(
    null,
  )
  const [isCreatePaymentModalOpen, setIsCreatePaymentModalOpen] = useState(false)
  const [isPaymentRequestErrorModalOpen, setIsPaymentRequestErrorModalOpen] = useState(false)
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false)
  const [isAutoRenewalEnabled, setIsAutoRenewalEnabled] = useState(false)
  const [isPaymentRequestPending, setIsPaymentRequestPending] = useState(false)

  const paymentReturnStatus = getPaymentReturnStatus(searchParams)
  const isBusinessAccount = accountType === 'business'
  const isCreatePaymentLoading = createPaymentState.isLoading || isPaymentRequestPending
  const isPaymentSuccessModalOpen = paymentReturnStatus === 'success'
  const isPaymentErrorModalOpen = paymentReturnStatus === 'error' || isPaymentRequestErrorModalOpen
  const selectedSubscription = subscriptionOptions.find(option => option.value === subscriptionPlan)
  const createPaymentDescription = isAutoRenewalEnabled
    ? 'This payment will extend your current subscription.'
    : 'Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings'

  const accountTypeChangeHandler = (nextAccountType: AccountType) => {
    setAccountType(nextAccountType)

    if (nextAccountType === 'business') {
      setSubscriptionPlan(DEFAULT_SUBSCRIPTION_PLAN)
    }
  }

  const clearPaymentSearchParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete('paymentStatus')
    params.delete('payment_status')
    params.delete('status')
    params.delete('result')
    params.delete('success')
    params.delete('failed')
    params.delete('cancel')
    params.delete('cancelled')
    params.delete('canceled')

    const nextQuery = params.toString()

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }, [pathname, router, searchParams])

  const syncCurrentSubscription = useCallback(async () => {
    setAccountType('business')
    setIsAutoRenewalEnabled(true)

    try {
      const currentSubscription = await getCurrentSubscription().unwrap()

      if (currentSubscription?.typeSubscription) {
        setSubscriptionPlan(apiTypeToSubscriptionPlan[currentSubscription.typeSubscription])
      }

      if (currentSubscription) {
        setIsAutoRenewalEnabled(currentSubscription.autoRenewal)
      }
    } catch {}
  }, [getCurrentSubscription])

  const paymentClickHandler = (provider: PaymentProvider) => {
    setSelectedPaymentProvider(provider)
    setIsAgreementAccepted(false)
    setIsCreatePaymentModalOpen(true)
  }

  const createPaymentModalCloseHandler = () => {
    setIsCreatePaymentModalOpen(false)
    setSelectedPaymentProvider(null)
    setIsAgreementAccepted(false)
  }

  const paymentConfirmHandler = async () => {
    if (!selectedPaymentProvider || isCreatePaymentLoading) {
      return
    }

    savePendingPayment({ accountType, subscriptionPlan })
    setIsPaymentRequestPending(true)

    try {
      const response = await createPayment({
        amount: subscriptionAmounts[subscriptionPlan],
        baseUrl: `${window.location.origin}${pathname}`,
        paymentType: paymentProviderToApiType[selectedPaymentProvider],
        typeSubscription: subscriptionPlanToApiType[subscriptionPlan],
      }).unwrap()

      window.location.assign(response.url)
    } catch {
      setIsPaymentRequestPending(false)
      setIsCreatePaymentModalOpen(false)
      setIsPaymentRequestErrorModalOpen(true)
    }
  }

  const paymentSuccessConfirmHandler = async () => {
    const pendingPayment = readPendingPayment()

    if (pendingPayment) {
      setAccountType(pendingPayment.accountType)
      setSubscriptionPlan(pendingPayment.subscriptionPlan)
    }

    await syncCurrentSubscription()
    removePendingPayment()
    clearPaymentSearchParams()
  }

  const paymentReturnCloseHandler = () => {
    removePendingPayment()
    setIsPaymentRequestErrorModalOpen(false)
    clearPaymentSearchParams()
  }

  const backToPaymentHandler = () => {
    const pendingPayment = readPendingPayment()

    if (pendingPayment) {
      setAccountType(pendingPayment.accountType)
      setSubscriptionPlan(pendingPayment.subscriptionPlan)
    } else {
      setAccountType('business')
    }

    removePendingPayment()
    setIsPaymentRequestErrorModalOpen(false)
    clearPaymentSearchParams()
  }

  return {
    account: {
      accountType,
      isBusinessAccount,
      onAccountTypeChange: accountTypeChangeHandler,
    },
    subscription: {
      isAutoRenewalEnabled,
      selectedSubscription,
      subscriptionPlan,
      onSubscriptionPlanChange: setSubscriptionPlan,
    },
    payment: {
      isCreatePaymentLoading,
    },
    modals: {
      createPaymentDescription,
      isAgreementAccepted,
      isCreatePaymentModalOpen,
      isPaymentErrorModalOpen,
      isPaymentSuccessLoading: currentSubscriptionState.isFetching,
      isPaymentSuccessModalOpen,
      onAgreementChange: setIsAgreementAccepted,
    },
    handlers: {
      backToPaymentHandler,
      createPaymentModalCloseHandler,
      paymentClickHandler,
      paymentConfirmHandler,
      paymentReturnCloseHandler,
      paymentSuccessConfirmHandler,
    },
  }
}
