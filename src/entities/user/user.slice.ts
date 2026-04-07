import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MeData } from '@/entities/auth'

type UserState = {
  user: MeData | null
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<MeData | null>) => {
      state.user = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearUser: state => {
      state.user = null
      state.error = null
    },
  },
})

export const { setUser, setLoading, setError, clearUser } = userSlice.actions
export const userReducer = userSlice.reducer
