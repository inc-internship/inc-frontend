import { baseApi } from '@/shared/api'
import { API_URLS } from '@/shared/constants'
import { MeData, meSchema } from '@/entities/auth'
import { getSessionsResponseSchema, GetSessionsResponse } from '@/entities/auth'
import {
  ConfirmationRequest,
  LoginArgs,
  ResponseLogin,
  RegisterRequest,
  ResendConfirmationRequest,
  PasswordRecoveryArgs,
  NewPasswordArgs,
  TerminateSessionArgs,
} from './auth.types'

const AUTH_API_URL = `${API_URLS.v1}/auth`
const SESSIONS_API_URL = `${API_URLS.v1}/sessions`

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<ResponseLogin, LoginArgs>({
      query: body => ({
        url: `${AUTH_API_URL}/login`,
        method: 'post',
        body,
      }),
    }),
    getMe: build.query<MeData, void>({
      query: () => `${AUTH_API_URL}/me`,
      transformResponse: (response: unknown) => {
        return meSchema.parse(response)
      },
    }),
    register: build.mutation<void, RegisterRequest>({
      query: body => ({
        url: `${AUTH_API_URL}/registration`,
        method: 'post',
        body,
      }),
    }),
    confirmation: build.mutation<void, ConfirmationRequest>({
      query: body => ({
        url: `${AUTH_API_URL}/registration/confirmation`,
        method: 'post',
        body,
      }),
    }),
    resendConfirmation: build.mutation<void, ResendConfirmationRequest>({
      query: body => ({
        url: `${AUTH_API_URL}/registration/confirmation/resend`,
        method: 'post',
        body,
      }),
    }),
    passwordRecovery: build.mutation<void, PasswordRecoveryArgs>({
      query: body => ({
        url: `${AUTH_API_URL}/password-recovery`,
        method: 'post',
        body,
      }),
    }),
    newPassword: build.mutation<void, NewPasswordArgs>({
      query: body => ({
        url: `${AUTH_API_URL}/new-password`,
        method: 'post',
        body,
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: `${AUTH_API_URL}/logout`,
        method: 'post',
      }),
    }),
    getSessions: build.query<GetSessionsResponse, void>({
      query: () => SESSIONS_API_URL,
      transformResponse: (response: unknown) => {
        return getSessionsResponseSchema.parse(response)
      },
      providesTags: ['Sessions'],
    }),
    terminateSession: build.mutation<void, TerminateSessionArgs>({
      query: ({ deviceId }) => ({
        url: `${SESSIONS_API_URL}/${deviceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sessions'],
    }),
    terminateAllOtherSessions: build.mutation<void, void>({
      query: () => ({
        url: SESSIONS_API_URL,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sessions'],
    }),
  }),
})

export const {
  useLoginMutation,
  useNewPasswordMutation,
  usePasswordRecoveryMutation,
  useRegisterMutation,
  useConfirmationMutation,
  useResendConfirmationMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
  useGetSessionsQuery,
  useTerminateSessionMutation,
  useTerminateAllOtherSessionsMutation,
} = authApi
