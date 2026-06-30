import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type NotificationItem = {
  id: string
  type: string
  message: string
  isRead: boolean
  createdAt: string
}

type NotificationsState = {
  items: NotificationItem[]
  nextCursor: string | null
  hasNextPage: boolean
  totalCount: number
  isConnected: boolean
  unreadCount: number
}

const initialState: NotificationsState = {
  items: [],
  nextCursor: null,
  hasNextPage: true,
  totalCount: 0,
  unreadCount: 0,
  isConnected: false,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  selectors: {
    selectNotifications: state => state.items,
  },
  reducers: {
    connectionStatusChanged: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
    notificationReceived: (state, action: PayloadAction<NotificationItem>) => {
      const exists = state.items.some(item => item.id === action.payload.id)
      if (!exists) {
        state.items.unshift(action.payload)
        state.totalCount += 1
        if (!action.payload.isRead) {
          state.unreadCount += 1
        }
      }
    },
  },
})

export const { connectionStatusChanged, notificationReceived } = notificationSlice.actions
export const { selectNotifications } = notificationSlice.selectors
export const notificationReducer = notificationSlice.reducer
