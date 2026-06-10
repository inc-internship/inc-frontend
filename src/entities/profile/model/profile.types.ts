export type ProfileImage = {
  url: string
  id: string
}

export type ProfileAvatar = {
  original: ProfileImage
  thumbnail: ProfileImage
}

export type Profile = {
  login: string
  aboutMe: string | null
  avatar: ProfileAvatar
  firstName: string
  lastName: string
  birthday: string
  countryId: string
  cityId: string
}

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

export type UpdateProfileRequest = {
  firstName?: string
  lastName?: string
  birthday?: string
  countryId?: string
  cityId?: string
  aboutMe?: string
  login?: string
}
