'use client'

import { FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { useSendMessageMutation } from '@/entities/messenger'
import { useI18n } from '@/shared/i18n'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { ImageOutlineIcon, MicOutlineIcon } from '@/shared/ui/icons'
import { getApiErrorMessage } from '@/shared/api'
import s from './MessageComposer.module.scss'

type Props = {
  conversationId: string
}

export const MessageComposer = ({ conversationId }: Props) => {
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [sendMessage, { isLoading }] = useSendMessageMutation()

  const trimmed = text.trim()
  const canSend = trimmed.length > 0 && !isLoading

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!canSend) {
      return
    }

    try {
      await sendMessage({ conversationId, text: trimmed }).unwrap()
      setText('')
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('common.somethingWentWrong')))
    }
  }

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <Input
        width="full"
        value={text}
        onChange={event => setText(event.target.value)}
        placeholder={t('messenger.messagePlaceholder')}
        aria-label={t('messenger.messagePlaceholder')}
        wrapperClassName={s.inputWrapper}
        className={s.input}
        autoComplete="off"
        disabled={isLoading}
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
