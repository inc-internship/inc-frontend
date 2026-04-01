import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { LoginArgs, MeData, ResponseLogin } from './auth.types'

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
    }),
  }),
})

export const { useLoginMutation, useGetMeQuery } = authApi
