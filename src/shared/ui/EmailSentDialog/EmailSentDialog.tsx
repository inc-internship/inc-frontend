'use client'

import React, { useId } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { Button } from '@/shared/ui/Button'
import s from './EmailSentDialog.module.scss'
import { Typography } from '@/shared/ui/Typography'

type EmailSentDialogProps = {
  // Optional className for the dialog root element.
  className?: string
  // Modal title text.
  title?: string
  // User email for the default description text.
  email?: string
  // Custom description. If not provided, a fallback template is used.
  description?: string
  // Confirm button label.
  confirmText?: string
  // Called when the close icon is clicked.
  onClose?: () => void
  // Called when the confirm button is clicked.
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
  // Stable ids are used for accessible aria-labelledby / aria-describedby links.
  const titleId = useId()
  const descriptionId = useId()

  // Build default description and append email only when it exists.
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
        <Typography variant="h1" as="h1" className={s.title}>
          {title}
        </Typography>
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
        <Typography id={descriptionId} variant="text-l" as="p" className={s.text}>
          {finalDescription}
        </Typography>
        <Button onClick={onConfirm} variant="primary">
          {confirmText}
        </Button>
      </div>
    </div>
  )
}
