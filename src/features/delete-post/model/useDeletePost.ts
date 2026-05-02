import { useDeletePostMutation } from '@/entities/post/api/post.api'

export const useDeletePost = () => {
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()

  const deletePostHandler = async (postId: string, userId: string) => {
    return deletePost({ postId, userId }).unwrap()
  }

  return { deletePostHandler, isDeleting }
}
