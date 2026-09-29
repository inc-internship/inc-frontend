import type { PostComment } from '@/entities/post'
import { sortPostComments } from './comment.utils'

const createComment = (overrides: Partial<PostComment>): PostComment => ({
  id: overrides.id ?? 'comment-id',
  text: overrides.text ?? 'comment text',
  author: overrides.author ?? {
    id: 'author-id',
    login: 'author',
    avatarUrl: null,
  },
  likesCount: overrides.likesCount ?? 0,
  repliesCount: overrides.repliesCount ?? 0,
  isLiked: overrides.isLiked ?? false,
  isOwn: overrides.isOwn ?? false,
  createdAt: overrides.createdAt ?? '2026-08-16T10:00:00.000Z',
  updatedAt: overrides.updatedAt ?? '2026-08-16T10:00:00.000Z',
})

describe('sortPostComments', () => {
  it('puts own comments first and sorts each group from newest to oldest', () => {
    const comments = [
      createComment({
        id: 'foreign-new',
        isOwn: false,
        createdAt: '2026-08-16T12:00:00.000Z',
      }),
      createComment({
        id: 'own-old',
        isOwn: true,
        createdAt: '2026-08-16T09:00:00.000Z',
      }),
      createComment({
        id: 'foreign-old',
        isOwn: false,
        createdAt: '2026-08-16T08:00:00.000Z',
      }),
      createComment({
        id: 'own-new',
        isOwn: true,
        createdAt: '2026-08-16T11:00:00.000Z',
      }),
    ]

    expect(sortPostComments(comments).map(comment => comment.id)).toEqual([
      'own-new',
      'own-old',
      'foreign-new',
      'foreign-old',
    ])
  })
})
