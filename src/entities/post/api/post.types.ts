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
