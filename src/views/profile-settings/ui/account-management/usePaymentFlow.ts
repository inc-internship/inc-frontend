'use client'

import { useCallback, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

import {
  useCancelAutoRenewalMutation,
  useCreatePaymentMutation,
  useGetCurrentSubscriptionQuery,
} from '@/entities/billing'
import type { CurrentSubscription } from '@/entities/billing'
import { getApiErrorMessage } from '@/shared/api/lib/getApiErrorMessage'
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

type CurrentSubscriptionOverride =
  | { overridden: false }
  | { overridden: true; value: CurrentSubscription | null }

type CurrentSubscriptionSyncResult =
  | { status: 'error' }
  | { status: 'success'; value: CurrentSubscription | null }

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

  if (successStatuses.has(normalizedStatus ?? '')) {
    return 'success'
  }

  if (errorStatuses.has(normalizedStatus ?? '')) {
    return 'error'
  }

  return null
}

export const usePaymentFlow = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString()
  const [cancelAutoRenewal, cancelAutoRenewalState] = useCancelAutoRenewalMutation()
  const [createPayment, createPaymentState] = useCreatePaymentMutation()
  const {
    data: fetchedCurrentSubscription,
    isFetching: isCurrentSubscriptionFetching,
    refetch: refetchCurrentSubscription,
  } = useGetCurrentSubscriptionQuery()
  const [accountType, setAccountType] = useState<AccountType>(DEFAULT_ACCOUNT_TYPE)
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan>(DEFAULT_SUBSCRIPTION_PLAN)
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<PaymentProvider | null>(
    null,
  )
  const [isCreatePaymentModalOpen, setIsCreatePaymentModalOpen] = useState(false)
  const [isPaymentRequestErrorModalOpen, setIsPaymentRequestErrorModalOpen] = useState(false)
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false)
  const [currentSubscriptionOverride, setCurrentSubscriptionOverride] =
    useState<CurrentSubscriptionOverride>({ overridden: false })
  const [hasSubscriptionPlanSelection, setHasSubscriptionPlanSelection] = useState(false)
  const [isPaymentRequestPending, setIsPaymentRequestPending] = useState(false)

  const paymentReturnStatus = getPaymentReturnStatus(searchParams)
  const currentSubscription = currentSubscriptionOverride.overridden
    ? currentSubscriptionOverride.value
    : (fetchedCurrentSubscription ?? null)
  const hasActiveSubscription = currentSubscription !== null
  const effectiveAccountType: AccountType = hasActiveSubscription ? 'business' : accountType
  const currentSubscriptionPlan = currentSubscription?.typeSubscription
    ? apiTypeToSubscriptionPlan[currentSubscription.typeSubscription]
    : null
  const effectiveSubscriptionPlan =
    hasSubscriptionPlanSelection || !currentSubscriptionPlan
      ? subscriptionPlan
      : currentSubscriptionPlan
  const isBusinessAccount = effectiveAccountType === 'business'
  // Unknown auto-renewal state is treated as disabled until the backend confirms it is enabled.
  const isAutoRenewalEnabled = currentSubscription?.autoRenewal ?? false
  const isCreatePaymentLoading = createPaymentState.isLoading || isPaymentRequestPending
  const isPaymentSuccessModalOpen = paymentReturnStatus === 'success'
  const isPaymentErrorModalOpen = paymentReturnStatus === 'error' || isPaymentRequestErrorModalOpen
  const selectedSubscription = subscriptionOptions.find(
    option => option.value === effectiveSubscriptionPlan,
  )
  const createPaymentDescription = hasActiveSubscription
    ? 'This payment will extend your current subscription.'
    : 'Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings'

  const accountTypeChangeHandler = (nextAccountType: AccountType) => {
    if (hasActiveSubscription && nextAccountType === 'personal') {
      return
    }

    setAccountType(nextAccountType)

    if (nextAccountType === 'business') {
      setSubscriptionPlan(DEFAULT_SUBSCRIPTION_PLAN)
      setHasSubscriptionPlanSelection(false)
    }
  }

  const subscriptionPlanChangeHandler = (nextSubscriptionPlan: SubscriptionPlan) => {
    setSubscriptionPlan(nextSubscriptionPlan)
    setHasSubscriptionPlanSelection(true)
  }

  const clearPaymentSearchParams = useCallback(() => {
    const params = new URLSearchParams(searchParamsString)

    params.delete('paymentStatus')
    params.delete('payment_status')
    params.delete('status')
    params.delete('result')

    const nextQuery = params.toString()

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }, [pathname, router, searchParamsString])

  const syncCurrentSubscription = useCallback(async (): Promise<CurrentSubscriptionSyncResult> => {
    try {
      const nextCurrentSubscription = await refetchCurrentSubscription().unwrap()

      setCurrentSubscriptionOverride({ overridden: true, value: nextCurrentSubscription ?? null })

      if (nextCurrentSubscription?.typeSubscription) {
        setSubscriptionPlan(apiTypeToSubscriptionPlan[nextCurrentSubscription.typeSubscription])
        setHasSubscriptionPlanSelection(false)
      }

      return { status: 'success', value: nextCurrentSubscription ?? null }
    } catch (error) {
      setCurrentSubscriptionOverride({ overridden: false })
      toast.error(getApiErrorMessage(error))

      return { status: 'error' }
    }
  }, [refetchCurrentSubscription])

  const cancelAutoRenewalHandler = async () => {
    if (!currentSubscription || !isAutoRenewalEnabled || cancelAutoRenewalState.isLoading) {
      return
    }

    const previousSubscription = currentSubscription

    setCurrentSubscriptionOverride({
      overridden: true,
      value: { ...currentSubscription, autoRenewal: false },
    })

    try {
      await cancelAutoRenewal().unwrap()
    } catch (error) {
      setCurrentSubscriptionOverride({ overridden: true, value: previousSubscription })
      toast.error(getApiErrorMessage(error))
    }
  }

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

    savePendingPayment({
      accountType: effectiveAccountType,
      subscriptionPlan: effectiveSubscriptionPlan,
    })
    setIsPaymentRequestPending(true)

    try {
      const response = await createPayment({
        amount: subscriptionAmounts[effectiveSubscriptionPlan],
        baseUrl: `${window.location.origin}${pathname}`,
        paymentType: paymentProviderToApiType[selectedPaymentProvider],
        typeSubscription: subscriptionPlanToApiType[effectiveSubscriptionPlan],
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
    const syncResult = await syncCurrentSubscription()

    if (pendingPayment && (syncResult.status === 'error' || !syncResult.value?.typeSubscription)) {
      setAccountType(pendingPayment.accountType)
      setSubscriptionPlan(pendingPayment.subscriptionPlan)
      setHasSubscriptionPlanSelection(true)
    }

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
      setHasSubscriptionPlanSelection(true)
    } else {
      setAccountType('business')
      setHasSubscriptionPlanSelection(false)
    }

    removePendingPayment()
    setIsPaymentRequestErrorModalOpen(false)
    clearPaymentSearchParams()
  }

  return {
    account: {
      accountType: effectiveAccountType,
      isBusinessAccount,
      onAccountTypeChange: accountTypeChangeHandler,
    },
    subscription: {
      currentSubscription,
      hasActiveSubscription,
      isAutoRenewalEnabled,
      isAutoRenewalUpdating: cancelAutoRenewalState.isLoading,
      selectedSubscription,
      subscriptionPlan: effectiveSubscriptionPlan,
      onCancelAutoRenewal: cancelAutoRenewalHandler,
      onSubscriptionPlanChange: subscriptionPlanChangeHandler,
    },
    payment: {
      isCreatePaymentLoading,
    },
    modals: {
      createPaymentDescription,
      isAgreementAccepted,
      isCreatePaymentModalOpen,
      isPaymentErrorModalOpen,
      isPaymentSuccessLoading: isCurrentSubscriptionFetching,
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
