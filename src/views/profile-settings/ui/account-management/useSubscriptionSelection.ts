'use client'

import { useMemo, useState } from 'react'

import { useGetSubscriptionPlansQuery, type CurrentSubscription } from '@/entities/billing'
import { DEFAULT_SUBSCRIPTION_PLAN, getSubscriptionOptions } from './accountManagement.constants'
import type { SubscriptionPlan } from './accountManagement.types'

type Args = {
  currentSubscription: CurrentSubscription | null
}

const normalizePlanName = (planName: string) => planName.trim().toLowerCase()

export const useSubscriptionSelection = ({ currentSubscription }: Args) => {
  const { data: subscriptionPlans = [], isFetching: isSubscriptionPlansFetching } =
    useGetSubscriptionPlansQuery()
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan>(DEFAULT_SUBSCRIPTION_PLAN)
  const [hasSubscriptionPlanSelection, setHasSubscriptionPlanSelection] = useState(false)
  const subscriptionOptions = useMemo(
    () => getSubscriptionOptions(subscriptionPlans),
    [subscriptionPlans],
  )
  const currentSubscriptionOption = currentSubscription?.planName
    ? (subscriptionOptions.find(
        option =>
          normalizePlanName(option.name) === normalizePlanName(currentSubscription.planName ?? ''),
      ) ?? null)
    : null
  const selectedSubscriptionByState = subscriptionOptions.find(
    option => option.value === subscriptionPlan,
  )
  const selectedSubscription =
    (hasSubscriptionPlanSelection ? selectedSubscriptionByState : null) ??
    currentSubscriptionOption ??
    subscriptionOptions[0]
  const effectiveSubscriptionPlan = selectedSubscription?.value ?? subscriptionPlan

  const subscriptionPlanChangeHandler = (nextSubscriptionPlan: SubscriptionPlan) => {
    setSubscriptionPlan(nextSubscriptionPlan)
    setHasSubscriptionPlanSelection(true)
  }

  const resetSubscriptionPlanSelection = () => {
    setSubscriptionPlan(subscriptionOptions[0]?.value ?? DEFAULT_SUBSCRIPTION_PLAN)
    setHasSubscriptionPlanSelection(false)
  }

  const restoreSubscriptionPlanSelection = (nextSubscriptionPlan: SubscriptionPlan) => {
    setSubscriptionPlan(nextSubscriptionPlan)
    setHasSubscriptionPlanSelection(true)
  }

  return {
    isSubscriptionPlansFetching,
    options: subscriptionOptions,
    selectedSubscription,
    subscriptionPlan: effectiveSubscriptionPlan,
    onSubscriptionPlanChange: subscriptionPlanChangeHandler,
    resetSubscriptionPlanSelection,
    restoreSubscriptionPlanSelection,
  }
}
