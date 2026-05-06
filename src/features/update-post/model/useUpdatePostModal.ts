import { useUpdatePostMutation } from '@/entities/post/api/post.api'

export const useUpdatePost = () => {
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()

  const updatePostHandler = async (postId: string, userId: string, description: string) => {
    return updatePost({ postId, userId, description: description ?? '' }).unwrap()
  }
  return { updatePostHandler, isUpdating }
}
