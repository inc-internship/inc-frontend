import { configureStore } from '@reduxjs/toolkit'

const placeholderReducer = (state: Record<string, never> = {}) => state

export const makeStore = () =>
  configureStore({
    reducer: {
      app: placeholderReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  })

export const store = makeStore()

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
