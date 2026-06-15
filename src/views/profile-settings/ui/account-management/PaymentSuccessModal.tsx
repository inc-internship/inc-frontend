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
import { Spinner } from '@/shared/ui/Spinner'
import s from './AccountManagementPage.module.scss'

type Props = {
  open: boolean
  isLoading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export const PaymentSuccessModal = ({ open, isLoading = false, onConfirm, onClose }: Props) => {
  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen && !isLoading) {
      onClose()
    }
  }

  return (
    <BaseModal
      open={open}
      className={s.successModal}
      closeOnOverlay={!isLoading}
      onOpenChange={openChangeHandler}
    >
      <ModalHeader className={s.modalHeader}>
        <ModalTitle className={s.modalTitle}>Success</ModalTitle>
        <ModalClose className={s.modalClose} disabled={isLoading} aria-label="Close">
          <CloseIcon />
        </ModalClose>
      </ModalHeader>
      <ModalBody className={s.resultModalBody}>
        <ModalDescription className={s.modalDescription}>Payment was successful!</ModalDescription>
      </ModalBody>
      <ModalFooter className={s.resultModalFooter}>
        <Button variant="primary" fullWidth disabled={isLoading} onClick={onConfirm}>
          {isLoading && <Spinner className={s.buttonSpinner} />}
          OK
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
