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
import s from './LogoutModal.module.scss'
import { CloseIcon } from '@/features/logout/ui/LogoutModal/CloseIcon/CloseIcon'
import { useGetMeQuery } from '@/entities/auth/api/auth.api'
import { useI18n } from '@/shared/i18n'

type Props = {
  open: boolean
  isLoading?: boolean
  onConfirm: () => Promise<void> | void
  onCancel: () => void
}

export const LogoutModal = ({ open, isLoading = false, onConfirm, onCancel }: Props) => {
  const { t } = useI18n()
  const { data: user } = useGetMeQuery()
  const email = user?.email || t('common.user')
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
            <ModalTitle className={s.title}>{t('auth.logout.title')}</ModalTitle>
            <ModalClose className={s.close} onClick={onCancel} disabled={isLoading}>
              <CloseIcon />
            </ModalClose>
          </ModalHeader>
          <ModalDescription className={s.description}>
            {t('auth.logout.description', { email })}
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
