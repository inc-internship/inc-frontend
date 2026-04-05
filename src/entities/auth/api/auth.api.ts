import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { LoginArgs, NewPasswordArgs, PasswordRecoveryArgs, ResponseLogin } from './auth.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<ResponseLogin, LoginArgs>({
      query: body => ({
        url: `${API_V1_URL}/auth/login`,
        method: 'post',
        body,
      }),
    }),
    passwordRecovery: build.mutation<void, PasswordRecoveryArgs>({
      query: body => ({
        url: `${API_V1_URL}/auth/password-recovery`,
        method: 'post',
        body,
      }),
    }),
    newPassword: build.mutation<void, NewPasswordArgs>({
      query: body => ({
        url: `${API_V1_URL}/auth/new-password`,
        method: 'post',
        body,
      }),
    }),
  }),
})

export const { useLoginMutation, useNewPasswordMutation, usePasswordRecoveryMutation } = authApi
