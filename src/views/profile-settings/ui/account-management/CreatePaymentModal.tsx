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
import { CheckBox } from '@/shared/ui/CheckBox'
import { CloseIcon } from '@/shared/ui/icons/CloseIcon'
import { Spinner } from '@/shared/ui/Spinner'
import s from './AccountManagementPage.module.scss'

type Props = {
  open: boolean
  isLoading: boolean
  isAgreed: boolean
  description: string
  onAgreementChange: (isAgreed: boolean) => void
  onConfirm: () => void
  onClose: () => void
}

export const CreatePaymentModal = ({
  open,
  isLoading,
  isAgreed,
  description,
  onAgreementChange,
  onConfirm,
  onClose,
}: Props) => {
  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen && !isLoading) {
      onClose()
    }
  }

  return (
    <BaseModal
      open={open}
      size="sm"
      className={s.createPaymentModal}
      closeOnOverlay={!isLoading}
      onOpenChange={openChangeHandler}
    >
      <ModalHeader className={s.modalHeader}>
        <ModalTitle className={s.modalTitle}>Create payment</ModalTitle>
        <ModalClose className={s.modalClose} disabled={isLoading} aria-label="Close">
          <CloseIcon />
        </ModalClose>
      </ModalHeader>
      <ModalBody className={s.createPaymentBody}>
        <ModalDescription className={s.modalDescription}>{description}</ModalDescription>
      </ModalBody>
      <ModalFooter className={s.createPaymentFooter}>
        <CheckBox
          label="I agree"
          checked={isAgreed}
          disabled={isLoading}
          className={s.agreementCheckbox}
          onCheckedChange={checked => onAgreementChange(checked === true)}
        />
        <Button variant="primary" disabled={!isAgreed || isLoading} onClick={onConfirm}>
          {isLoading && <Spinner className={s.buttonSpinner} />}
          OK
        </Button>
      </ModalFooter>
    </BaseModal>
  )
}
