import { Typography } from '@/shared/ui/Typography'
import s from './ExtraInfo.module.scss'
import { useI18n } from '@/shared/i18n'
import { PostComment } from '@/entities/post'
import { getRelativeCommentTime } from '@/features/view-post/model/comment.utils'

type Props = {
  comment: PostComment
  isAuthenticated: boolean
  canReply: boolean
  onAnswerClick: () => void
}

export const ExtraInfo = ({ comment, isAuthenticated, canReply, onAnswerClick }: Props) => {
  const { locale, t } = useI18n()
  const createdAt = getRelativeCommentTime(comment.createdAt, locale, t('post.justNow'))

  return (
    <Typography className={s.extraInfo} variant="text-s" as="div">
      <span>{createdAt}</span>
      {isAuthenticated && comment.likesCount > 0 && (
        <span className={s.actionText}>
          {t('post.liked')}: {comment.likesCount}
        </span>
      )}
      {isAuthenticated && canReply && (
        <button className={s.answerButton} type="button" onClick={onAnswerClick}>
          {t('post.reply')}
        </button>
      )}
    </Typography>
  )
}
