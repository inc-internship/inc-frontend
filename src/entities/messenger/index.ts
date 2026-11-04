export type {
  Conversation,
  ConversationsWithCursor,
  CreateConversationRequest,
  CreateConversationResponse,
  MessageReceivedPayload,
  MessengerMessage,
  MessengerParticipant,
  MessagesWithCursor,
  MessengerSocketErrorPayload,
  SendMessageRequest,
  UserTypingPayload,
} from './api/messenger.types'
export {
  messengerApi,
  messengerBaseApi,
  useGetConversationsInfiniteQuery,
  useGetConversationQuery,
  useGetOrCreateConversationMutation,
  useGetMessagesInfiniteQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
} from './api/messenger.api'
export {
  applyLastMessageToConversations,
  mapReceivedMessage,
  upsertIncomingMessage,
} from './model/applyIncomingMessage'
export {
  formatChatListTime,
  formatMessageTime,
  getConversationPeer,
  getMessagePreview,
  isOutgoingMessage,
} from './model/messenger.utils'
