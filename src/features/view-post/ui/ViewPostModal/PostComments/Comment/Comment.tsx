'use client'

import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { Content } from './Content/Content'
import s from './Comment.module.scss'
import {
  CommentAuthor,
  PostComment,
  useGetCommentRepliesInfiniteQuery,
  useReplyToCommentMutation,
} from '@/entities/post'
import { ExtraInfo } from './ExtraInfo/ExtraInfo'
import { AddComment } from '../../AddComment/AddComment'
import { useI18n } from '@/shared/i18n'
import { sortPostComments } from '@/features/view-post/model/comment.utils'
import { useInfiniteCommentsScroll } from '@/features/view-post/model/useInfiniteCommentsScroll'
import { CommentsStatus } from '../CommentsStatus/CommentsStatus'

type Props = {
  comment: PostComment
  postId: string
  currentUserAuthor: CommentAuthor | null
  canReply?: boolean
  parentCommentId?: string
}

export const Comment = ({
  comment,
  postId,
  currentUserAuthor,
  canReply = false,
  parentCommentId,
}: Props) => {
  const { t } = useI18n()
  const isAuthenticated = !!currentUserAuthor
  const [isReplyFormShown, setIsReplyFormShown] = useState(false)
  const [areRepliesShown, setAreRepliesShown] = useState(false)
  const [replyToComment, { isLoading: isReplying }] = useReplyToCommentMutation()
  const hasReplies = comment.repliesCount > 0

  const answerClickHandler = () => {
    setIsReplyFormShown(prev => !prev)
  }

  const repliesToggleClickHandler = () => {
    setAreRepliesShown(prev => !prev)
  }

  const replySubmitHandler = async (text: string) => {
    if (!currentUserAuthor) {
      return
    }

    setAreRepliesShown(true)

    await replyToComment({
      postId,
      commentId: comment.id,
      text,
      author: currentUserAuthor,
    }).unwrap()

    setIsReplyFormShown(false)
  }

  return (
    <article className={clsx(s.container, { [s.replyContainer]: !canReply })}>
      <Content
        comment={comment}
        postId={postId}
        isAuthenticated={isAuthenticated}
        parentCommentId={parentCommentId}
      />
      <ExtraInfo
        comment={comment}
        isAuthenticated={isAuthenticated}
        canReply={canReply}
        onAnswerClick={answerClickHandler}
      />

      {isReplyFormShown && (
        <AddComment
          className={s.replyForm}
          placeholder={`${t('post.replyPlaceholder')}...`}
          onSubmit={replySubmitHandler}
          isLoading={isReplying}
          autoFocus
        />
      )}

      {canReply && hasReplies && (
        <button
          className={s.answersToggle}
          type="button"
          onClick={repliesToggleClickHandler}
          aria-expanded={areRepliesShown}
        >
          <span className={s.answersToggleLine} aria-hidden="true" />
          {t(areRepliesShown ? 'post.hideAnswers' : 'post.showAnswers', {
            count: comment.repliesCount,
          })}
        </button>
      )}

      {canReply && areRepliesShown && (
        <CommentReplies comment={comment} postId={postId} currentUserAuthor={currentUserAuthor} />
      )}
    </article>
  )
}

type CommentRepliesProps = {
  comment: PostComment
  postId: string
  currentUserAuthor: CommentAuthor | null
}

const CommentReplies = ({ comment, postId, currentUserAuthor }: CommentRepliesProps) => {
  const { t } = useI18n()
  const shouldSkip = comment.repliesCount === 0
  const { data, fetchNextPage, hasNextPage, isError, isFetching, isFetchingNextPage, isLoading } =
    useGetCommentRepliesInfiniteQuery({ postId, commentId: comment.id }, { skip: shouldSkip })

  const replies = useMemo(
    () => sortPostComments(data?.pages.flatMap(page => page.items) ?? []),
    [data],
  )

  const { loadMoreRef } = useInfiniteCommentsScroll({
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    fetchNextPage,
    disabled: shouldSkip || isLoading || isError,
  })

  if (shouldSkip) {
    return null
  }

  const isRefetching = isFetching && !isLoading && !isFetchingNextPage

  return (
    <div className={s.replies}>
      <CommentsStatus
        isLoading={isLoading}
        isError={isError}
        loadingText={t('common.loading')}
        errorText={t('post.commentsError')}
      />

      {replies.map(reply => (
        <Comment
          key={reply.id}
          comment={reply}
          postId={postId}
          parentCommentId={comment.id}
          currentUserAuthor={currentUserAuthor}
        />
      ))}

      {hasNextPage && <div className={s.loadMore} ref={loadMoreRef} aria-hidden="true" />}

      <CommentsStatus
        isLoading={isFetchingNextPage || isRefetching}
        loadingText={t('common.loading')}
        errorText={t('post.commentsError')}
      />
    </div>
  )
}
