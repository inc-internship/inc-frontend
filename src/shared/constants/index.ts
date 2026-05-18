export const ENDPOINTS_WITH_REFRESH = new Set([
  'getMe',
  'terminateSession',
  'getSessions',
  'terminateAllOtherSessions',
  'uploadImages',
  'createPost',
  'updatePost',
  'deletePost',
])

const normalizeOrigin = (origin: string) => origin.replace(/\/+$/, '')

export const BASE_URL = ''
export const BASE_REDIRECT_URL = normalizeOrigin(
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://minglo.blog',
)

export const API_V1_URL = '/api/v1'
export const PASSWORD_RECOVERY_EMAIL_STORAGE_KEY = 'passwordRecoveryEmail'

export { ROUTES, getLocalizedRoute, type RoutePath } from './routes'
