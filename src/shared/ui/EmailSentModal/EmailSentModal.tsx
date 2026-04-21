'use client'

import {
  BaseModal,
  ModalBody,
  ModalClose,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui/BaseModal'
import { Button } from '@/shared/ui/Button'
import { Typography } from '@/shared/ui/Typography'
import Image from 'next/image'
import s from './EmailSentModal.module.scss'
import { useI18n } from '@/shared/i18n'

type Props = {
  email: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: () => void
  confirmText?: string
}

export const EmailSentModal = ({ email, open, onOpenChange, onConfirm, confirmText }: Props) => {
  const { t } = useI18n()
  const confirmHandler = () => {
    onConfirm?.()
    onOpenChange(false)
  }

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} size="sm" className={s.modal}>
      <ModalHeader className={s.header}>
        <ModalTitle className={s.title}>{t('auth.emailSent.title')}</ModalTitle>
        <ModalClose className={s.close} aria-label={t('common.closeMessage')}>
          <Image src="/icons/ui/close.svg" alt="" width={24} height={24} className={s.closeIcon} />
        </ModalClose>
      </ModalHeader>

      <ModalBody className={s.body}>
        <ModalDescription className={s.description}>
          <Typography variant="text-l" as="span">
            {t('auth.emailSent.description', { email })}
          </Typography>
        </ModalDescription>
      </ModalBody>

      <ModalFooter className={s.footer}>
        <Button type="button" variant="primary" className={s.okButton} onClick={confirmHandler}>
          {confirmText ?? t('common.ok')}
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
