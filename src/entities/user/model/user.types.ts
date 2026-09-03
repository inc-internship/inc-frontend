export type User = {
  id: string
  login: string
  avatarUrl: string
  isFollowing: boolean
}

export type UserSearchResponse = {
  items: User[]
  nextCursor: string
  hasNextPage: boolean
}

export type UserSearchRequest = {
  username: string
  cursor?: string
}

export type FollowUser = {
  id: string
  login: string
  avatarUrl: string
  followedAt: string
}

export type FollowListResponse = {
  items: FollowUser[]
  nextCursor: string
  hasNextPage: boolean
}

export type FollowListRequest = {
  userId: string
  cursor?: string
}
