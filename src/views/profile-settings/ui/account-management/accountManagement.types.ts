import type { BillingPaymentProvider, BillingSubscriptionPlan } from '@/entities/billing'

export type AccountType = 'personal' | 'business'
export type SubscriptionPlan = BillingSubscriptionPlan
export type PaymentProvider = BillingPaymentProvider

export type RadioOption<TValue extends string> = {
  label: string
  value: TValue
}
