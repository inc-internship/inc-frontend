'use client'

import { useAppDispatch } from '@/shared/store'
import { useEffect } from 'react'
import { connectionStatusChanged, notificationReceived } from '@/entities/notification'

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/notifications?token=${token}`)

    ws.onopen = () => {
      dispatch(connectionStatusChanged(true))
    }

    ws.onmessage = event => {
      const data = JSON.parse(event.data)
      dispatch(notificationReceived(data))
    }

    ws.onclose = () => {
      dispatch(connectionStatusChanged(false))
    }

    ws.onerror = () => {
      dispatch(connectionStatusChanged(false))
    }

    return () => ws.close()
  }, [dispatch])

  return <>{children}</>
}
