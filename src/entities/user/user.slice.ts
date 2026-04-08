import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MeData } from '@/entities/auth'

type UserState = {
  user: MeData | null
  isInitialized: boolean
}

const initialState: UserState = {
  user: null,
  isInitialized: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    selectUser: state => state.user,
    selectIsInitialized: state => state.isInitialized,
  },
  reducers: {
    setUser: (state, action: PayloadAction<MeData | null>) => {
      state.user = action.payload
      state.isInitialized = true
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload
    },
    clearUser: state => {
      state.user = null
      state.isInitialized = true
    },
  },
})

export const { setUser, setInitialized, clearUser } = userSlice.actions
export const { selectUser, selectIsInitialized } = userSlice.selectors
export const userReducer = userSlice.reducer
