import { useUpdatePostMutation } from '@/entities/post/api/post.api'

export const useUpdatePost = () => {
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()

  const updatePostHandler = async (postId: string, userId: string, description: string) => {
    try {
      await updatePost({ postId, userId, description: description ?? '' }).unwrap()
    } catch (error) {
      console.error('Failed to update post:', error)
    }
  }
  return { updatePostHandler, isUpdating }
}
