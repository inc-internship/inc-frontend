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

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://minglo.blog'
export const BASE_REDIRECT_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://minglo.blog'

export const API_V1_URL = `${BACKEND_URL}/api/v1`
export const PASSWORD_RECOVERY_EMAIL_STORAGE_KEY = 'passwordRecoveryEmail'

export { ROUTES, getLocalizedRoute, type RoutePath } from './routes'
