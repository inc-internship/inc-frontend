import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { LoginArgs, ResponseLogin } from './auth.types'

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
      // async onQueryStarted(_, {dispatch, queryFulfilled}) {
      //     await queryFulfilled
      //     // deleteCookie('accessToken')
      //     dispatch(authApi.util.resetApiState())
      // },
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation } = authApi
