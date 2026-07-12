import type { SubscriptionPlanInfo } from '@/entities/billing'
import type { AccountType, RadioOption, SubscriptionOption } from './accountManagement.types'

export const DEFAULT_ACCOUNT_TYPE: AccountType = 'personal'
export const DEFAULT_SUBSCRIPTION_PLAN = ''
export const PENDING_PAYMENT_STORAGE_KEY = 'account-management-pending-payment'

export const accountTypeOptions: Array<RadioOption<AccountType>> = [
  { label: 'Personal', value: 'personal' },
  { label: 'Business', value: 'business' },
]

const getFormattedPrice = ({ currency, price }: SubscriptionPlanInfo) => {
  return currency === 'USD' ? `$${price}` : `${price} ${currency}`
}

const getSubscriptionPeriodLabel = ({ durationDays, name }: SubscriptionPlanInfo) => {
  if (name.trim().toLowerCase().includes('month')) {
    return 'month'
  }

  return `${durationDays} ${durationDays === 1 ? 'Day' : 'Days'}`
}

const getSubscriptionOptionLabel = (plan: SubscriptionPlanInfo) => {
  const formattedPrice = getFormattedPrice(plan)

  return `${formattedPrice} per ${getSubscriptionPeriodLabel(plan)}`
}

export const getSubscriptionOptions = (plans: SubscriptionPlanInfo[]): SubscriptionOption[] => {
  return plans.map(plan => ({
    durationDays: plan.durationDays,
    label: getSubscriptionOptionLabel(plan),
    name: plan.name,
    value: plan.id,
  }))
}
