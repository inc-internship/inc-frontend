export const API_ENDPOINT_NAMES = {
  createPayment: 'createPayment',
  createPost: 'createPost',
  deletePost: 'deletePost',
  getCurrentSubscription: 'getCurrentSubscription',
  getMe: 'getMe',
  getSessions: 'getSessions',
  terminateAllOtherSessions: 'terminateAllOtherSessions',
  terminateSession: 'terminateSession',
  updatePost: 'updatePost',
  uploadImages: 'uploadImages',
} as const

export const ENDPOINTS_WITH_REFRESH = new Set<string>([
  API_ENDPOINT_NAMES.getMe,
  API_ENDPOINT_NAMES.terminateSession,
  API_ENDPOINT_NAMES.getSessions,
  API_ENDPOINT_NAMES.terminateAllOtherSessions,
  API_ENDPOINT_NAMES.uploadImages,
  API_ENDPOINT_NAMES.createPost,
  API_ENDPOINT_NAMES.updatePost,
  API_ENDPOINT_NAMES.deletePost,
  API_ENDPOINT_NAMES.createPayment,
  API_ENDPOINT_NAMES.getCurrentSubscription,
])
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const API_V1_URL = `${BASE_URL}/api/v1`

export const SERVER_API_V1_URL = `${process.env.INTERNAL_API_URL ?? BASE_URL}/api/v1`

export const PASSWORD_RECOVERY_EMAIL_STORAGE_KEY = 'passwordRecoveryEmail'

export { ROUTES, getLocalizedRoute, type RoutePath } from './routes'
