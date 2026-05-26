import type { BillingPaymentType, BillingSubscriptionType } from '@/entities/billing'
import type {
  AccountType,
  PaymentProvider,
  RadioOption,
  SubscriptionPlan,
} from './accountManagement.types'

export const DEFAULT_ACCOUNT_TYPE: AccountType = 'personal'
export const DEFAULT_SUBSCRIPTION_PLAN: SubscriptionPlan = 'day'
export const PENDING_PAYMENT_STORAGE_KEY = 'account-management-pending-payment'

export const accountTypeOptions: Array<RadioOption<AccountType>> = [
  { label: 'Personal', value: 'personal' },
  { label: 'Business', value: 'business' },
]

export const subscriptionOptions: Array<RadioOption<SubscriptionPlan> & { amount: number }> = [
  { amount: 10, label: '$10 per 1 Day', value: 'day' },
  { amount: 50, label: '$50 per 7 Day', value: 'week' },
  { amount: 100, label: '$100 per month', value: 'month' },
]

export const subscriptionAmounts = Object.fromEntries(
  subscriptionOptions.map(option => [option.value, option.amount]),
) as Record<SubscriptionPlan, number>

export const subscriptionPlanToApiType: Record<SubscriptionPlan, BillingSubscriptionType> = {
  day: 'DAY',
  month: 'MONTHLY',
  week: 'WEEKLY',
}

export const apiTypeToSubscriptionPlan: Record<BillingSubscriptionType, SubscriptionPlan> = {
  DAY: 'day',
  MONTHLY: 'month',
  WEEKLY: 'week',
}

export const paymentProviderToApiType: Record<PaymentProvider, BillingPaymentType> = {
  paypal: 'PAYPAL',
  stripe: 'STRIPE',
}
