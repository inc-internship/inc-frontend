import type { Locale } from '@/shared/i18n/config'
import type { Conversation, MessengerMessage, MessengerParticipant } from '../api/messenger.types'

export const getConversationPeer = (
  conversation: Conversation,
  currentUserId?: string | null,
): MessengerParticipant | null => {
  if (!conversation.participants.length) {
    return null
  }

  if (!currentUserId) {
    return conversation.participants[0] ?? null
  }

  return (
    conversation.participants.find(participant => participant.id !== currentUserId) ??
    conversation.participants[0] ??
    null
  )
}

export const getMessagePreview = (
  conversation: Conversation,
  currentUserId: string | undefined,
  youLabel: string,
): string => {
  const lastMessage = conversation.lastMessage

  if (!lastMessage?.text) {
    return ''
  }

  const isOutgoing = !!currentUserId && lastMessage.sender.id === currentUserId
  const prefix = isOutgoing ? `${youLabel}: ` : ''

  return `${prefix}${lastMessage.text}`
}

export const isOutgoingMessage = (
  message: MessengerMessage,
  currentUserId?: string | null,
): boolean => {
  if (!currentUserId) {
    return false
  }

  return message.sender.id === currentUserId
}

export const formatChatListTime = (isoDate: string, locale: Locale): string => {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMessageDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfMessageDay.getTime()) / (24 * 60 * 60 * 1000),
  )

  const localeCode = locale === 'ru' ? 'ru-RU' : 'en-GB'

  if (dayDiff === 0) {
    return new Intl.DateTimeFormat(localeCode, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date)
  }

  if (dayDiff > 0 && dayDiff < 7) {
    return new Intl.DateTimeFormat(localeCode, { weekday: 'short' }).format(date)
  }

  return new Intl.DateTimeFormat(localeCode, {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export const formatMessageTime = (isoDate: string, locale: Locale): string => {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const localeCode = locale === 'ru' ? 'ru-RU' : 'en-GB'

  return new Intl.DateTimeFormat(localeCode, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}
