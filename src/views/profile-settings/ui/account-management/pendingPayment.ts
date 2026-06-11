import { PENDING_PAYMENT_STORAGE_KEY } from './accountManagement.constants'
import type { AccountType, SubscriptionPlan } from './accountManagement.types'

export type PendingPaymentState = {
  accountType: AccountType
  subscriptionPlan: SubscriptionPlan
}

const isAccountType = (value: unknown): value is AccountType => {
  return value === 'personal' || value === 'business'
}

const isSubscriptionPlan = (value: unknown): value is SubscriptionPlan => {
  return typeof value === 'string' && value.length > 0
}

export const readPendingPayment = (): PendingPaymentState | null => {
  try {
    const rawValue = sessionStorage.getItem(PENDING_PAYMENT_STORAGE_KEY)

    if (!rawValue) {
      return null
    }

    const pendingPayment = JSON.parse(rawValue) as Partial<PendingPaymentState>

    if (
      isAccountType(pendingPayment.accountType) &&
      isSubscriptionPlan(pendingPayment.subscriptionPlan)
    ) {
      return {
        accountType: pendingPayment.accountType,
        subscriptionPlan: pendingPayment.subscriptionPlan,
      }
    }
  } catch {}

  return null
}

export const savePendingPayment = (pendingPayment: PendingPaymentState) => {
  sessionStorage.setItem(PENDING_PAYMENT_STORAGE_KEY, JSON.stringify(pendingPayment))
}

export const removePendingPayment = () => {
  sessionStorage.removeItem(PENDING_PAYMENT_STORAGE_KEY)
}
