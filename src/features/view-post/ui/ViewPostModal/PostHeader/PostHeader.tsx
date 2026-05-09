import { ModalHeader, ModalTitle } from '@/shared/ui/BaseModal'
import s from './PostHeader.module.scss'
import { Post } from '@/entities/post'
import { useI18n } from '@/shared/i18n'
import {
  EditIcon,
  type PostActionMenuItem,
  PostActionsMenu,
  TrashBinIcon,
} from '@/features/post-actions'
import { useAppSelector } from '@/shared/store'
import { selectUser } from '@/entities/user/user.slice'
import { useState } from 'react'

type Props = {
  post: Post
  isOwnPost: boolean
}

export const PostHeader = ({ post, isOwnPost }: Props) => {
  const { t } = useI18n()

  return (
    <ModalHeader className={s.wrapper}>
      <div
        style={{ borderRadius: '50%', width: '36px', height: '36px', backgroundColor: 'red' }}
      ></div>
      <ModalTitle className={s.postOwnerName}>{post.owner.login || t('common.user')}</ModalTitle>
      {/*{isOwnPost && <PostActionsMenu items={[{ key: '', label: '', onClick: () => {} }]} />}*/}
      <PostActionsMenu items={[{ key: '', label: '', onClick: () => {} }]} />
    </ModalHeader>
  )
}
