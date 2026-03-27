import { API_V1_PATH, baseApi } from '@/shared/api'
import { SignInRequestDto, SignInResponseDto, signInResponseSchema } from './contracts'

export const sessionApi = baseApi.injectEndpoints({
  endpoints: build => ({
    signIn: build.mutation<SignInResponseDto, SignInRequestDto>({
      query: body => ({
        url: `${API_V1_PATH}/auth/login`,
        method: 'post',
        body,
      }),
      transformResponse: response => signInResponseSchema.parse(response),
    }),
  }),
})

export const { useSignInMutation } = sessionApi
