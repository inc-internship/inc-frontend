import { Typography } from '@/shared/ui/Typography'
import s from './CommentsStatus.module.scss'

type Props = {
  errorText?: string
  emptyText?: string
  isEmpty?: boolean
  isError?: boolean
  isLoading?: boolean
  loadingText?: string
  message?: string
}

export const CommentsStatus = ({
  errorText,
  emptyText,
  isEmpty = false,
  isError = false,
  isLoading = false,
  loadingText,
  message,
}: Props) => {
  const statusText =
    message ??
    (isLoading ? loadingText : undefined) ??
    (isError ? errorText : undefined) ??
    (isEmpty ? emptyText : undefined)

  if (!statusText) {
    return null
  }

  return (
    <Typography className={s.message} variant="text-s">
      {statusText}
    </Typography>
  )
}
