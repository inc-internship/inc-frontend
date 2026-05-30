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

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const API_V1_URL = process.env.NODE_ENV === 'development' ? '/api/v1' : `${BASE_URL}/api/v1`

export const SERVER_API_V1_URL = `${process.env.INTERNAL_API_URL ?? BASE_URL}/api/v1`

export const PASSWORD_RECOVERY_EMAIL_STORAGE_KEY = 'passwordRecoveryEmail'

export { ROUTES, getLocalizedRoute, type RoutePath } from './routes'
