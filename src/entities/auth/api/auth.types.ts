export type LoginArgs = {
  email: string
  password: string
}

export type ResponseLogin = {
  accessToken: string
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

export type Session = {
  ip: string
  lastActive: string // ISO date string
  deviceId: string
  deviceName: string
  browserName: string
  browserVersion: string
  osName: string
}

export type GetSessionsResponse = Session[]

export type TerminateSessionArgs = {
  deviceId: string
}
