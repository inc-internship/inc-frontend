import { BaseModal, ModalClose, ModalHeader, ModalTitle } from '@/shared/ui/BaseModal'
import s from './AddProfilePhotoModal.module.scss'
import { Button } from '@/shared/ui/Button'
import { CloseIcon } from '@/shared/ui/icons/CloseIcon'
import { useI18n } from '@/shared/i18n'

type Props = {
  open: boolean
  onCansel: () => void
}

export const AddProfilePhotoModal = ({ open, onCansel }: Props) => {
  const { t } = useI18n()

  return (
    <BaseModal open={open} className={s.content}>
      <>
        <ModalHeader className={s.header}>
          <ModalTitle className={s.title}>{t('profile.addProfilePhotoModalTitle')}</ModalTitle>
          <Button
            iconOnly
            className={s.close}
            onClick={() => onCansel()}
            aria-label="Close modal"
            // disabled={isLoading}
          >
            <CloseIcon />
          </Button>
        </ModalHeader>
      </>
    </BaseModal>
  )
}
