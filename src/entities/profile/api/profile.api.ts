import { baseApi } from '@/shared/api'
import { API_V1_URL, BASE_URL } from '@/shared/constants'
import type {
  Profile,
  DeleteAvatarRequest,
  UpdateProfileRequest,
  UploadMediaResponse,
} from '../model/profile.types'

export const profileApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getProfile: build.query<Profile, { userId: string }>({
      query: ({ userId }) => `${API_V1_URL}/profile/${userId}`,
      providesTags: ['Profile'],
    }),
    uploadAvatarMedia: build.mutation<UploadMediaResponse, FormData>({
      query: body => ({
        url: `${BASE_URL}/api/v1/profile/upload-image`,
        method: 'post',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteAvatar: build.mutation<void, DeleteAvatarRequest>({
      query: body => ({
        url: `${API_V1_URL}/profile/avatar`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfile: build.mutation<void, UpdateProfileRequest>({
      query: body => ({
        url: `${API_V1_URL}/profile`,
        method: 'put',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const {
  useGetProfileQuery,
  useUploadAvatarMediaMutation,
  useDeleteAvatarMutation,
  useUpdateProfileMutation,
} = profileApi
