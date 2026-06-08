export type UploadMediaResponse = {
  original: {
    id: string
    url: string
    key: string
    width: number
    height: number
    fileSize: number
    mimeType: string
  }
  thumbnail: {
    id: string
    url: string
    key: string
    width: number
    height: number
    fileSize: number
    mimeType: string
  }
}

export type DeleteAvatarRequest = {
  mediaId: string
}

export type ProfileAvatarImage = {
  id: string
  url: string
  key: string
  width: number
  height: number
  fileSize: number
  mimeType: string
}

export type ProfileAvatar = {
  original: ProfileAvatarImage
  thumbnail: ProfileAvatarImage
}

export type GetProfileResponse = {
  firstName: string
  lastName: string
  login: string
  birthday: string
  countryId: string
  cityId: string
  aboutMe: string
  avatar: ProfileAvatar | null
}

export type UpdateProfileRequest = {
  firstName?: string
  lastName?: string
  birthday?: string
  countryId?: string
  cityId?: string
  aboutMe?: string
  login?: string
}
