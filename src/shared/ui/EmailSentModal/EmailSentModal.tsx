'use client'

import {
  BaseModal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui/BaseModal'
import { Button } from '@/shared/ui/Button'
import { Typography } from '@/shared/ui/Typography'
import Image from 'next/image'
import s from './EmailSentModal.module.scss'

type Props = {
  email: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: () => void
  confirmText?: string
}

export const EmailSentModal = ({
  email,
  open,
  onOpenChange,
  onConfirm,
  confirmText = 'OK',
}: Props) => {
  const confirmHandler = () => {
    onConfirm?.()
    onOpenChange(false)
  }

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} size="sm" className={s.modal}>
      <ModalHeader className={s.header}>
        <ModalTitle className={s.title}>Email sent</ModalTitle>
        <ModalClose className={s.close} aria-label="Close message">
          <Image src="/icons/ui/close.svg" alt="" width={24} height={24} className={s.closeIcon} />
        </ModalClose>
      </ModalHeader>

      <ModalBody className={s.body}>
        <Typography variant="text-l" className={s.description}>
          {`We have sent a link to confirm your email to ${email}`}
        </Typography>
      </ModalBody>

      <ModalFooter className={s.footer}>
        <Button type="button" variant="primary" className={s.okButton} onClick={confirmHandler}>
          {confirmText}
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
