import { z } from 'zod'
import type { CreatePaymentResponse, CurrentSubscription } from './billing.types'

const subscriptionTypeSchema = z.enum(['DAY', 'WEEKLY', 'MONTHLY'])
const subscriptionSchema = z
  .object({
    autoRenewal: z.boolean().optional(),
    endDateOfSubscription: z.string().optional(),
    typeSubscription: subscriptionTypeSchema.optional(),
  })
  .passthrough()

const currentSubscriptionResponseSchema = z.union([
  subscriptionSchema,
  z
    .object({
      data: z.array(subscriptionSchema).optional(),
      hasAutoRenewal: z.boolean().optional(),
    })
    .passthrough(),
])

const createPaymentResponseSchema = z
  .object({
    paymentUrl: z.string().min(1).optional(),
    redirectUrl: z.string().min(1).optional(),
    url: z.string().min(1).optional(),
  })
  .passthrough()

const readStringField = (value: unknown, field: string) => {
  if (typeof value !== 'object' || value === null || !(field in value)) {
    return null
  }

  const fieldValue = (value as Record<string, unknown>)[field]

  return typeof fieldValue === 'string' && fieldValue.length > 0 ? fieldValue : null
}

export const mapCreatePaymentResponse = (response: unknown): CreatePaymentResponse => {
  const result = createPaymentResponseSchema.safeParse(response)
  const url = result.success
    ? (result.data.url ?? result.data.paymentUrl ?? result.data.redirectUrl)
    : null

  if (!url) {
    throw new Error('Payment creation response has no redirect url')
  }

  return { url }
}

export const mapCurrentSubscriptionResponse = (response: unknown): CurrentSubscription | null => {
  const result = currentSubscriptionResponseSchema.safeParse(response)

  if (!result.success) {
    return null
  }

  const responseRecord = result.data as Record<string, unknown>
  const source = Array.isArray(responseRecord.data) ? responseRecord.data[0] : responseRecord

  if (typeof source !== 'object' || source === null) {
    return null
  }

  const subscription = source as Record<string, unknown>
  const autoRenewal =
    typeof responseRecord.hasAutoRenewal === 'boolean'
      ? responseRecord.hasAutoRenewal
      : subscription.autoRenewal === true

  const endDateOfSubscription = readStringField(subscription, 'endDateOfSubscription') ?? undefined
  const typeSubscription = readStringField(subscription, 'typeSubscription') ?? undefined
  const parsedTypeSubscription = subscriptionTypeSchema.safeParse(typeSubscription)

  return {
    autoRenewal,
    endDateOfSubscription,
    typeSubscription: parsedTypeSubscription.success ? parsedTypeSubscription.data : undefined,
  }
}
