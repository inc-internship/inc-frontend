'use client'

import { useCallback, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

import {
  useCreatePaymentMutation,
  useGetCurrentSubscriptionQuery,
  useUpdateAutoRenewalMutation,
} from '@/entities/billing'
import type { CurrentSubscription } from '@/entities/billing'
import { getApiErrorMessage } from '@/shared/api/lib/getApiErrorMessage'
import { DEFAULT_ACCOUNT_TYPE } from './accountManagement.constants'
import type { AccountType, PaymentProvider } from './accountManagement.types'
import { getPaymentReturnStatus, getSearchParamsWithoutPaymentStatus } from './paymentReturn'
import { readPendingPayment, removePendingPayment, savePendingPayment } from './pendingPayment'
import { useSubscriptionSelection } from './useSubscriptionSelection'

type CurrentSubscriptionOverride =
  | { overridden: false }
  | {
      overridden: true
      source: CurrentSubscription | null
      sourceFulfilledTimeStamp?: number
      value: CurrentSubscription | null
    }

type CurrentSubscriptionSyncResult =
  | { status: 'error' }
  | { status: 'success'; value: CurrentSubscription | null }

export const usePaymentFlow = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString()
  const [createPayment, createPaymentState] = useCreatePaymentMutation()
  const [updateAutoRenewal, updateAutoRenewalState] = useUpdateAutoRenewalMutation()
  const {
    data: fetchedCurrentSubscription,
    fulfilledTimeStamp: currentSubscriptionFulfilledTimeStamp,
    isFetching: isCurrentSubscriptionFetching,
    refetch: refetchCurrentSubscription,
  } = useGetCurrentSubscriptionQuery()
  const [accountType, setAccountType] = useState<AccountType>(DEFAULT_ACCOUNT_TYPE)
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<PaymentProvider | null>(
    null,
  )
  const [isCreatePaymentModalOpen, setIsCreatePaymentModalOpen] = useState(false)
  const [isPaymentRequestErrorModalOpen, setIsPaymentRequestErrorModalOpen] = useState(false)
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false)
  const [currentSubscriptionOverride, setCurrentSubscriptionOverride] =
    useState<CurrentSubscriptionOverride>({ overridden: false })
  const [isPaymentRequestPending, setIsPaymentRequestPending] = useState(false)

  const paymentReturnStatus = getPaymentReturnStatus(searchParams)
  const fetchedSubscription = fetchedCurrentSubscription ?? null
  const isCurrentSubscriptionOverrideActive =
    currentSubscriptionOverride.overridden &&
    currentSubscriptionOverride.source === fetchedSubscription &&
    currentSubscriptionOverride.sourceFulfilledTimeStamp === currentSubscriptionFulfilledTimeStamp
  const currentSubscription = isCurrentSubscriptionOverrideActive
    ? currentSubscriptionOverride.value
    : fetchedSubscription

  const {
    isSubscriptionPlansFetching,
    options: subscriptionOptions,
    selectedSubscription,
    subscriptionPlan,
    onSubscriptionPlanChange,
    resetSubscriptionPlanSelection,
    restoreSubscriptionPlanSelection,
  } = useSubscriptionSelection({ currentSubscription })
  const hasActiveSubscription = currentSubscription !== null
  const effectiveAccountType: AccountType = hasActiveSubscription ? 'business' : accountType
  const isBusinessAccount = effectiveAccountType === 'business'

  const isAutoRenewalEnabled = currentSubscription?.autoRenewal ?? false
  const isCreatePaymentLoading = createPaymentState.isLoading || isPaymentRequestPending
  const isPaymentSuccessModalOpen = paymentReturnStatus === 'success'
  const isPaymentErrorModalOpen = paymentReturnStatus === 'error' || isPaymentRequestErrorModalOpen
  const isPaymentDisabled =
    isCreatePaymentLoading || isSubscriptionPlansFetching || !selectedSubscription
  const createPaymentDescription = hasActiveSubscription
    ? 'This payment will extend your current subscription.'
    : 'Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings'

  const accountTypeChangeHandler = (nextAccountType: AccountType) => {
    if (hasActiveSubscription && nextAccountType === 'personal') {
      return
    }

    setAccountType(nextAccountType)

    if (nextAccountType === 'business') {
      resetSubscriptionPlanSelection()
    }
  }

  const clearPaymentSearchParams = useCallback(() => {
    const nextQuery = getSearchParamsWithoutPaymentStatus(searchParamsString)

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }, [pathname, router, searchParamsString])

  const syncCurrentSubscription = useCallback(async (): Promise<CurrentSubscriptionSyncResult> => {
    try {
      const nextCurrentSubscription = await refetchCurrentSubscription().unwrap()

      return { status: 'success', value: nextCurrentSubscription ?? null }
    } catch (error) {
      setCurrentSubscriptionOverride({ overridden: false })
      toast.error(getApiErrorMessage(error))

      return { status: 'error' }
    }
  }, [refetchCurrentSubscription])

  const autoRenewalChangeHandler = async (autoRenewal: boolean) => {
    if (
      !currentSubscription ||
      autoRenewal === isAutoRenewalEnabled ||
      updateAutoRenewalState.isLoading
    ) {
      return
    }

    setCurrentSubscriptionOverride({
      overridden: true,
      source: fetchedSubscription,
      sourceFulfilledTimeStamp: currentSubscriptionFulfilledTimeStamp,
      value: { ...currentSubscription, autoRenewal },
    })

    try {
      await updateAutoRenewal(autoRenewal).unwrap()
    } catch (error) {
      setCurrentSubscriptionOverride({ overridden: false })
      toast.error(getApiErrorMessage(error))
    }
  }

  const paymentClickHandler = (provider: PaymentProvider) => {
    if (provider !== 'stripe') {
      toast.error('PayPal payment is not available')

      return
    }

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
    if (selectedPaymentProvider !== 'stripe' || isCreatePaymentLoading) {
      return
    }

    if (!selectedSubscription) {
      toast.error('Subscription plan is unavailable')

      return
    }

    savePendingPayment({
      accountType: effectiveAccountType,
      subscriptionPlan,
    })
    setIsPaymentRequestPending(true)

    try {
      const response = await createPayment({
        planId: selectedSubscription.value,
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

    if (pendingPayment && (syncResult.status === 'error' || !syncResult.value?.planName)) {
      setAccountType(pendingPayment.accountType)
      restoreSubscriptionPlanSelection(pendingPayment.subscriptionPlan)
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
      restoreSubscriptionPlanSelection(pendingPayment.subscriptionPlan)
    } else {
      setAccountType('business')
      resetSubscriptionPlanSelection()
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
      isAutoRenewalUpdating: updateAutoRenewalState.isLoading,
      isSubscriptionPlansLoading: isSubscriptionPlansFetching,
      options: subscriptionOptions,
      selectedSubscription,
      subscriptionPlan,
      onAutoRenewalChange: autoRenewalChangeHandler,
      onSubscriptionPlanChange,
    },
    payment: {
      isPaymentDisabled,
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
