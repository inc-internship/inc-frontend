'use client'

import clsx from 'clsx'
import {
  formatMessageTime,
  isOutgoingMessage,
  type MessengerMessage,
  type MessengerParticipant,
} from '@/entities/messenger'
import { useI18n } from '@/shared/i18n'
import { Avatar } from '@/shared/ui/Avatar'
import { Typography } from '@/shared/ui/Typography'
import { DoneAllIcon } from '@/shared/ui/icons'
import s from './MessageBubble.module.scss'

type Props = {
  message: MessengerMessage
  peer: MessengerParticipant | null
  currentUserId?: string
  showAvatar: boolean
}

export const MessageBubble = ({ message, peer, currentUserId, showAvatar }: Props) => {
  const { t, locale } = useI18n()
  const isOutgoing = isOutgoingMessage(message, currentUserId)
  const timeLabel = formatMessageTime(message.createdAt, locale)

  return (
    <div className={clsx(s.row, isOutgoing ? s.outgoing : s.incoming)}>
      {!isOutgoing ? (
        <div className={s.avatarSlot}>
          {showAvatar ? (
            <Avatar size={36} src={peer?.avatarUrl ?? null} alt={t('profile.altAvatar')} />
          ) : null}
        </div>
      ) : null}

      <div className={s.bubbleColumn}>
        <div className={clsx(s.bubble, isOutgoing ? s.bubbleOutgoing : s.bubbleIncoming)}>
          <Typography variant="text-m" className={s.text}>
            {message.text ?? ''}
          </Typography>
        </div>
        <div className={clsx(s.meta, isOutgoing && s.metaOutgoing)}>
          {isOutgoing ? <DoneAllIcon className={s.check} /> : null}
          <Typography variant="text-s" className={s.time}>
            {timeLabel}
          </Typography>
        </div>
      </div>
    </div>
  )
}
