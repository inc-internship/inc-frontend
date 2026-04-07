import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { MeData, meSchema } from '@/entities/auth'
import {
  ConfirmationRequest,
  LoginArgs,
  ResponseLogin,
  RegisterRequest,
  ResendConfirmationRequest,
} from './auth.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<ResponseLogin, LoginArgs>({
      query: body => ({
        url: `${API_V1_URL}/auth/login`,
        method: 'post',
        body,
      }),
    }),
    getMe: build.query<MeData, void>({
      query: () => `${API_V1_URL}/auth/me`,
      transformResponse: (response: unknown) => {
        return meSchema.parse(response)
      },
    }),
    register: build.mutation<void, RegisterRequest>({
      query: body => ({
        url: `${API_V1_URL}/auth/registration`,
        method: 'post',
        body,
      }),
    }),
    confirmation: build.mutation<void, ConfirmationRequest>({
      query: body => ({
        url: `${API_V1_URL}/auth/registration/confirmation`,
        method: 'post',
        body,
      }),
    }),
    resendConfirmation: build.mutation<void, ResendConfirmationRequest>({
      query: body => ({
        url: `${API_V1_URL}/auth/registration/confirmation/resend`,
        method: 'post',
        body,
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: `${API_V1_URL}/auth/logout`,
        method: 'post',
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useConfirmationMutation,
  useResendConfirmationMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi
