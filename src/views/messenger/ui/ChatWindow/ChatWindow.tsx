'use client'

import { useEffect, useMemo, useRef } from 'react'
import {
  getConversationPeer,
  isOutgoingMessage,
  useGetConversationQuery,
  useGetMessagesInfiniteQuery,
  useMarkConversationReadMutation,
} from '@/entities/messenger'
import { selectUser } from '@/entities/user/user.slice'
import { useI18n } from '@/shared/i18n'
import { useAppSelector } from '@/shared/store'
import { Avatar } from '@/shared/ui/Avatar'
import { Typography } from '@/shared/ui/Typography'
import { MessageComposer } from '../MessageComposer/MessageComposer'
import { MessageBubble } from '../MessageBubble/MessageBubble'
import s from './ChatWindow.module.scss'

type Props = {
  conversationId: string | null
  sendMessage: (conversationId: string, text: string) => boolean
  startTyping: (conversationId: string) => void
  stopTyping: (conversationId: string) => void
  isPeerTyping: boolean
}

export const ChatWindow = ({
  conversationId,
  sendMessage,
  startTyping,
  stopTyping,
  isPeerTyping,
}: Props) => {
  const { t } = useI18n()
  const user = useAppSelector(selectUser)
  const token = localStorage.getItem('accessToken')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [markRead] = useMarkConversationReadMutation()

  const { data: conversation } = useGetConversationQuery(conversationId ?? '', {
    skip: !conversationId || !token,
  })

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetMessagesInfiniteQuery(
    { conversationId: conversationId ?? '' },
    { skip: !conversationId || !token },
  )

  const peer = conversation ? getConversationPeer(conversation, user?.publicId) : null

  const messages = useMemo(() => {
    const items = messagesData?.pages.flatMap(page => page.items) ?? []
    // API returns newest first; chat UI shows oldest → newest
    return [...items].reverse()
  }, [messagesData])

  useEffect(() => {
    if (!conversationId) {
      return
    }

    void markRead(conversationId)
  }, [conversationId, markRead])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationId, messages.length])

  if (!conversationId) {
    return (
      <section className={s.emptyState}>
        <div className={s.emptyCard}>
          <Typography variant="text-m-bold" className={s.emptyText}>
            {t('messenger.chooseChat')}
          </Typography>
        </div>
      </section>
    )
  }

  return (
    <section className={s.root}>
      <header className={s.header}>
        <Avatar size={48} src={peer?.avatarUrl ?? null} alt={t('profile.altAvatar')} />
        <div className={s.headerText}>
          <Typography variant="text-m-bold" className={s.title}>
            {peer?.login || t('common.user')}
          </Typography>
          {isPeerTyping ? (
            <Typography variant="text-s" className={s.typing}>
              {t('messenger.typing')}
            </Typography>
          ) : null}
        </div>
      </header>

      <div className={s.messages}>
        {hasNextPage ? (
          <button
            type="button"
            className={s.loadOlder}
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? t('common.loading') : t('messenger.loadOlder')}
          </button>
        ) : null}

        {isMessagesLoading ? (
          <Typography variant="text-s" className={s.status}>
            {t('common.loading')}
          </Typography>
        ) : null}

        {isMessagesError ? (
          <Typography variant="text-s" className={s.status}>
            {t('common.somethingWentWrong')}
          </Typography>
        ) : null}

        {messages.map((message, index) => {
          const previous = messages[index - 1]
          const showAvatar =
            !isOutgoingMessage(message, user?.publicId) &&
            (!previous ||
              isOutgoingMessage(previous, user?.publicId) ||
              previous.sender.id !== message.sender.id)

          return (
            <MessageBubble
              key={message.id}
              message={message}
              peer={peer}
              currentUserId={user?.publicId}
              showAvatar={showAvatar}
            />
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <MessageComposer
        conversationId={conversationId}
        sendMessage={sendMessage}
        startTyping={startTyping}
        stopTyping={stopTyping}
      />
    </section>
  )
}
