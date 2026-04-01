export type LoginArgs = {
  email: string
  password: string
}

export type ResponseLogin = {
  accessToken: string
}

export type SignUpApiRequest = {
  login: string
  email: string
  password: string
  redirectUrl: string
}
// ======
export type ConfirmationRequest = {
  code: string
}
