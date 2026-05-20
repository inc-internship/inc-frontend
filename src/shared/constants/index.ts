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
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://minglo.blog'
export const BASE_REDIRECT_URL = 'https://minglo.blog'

export const API_V1_URL = `${BASE_URL}/api/v1`
export const PASSWORD_RECOVERY_EMAIL_STORAGE_KEY = 'passwordRecoveryEmail'

export { ROUTES, getLocalizedRoute, type RoutePath } from './routes'
