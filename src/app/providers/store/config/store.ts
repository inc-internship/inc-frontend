import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api'
import { userReducer } from '@/app/providers/store/user/user-slice'

const placeholderReducer = (state: Record<string, never> = {}) => state

export const makeStore = () =>
  configureStore({
    reducer: {
      app: placeholderReducer,
      [baseApi.reducerPath]: baseApi.reducer,
      user: userReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  })

export const store = makeStore()

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
