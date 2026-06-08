import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import type { Profile } from '../model/profile.types'

export const profileApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getProfile: build.query<Profile, { userId: string }>({
      query: ({ userId }) => `${API_V1_URL}/profile/${userId}`,
    }),
  }),
})

export const { useGetProfileQuery } = profileApi
