export type LoginArgs = {
  email: string
  password: string
}

export type ResponseLogin = {
  accessToken: string
}

export type PasswordRecoveryArgs = {
  email: string
  redirectUrl: string
}

export type NewPasswordArgs = {
  newPassword: string
  recoveryCode: string
}
