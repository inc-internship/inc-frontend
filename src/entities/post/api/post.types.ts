export type GetUserPostsArgs = {
  userId: string
  cursor?: string
}

export type ResponseGetUserPosts = {
  items: Post[]
  nextCursor: string | null
  hasNextPage: boolean
}

type Post = {
  description: string
  id: string
  images: Image[]
  owner: Owner
}

type Image = {
  height: number
  width: number
  id: string
  url: string
}

type Owner = {
  id: string
  login: string
}

export type UpdateUserPost = {
  postId: string
  description: string
}

export type DeleteUserPost = {
  postId: string
}
