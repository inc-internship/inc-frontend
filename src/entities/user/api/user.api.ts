import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import {
  DeleteAvatarRequest,
  GetProfileResponse,
  UpdateProfileRequest,
  UploadMediaResponse,
} from '@/entities/user/api/user.types'

export const userApi = baseApi.injectEndpoints({
  endpoints: build => ({
    uploadAvatarMedia: build.mutation<UploadMediaResponse, FormData>({
      query: body => ({
        url: `${API_V1_URL}/profile/upload-image`,
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
    getProfile: build.query<GetProfileResponse, string>({
      query: userId => ({
        url: `${API_V1_URL}/profile/${userId}`,
        method: 'get',
      }),
      providesTags: ['Profile'],
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
  useUploadAvatarMediaMutation,
  useDeleteAvatarMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = userApi
