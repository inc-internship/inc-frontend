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
import { CrossIcon } from '@/features/auth/ui/email-sent-modal/icon/CrossIcon'

type PropsSentModal = {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}

export const EmailSentModal = ({ open, onOpenChange, email }: PropsSentModal) => {
  return (
    <BaseModal open={open} size={'sm'} onOpenChange={onOpenChange} className={s.emailSentModal}>
      <ModalHeader className={s.header}>
        <ModalTitle className={s.headerTitle}>Email sent</ModalTitle>
        <ModalClose className={s.closeButton}>
          <CrossIcon />
        </ModalClose>
      </ModalHeader>
      <ModalBody className={s.modalBody}>
        <Typography className={s.text} variant={'text-l'}>
          We have sent a link to confirm your email to {email}
        </Typography>
      </ModalBody>
      <ModalFooter className={s.modalFooter}>
        <Button variant={'primary'} onClick={() => onOpenChange(false)}>
          OK
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
