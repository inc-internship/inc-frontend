import type { ManagerOptions, SocketOptions } from 'socket.io-client'
import { NOTIFICATIONS_WS_NAMESPACE, NOTIFICATIONS_WS_URL } from '@/shared/constants'

export const getNotificationsSocketUrl = () =>
  `${NOTIFICATIONS_WS_URL}${NOTIFICATIONS_WS_NAMESPACE}`

export const getNotificationsSocketOptions = (
  token: string,
): Partial<ManagerOptions & SocketOptions> => ({
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  withCredentials: true,
  auth: {
    token: `Bearer ${token}`,
  },
})
