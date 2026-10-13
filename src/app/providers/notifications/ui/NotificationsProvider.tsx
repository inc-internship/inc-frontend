'use client'

import { useAppDispatch } from '@/shared/store'
import { useEffect } from 'react'
import { io, type Socket } from 'socket.io-client'
import {
  connectionStatusChanged,
  notificationReceived,
  notificationApi,
  type NotificationItem,
} from '@/entities/notification'
import { NOTIFICATION_WS_EVENT } from '@/shared/constants'
import {
  getNotificationsSocketOptions,
  getNotificationsSocketUrl,
} from '@/shared/lib/getNotificationsSocketUrl'

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const socket: Socket = io(getNotificationsSocketUrl(), getNotificationsSocketOptions(token))

    const setConnected = (connected: boolean) => {
      dispatch(connectionStatusChanged(connected))
    }

    const onNotification = (payload: NotificationItem) => {
      dispatch(notificationReceived(payload))
      dispatch(notificationApi.util.invalidateTags(['Notifications']))
    }

    socket.on('connect', () => {
      console.log('Победа')
      setConnected(true)
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on('connect_error', () => setConnected(false))
    socket.on(NOTIFICATION_WS_EVENT, onNotification)

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.off(NOTIFICATION_WS_EVENT, onNotification)
      socket.disconnect()
      setConnected(false)
    }
  }, [dispatch])

  return <>{children}</>
}
