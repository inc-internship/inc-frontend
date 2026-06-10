export type ProfileImage = {
  url: string
}

export type ProfileAvatar = {
  original: ProfileImage
  thumbnail: ProfileImage
}

export type Profile = {
  login: string
  aboutMe: string | null
  avatar: ProfileAvatar
}
