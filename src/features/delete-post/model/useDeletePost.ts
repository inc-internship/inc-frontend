import { useDeletePostMutation } from '@/entities/post/api/post.api'

export const useDeletePost = () => {
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()

  const deletePostHandler = async (postId: string, userId: string) => {
    try {
      await deletePost({ postId, userId }).unwrap()
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  return { deletePostHandler, isDeleting }
}
