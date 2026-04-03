import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { LoginArgs, LogoutResponse, ResponseLogin } from './auth.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<ResponseLogin, LoginArgs>({
      query: body => ({
        url: `${API_V1_URL}/auth/login`,
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

export const { useLoginMutation, useLogoutMutation } = authApi
