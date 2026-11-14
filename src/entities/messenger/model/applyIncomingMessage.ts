import type { InfiniteData } from '@reduxjs/toolkit/query'
import type {
  ConversationsWithCursor,
  MessageReceivedPayload,
  MessageType,
  MessengerMessage,
  MessagesWithCursor,
} from '../api/messenger.types'

const MESSAGE_TYPES: MessageType[] = ['TEXT', 'IMAGE', 'VOICE']

const toMessageType = (value: string): MessageType =>
  MESSAGE_TYPES.includes(value as MessageType) ? (value as MessageType) : 'TEXT'

export const mapReceivedMessage = (payload: MessageReceivedPayload): MessengerMessage => ({
  id: payload.id,
  conversationId: payload.conversationId,
  text: payload.text,
  type: toMessageType(payload.type),
  createdAt: payload.createdAt,
  sender: {
    id: payload.sender.id,
    login: payload.sender.login ?? payload.sender.name ?? null,
    avatarUrl: payload.sender.avatarUrl ?? null,
  },
})

export const upsertIncomingMessage = (
  draft: InfiniteData<MessagesWithCursor, string | null>,
  message: MessengerMessage,
) => {
  const exists = draft.pages.some(page => page.items.some(item => item.id === message.id))

  if (exists || !draft.pages[0]) {
    return
  }

  draft.pages[0].items.unshift(message)
}

export const applyLastMessageToConversations = (
  draft: InfiniteData<ConversationsWithCursor, string | null>,
  message: MessengerMessage,
  incrementUnread: boolean,
): boolean => {
  let conversation: ConversationsWithCursor['items'][number] | undefined

  for (const page of draft.pages) {
    const index = page.items.findIndex(item => item.id === message.conversationId)

    if (index >= 0) {
      conversation = page.items[index]
      page.items.splice(index, 1)
      break
    }
  }

  if (!conversation || !draft.pages[0]) {
    return false
  }

  conversation.lastMessage = message
  conversation.updatedAt = message.createdAt
  conversation.unreadCount = incrementUnread ? conversation.unreadCount + 1 : 0
  draft.pages[0].items.unshift(conversation)

  return true
}
