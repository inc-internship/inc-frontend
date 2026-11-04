import { withReauth } from '@/shared/api'
import { MESSENGER_API_V1_URL } from '@/shared/constants'
import type {
  Conversation,
  ConversationsWithCursor,
  CreateConversationRequest,
  CreateConversationResponse,
  GetConversationsArgs,
  GetMessagesArgs,
  MessagesWithCursor,
  SendMessageRequest,
} from './messenger.types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const isBrowser = () => typeof window !== 'undefined'

const getAccessToken = (): string | null => {
  if (!isBrowser()) return null
  return localStorage.getItem('accessToken')
}

const messengerBaseQuery = withReauth(
  fetchBaseQuery({
    baseUrl: MESSENGER_API_V1_URL,
    prepareHeaders: headers => {
      const token = getAccessToken()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
    paramsSerializer: params => {
      const token = getAccessToken()
      const allParams = {
        ...params,
        ...(token ? { accessToken: token } : {}),
      }
      const searchParams = new URLSearchParams()
      Object.entries(allParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      return searchParams.toString()
    },
  }),
)

export const messengerBaseApi = createApi({
  reducerPath: 'messengerApi',
  baseQuery: messengerBaseQuery,
  tagTypes: ['Conversations', 'Messages'],
  endpoints: () => ({}),
})

export const messengerApi = messengerBaseApi.injectEndpoints({
  endpoints: build => ({
    getConversations: build.infiniteQuery<
      ConversationsWithCursor,
      GetConversationsArgs | void,
      string | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
      },
      query: ({ queryArg, pageParam }) => ({
        url: '/conversations',
        params: {
          ...(pageParam ? { cursor: pageParam } : {}),
          ...(queryArg && 'limit' in queryArg && queryArg.limit ? { limit: queryArg.limit } : {}),
        },
      }),
      providesTags: ['Conversations'],
    }),
    getConversation: build.query<Conversation, string>({
      query: conversationId => `/conversations/${conversationId}`,
      providesTags: (_result, _error, conversationId) => [
        { type: 'Conversations', id: conversationId },
      ],
    }),
    getOrCreateConversation: build.mutation<CreateConversationResponse, CreateConversationRequest>({
      query: body => ({
        url: '/conversations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Conversations'],
    }),
    getMessages: build.infiniteQuery<MessagesWithCursor, GetMessagesArgs, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
      },
      query: ({ queryArg, pageParam }) => ({
        url: `/conversations/${queryArg.conversationId}/messages`,
        params: {
          ...(pageParam ? { cursor: pageParam } : {}),
          ...(queryArg.limit ? { limit: queryArg.limit } : {}),
        },
      }),
      providesTags: (_result, _error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
      ],
    }),
    sendMessage: build.mutation<void, SendMessageRequest>({
      query: ({ conversationId, text }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (_result, error, { conversationId }) =>
        error ? [] : [{ type: 'Messages', id: conversationId }, 'Conversations'],
    }),
    markConversationRead: build.mutation<void, string>({
      query: conversationId => ({
        url: `/conversations/${conversationId}/read`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: (_result, _error, conversationId) => [
        { type: 'Conversations', id: conversationId },
        'Conversations',
      ],
    }),
  }),
})

export const {
  useGetConversationsInfiniteQuery,
  useGetConversationQuery,
  useGetOrCreateConversationMutation,
  useGetMessagesInfiniteQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
} = messengerApi
