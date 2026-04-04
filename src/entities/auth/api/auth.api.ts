import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { LoginArgs, ResponseLogin } from './auth.types'
import { MeData, meSchema } from '@/entities/auth'

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
  }),
})

export const { useLoginMutation, useGetMeQuery } = authApi
