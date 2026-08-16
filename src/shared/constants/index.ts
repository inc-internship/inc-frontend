export const API_ENDPOINT_NAMES = {
  createPayment: 'createPayment',
  createComment: 'createComment',
  createPost: 'createPost',
  deletePost: 'deletePost',
  getCommentReplies: 'getCommentReplies',
  getCurrentSubscription: 'getCurrentSubscription',
  getPostComments: 'getPostComments',
  getSubscriptionPlans: 'getSubscriptionPlans',
  getMe: 'getMe',
  getSessions: 'getSessions',
  terminateAllOtherSessions: 'terminateAllOtherSessions',
  terminateSession: 'terminateSession',
  replyToComment: 'replyToComment',
  toggleCommentLike: 'toggleCommentLike',
  updateAutoRenewal: 'updateAutoRenewal',
  updatePost: 'updatePost',
  uploadImages: 'uploadImages',
  updateProfile: 'updateProfile',
  uploadAvatarMedia: 'uploadAvatarMedia',
  getPaymentsHistory: 'getPaymentsHistory',
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
  API_ENDPOINT_NAMES.getPostComments,
  API_ENDPOINT_NAMES.getCommentReplies,
  API_ENDPOINT_NAMES.createComment,
  API_ENDPOINT_NAMES.replyToComment,
  API_ENDPOINT_NAMES.toggleCommentLike,
  API_ENDPOINT_NAMES.createPayment,
  API_ENDPOINT_NAMES.getCurrentSubscription,
  API_ENDPOINT_NAMES.getSubscriptionPlans,
  API_ENDPOINT_NAMES.updateAutoRenewal,
  API_ENDPOINT_NAMES.updateProfile,
  API_ENDPOINT_NAMES.uploadAvatarMedia,
  API_ENDPOINT_NAMES.getPaymentsHistory,
])

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const API_V1_URL = process.env.NODE_ENV === 'development' ? '/api/v1' : `${BASE_URL}/api/v1`

export const SERVER_API_V1_URL = `${process.env.INTERNAL_API_URL ?? BASE_URL}/api/v1`

export const PASSWORD_RECOVERY_EMAIL_STORAGE_KEY = 'passwordRecoveryEmail'

export { ROUTES, getLocalizedRoute, type RoutePath } from './routes'
