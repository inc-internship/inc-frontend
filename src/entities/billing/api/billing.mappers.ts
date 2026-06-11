import { z } from 'zod'
import type {
  CreatePaymentResponse,
  CurrentSubscription,
  SubscriptionPlanInfo,
} from './billing.types'

const subscriptionTypeSchema = z.enum(['DAY', 'WEEKLY', 'MONTHLY'])
const subscriptionStatusSchema = z.enum(['PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED'])

const subscriptionFieldsShape = {
  autoRenewal: z.boolean().optional(),
  dateOfNextPayment: z.string().min(1).optional(),
  endDateOfSubscription: z.string().min(1).optional(),
  nextPayment: z.string().min(1).optional(),
  nextPaymentAt: z.string().min(1).optional(),
  nextPaymentDate: z.string().min(1).optional(),
  typeSubscription: subscriptionTypeSchema.optional(),
}

const subscriptionFieldsSchema = z.object(subscriptionFieldsShape).passthrough()

type SubscriptionFields = z.infer<typeof subscriptionFieldsSchema>

const subscriptionFieldKeys = Object.keys(subscriptionFieldsShape) as Array<
  keyof typeof subscriptionFieldsShape
>

const hasSubscriptionFields = (subscription: SubscriptionFields) => {
  return subscriptionFieldKeys.some(key => subscription[key] !== undefined)
}

const subscriptionSchema = subscriptionFieldsSchema.refine(hasSubscriptionFields)

const directSubscriptionSchema = subscriptionFieldsSchema
  .extend({ hasAutoRenewal: z.boolean().optional() })
  .refine(hasSubscriptionFields)

const currentSubscriptionEnvelopeSchema = z
  .object({
    data: z.array(subscriptionSchema).nullish(),
    hasAutoRenewal: z.boolean().optional(),
  })
  .passthrough()

const checkoutResponseSchema = z
  .object({
    checkoutUrl: z.string().min(1).optional(),
    paymentUrl: z.string().min(1).optional(),
    redirectUrl: z.string().min(1).optional(),
    url: z.string().min(1).optional(),
  })
  .passthrough()

const subscriptionPlanInfoSchema = z.object({
  currency: z.string(),
  durationDays: z.number(),
  id: z.string().min(1),
  name: z.string(),
  price: z.string(),
})

const subscriptionPlansResponseSchema = z.object({
  data: z.array(subscriptionPlanInfoSchema),
})

const backendSubscriptionSchema = z.object({
  autoRenewal: z.boolean(),
  endDate: z.string().nullish(),
  planName: z.string(),
  status: subscriptionStatusSchema,
})

const backendCurrentSubscriptionSchema = z.object({
  expiresAt: z.string().nullish(),
  nextPaymentDate: z.string().nullish(),
  subscriptions: z.array(backendSubscriptionSchema),
})

const getResponsePreview = (response: unknown) => {
  try {
    return JSON.stringify(response)?.slice(0, 500) ?? String(response)
  } catch {
    return '[unserializable response]'
  }
}

export const mapCreatePaymentResponse = (response: unknown): CreatePaymentResponse => {
  const result = checkoutResponseSchema.safeParse(response)
  const url = result.success
    ? (result.data.checkoutUrl ??
      result.data.url ??
      result.data.paymentUrl ??
      result.data.redirectUrl)
    : null

  if (!url) {
    throw new Error(
      `Payment creation response has no redirect url. Response: ${getResponsePreview(response)}`,
    )
  }

  return { url }
}

export const mapSubscriptionPlansResponse = (response: unknown): SubscriptionPlanInfo[] => {
  const result = subscriptionPlansResponseSchema.safeParse(response)

  return result.success ? result.data.data : []
}

const getNextPaymentDate = (subscription: SubscriptionFields) => {
  return (
    subscription.nextPaymentDate ??
    subscription.nextPayment ??
    subscription.dateOfNextPayment ??
    subscription.nextPaymentAt
  )
}

const mapSubscription = (
  subscription: SubscriptionFields,
  autoRenewalOverride?: boolean,
): CurrentSubscription => {
  return {
    autoRenewal: autoRenewalOverride ?? subscription.autoRenewal,
    endDateOfSubscription: subscription.endDateOfSubscription,
    nextPaymentDate: getNextPaymentDate(subscription),
  }
}

const mapBackendCurrentSubscription = (response: unknown): CurrentSubscription | null => {
  const result = backendCurrentSubscriptionSchema.safeParse(response)

  if (!result.success || !result.data.expiresAt) {
    return null
  }

  const activeSubscription =
    result.data.subscriptions.find(subscription => subscription.status === 'ACTIVE') ??
    result.data.subscriptions[0]

  return {
    autoRenewal: activeSubscription?.autoRenewal,
    endDateOfSubscription: result.data.expiresAt,
    nextPaymentDate: result.data.nextPaymentDate ?? undefined,
    planName: activeSubscription?.planName,
  }
}

export const mapCurrentSubscriptionResponse = (response: unknown): CurrentSubscription | null => {
  const backendCurrentSubscription = mapBackendCurrentSubscription(response)

  if (backendCurrentSubscription) {
    return backendCurrentSubscription
  }

  const envelopeResult = currentSubscriptionEnvelopeSchema.safeParse(response)

  if (envelopeResult.success && Array.isArray(envelopeResult.data.data)) {
    const [subscription] = envelopeResult.data.data

    return subscription ? mapSubscription(subscription, envelopeResult.data.hasAutoRenewal) : null
  }

  const directSubscriptionResult = directSubscriptionSchema.safeParse(response)

  if (!directSubscriptionResult.success) {
    return null
  }

  return mapSubscription(
    directSubscriptionResult.data,
    directSubscriptionResult.data.hasAutoRenewal,
  )
}
