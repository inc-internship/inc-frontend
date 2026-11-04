'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useSendMessageMutation } from '@/entities/messenger'
import { getApiErrorMessage } from '@/shared/api'
import { useI18n } from '@/shared/i18n'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { ImageOutlineIcon, MicOutlineIcon } from '@/shared/ui/icons'
import s from './MessageComposer.module.scss'

type Props = {
  conversationId: string
  sendMessage: (conversationId: string, text: string) => boolean
  startTyping: (conversationId: string) => void
  stopTyping: (conversationId: string) => void
}

export const MessageComposer = ({
  conversationId,
  sendMessage: sendSocketMessage,
  startTyping,
  stopTyping,
}: Props) => {
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [sendHttpMutation, { isLoading: isHttpLoading }] = useSendMessageMutation()
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const trimmed = text.trim()
  const canSend = trimmed.length > 0 && !isHttpLoading

  const clearTypingTimer = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!canSend) {
      return
    }

    try {
      const sentOverSocket = sendSocketMessage(conversationId, trimmed)

      if (!sentOverSocket) {
        await sendHttpMutation({ conversationId, text: trimmed }).unwrap()
      }

      setText('')
      stopTyping(conversationId)
      clearTypingTimer()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('common.somethingWentWrong')))
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setText(value)

    if (!value.trim()) {
      stopTyping(conversationId)
      clearTypingTimer()
      return
    }

    startTyping(conversationId)
    clearTypingTimer()
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(conversationId)
    }, 1500)
  }

  useEffect(() => {
    return () => {
      clearTypingTimer()
    }
  }, [])

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <Input
        width="full"
        value={text}
        onChange={handleInputChange}
        placeholder={t('messenger.messagePlaceholder')}
        aria-label={t('messenger.messagePlaceholder')}
        wrapperClassName={s.inputWrapper}
        className={s.input}
        autoComplete="off"
        disabled={isHttpLoading}
      />

      <div className={s.actions}>
        <button
          type="button"
          className={s.iconButton}
          aria-label={t('messenger.voiceMessage')}
          disabled
        >
          <MicOutlineIcon />
        </button>
        <button
          type="button"
          className={s.iconButton}
          aria-label={t('messenger.attachImage')}
          disabled
        >
          <ImageOutlineIcon />
        </button>
        <Button type="submit" variant="default" className={s.sendButton} disabled={!canSend}>
          {t('messenger.sendMessage')}
        </Button>
      </div>
    </form>
  )
}
