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
    logout: build.mutation<void, void>({
      query: () => ({
        url: `${API_V1_URL}/auth/logout`,
        method: 'post',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await queryFulfilled
        try {
          localStorage.removeItem('accessToken')
        } catch (error) {
          console.error('Logout failed:', error)
        }
      },
    }),
    getMe: build.query<MeData, void>({
      query: () => `${API_V1_URL}/auth/me`,
      transformResponse: (response: unknown) => {
        return meSchema.parse(response)
      },
    }),
  }),
})

export const { useLoginMutation, useGetMeQuery, useLogoutMutation } = authApi
