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

const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL

if (!appBaseUrl) {
  throw new Error('NEXT_PUBLIC_BASE_URL is required')
}

export const APP_BASE_URL = appBaseUrl.replace(/\/+$/, '')
export const BASE_REDIRECT_URL = APP_BASE_URL

export const API_URLS = {
  v1: `${APP_BASE_URL}/api/v1`,
} as const

export const PASSWORD_RECOVERY_EMAIL_STORAGE_KEY = 'passwordRecoveryEmail'

export { ROUTES, getLocalizedRoute, type RoutePath } from './routes'
