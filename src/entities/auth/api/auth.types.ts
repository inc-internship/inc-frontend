export type LoginArgs = {
  email: string
  password: string
}

export type ResponseLogin = {
  accessToken: string
}

export type MeData = {
  publicId: string
  login: string
  email: string
}
