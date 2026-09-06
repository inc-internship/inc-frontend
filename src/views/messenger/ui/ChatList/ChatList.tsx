'use client'

import { useGetConversationsInfiniteQuery, getConversationPeer } from '@/entities/messenger'
import { selectUser } from '@/entities/user/user.slice'
import { useI18n } from '@/shared/i18n'
import { useAppSelector } from '@/shared/store'
import { Input } from '@/shared/ui/Input'
import { Typography } from '@/shared/ui/Typography'
import { ChatListItem } from '../ChatListItem/ChatListItem'
import s from './ChatList.module.scss'

type Props = {
  selectedConversationId: string | null
  searchQuery: string
  onSearchChange: (value: string) => void
  onSelectConversation: (conversationId: string) => void
}

export const ChatList = ({
  selectedConversationId,
  searchQuery,
  onSearchChange,
  onSelectConversation,
}: Props) => {
  const { t } = useI18n()
  const user = useAppSelector(selectUser)
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetConversationsInfiniteQuery()

  const conversations = data?.pages.flatMap(page => page.items) ?? []
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredConversations = normalizedQuery
    ? conversations.filter(conversation => {
        const peer = getConversationPeer(conversation, user?.publicId)
        return (peer?.login ?? '').toLowerCase().includes(normalizedQuery)
      })
    : conversations

  return (
    <aside className={s.root}>
      <div className={s.search}>
        <Input
          type="search"
          variant="search"
          width="full"
          value={searchQuery}
          onChange={event => onSearchChange(event.target.value)}
          placeholder={t('messenger.searchPlaceholder')}
          aria-label={t('messenger.searchPlaceholder')}
        />
      </div>

      <div className={s.list} role="list">
        {isLoading ? (
          <Typography variant="text-s" className={s.empty}>
            {t('common.loading')}
          </Typography>
        ) : null}

        {isError ? (
          <Typography variant="text-s" className={s.empty}>
            {t('common.somethingWentWrong')}
          </Typography>
        ) : null}

        {!isLoading && !isError && filteredConversations.length === 0 ? (
          <Typography variant="text-s" className={s.empty}>
            {t('messenger.noChatsFound')}
          </Typography>
        ) : null}

        {filteredConversations.map(conversation => (
          <ChatListItem
            key={conversation.id}
            conversation={conversation}
            currentUserId={user?.publicId}
            isActive={conversation.id === selectedConversationId}
            onSelect={onSelectConversation}
          />
        ))}

        {hasNextPage ? (
          <button
            type="button"
            className={s.loadMore}
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? t('common.loading') : t('common.next')}
          </button>
        ) : null}
      </div>
    </aside>
  )
}
