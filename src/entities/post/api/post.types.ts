export type GetUserPostsArgs = {
  userId: string
  cursor?: string
}

export type ResponseGetUserPosts = {
  items: Post[]
  nextCursor: string | null
  hasNextPage: boolean
}

export type ResponseGetFeedPosts = {
  items: Post[]
  nextCursor: string | null
  hasNextPage: boolean
}

export type Post = {
  description: string
  id: string
  images: Image[]
  owner: Owner
  createdAt?: string
  updatedAt?: string
  likesCount?: number
  commentsCount?: number
  isLiked?: boolean
}

export type Image = {
  height: number
  width: number
  id: string
  url: string
}

type Owner = {
  id: string
  login: string
  avatar?: {
    url: string
  } | null
  avatarUrl?: string | null
}

export type UploadImagesResponseType = {
  ids: string[]
  failedCount: number
}

export type CreatePostRequest = {
  description: string
  uploadIds: string[]
}

export type CreatePostResponse = {
  id: string
}

export type UpdateUserPost = {
  postId: string
  description: string
  userId: string
}

export type DeleteUserPost = {
  postId: string
  userId: string
}
