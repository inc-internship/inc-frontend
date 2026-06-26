import { baseApi } from '@/shared/api'
import { API_ENDPOINT_NAMES, API_V1_URL } from '@/shared/constants'
import type {
  CreatePaymentArgs,
  CreatePaymentResponse,
  CurrentSubscription,
  PaymentsHistoryArgs,
  PaymentsHistoryResponse,
} from './billing.types'
import {
  mapCreatePaymentResponse,
  mapCurrentSubscriptionResponse,
  mapGetPaymentsHistoryResponse,
} from './billing.mappers'

const SUBSCRIPTIONS_URL = `${API_V1_URL}/subscriptions`

export const billingApi = baseApi.injectEndpoints({
  endpoints: build => ({
    [API_ENDPOINT_NAMES.createPayment]: build.mutation<CreatePaymentResponse, CreatePaymentArgs>({
      query: body => ({
        url: SUBSCRIPTIONS_URL,
        method: 'POST',
        body,
      }),
      transformResponse: mapCreatePaymentResponse,
      invalidatesTags: ['Billing'],
    }),
    [API_ENDPOINT_NAMES.getCurrentSubscription]: build.query<CurrentSubscription | null, void>({
      query: () => `${SUBSCRIPTIONS_URL}/current-payment-subscriptions`,
      transformResponse: mapCurrentSubscriptionResponse,
      providesTags: ['Billing'],
    }),
    [API_ENDPOINT_NAMES.getPaymentsHistory]: build.query<
      PaymentsHistoryResponse,
      PaymentsHistoryArgs
    >({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: `${API_V1_URL}/billing/history`,
        params: { page, pageSize },
      }),
      transformResponse: mapGetPaymentsHistoryResponse,
      providesTags: ['Billing'],
    }),
  }),
})

export const {
  useCreatePaymentMutation,
  useLazyGetCurrentSubscriptionQuery,
  useGetPaymentsHistoryQuery,
} = billingApi
