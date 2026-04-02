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

// ======
export type ConfirmationRequest = {
  code: string
}

export type ResendConfirmationRequest = {
  email: string
  redirectUrl: string
}
