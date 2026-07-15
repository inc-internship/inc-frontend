'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGetNotificationsInfiniteQuery } from '@/entities/notification/api/notification.api'
import { Button } from '@/shared/ui/Button'
import { Typography } from '@/shared/ui/Typography'
import { useI18n } from '@/shared/i18n'
import { DropDownCorner } from '@/widgets/header/icons/DropDownCorner'
import { BellIcon } from '@/widgets/header/icons/BellIcon'
import type { NotificationItem } from '@/entities/notification/api/notification.types'
import s from './NotificationsDropdown.module.scss'

const SEEN_NOTIFICATIONS_STORAGE_KEY = 'seenNotificationIds'
const DATE_PATTERN = /\b\d{1,2}\.\d{1,2}\.\d{4}\b/
const DATE_PATTERN_GLOBAL = /\b\d{1,2}\.\d{1,2}\.\d{4}\b/g
const ISO_DATE_PATTERN = /\b\d{4}-\d{2}-\d{2}\b/
const ISO_DATE_PATTERN_GLOBAL = /\b\d{4}-\d{2}-\d{2}\b/g
const NUMBER_PATTERN = /\b\d+\b/

const notificationMessageKeyByType: Record<NotificationItem['type'], string> = {
  SUBSCRIPTION_ACTIVATED: 'notifications.messages.subscriptionActivated',
  PAYMENT_SOON: 'notifications.messages.paymentSoon',
  SUBSCRIPTION_EXPIRES_IN_DAYS: 'notifications.messages.subscriptionExpiresInDays',
  SUBSCRIPTION_EXPIRES_TOMORROW: 'notifications.messages.subscriptionExpiresTomorrow',
}

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

const normalizeDateForTranslation = (message: string) => {
  const dottedDate = message.match(DATE_PATTERN)?.[0]

  if (dottedDate) {
    return dottedDate
  }

  const isoDate = message.match(ISO_DATE_PATTERN)?.[0]

  if (!isoDate) {
    return null
  }

  const [year, month, day] = isoDate.split('-')

  return `${day}.${month}.${year}`
}

const getAllNormalizedDates = (message: string) => {
  const dottedDates = message.match(DATE_PATTERN_GLOBAL)

  if (dottedDates && dottedDates.length > 0) {
    return dottedDates
  }

  const isoDates = message.match(ISO_DATE_PATTERN_GLOBAL)

  if (!isoDates || isoDates.length === 0) {
    return []
  }

  return isoDates.map(isoDate => {
    const [year, month, day] = isoDate.split('-')

    return `${day}.${month}.${year}`
  })
}

const getScheduledActivationMessage = (
  message: string,
  t: (key: string, params?: Record<string, string | number>) => string,
) => {
  const [startDate, endDate] = getAllNormalizedDates(message)

  if (!startDate || !endDate) {
    return null
  }

  return t('notifications.messages.subscriptionPurchasedScheduled', {
    startDate,
    endDate,
  })
}

const getTranslatedMessage = (
  item: NotificationItem,
  locale: string,
  t: (key: string, params?: Record<string, string | number>) => string,
) => {
  if (locale === 'en') {
    return item.message
  }

  const scheduledActivationMessage = getScheduledActivationMessage(item.message, t)

  if (scheduledActivationMessage) {
    return scheduledActivationMessage
  }

  switch (item.type) {
    case 'SUBSCRIPTION_ACTIVATED': {
      const date = normalizeDateForTranslation(item.message)

      return date ? t(notificationMessageKeyByType[item.type], { date }) : item.message
    }

    case 'PAYMENT_SOON': {
      const date = normalizeDateForTranslation(item.message)

      return date ? t(notificationMessageKeyByType[item.type], { date }) : item.message
    }

    case 'SUBSCRIPTION_EXPIRES_IN_DAYS': {
      const days = item.message.match(NUMBER_PATTERN)?.[0]

      return days
        ? t(notificationMessageKeyByType[item.type], { days: Number(days) })
        : item.message
    }

    case 'SUBSCRIPTION_EXPIRES_TOMORROW':
      return t(notificationMessageKeyByType[item.type])

    default:
      return item.message || t('notifications.messages.unknown')
  }
}

export const NotificationsDropdown = () => {
  const { t, locale } = useI18n()
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
                    {getTranslatedMessage(item, locale, t)}
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
