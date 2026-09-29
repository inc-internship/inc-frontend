import { FormEvent, useState } from 'react'
import clsx from 'clsx'
import s from './AddComment.module.scss'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { useI18n } from '@/shared/i18n'
import { toast } from 'react-toastify'
import { getApiErrorMessage } from '@/shared/api'

const MAX_COMMENT_LENGTH = 300

type Props = {
  onSubmit: (text: string) => Promise<void> | void
  autoFocus?: boolean
  className?: string
  isLoading?: boolean
  placeholder?: string
}

export const AddComment = ({
  onSubmit,
  autoFocus = false,
  className,
  isLoading = false,
  placeholder,
}: Props) => {
  const { t } = useI18n()
  const [text, setText] = useState('')

  const trimmedText = text.trim()
  const canSubmit = trimmedText.length > 0 && !isLoading

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    try {
      await onSubmit(trimmedText)
      setText('')
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('post.commentPublishError')))
    }
  }

  return (
    <form className={clsx(s.container, className)} onSubmit={submitHandler}>
      <Input
        wrapperClassName={s.inputWrapper}
        className={s.input}
        placeholder={placeholder ?? `${t('post.addComment')}...`}
        value={text}
        onChange={event => setText(event.currentTarget.value)}
        maxLength={MAX_COMMENT_LENGTH}
        disabled={isLoading}
        autoFocus={autoFocus}
      />
      <Button className={s.button} type="submit" disabled={!canSubmit}>
        {t('post.sendComment')}
      </Button>
    </form>
  )
}
