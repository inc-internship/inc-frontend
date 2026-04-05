import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type SessionSlice = {
  accessToken: string | null
}

const initialState: SessionSlice = { accessToken: null }

export const sessionSlice = createSlice({
  name: 'auth',
  initialState,
  selectors: {
    selectAccessToken: (state: SessionSlice) => state.accessToken,
  },
  reducers: {
    setAccessToken(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken
    },
  },
})

export const { setAccessToken } = sessionSlice.actions
export const { selectAccessToken } = sessionSlice.selectors
export const sessionReducer = sessionSlice.reducer
