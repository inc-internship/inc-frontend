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
import { CloseIcon } from '@/shared/ui/icons/CloseIcon'
import s from './AccountManagementPage.module.scss'

type Props = {
  open: boolean
  onBackToPayment: () => void
  onClose: () => void
}

export const PaymentErrorModal = ({ open, onBackToPayment, onClose }: Props) => {
  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose()
    }
  }

  return (
    <BaseModal open={open} className={s.errorModal} onOpenChange={openChangeHandler}>
      <ModalHeader className={s.modalHeader}>
        <ModalTitle className={s.modalTitle}>Error</ModalTitle>
        <ModalClose className={s.modalClose} aria-label="Close">
          <CloseIcon />
        </ModalClose>
      </ModalHeader>
      <ModalBody className={s.resultModalBody}>
        <ModalDescription className={s.modalDescription}>
          Transaction failed. Please, write to support
        </ModalDescription>
      </ModalBody>
      <ModalFooter className={s.resultModalFooter}>
        <Button
          variant="primary"
          fullWidth
          className={s.resultModalButton}
          onClick={onBackToPayment}
        >
          Back to payment
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
