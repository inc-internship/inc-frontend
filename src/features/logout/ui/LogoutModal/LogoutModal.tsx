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

type Props = {
  open: boolean
  isLoading?: boolean
  onConfirm: () => Promise<void> | void
  onCancel: () => void
}

export const LogoutModal = ({ open, isLoading = false, onConfirm, onCancel }: Props) => {
  const { data: user } = useGetMeQuery()
  const email = user?.email || 'User'
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
            <ModalTitle className={s.title}>Log Out</ModalTitle>
            <ModalClose className={s.close} onClick={onCancel} disabled={isLoading}>
              <CloseIcon />
            </ModalClose>
          </ModalHeader>
          <ModalDescription className={s.description}>
            Are you really want to log out of your account {'"'}
            <strong>{email}</strong>
            {'"'}?
          </ModalDescription>
          <ModalFooter className={s.footer}>
            <Button variant={'outlined'} onClick={onConfirm} disabled={isLoading}>
              Yes
            </Button>
            <Button variant={'primary'} onClick={onCancel} disabled={isLoading}>
              No
            </Button>
          </ModalFooter>
        </>
      )}
    </BaseModal>
  )
}
