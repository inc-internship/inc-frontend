export type UploadMediaResponse = { ids: string[]; failedCount: number }

export type CreateAvatarResponse = { id: string }

export type CreateAvatarRequest = { uploadIds: string[] }

export type ProfileAvatar = {
  url: string
  mimeType: string
  fileSize: number
  width: number
  height: number
}

// Тип полного ответа GET /api/v1/profile/me
export type GetProfileResponse = {
  firstName: string
  lastName: string
  login: string
  birthday: string // ISO date "2000-01-01T00:00:00.000Z"
  countryId: string // UUID
  cityId: string // UUID
  aboutMe: string
  avatar: ProfileAvatar | null // может быть null, если аватар не установлен
}

export type UpdateProfileRequest = {
  firstName?: string
  lastName?: string
  birthday?: string // ISO 8601, например "2000-01-01T00:00:00.000Z"
  countryId?: string // UUID
  cityId?: string // UUID
  aboutMe?: string
}

export type FillProfileRequest = {
  firstName: string
  lastName: string
  birthday?: string
  countryId?: string
  cityId?: string
  aboutMe?: string
}
