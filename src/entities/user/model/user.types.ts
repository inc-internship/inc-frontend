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
