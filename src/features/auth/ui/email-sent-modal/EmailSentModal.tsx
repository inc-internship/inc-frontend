'use client'

import {
  BaseModal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui/BaseModal'
import s from './EmailSentModal.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { CrossIcon } from './icon/CrossIcon'
import { useI18n } from '@/shared/i18n'

type PropsSentModal = {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}

export const EmailSentModal = ({ open, onOpenChange, email }: PropsSentModal) => {
  const { t } = useI18n()

  return (
    <BaseModal open={open} size="sm" onOpenChange={onOpenChange} className={s.emailSentModal}>
      <ModalHeader className={s.header}>
        <ModalTitle className={s.headerTitle}>{t('auth.emailSent.title')}</ModalTitle>
        <ModalClose className={s.closeButton}>
          <CrossIcon />
        </ModalClose>
      </ModalHeader>
      <ModalBody className={s.modalBody}>
        <Typography className={s.text} variant="text-l">
          {t('auth.emailSent.description', { email })}
        </Typography>
      </ModalBody>
      <ModalFooter className={s.modalFooter}>
        <Button variant="primary" onClick={() => onOpenChange(false)}>
          {t('common.ok')}
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
