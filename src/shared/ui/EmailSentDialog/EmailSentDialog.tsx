'use client'

import React, { useId } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { Button } from '@/shared/ui/Button'
import s from './EmailSentDialog.module.scss'

type EmailSentDialogProps = {
  className?: string
  title?: string
  email?: string
  description?: string
  confirmText?: string
  onClose?: () => void
  onConfirm?: () => void
}

export const EmailSentDialog = ({
  className,
  title = 'Email sent',
  email,
  description,
  confirmText = 'OK',
  onClose,
  onConfirm,
}: EmailSentDialogProps) => {
  const titleId = useId()
  const descriptionId = useId()

  const finalDescription =
    description ?? `We have sent a link to confirm your email${email ? ` to ${email}` : ''}`

  return (
    <div
      className={clsx(s.emailSentDialog, className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className={s.topWrapper}>
        <p id={titleId} className={s.title}>
          {title}
        </p>
        <button type="button" className={s.closeButton} onClick={onClose} aria-label="Close dialog">
          <Image
            src="/icons/ui/close-outline.svg"
            alt=""
            width={24}
            height={24}
            className={s.chevronIcon}
            aria-hidden
          />
        </button>
      </div>

      <div className={s.content}>
        <p id={descriptionId} className={s.text}>
          {finalDescription}
        </p>

        <Button onClick={onConfirm} variant="primary">
          {confirmText}
        </Button>
      </div>
    </div>
  )
}
