'use client'

import clsx from 'clsx'
import {
  formatChatListTime,
  getConversationPeer,
  getMessagePreview,
  type Conversation,
} from '@/entities/messenger'
import { useI18n } from '@/shared/i18n'
import { Avatar } from '@/shared/ui/Avatar'
import { Typography } from '@/shared/ui/Typography'
import s from './ChatListItem.module.scss'

type Props = {
  conversation: Conversation
  currentUserId?: string
  isActive: boolean
  onSelect: (conversationId: string) => void
}

export const ChatListItem = ({ conversation, currentUserId, isActive, onSelect }: Props) => {
  const { t, locale } = useI18n()
  const peer = getConversationPeer(conversation, currentUserId)
  const peerName = peer?.login || t('common.user')
  const preview = getMessagePreview(conversation, currentUserId, t('messenger.you'))
  const timeSource = conversation.lastMessage?.createdAt ?? conversation.updatedAt
  const timeLabel = timeSource ? formatChatListTime(timeSource, locale) : ''

  return (
    <button
      type="button"
      className={clsx(s.item, isActive && s.active)}
      onClick={() => onSelect(conversation.id)}
      aria-current={isActive ? 'true' : undefined}
    >
      <Avatar
        size={48}
        src={peer?.avatarUrl ?? null}
        alt={t('profile.altAvatar')}
        className={s.avatar}
      />
      <div className={s.content}>
        <div className={s.topRow}>
          <Typography variant="text-m-bold" className={s.name}>
            {peerName}
          </Typography>
          {timeLabel ? (
            <Typography variant="text-s" className={s.time}>
              {timeLabel}
            </Typography>
          ) : null}
        </div>
        {preview ? (
          <Typography variant="text-s" className={s.preview}>
            {preview}
          </Typography>
        ) : null}
      </div>
    </button>
  )
}
