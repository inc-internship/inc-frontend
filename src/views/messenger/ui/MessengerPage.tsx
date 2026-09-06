'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { useGetOrCreateConversationMutation } from '@/entities/messenger'
import { getLocalizedPath, useI18n } from '@/shared/i18n'
import { ROUTES } from '@/shared/constants'
import { getApiErrorMessage } from '@/shared/api'
import { Typography } from '@/shared/ui/Typography'
import { ChatList } from './ChatList/ChatList'
import { ChatWindow } from './ChatWindow/ChatWindow'
import s from './MessengerPage.module.scss'

export const MessengerPage = () => {
  const { t, locale } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userIdFromQuery = searchParams.get('userId')
  const selectedConversationId = searchParams.get('conversationId')

  const [searchQuery, setSearchQuery] = useState('')
  const [getOrCreateConversation, { isLoading: isOpeningChat }] =
    useGetOrCreateConversationMutation()

  useEffect(() => {
    if (!userIdFromQuery) {
      return
    }

    let cancelled = false

    const openChat = async () => {
      try {
        const result = await getOrCreateConversation({
          participantPublicId: userIdFromQuery,
        }).unwrap()

        if (cancelled) {
          return
        }

        const nextPath = getLocalizedPath(
          locale,
          `${ROUTES.messenger}?conversationId=${encodeURIComponent(result.conversationPublicId)}`,
        )
        router.replace(nextPath)
      } catch (error) {
        if (!cancelled) {
          toast.error(getApiErrorMessage(error, t('common.somethingWentWrong')))
        }
      }
    }

    void openChat()

    return () => {
      cancelled = true
    }
  }, [getOrCreateConversation, locale, router, t, userIdFromQuery])

  const handleSelectConversation = (conversationId: string) => {
    const nextPath = getLocalizedPath(
      locale,
      `${ROUTES.messenger}?conversationId=${encodeURIComponent(conversationId)}`,
    )
    router.replace(nextPath)
  }

  return (
    <div className={s.page}>
      <Typography variant="h1" className={s.title}>
        {t('messenger.title')}
      </Typography>

      {isOpeningChat ? (
        <Typography variant="text-s" className={s.opening}>
          {t('common.loading')}
        </Typography>
      ) : null}

      <div className={s.panel}>
        <ChatList
          selectedConversationId={selectedConversationId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectConversation={handleSelectConversation}
        />
        <ChatWindow conversationId={selectedConversationId} />
      </div>
    </div>
  )
}
