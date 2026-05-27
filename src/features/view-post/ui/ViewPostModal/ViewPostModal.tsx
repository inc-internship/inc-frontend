'use client'

import { BaseModal, ModalClose } from '@/shared/ui/BaseModal'
import type { Post } from '@/entities/post'
import s from './ViewPostModal.module.scss'
import { PostComments } from './PostComments/PostComments'
import { PostHeader } from './PostHeader/PostHeader'
import { PostImage } from './PostImage/PostImage'
import { PostFooter } from './PostFooter/PostFooter'
import { AddComment } from './AddComment/AddComment'
import type { PostActionMenuItem } from '@/features/post-actions'
import { CloseIcon } from '@/shared/ui/icons/CloseIcon'

type Props = {
  open: boolean
  post: Post | null
  menuItems?: PostActionMenuItem[]
  onCancel: () => void
}

export const ViewPostModal = ({ open, post, menuItems = [], onCancel }: Props) => {
  if (!open || !post) {
    return null
  }

  return (
    <BaseModal
      open={open}
      onOpenChange={nextOpen => !nextOpen && onCancel()}
      className={s.container}
      closeOnOverlay={false}
      onOpenAutoFocus={e => e.preventDefault()}
    >
      <ModalClose className={s.close}>
        <CloseIcon />
      </ModalClose>
      <div className={s.content}>
        <div className={s.imageColumn}>
          <PostImage images={post.images} />
        </div>

        <div className={s.details}>
          <PostHeader menuItems={menuItems} post={post} />
          <PostComments post={post} />
          <PostFooter />
          <AddComment />
        </div>
      </div>
    </BaseModal>
  )
}
