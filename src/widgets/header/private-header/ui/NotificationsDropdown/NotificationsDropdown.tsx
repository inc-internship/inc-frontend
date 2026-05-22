'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Typography } from '@/shared/ui/Typography'
import { BellIcon } from '@/widgets/header/icons/BellIcon'
import { useI18n } from '@/shared/i18n'
import s from './NotificationsDropdown.module.scss'
import { DropDownCorner } from '@/widgets/header/icons/DropDownCorner'

type NotificationItem = {
  id: string
  type:
    | 'SUBSCRIPTION_ACTIVATED'
    | 'PAYMENT_SOON'
    | 'SUBSCRIPTION_EXPIRES_IN_DAYS'
    | 'SUBSCRIPTION_EXPIRES_TOMORROW'
    | 'UNKNOWN'
  payload: Record<string, string | number>
  createdAt: Date
  isUnread: boolean
}

type RawNotificationEvent = {
  id: string
  type: string
  payload?: Record<string, unknown>
  createdAt: string
  isUnread: boolean
}

const MOCK_LOADING = false
const MOCK_ERROR = false
const MOCK_EMPTY = false

const KNOWN_NOTIFICATION_TYPES = new Set<NotificationItem['type']>([
  'SUBSCRIPTION_ACTIVATED',
  'PAYMENT_SOON',
  'SUBSCRIPTION_EXPIRES_IN_DAYS',
  'SUBSCRIPTION_EXPIRES_TOMORROW',
  'UNKNOWN',
])

const notificationMessageKeyByType: Record<NotificationItem['type'], string> = {
  SUBSCRIPTION_ACTIVATED: 'notifications.messages.subscriptionActivated',
  PAYMENT_SOON: 'notifications.messages.paymentSoon',
  SUBSCRIPTION_EXPIRES_IN_DAYS: 'notifications.messages.subscriptionExpiresInDays',
  SUBSCRIPTION_EXPIRES_TOMORROW: 'notifications.messages.subscriptionExpiresTomorrow',
  UNKNOWN: 'notifications.messages.unknown',
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toTranslationPayload = (value: unknown): Record<string, string | number> => {
  if (!isRecord(value)) {
    return {}
  }

  return Object.entries(value).reduce<Record<string, string | number>>((acc, [key, fieldValue]) => {
    if (typeof fieldValue === 'string' || typeof fieldValue === 'number') {
      acc[key] = fieldValue
    }

    return acc
  }, {})
}

const toNotificationType = (type: string): NotificationItem['type'] =>
  KNOWN_NOTIFICATION_TYPES.has(type as NotificationItem['type'])
    ? (type as NotificationItem['type'])
    : 'UNKNOWN'

const normalizeNotification = (event: RawNotificationEvent): NotificationItem => {
  const parsedDate = new Date(event.createdAt)

  return {
    id: event.id,
    type: toNotificationType(event.type),
    payload: toTranslationPayload(event.payload),
    createdAt: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
    isUnread: Boolean(event.isUnread),
  }
}

const MOCK_WS_EVENTS: RawNotificationEvent[] = [
  {
    id: '1',
    type: 'SUBSCRIPTION_ACTIVATED',
    payload: { date: '07.06.2026' },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    isUnread: true,
  },
  {
    id: '2',
    type: 'PAYMENT_SOON',
    payload: { date: '10.06.2026' },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isUnread: true,
  },
  {
    id: '3',
    type: 'SUBSCRIPTION_EXPIRES_IN_DAYS',
    payload: { days: 7 },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isUnread: true,
  },
  {
    id: '4',
    type: 'UNSUPPORTED_BACKEND_EVENT',
    payload: { rawType: 'UNSUPPORTED_BACKEND_EVENT' },
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isUnread: true,
  },
]

const getRelativeTime = (
  value: Date,
  t: (key: string, params?: Record<string, string | number>) => string,
) => {
  const diffMs = Date.now() - value.getTime()
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000))

  if (diffHours < 1) {
    return t('notifications.relative.justNow')
  }

  if (diffHours < 24) {
    return t('notifications.relative.hoursAgo', { count: diffHours })
  }

  const days = Math.floor(diffHours / 24)

  return t('notifications.relative.daysAgo', { count: days })
}

const formatUnreadCount = (count: number) => {
  if (count > 99) {
    return '99+'
  }

  return String(count)
}

export const NotificationsDropdown = () => {
  const { t } = useI18n()
  const rootRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)

  const notifications = useMemo(
    () => (MOCK_EMPTY ? [] : MOCK_WS_EVENTS.map(normalizeNotification)),
    [],
  )
  const unreadCount = useMemo(() => {
    return notifications.reduce((acc, item) => (item.isUnread ? acc + 1 : acc), 0)
  }, [notifications])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onEscape)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onEscape)
    }
  }, [isOpen])

  return (
    <div ref={rootRef} className={s.root}>
      <Button
        iconOnly
        className={s.iconButton}
        aria-label={t('header.notifications')}
        aria-haspopup={true}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <BellIcon />
      </Button>

      {unreadCount > 0 && (
        <span
          className={s.badge}
          aria-label={t('notifications.unreadBadgeAria', { count: unreadCount })}
        >
          {formatUnreadCount(unreadCount)}
        </span>
      )}

      {isOpen && (
        <div className={s.dropdown} role="dialog" aria-label={t('header.notifications')}>
          <DropDownCorner className={s.corner} />
          <Typography variant="text-m-bold" as="h3" className={s.title}>
            {t('header.notifications')}
          </Typography>
          <div className={s.divider} />

          <div className={s.list}>
            {MOCK_LOADING && (
              <Typography variant="text-s" as="p" className={s.state}>
                {t('common.loading')}
              </Typography>
            )}

            {!MOCK_LOADING && MOCK_ERROR && (
              <Typography variant="text-s" as="p" className={s.state}>
                {t('common.somethingWentWrong')}
              </Typography>
            )}

            {!MOCK_LOADING && !MOCK_ERROR && notifications.length === 0 && (
              <Typography variant="text-s" as="p" className={s.state}>
                {t('notifications.empty')}
              </Typography>
            )}

            {!MOCK_LOADING &&
              !MOCK_ERROR &&
              notifications.map(item => (
                <article key={item.id} className={s.item}>
                  <div className={s.itemHeader}>
                    <Typography variant="text-s-semibold" as="h4" className={s.itemTitle}>
                      {t('notifications.itemTitle')}
                    </Typography>
                    {item.isUnread && (
                      <Typography variant="text-s" as="span" className={s.newLabel}>
                        {t('notifications.new')}
                      </Typography>
                    )}
                  </div>
                  <Typography variant="text-s" as="p" className={s.message}>
                    {t(notificationMessageKeyByType[item.type], item.payload)}
                  </Typography>
                  <Typography variant="text-s" as="time" className={s.time}>
                    {getRelativeTime(item.createdAt, t)}
                  </Typography>
                </article>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
