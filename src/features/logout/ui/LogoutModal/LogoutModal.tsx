import {
  BaseModal,
  ModalClose,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui/BaseModal'
import { Button } from '@/shared/ui/Button'
import s from './LogoutModal.module.scss'
import { CloseIcon } from '@/features/logout/ui/LogoutModal/CloseIcon/CloseIcon'
import { useGetMeQuery } from '@/entities/auth/api/auth.api'

type Props = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const LogoutModal = ({ open, onConfirm, onCancel }: Props) => {
  const { data: user } = useGetMeQuery()
  const email = user?.email || 'User'
  if (!open) return null

  return (
    <BaseModal open={open} className={s.content}>
      <ModalHeader className={s.header}>
        <ModalTitle className={s.title}>Log Out</ModalTitle>
        <ModalClose className={s.close} onClick={() => onCancel()}>
          <CloseIcon />
        </ModalClose>
      </ModalHeader>
      <ModalDescription className={s.description}>
        Are you really want to log out of your account {'"'}
        <strong>{email}</strong>
        {'"'}?
      </ModalDescription>
      <ModalFooter className={s.footer}>
        <Button variant={'outlined'} onClick={() => onConfirm()}>
          Yes
        </Button>
        <Button variant={'primary'} onClick={() => onCancel()}>
          No
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
