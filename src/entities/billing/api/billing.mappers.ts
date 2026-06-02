import { z } from 'zod'
import type { CreatePaymentResponse, CurrentSubscription } from './billing.types'

const subscriptionTypeSchema = z.enum(['DAY', 'WEEKLY', 'MONTHLY'])

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

// Object.keys loses literal keys; SubscriptionFields is inferred from this same shape.
const subscriptionFieldKeys = Object.keys(subscriptionFieldsShape) as Array<
  keyof typeof subscriptionFieldsShape
>

const hasSubscriptionFields = (subscription: SubscriptionFields) => {
  // Passthrough fields are ignored: only declared subscription fields prove there is a subscription.
  return subscriptionFieldKeys.some(key => subscription[key] !== undefined)
}

const subscriptionSchema = subscriptionFieldsSchema.refine(hasSubscriptionFields)
// hasAutoRenewal alone is not enough to prove an active subscription exists.
const directSubscriptionSchema = subscriptionFieldsSchema
  .extend({ hasAutoRenewal: z.boolean().optional() })
  .refine(hasSubscriptionFields)

const currentSubscriptionEnvelopeSchema = z
  .object({
    data: z.array(subscriptionSchema).nullish(),
    hasAutoRenewal: z.boolean().optional(),
  })
  .passthrough()

const createPaymentResponseSchema = z
  .object({
    paymentUrl: z.string().min(1).optional(),
    redirectUrl: z.string().min(1).optional(),
    url: z.string().min(1).optional(),
  })
  .passthrough()

const getResponsePreview = (response: unknown) => {
  try {
    return JSON.stringify(response)?.slice(0, 500) ?? String(response)
  } catch {
    return '[unserializable response]'
  }
}

export const mapCreatePaymentResponse = (response: unknown): CreatePaymentResponse => {
  const result = createPaymentResponseSchema.safeParse(response)
  const url = result.success
    ? (result.data.url ?? result.data.paymentUrl ?? result.data.redirectUrl)
    : null

  if (!url) {
    throw new Error(
      `Payment creation response has no redirect url. Response: ${getResponsePreview(response)}`,
    )
  }

  return { url }
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
    typeSubscription: subscription.typeSubscription,
  }
}

export const mapCurrentSubscriptionResponse = (response: unknown): CurrentSubscription | null => {
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
