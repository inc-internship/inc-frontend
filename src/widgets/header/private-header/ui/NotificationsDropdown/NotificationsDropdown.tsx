'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Typography } from '@/shared/ui/Typography'
import { BellIcon } from '@/widgets/header/icons/BellIcon'
import { useI18n } from '@/shared/i18n'
import s from './NotificationsDropdown.module.scss'

type NotificationItem = {
  id: string
  title: string
  message: string
  createdAt: Date
  isUnread: boolean
}

const MOCK_LOADING = false
const MOCK_ERROR = false
const MOCK_EMPTY = false

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'New notification!',
    message: 'Your profile details have been updated successfully.',
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    isUnread: true,
  },
  {
    id: '2',
    title: 'New notification!',
    message: 'A new login to your account was detected.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isUnread: false,
  },
  {
    id: '3',
    title: 'New notification!',
    message: 'Your post has new interactions. Open the profile page to see details.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isUnread: true,
  },
]

const getRelativeTime = (value: Date) => {
  const diffMs = Date.now() - value.getTime()
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000))

  if (diffHours < 1) {
    return 'just now'
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  }

  const days = Math.floor(diffHours / 24)

  return `${days} day${days === 1 ? '' : 's'} ago`
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

  const notifications = useMemo(() => (MOCK_EMPTY ? [] : MOCK_NOTIFICATIONS), [])
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
        <span className={s.badge} aria-label={`${unreadCount} unread notifications`}>
          {formatUnreadCount(unreadCount)}
        </span>
      )}

      {isOpen && (
        <div className={s.dropdown} role="dialog" aria-label={t('header.notifications')}>
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
                No notifications yet
              </Typography>
            )}

            {!MOCK_LOADING &&
              !MOCK_ERROR &&
              notifications.map(item => (
                <article key={item.id} className={s.item}>
                  <div className={s.itemHeader}>
                    <Typography variant="text-s-semibold" as="h4" className={s.itemTitle}>
                      {item.title}
                    </Typography>
                    {item.isUnread && (
                      <Typography variant="text-s" as="span" className={s.newLabel}>
                        New
                      </Typography>
                    )}
                  </div>
                  <Typography variant="text-s" as="p" className={s.message}>
                    {item.message}
                  </Typography>
                  <Typography variant="text-s" as="time" className={s.time}>
                    {getRelativeTime(item.createdAt)}
                  </Typography>
                </article>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
