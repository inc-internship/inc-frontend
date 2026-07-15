'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGetNotificationsInfiniteQuery } from '@/entities/notification/api/notification.api'
import { Button } from '@/shared/ui/Button'
import { Typography } from '@/shared/ui/Typography'
import { useI18n } from '@/shared/i18n'
import { DropDownCorner } from '@/widgets/header/icons/DropDownCorner'
import { BellIcon } from '@/widgets/header/icons/BellIcon'
import s from './NotificationsDropdown.module.scss'

const SEEN_NOTIFICATIONS_STORAGE_KEY = 'seenNotificationIds'

const getRelativeTime = (
  value: string,
  t: (key: string, params?: Record<string, string | number>) => string,
) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return t('notifications.relative.justNow')
  }

  const diffMs = Date.now() - date.getTime()
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
  const [seenNotificationIds, setSeenNotificationIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    const storedValue = window.localStorage.getItem(SEEN_NOTIFICATIONS_STORAGE_KEY)

    if (!storedValue) {
      return []
    }

    try {
      const parsedValue = JSON.parse(storedValue)

      return Array.isArray(parsedValue) ? parsedValue.filter(id => typeof id === 'string') : []
    } catch {
      return []
    }
  })

  const { data, isLoading, isError } = useGetNotificationsInfiniteQuery()

  const notifications = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data])
  const unreadCount = useMemo(
    () =>
      notifications.reduce(
        (acc, item) => (!item.isRead && !seenNotificationIds.includes(item.id) ? acc + 1 : acc),
        0,
      ),
    [notifications, seenNotificationIds],
  )

  const markNotificationsAsSeen = useCallback(() => {
    setSeenNotificationIds(prev => {
      const currentUnreadIds = notifications
        .filter(item => !item.isRead)
        .map(item => item.id)
        .filter(id => !prev.includes(id))

      return currentUnreadIds.length > 0 ? [...prev, ...currentUnreadIds] : prev
    })
  }, [notifications])

  const closeDropdown = useCallback(() => {
    markNotificationsAsSeen()
    setIsOpen(false)
  }, [markNotificationsAsSeen])

  useEffect(() => {
    window.localStorage.setItem(SEEN_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(seenNotificationIds))
  }, [seenNotificationIds])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeDropdown()
      }
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown()
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onEscape)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onEscape)
    }
  }, [closeDropdown, isOpen])

  return (
    <div ref={rootRef} className={s.root}>
      <Button
        iconOnly
        className={s.iconButton}
        aria-label={t('header.notifications')}
        aria-haspopup={true}
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            closeDropdown()
            return
          }

          setIsOpen(true)
        }}
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
            {isLoading && (
              <Typography variant="text-s" as="p" className={s.state}>
                {t('common.loading')}
              </Typography>
            )}

            {!isLoading && isError && (
              <Typography variant="text-s" as="p" className={s.state}>
                {t('common.somethingWentWrong')}
              </Typography>
            )}

            {!isLoading && !isError && notifications.length === 0 && (
              <Typography variant="text-s" as="p" className={s.state}>
                {t('notifications.empty')}
              </Typography>
            )}

            {!isLoading &&
              !isError &&
              notifications.map(item => (
                <article key={item.id} className={s.item}>
                  <div className={s.itemHeader}>
                    <Typography variant="text-s-semibold" as="h4" className={s.itemTitle}>
                      {t('notifications.itemTitle')}
                    </Typography>
                    {!item.isRead && !seenNotificationIds.includes(item.id) && (
                      <Typography variant="text-s" as="span" className={s.newLabel}>
                        {t('notifications.new')}
                      </Typography>
                    )}
                  </div>
                  <Typography variant="text-s" as="p" className={s.message}>
                    {item.message}
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
