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
import { MessageBubble } from '../MessageBubble/MessageBubble'
import { MessageComposer } from '../MessageComposer/MessageComposer'
import s from './ChatWindow.module.scss'

type Props = {
  conversationId: string | null
}

export const ChatWindow = ({ conversationId }: Props) => {
  const { t } = useI18n()
  const user = useAppSelector(selectUser)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [markRead] = useMarkConversationReadMutation()

  const { data: conversation } = useGetConversationQuery(conversationId ?? '', {
    skip: !conversationId,
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
    { skip: !conversationId },
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
        <Typography variant="text-m-bold" className={s.title}>
          {peer?.login || t('common.user')}
        </Typography>
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

      <MessageComposer conversationId={conversationId} />
    </section>
  )
}
