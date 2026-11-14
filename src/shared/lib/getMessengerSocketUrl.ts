import type { ManagerOptions, SocketOptions } from 'socket.io-client'
import { MESSENGER_WS_NAMESPACE, MESSENGER_WS_URL } from '@/shared/constants'

export const getMessengerSocketUrl = () => `${MESSENGER_WS_URL}${MESSENGER_WS_NAMESPACE}`

export const getMessengerSocketOptions = (
  token: string,
): Partial<ManagerOptions & SocketOptions> => ({
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  withCredentials: true,
  auth: {
    token: `Bearer ${token}`,
  },
})
