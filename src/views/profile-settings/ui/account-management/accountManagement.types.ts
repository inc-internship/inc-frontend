export type AccountType = 'personal' | 'business'
export type SubscriptionPlan = 'day' | 'week' | 'month'

export type RadioOption<TValue extends string> = {
  label: string
  value: TValue
}
