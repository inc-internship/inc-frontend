export type BillingPaymentProvider = 'paypal' | 'stripe'
export type BillingPaymentType = 'PAYPAL' | 'STRIPE'
export type BillingSubscriptionPlan = 'day' | 'week' | 'month'
export type BillingSubscriptionType = 'DAY' | 'WEEKLY' | 'MONTHLY'

export type CreatePaymentArgs = {
  amount: number
  baseUrl: string
  paymentType: BillingPaymentType
  typeSubscription: BillingSubscriptionType
}

export type CreatePaymentResponse = {
  url: string
}

export type CurrentSubscription = {
  autoRenewal: boolean
  endDateOfSubscription?: string
  typeSubscription?: BillingSubscriptionType
}
