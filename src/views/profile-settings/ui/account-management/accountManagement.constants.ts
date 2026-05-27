import type { AccountType, RadioOption, SubscriptionPlan } from './accountManagement.types'

export const DEFAULT_ACCOUNT_TYPE: AccountType = 'personal'
export const DEFAULT_SUBSCRIPTION_PLAN: SubscriptionPlan = 'day'

export const accountTypeOptions: Array<RadioOption<AccountType>> = [
  { label: 'Personal', value: 'personal' },
  { label: 'Business', value: 'business' },
]

export const subscriptionOptions: Array<RadioOption<SubscriptionPlan>> = [
  { label: '$10 per 1 Day', value: 'day' },
  { label: '$50 per 7 Day', value: 'week' },
  { label: '$100 per month', value: 'month' },
]
