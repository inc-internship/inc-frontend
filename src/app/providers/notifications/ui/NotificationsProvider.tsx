'use client'

import { useAppDispatch } from '@/shared/store'
import { useEffect, useState, useRef } from 'react'
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

  // Храним инстанс сокета в рефе, чтобы он не пересоздавался при каждом рендере
  const socketRef = useRef<Socket | null>(null)

  // 1. Инициализируем стейт синхронно и безопасно для SSR
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return null
  })

  // 2. Слушаем изменения токена в localStorage
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

  // 3. Управление WebSocket-соединением
  useEffect(() => {
    if (!token) return

    // Создаем сокет только если его еще нет
    if (!socketRef.current) {
      socketRef.current = io(getNotificationsSocketUrl(), getNotificationsSocketOptions(token))
    }

    const socket = socketRef.current

    const setConnected = (connected: boolean) => {
      dispatch(connectionStatusChanged(connected))
    }

    const onNotification = (payload: NotificationItem) => {
      dispatch(notificationReceived(payload))
      dispatch(notificationApi.util.invalidateTags(['Notifications']))
    }

    // Навешиваем слушатели событий
    socket.on('connect', () => {
      console.log('Веб-сокеты для блога подключены!')
      setConnected(true)
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on('connect_error', () => setConnected(false))
    socket.on(NOTIFICATION_WS_EVENT, onNotification)

    return () => {
      // Очищаем слушатели
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.off(NOTIFICATION_WS_EVENT, onNotification)

      // Закрываем соединение и очищаем реф
      socket.disconnect()
      socketRef.current = null
      setConnected(false)
    }
  }, [dispatch, token])

  return <>{children}</>
}
