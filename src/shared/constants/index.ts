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
  getConversations: 'getConversations',
  getConversation: 'getConversation',
  getOrCreateConversation: 'getOrCreateConversation',
  getMessages: 'getMessages',
  sendMessage: 'sendMessage',
  markConversationRead: 'markConversationRead',
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

/** Socket.IO server origin (no path). Falls back to REST API host. */
export const NOTIFICATIONS_WS_URL = (
  process.env.NEXT_PUBLIC_WS_URL ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  'https://minglo.blog'
).replace(/\/$/, '')

export const NOTIFICATIONS_WS_NAMESPACE = '/notifications'
export const NOTIFICATION_WS_EVENT = 'NOTIFICATION'

export const API_V1_URL = process.env.NODE_ENV === 'development' ? '/api/v1' : `${BASE_URL}/api/v1`

export const SERVER_API_V1_URL = `${process.env.INTERNAL_API_URL ?? BASE_URL}/api/v1`

export const MESSENGER_BASE_URL =
  process.env.NEXT_PUBLIC_MESSENGER_API_URL ?? 'https://messenger.minglo.blog'

// Временно используем прямой URL даже в development для отладки
export const MESSENGER_API_V1_URL = `${MESSENGER_BASE_URL.replace(/\/$/, '')}/api/v1`
// Старый код:
// export const MESSENGER_API_V1_URL =
//   process.env.NODE_ENV === 'development'
//     ? '/messenger-api/api/v1'
//     : `${MESSENGER_BASE_URL.replace(/\/$/, '')}/api/v1`

export const MESSENGER_WS_URL = (
  process.env.NEXT_PUBLIC_MESSENGER_WS_URL ?? MESSENGER_BASE_URL
).replace(/\/$/, '')

export const MESSENGER_WS_NAMESPACE = '/messenger'
export const MESSENGER_WS_CLIENT_EVENTS = {
  messageSend: 'MESSAGE_SEND',
  typingStart: 'TYPING_START',
  typingStop: 'TYPING_STOP',
} as const
export const MESSENGER_WS_SERVER_EVENTS = {
  messageReceived: 'MESSAGE_RECEIVED',
  userTyping: 'USER_TYPING',
  error: 'ERROR',
} as const

export const PASSWORD_RECOVERY_EMAIL_STORAGE_KEY = 'passwordRecoveryEmail'

export { ROUTES, getLocalizedRoute, type RoutePath } from './routes'
