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
  createdAt?: string
  description: string
  id: string
  images: Image[]
  likesCount?: number
  commentsCount?: number
  isLiked?: boolean
  owner: Owner
  updatedAt?: string
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

export type CommentAuthor = {
  id: string
  login: string
  avatarUrl: string | null
}

export type PostComment = {
  id: string
  text: string
  author: CommentAuthor
  likesCount: number
  repliesCount: number
  isLiked: boolean
  isOwn: boolean
  createdAt: string
  updatedAt: string
}

export type ResponseGetPostComments = {
  items: PostComment[]
  nextCursor: string | null
  hasNextPage: boolean
}

export type GetPostCommentsArgs = {
  postId: string
}

export type GetCommentRepliesArgs = {
  postId: string
  commentId: string
}

export type CreatedCommentResponse = {
  id: string
}

export type CreateCommentRequest = {
  postId: string
  text: string
  author: CommentAuthor
}

export type ReplyToCommentRequest = CreateCommentRequest & {
  commentId: string
}

export type ToggleCommentLikeRequest = {
  postId: string
  commentId: string
  isLiked: boolean
  parentCommentId?: string
}
