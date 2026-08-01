export type NotificationItem = {
  id: string
  type:
    | 'SUBSCRIPTION_ACTIVATED'
    | 'PAYMENT_SOON'
    | 'SUBSCRIPTION_EXPIRES_IN_DAYS'
    | 'SUBSCRIPTION_EXPIRES_TOMORROW'
  message: string
  isRead: boolean
  createdAt: string
}

export type GetNotificationsResponse = {
  items: NotificationItem[]
  nextCursor: string | null
  hasNextPage: boolean
  totalCount: number
}
