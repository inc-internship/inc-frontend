import { SerializedError } from '@reduxjs/toolkit'
import { isFetchBaseQueryError } from './isFetchBaseQueryError'

type ApiErrorData =
  | string
  | {
      error?: string
      message?: string
    }
  | undefined

const getMessageFromData = (data: ApiErrorData) => {
  if (typeof data === 'string') {
    return data
  }

  if (typeof data?.message === 'string') {
    return data.message
  }

  if (typeof data?.error === 'string') {
    return data.error
  }

  return ''
}

export const getApiErrorMessage = (error: unknown, fallbackMessage = 'Something went wrong') => {
  if (isFetchBaseQueryError(error)) {
    return getMessageFromData(error.data as ApiErrorData) || fallbackMessage
  }

  if (typeof (error as SerializedError | undefined)?.message === 'string') {
    return (error as SerializedError).message as string
  }

  return fallbackMessage
}
