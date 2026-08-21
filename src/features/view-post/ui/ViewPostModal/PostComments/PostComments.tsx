'use client'

import { useMemo } from 'react'
import s from './PostComments.module.scss'
import { CommentAuthor, Post } from '@/entities/post'
import { Comment } from './Comment/Comment'
import { useGetPostCommentsInfiniteQuery } from '@/entities/post'
import { useI18n } from '@/shared/i18n'
import { sortPostComments } from '@/features/view-post/model/comment.utils'
import { useInfiniteCommentsScroll } from '@/features/view-post/model/useInfiniteCommentsScroll'
import { CommentsStatus } from './CommentsStatus/CommentsStatus'

type Props = {
  post: Post
  isAuthenticated: boolean
  currentUserAuthor: CommentAuthor | null
}

export const PostComments = ({ post, isAuthenticated, currentUserAuthor }: Props) => {
  const { t } = useI18n()
  const { data, fetchNextPage, hasNextPage, isError, isFetching, isFetchingNextPage, isLoading } =
    useGetPostCommentsInfiniteQuery({ postId: post.id }, { skip: !isAuthenticated })

  const comments = useMemo(
    () => sortPostComments(data?.pages.flatMap(page => page.items) ?? []),
    [data],
  )

  const { loadMoreRef } = useInfiniteCommentsScroll({
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    fetchNextPage,
    disabled: !isAuthenticated || isLoading || isError,
  })

  if (!isAuthenticated) {
    return (
      <div className={s.container}>
        <CommentsStatus message={t('post.signInToViewComments')} />
      </div>
    )
  }

  const isRefetching = isFetching && !isLoading && !isFetchingNextPage

  return (
    <div className={s.container}>
      <CommentsStatus
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && !isError && comments.length === 0}
        loadingText={t('common.loading')}
        errorText={t('post.commentsError')}
        emptyText={t('post.noComments')}
      />

      {comments.map(comment => (
        <Comment
          key={comment.id}
          comment={comment}
          postId={post.id}
          currentUserAuthor={currentUserAuthor}
          canReply
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
