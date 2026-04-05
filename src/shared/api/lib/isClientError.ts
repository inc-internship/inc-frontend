import { isFetchBaseQueryError } from './isFetchBaseQueryError'

export const isClientError = (error: unknown): boolean => {
  return (
    isFetchBaseQueryError(error) &&
    typeof error.status === 'number' &&
    error.status >= 400 &&
    error.status < 500
  )
}
