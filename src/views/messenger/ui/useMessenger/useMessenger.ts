import { useCallback, useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import {
  applyLastMessageToConversations,
  mapReceivedMessage,
  messengerApi,
  type MessageReceivedPayload,
  type MessengerSocketErrorPayload,
  upsertIncomingMessage,
  type UserTypingPayload,
} from '@/entities/messenger'
import { selectUser } from '@/entities/user/user.slice'
import { MESSENGER_WS_CLIENT_EVENTS, MESSENGER_WS_SERVER_EVENTS } from '@/shared/constants'
import {
  getMessengerSocketOptions,
  getMessengerSocketUrl,
} from '@/shared/lib/getMessengerSocketUrl'
import { useAppDispatch, useAppSelector } from '@/shared/store'

export const useMessenger = (activeConversationId: string | null) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const socketRef = useRef<Socket | null>(null)

  // Инициализируем рефы начальными значениями
  const activeConversationIdRef = useRef(activeConversationId)
  const currentUserIdRef = useRef(user?.publicId)

  // 1. Ленивая инициализация токена для предотвращения каскадных рендеров и ошибок SSR
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return null
  })

  const [isConnected, setIsConnected] = useState(false)
  const [typingByConversationId, setTypingByConversationId] = useState<Record<string, boolean>>({})

  // 2. БЕЗОПАСНОЕ ОБНОВЛЕНИЕ РЕФОВ: переносим мутации refs внутрь эффекта синхронизации.
  // Это убирает ошибку ESLint, так как рендер остается чистым.
  useEffect(() => {
    activeConversationIdRef.current = activeConversationId
    currentUserIdRef.current = user?.publicId
  }, [activeConversationId, user?.publicId])

  // 3. Отслеживаем появление/обновление токена в localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('accessToken'))
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('local-storage-update', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage-update', handleStorageChange)
    }
  }, [])

  // 4. Управление жизненным циклом WebSocket-соединения на основе стейта token
  useEffect(() => {
    if (!token) {
      return
    }

    if (!socketRef.current) {
      socketRef.current = io(getMessengerSocketUrl(), getMessengerSocketOptions(token))
    }

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('Веб-сокеты для мессенджера подключены!')
      setIsConnected(true)
    })
    socket.on('disconnect', () => setIsConnected(false))
    socket.on('connect_error', () => setIsConnected(false))

    socket.on(MESSENGER_WS_SERVER_EVENTS.messageReceived, (payload: MessageReceivedPayload) => {
      const message = mapReceivedMessage(payload)
      const isOwnMessage = message.sender.id === currentUserIdRef.current
      const isActiveConversation = message.conversationId === activeConversationIdRef.current
      const incrementUnread = !isOwnMessage && !isActiveConversation

      dispatch(
        messengerApi.util.updateQueryData(
          'getMessages',
          { conversationId: message.conversationId },
          draft => {
            upsertIncomingMessage(draft, message)
          },
        ),
      )

      let conversationPatched = false
      dispatch(
        messengerApi.util.updateQueryData('getConversations', undefined, draft => {
          conversationPatched = applyLastMessageToConversations(draft, message, incrementUnread)
        }),
      )

      dispatch(
        messengerApi.util.updateQueryData('getConversation', message.conversationId, draft => {
          draft.lastMessage = message
          draft.updatedAt = message.createdAt
          if (!incrementUnread) {
            draft.unreadCount = 0
          }
        }),
      )

      if (!conversationPatched) {
        dispatch(messengerApi.util.invalidateTags(['Conversations']))
      }

      if (isActiveConversation && !isOwnMessage) {
        void dispatch(messengerApi.endpoints.markConversationRead.initiate(message.conversationId))
      }

      setTypingByConversationId(prev =>
        prev[message.conversationId] ? { ...prev, [message.conversationId]: false } : prev,
      )
    })

    socket.on(MESSENGER_WS_SERVER_EVENTS.userTyping, (payload: UserTypingPayload) => {
      if (payload.userPublicId === currentUserIdRef.current) {
        return
      }

      setTypingByConversationId(prev => ({
        ...prev,
        [payload.conversationId]: payload.isTyping,
      }))
    })

    socket.on(MESSENGER_WS_SERVER_EVENTS.error, (payload: MessengerSocketErrorPayload) => {
      console.error('[messenger]', payload.message)
    })

    return () => {
      socket.removeAllListeners()
      socket.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [dispatch, token])

  const sendMessage = useCallback((conversationId: string, text: string) => {
    if (!socketRef.current?.connected) {
      return false
    }

    socketRef.current.emit(MESSENGER_WS_CLIENT_EVENTS.messageSend, { conversationId, text })
    return true
  }, [])

  const startTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit(MESSENGER_WS_CLIENT_EVENTS.typingStart, { conversationId })
  }, [])

  const stopTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit(MESSENGER_WS_CLIENT_EVENTS.typingStop, { conversationId })
  }, [])

  return {
    sendMessage,
    startTyping,
    stopTyping,
    isConnected,
    isPeerTyping: activeConversationId ? !!typingByConversationId[activeConversationId] : false,
  }
}
