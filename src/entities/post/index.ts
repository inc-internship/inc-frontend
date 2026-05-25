export {
  useUploadImagesMutation,
  useCreatePostMutation,
  useGetUserPostsInfiniteQuery,
} from './api/post.api'
export { fetchPost, fetchUserPosts } from './api/post.server'
export type {
  CreatePostRequest,
  CreatePostResponse,
  UploadImagesResponseType,
  Post,
  Image,
} from './api/post.types'
