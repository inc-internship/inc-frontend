import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import {
  ConfirmationRequest,
  LoginArgs,
  ResponseLogin,
  SignUpApiRequest,
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
    signUp: build.mutation<void, SignUpApiRequest>({
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
  }),
})

export const {
  useLoginMutation,
  useSignUpMutation,
  useConfirmationMutation,
  useResendConfirmationMutation,
} = authApi
