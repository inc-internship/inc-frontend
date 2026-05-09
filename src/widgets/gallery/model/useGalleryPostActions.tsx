import { useState } from 'react'
import type { Post } from '@/entities/post'
import { useDeletePost } from '@/features/delete-post'
import { useUpdatePost } from '@/features/update-post'
import type { TranslationParams } from '@/shared/i18n'
import { EditIcon, TrashBinIcon } from '@/shared/ui/icons'

type Props = {
  userId: string
  currentUserId: string | undefined
  t: (key: string, params?: TranslationParams) => string
}

export const useGalleryPostActions = ({ userId, currentUserId, t }: Props) => {
  const [selectedViewPost, setSelectedViewPost] = useState<Post | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const { deletePostHandler, isDeleting } = useDeletePost()

  const [isUpdatePostModalOpen, setIsUpdatePostModalOpen] = useState(false)
  const [selectedUpdatePostId, setSelectedUpdatePostId] = useState<string | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(undefined)
  const [selectedInitialDescription, setSelectedInitialDescription] = useState('')
  const { updatePostHandler, isUpdating } = useUpdatePost()

  const closeViewModalHandler = () => {
    setSelectedViewPost(null)
  }

  const closeDeleteModalHandler = () => {
    setIsDeleteModalOpen(false)
    setSelectedPostId(null)
  }

  const confirmDeleteHandler = async () => {
    if (!selectedPostId) {
      return
    }

    const postId = selectedPostId

    closeDeleteModalHandler()

    void deletePostHandler(postId, userId).catch(() => {
      // rollback произойдет в RTK Query onQueryStarted
    })
  }

  const selectedViewPostImage = selectedViewPost?.images[0]
  const isSelectedViewPostOwn = currentUserId === selectedViewPost?.owner?.id
  const selectedViewPostMenuItems =
    isSelectedViewPostOwn && selectedViewPost && selectedViewPostImage
      ? [
          {
            key: 'edit',
            label: t('post.updateTitle'),
            onClick: () => {
              setSelectedUpdatePostId(selectedViewPost.id)
              setSelectedImageUrl(selectedViewPostImage.url)
              setSelectedInitialDescription(selectedViewPost.description ?? '')
              setIsUpdatePostModalOpen(true)
            },
            icon: <EditIcon />,
          },
          {
            key: 'delete',
            label: t('post.deleteTitle'),
            onClick: () => {
              setSelectedPostId(selectedViewPost.id)
              setIsDeleteModalOpen(true)
            },
            icon: <TrashBinIcon />,
          },
        ]
      : []

  const closeUpdateModalHandler = () => {
    setIsUpdatePostModalOpen(false)
    setSelectedUpdatePostId(null)
    setSelectedImageUrl(undefined)
    setSelectedInitialDescription('')
  }

  const confirmUpdateHandler = async (newDescription: string) => {
    if (!selectedUpdatePostId) {
      return
    }

    const postId = selectedUpdatePostId

    closeUpdateModalHandler()

    void updatePostHandler(postId, userId, newDescription).catch(() => {
      // rollback произойдет в RTK Query onQueryStarted
    })
  }

  return {
    selectedViewPost,
    selectedUpdatePostId,
    selectedViewPostMenuItems,
    isDeleteModalOpen,
    isUpdatePostModalOpen,
    selectedImageUrl,
    selectedInitialDescription,
    isDeleting,
    isUpdating,
    setSelectedViewPost,
    closeViewModalHandler,
    closeDeleteModalHandler,
    confirmDeleteHandler,
    closeUpdateModalHandler,
    confirmUpdateHandler,
  }
}
