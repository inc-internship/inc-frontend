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
import { Spinner } from '@/shared/ui/Spinner'
import s from './DeleteProfolePhotoModal.module.scss'
import { CloseIcon } from '@/shared/ui/icons/CloseIcon'
import { useI18n } from '@/shared/i18n'

type Props = {
  open: boolean
  isLoading?: boolean
  onConfirm: () => Promise<void> | void
  onCancel: () => void
}

export const DeleteProfilePhotoModal = ({
  open,
  isLoading = false,
  onConfirm,
  onCancel,
}: Props) => {
  const { t } = useI18n()
  if (!open) return null

  return (
    <BaseModal open={open} className={s.content} closeOnOverlay={!isLoading}>
      {isLoading ? (
        <div className={s.loaderState} aria-live="polite" aria-busy="true">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <ModalHeader className={s.header}>
            <ModalTitle className={s.title}>{t('profile.deleteProfilePhotoModalTitle')}</ModalTitle>
            <ModalClose className={s.close} onClick={onCancel} disabled={isLoading}>
              <CloseIcon />
            </ModalClose>
          </ModalHeader>
          <ModalDescription className={s.description}>
            {t('profile.deleteProfilePhotoModalText')}
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
      )}
    </BaseModal>
  )
}
