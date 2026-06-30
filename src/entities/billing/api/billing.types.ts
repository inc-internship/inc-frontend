export type BillingPaymentProvider = 'paypal' | 'stripe'

export type CreatePaymentArgs = {
  planId: string
}

export type CreatePaymentResponse = {
  url: string
}

export type SubscriptionPlanInfo = {
  currency: string
  durationDays: number
  id: string
  name: string
  price: string
}

export type CurrentSubscription = {
  autoRenewal?: boolean
  endDateOfSubscription?: string
  nextPaymentDate?: string
  planName?: string
}
