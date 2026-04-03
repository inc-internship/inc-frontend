import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '@/shared/constants'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: headers => {
      headers.set('Authorization', `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`)
      console.log(process.env.NEXT_PUBLIC_ACCESS_TOKEN)
      return headers
    },
  }),
  endpoints: () => ({}),
})
