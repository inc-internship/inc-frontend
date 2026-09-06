import { baseApi } from '@/shared/api'
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

export const messengerApi = baseApi.injectEndpoints({
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
        url: `${MESSENGER_API_V1_URL}/conversations`,
        params: {
          ...(pageParam ? { cursor: pageParam } : {}),
          ...(queryArg && 'limit' in queryArg && queryArg.limit ? { limit: queryArg.limit } : {}),
        },
      }),
      providesTags: ['Conversations'],
    }),
    getConversation: build.query<Conversation, string>({
      query: conversationId => `${MESSENGER_API_V1_URL}/conversations/${conversationId}`,
      providesTags: (_result, _error, conversationId) => [
        { type: 'Conversations', id: conversationId },
      ],
    }),
    getOrCreateConversation: build.mutation<CreateConversationResponse, CreateConversationRequest>({
      query: body => ({
        url: `${MESSENGER_API_V1_URL}/conversations`,
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
        url: `${MESSENGER_API_V1_URL}/conversations/${queryArg.conversationId}/messages`,
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
        url: `${MESSENGER_API_V1_URL}/conversations/${conversationId}/messages`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (_result, error, { conversationId }) =>
        error ? [] : [{ type: 'Messages', id: conversationId }, 'Conversations'],
    }),
    markConversationRead: build.mutation<void, string>({
      query: conversationId => ({
        url: `${MESSENGER_API_V1_URL}/conversations/${conversationId}/read`,
        method: 'POST',
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
