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

  return 'Something went wrong'
}

export const getApiErrorMessage = (error: unknown) => {
  if (isFetchBaseQueryError(error)) {
    return getMessageFromData(error.data as ApiErrorData)
  }

  if (typeof (error as SerializedError | undefined)?.message === 'string') {
    return (error as SerializedError).message as string
  }

  return 'Something went wrong'
}
