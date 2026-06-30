import { useUpdatePostMutation } from '@/entities/post/api/post.api'

export const useUpdatePost = () => {
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()

  const updatePostHandler = async (postId: string, userId: string, description: string) => {
    try {
      return await updatePost({ postId, userId, description: description ?? '' })
    } catch (error) {}
  }
  return { updatePostHandler, isUpdating }
}
