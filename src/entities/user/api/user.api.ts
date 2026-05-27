import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import {
  CreateAvatarRequest,
  CreateAvatarResponse,
  FillProfileRequest,
  GetProfileResponse,
  UpdateProfileRequest,
  UploadMediaResponse,
} from '@/entities/user/api/user.types'

export const userApi = baseApi.injectEndpoints({
  endpoints: build => ({
    createAvatar: build.mutation<CreateAvatarResponse, CreateAvatarRequest>({
      query: body => ({
        url: `${API_V1_URL}/profile/create-avatar`,
        method: 'post',
        body,
      }),
      // invalidatesTags: ['Profile'],
    }),
    uploadAvatarMedia: build.mutation<UploadMediaResponse, FormData>({
      query: body => ({
        url: `${API_V1_URL}/profile/upload-image`,
        method: 'post',
        body,
      }),
    }),
    getProfile: build.query<GetProfileResponse, void>({
      query: () => ({
        url: `${API_V1_URL}/profile/me`,
        method: 'get',
      }),
    }),
    fillProfile: build.mutation<void, FillProfileRequest>({
      query: body => ({
        url: `${API_V1_URL}/profile/fill`,
        method: 'post',
        body,
      }),
      // invalidatesTags: ['Profile'],
    }),
    updateProfile: build.mutation<void, UpdateProfileRequest>({
      query: body => ({
        url: `${API_V1_URL}/profile`,
        method: 'put',
        body,
      }),
    }),
  }),
})

export const {
  useCreateAvatarMutation,
  useUploadAvatarMediaMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useFillProfileMutation,
} = userApi
