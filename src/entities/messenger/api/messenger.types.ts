export type MessengerParticipant = {
  id: string
  login: string | null
  avatarUrl: string | null
}

export type MessageType = 'TEXT' | 'IMAGE' | 'VOICE'

export type MessengerMessage = {
  id: string
  conversationId: string
  text: string | null
  type: MessageType
  sender: MessengerParticipant
  createdAt: string
}

export type ConversationType = 'DIRECT' | 'CHANNEL'

export type Conversation = {
  id: string
  type: ConversationType
  participants: MessengerParticipant[]
  lastMessage: MessengerMessage | null
  unreadCount: number
  updatedAt: string
}

export type ConversationsWithCursor = {
  items: Conversation[]
  nextCursor: string | null
}

export type MessagesWithCursor = {
  items: MessengerMessage[]
  nextCursor: string | null
}

export type CreateConversationRequest = {
  participantPublicId: string
}

export type CreateConversationResponse = {
  conversationPublicId: string
}

export type SendMessageRequest = {
  conversationId: string
  text: string
}

export type GetConversationsArgs = {
  cursor?: string
  limit?: number
}

export type GetMessagesArgs = {
  conversationId: string
  cursor?: string
  limit?: number
}
