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
