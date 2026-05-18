import { ModalHeader, ModalTitle } from '@/shared/ui/BaseModal'
import s from './PostHeader.module.scss'
import { Post } from '@/entities/post'
import { useI18n } from '@/shared/i18n'
import { PostActionMenuItem, PostActionsMenu } from '@/features/post-actions'
import { Avatar } from '@/shared/ui/Avatar'

type Props = {
  post: Post
  menuItems: PostActionMenuItem[]
}

export const PostHeader = ({ post, menuItems }: Props) => {
  const { t } = useI18n()

  return (
    <ModalHeader className={s.wrapper}>
      <div className={s.postOwner}>
        <Avatar size={36} src={null} />
        <ModalTitle className={s.postOwnerName}>{post.owner.login || t('common.user')}</ModalTitle>
      </div>
      {menuItems.length > 0 && (
        <PostActionsMenu
          items={menuItems}
          className={s.actionsMenu}
          ariaLabel="Post actions"
          position="static"
        />
      )}
    </ModalHeader>
  )
}
