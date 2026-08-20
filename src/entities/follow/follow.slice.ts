import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type FollowState = {
  /** Users unfollowed in the current session (until page reload). */
  unfollowedUserIds: string[]
}

const initialState: FollowState = {
  unfollowedUserIds: [],
}

const followSlice = createSlice({
  name: 'follow',
  initialState,
  selectors: {
    selectUnfollowedUserIds: state => state.unfollowedUserIds,
    selectUnfollowedCount: state => state.unfollowedUserIds.length,
  },
  reducers: {
    unfollowUser: (state, action: PayloadAction<string>) => {
      if (!state.unfollowedUserIds.includes(action.payload)) {
        state.unfollowedUserIds.push(action.payload)
      }
    },
    followUser: (state, action: PayloadAction<string>) => {
      state.unfollowedUserIds = state.unfollowedUserIds.filter(id => id !== action.payload)
    },
  },
})

export const { unfollowUser, followUser } = followSlice.actions
export const { selectUnfollowedUserIds, selectUnfollowedCount } = followSlice.selectors
export const followReducer = followSlice.reducer
