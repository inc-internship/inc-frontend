import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_ORIGIN } from './config'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_ORIGIN,
  }),
  endpoints: () => ({}),
})
