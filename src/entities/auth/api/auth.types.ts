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
  captchaValue: string
}

export type NewPasswordArgs = {
  newPassword: string
  recoveryCode: string
}

export type RegisterRequest = {
  login: string
  email: string
  password: string
  redirectUrl: string
}

export type ErrorExtension = {
  field: string
  message: string
}

export type ApiErrorResponse = {
  timestamp: string
  path: string
  code: number
  message: string
  extensions?: ErrorExtension[]
}

export type ConfirmationRequest = {
  code: string
}

export type ResendConfirmationRequest = {
  email: string
  redirectUrl: string
}

export type TerminateSessionArgs = {
  deviceId: string
}
