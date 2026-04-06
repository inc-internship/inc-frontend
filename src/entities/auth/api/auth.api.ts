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
    logout: build.mutation<null, void>({
      query: () => ({
        url: `${API_V1_URL}/auth/logout`,
        method: 'post',
        responseHandler: 'text',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await queryFulfilled
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken')
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          console.error('Logout failed:', message)
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
