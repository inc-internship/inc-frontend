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

export type PaymentsHistoryItem = {
  id: string
  paymentDate: string
  subscriptionExpiresAt: string
  amount: string
  planName: string
  paymentSystem: 'STRIPE' | 'PAYPAL'
  status: string
  failureReason?: string
}

export type PaymentsHistoryResponse = {
  items: PaymentsHistoryItem[]
  totalCount: number
  page: number
  pageSize: number
  pagesCount: number
}

export type PaymentsHistoryArgs = {
  page?: number
  pageSize?: number
}
