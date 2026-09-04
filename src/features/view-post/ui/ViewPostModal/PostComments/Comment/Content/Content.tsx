'use client'

import clsx from 'clsx'
import s from './Content.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { PostComment, useToggleCommentLikeMutation } from '@/entities/post'
import { useI18n } from '@/shared/i18n'
import { LikeIcon } from '@/shared/ui/icons'
import { Avatar } from '@/shared/ui/Avatar'
import { toast } from 'react-toastify'
import { getApiErrorMessage } from '@/shared/api'

type Props = {
  comment: PostComment
  postId: string
  isAuthenticated: boolean
  parentCommentId?: string
}

export const Content = ({ comment, postId, isAuthenticated, parentCommentId }: Props) => {
  const { t } = useI18n()
  const [toggleCommentLike, { isLoading }] = useToggleCommentLikeMutation()

  const likeClickHandler = async () => {
    if (!isAuthenticated || isLoading) {
      return
    }

    try {
      await toggleCommentLike({
        postId,
        commentId: comment.id,
        isLiked: comment.isLiked,
        parentCommentId,
      }).unwrap()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('post.commentLikeError')))
    }
  }

  return (
    <div className={s.container}>
      <div className={s.main}>
        <Avatar size={36} src={comment.author.avatarUrl} className={s.avatar} />
        <Typography variant="text-m" className={s.text}>
          <span className={s.author}>{comment.author.login || t('common.user')}</span>{' '}
          <span>{comment.text}</span>
        </Typography>
      </div>
      {isAuthenticated && (
        <button
          className={clsx(s.likeButton, { [s.liked]: comment.isLiked })}
          type="button"
          onClick={likeClickHandler}
          aria-label={comment.isLiked ? t('post.unlikeComment') : t('post.likeComment')}
          aria-pressed={comment.isLiked}
          disabled={isLoading}
        >
          <LikeIcon className={s.like} filled={comment.isLiked} />
        </button>
      )}
    </div>
  )
}
