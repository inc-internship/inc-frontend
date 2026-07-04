import type { BillingPaymentProvider } from '@/entities/billing'

export type AccountType = 'personal' | 'business'
export type SubscriptionPlan = string
export type PaymentProvider = BillingPaymentProvider

export type RadioOption<TValue extends string> = {
  disabled?: boolean
  label: string
  value: TValue
}

export type SubscriptionOption = RadioOption<SubscriptionPlan> & {
  durationDays?: number
  name: string
}
