import type { PostComment } from '@/entities/post'

const getTimestamp = (date: string) => {
  const timestamp = Date.parse(date)

  return Number.isNaN(timestamp) ? 0 : timestamp
}

export const sortPostComments = (comments: PostComment[]) => {
  return comments
    .map((comment, index) => ({ comment, index }))
    .sort((left, right) => {
      if (left.comment.isOwn !== right.comment.isOwn) {
        return left.comment.isOwn ? -1 : 1
      }

      const dateDiff = getTimestamp(right.comment.createdAt) - getTimestamp(left.comment.createdAt)

      return dateDiff || left.index - right.index
    })
    .map(({ comment }) => comment)
}

export const getRelativeCommentTime = (createdAt: string, localeCode: string, fallback: string) => {
  const timestamp = Date.parse(createdAt)

  if (Number.isNaN(timestamp)) {
    return fallback
  }

  const deltaMs = timestamp - Date.now()
  const absDeltaMs = Math.abs(deltaMs)
  const formatter = new Intl.RelativeTimeFormat(localeCode, { numeric: 'always' })

  if (absDeltaMs < 60_000) {
    return fallback
  }

  if (absDeltaMs < 3_600_000) {
    return formatter.format(Math.round(deltaMs / 60_000), 'minute')
  }

  if (absDeltaMs < 86_400_000) {
    return formatter.format(Math.round(deltaMs / 3_600_000), 'hour')
  }

  return formatter.format(Math.round(deltaMs / 86_400_000), 'day')
}
