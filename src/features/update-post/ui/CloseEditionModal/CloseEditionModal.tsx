'use client'

import {
  BaseModal,
  ModalClose,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui/BaseModal'
import { Button } from '@/shared/ui/Button'
import s from './CloseEditionModal.module.scss'
import { CloseIcon } from '@/shared/ui/icons/CloseIcon'
import { useI18n } from '@/shared/i18n'

type Props = {
  open: boolean
  isLoading?: boolean
  onConfirm: () => Promise<void> | void
  onCancel: () => void
}

export const CloseEditionModal = ({ open, isLoading = false, onConfirm, onCancel }: Props) => {
  const { t } = useI18n()
  if (!open) return null

  return (
    <>
      <BaseModal open={open} className={s.content} closeOnOverlay={!isLoading}>
        <>
          <ModalHeader className={s.header}>
            <ModalTitle className={s.title}>{t('post.closeEditionModalTitle')}</ModalTitle>
            <ModalClose className={s.close} onClick={onCancel} disabled={isLoading}>
              <CloseIcon />
            </ModalClose>
          </ModalHeader>
          <ModalDescription className={s.description}>
            {t('post.closeEditionModalText')}
          </ModalDescription>
          <ModalFooter className={s.footer}>
            <Button variant={'outlined'} onClick={onConfirm} disabled={isLoading}>
              {t('common.yes')}
            </Button>
            <Button variant={'primary'} onClick={onCancel} disabled={isLoading}>
              {t('common.no')}
            </Button>
          </ModalFooter>
        </>
      </BaseModal>
    </>
  )
}
