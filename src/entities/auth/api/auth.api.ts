import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { LoginArgs, ResponseLogin, SignUpApiRequest } from './auth.types'

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
    // signUp: build.mutation({
    //   async queryFn(body) {
    //     console.log('MOCK BODY:', body)
    //
    //     await new Promise(r => setTimeout(r, 1000))
    //
    //     if (body.login === 'error') {
    //       return {
    //         error: {
    //           status: 409,
    //           data: { message: 'User already exists' },
    //         },
    //       }
    //     }
    //
    //     return { data: { success: true } }
    //   },
    // }),
  }),
})

export const { useLoginMutation, useSignUpMutation } = authApi
