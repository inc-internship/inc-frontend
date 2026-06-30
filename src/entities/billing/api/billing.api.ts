import { baseApi } from '@/shared/api'
import { API_ENDPOINT_NAMES, API_V1_URL } from '@/shared/constants'
import type {
  CreatePaymentArgs,
  CreatePaymentResponse,
  CurrentSubscription,
  SubscriptionPlanInfo,
} from './billing.types'
import {
  mapCreatePaymentResponse,
  mapCurrentSubscriptionResponse,
  mapSubscriptionPlansResponse,
} from './billing.mappers'

const BILLING_URL = `${API_V1_URL}/billing`

export const billingApi = baseApi.injectEndpoints({
  endpoints: build => ({
    [API_ENDPOINT_NAMES.getSubscriptionPlans]: build.query<SubscriptionPlanInfo[], void>({
      query: () => `${BILLING_URL}/plans`,
      transformResponse: mapSubscriptionPlansResponse,
      providesTags: ['Billing'],
    }),
    [API_ENDPOINT_NAMES.createPayment]: build.mutation<CreatePaymentResponse, CreatePaymentArgs>({
      query: body => ({
        url: `${BILLING_URL}/checkout/stripe`,
        method: 'POST',
        body,
      }),
      transformResponse: mapCreatePaymentResponse,
      invalidatesTags: ['Billing'],
    }),
    [API_ENDPOINT_NAMES.updateAutoRenewal]: build.mutation<void, boolean>({
      query: autoRenewal => ({
        url: `${BILLING_URL}/auto-renewal`,
        method: 'PATCH',
        body: { autoRenewal },
      }),
      invalidatesTags: ['Billing'],
    }),
    [API_ENDPOINT_NAMES.getCurrentSubscription]: build.query<CurrentSubscription | null, void>({
      query: () => `${BILLING_URL}/current`,
      transformResponse: mapCurrentSubscriptionResponse,
      providesTags: ['Billing'],
    }),
  }),
})

export const {
  useCreatePaymentMutation,
  useGetCurrentSubscriptionQuery,
  useGetSubscriptionPlansQuery,
  useLazyGetCurrentSubscriptionQuery,
  useUpdateAutoRenewalMutation,
} = billingApi
