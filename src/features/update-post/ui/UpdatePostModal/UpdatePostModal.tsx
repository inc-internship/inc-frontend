'use client'

import { BaseModal, ModalHeader, ModalTitle } from '@/shared/ui/BaseModal'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'
import s from './UpdatePostModal.module.scss'
import { CloseIcon } from '@/shared/ui/icons/CloseIcon'
import { useState, useEffect } from 'react'
import { useI18n } from '@/shared/i18n'
import { Typography } from '@/shared/ui/Typography'
import { TextArea } from '@/shared/ui/TextArea'
import Image from 'next/image'
import { useGetMeQuery } from '@/entities/auth'
import { CloseEditionModal } from '@/features/update-post/ui/CloseEditionModal/CloseEditionModal'

type Props = {
  open: boolean
  isLoading?: boolean
  onConfirm: (description: string) => Promise<void> | void
  onCancel: () => void
  initialDescription?: string
  imageUrl?: string
}

export const UpdatePostModal = ({
  open,
  isLoading = false,
  onConfirm,
  onCancel,
  initialDescription = '',
  imageUrl,
}: Props) => {
  const { data: user } = useGetMeQuery()
  const { t } = useI18n()

  const [isCloseEditionModalOpen, setIsCloseEditionModalOpen] = useState(false)

  const [localDescription, setLocalDescription] = useState(initialDescription)

  const hasChanges = localDescription.trim() !== initialDescription.trim()

  const handleSave = () => {
    if (!hasChanges) {
      onCancel()
      return
    }
    onConfirm(localDescription)
  }

  if (!open) return null

  return (
    <>
      <BaseModal open={open} className={s.container} closeOnOverlay={!isLoading}>
        {isLoading ? (
          <div className={s.loaderState} aria-live="polite" aria-busy="true">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <ModalHeader className={s.header}>
              <ModalTitle className={s.title}>{t('post.updateTitle')}</ModalTitle>
              <Button
                iconOnly
                className={s.headerIconButton}
                onClick={() => setIsCloseEditionModalOpen(true)}
                aria-label="Close modal"
                disabled={isLoading}
              >
                <span className={s.iconWrapper}>
                  <CloseIcon />
                </span>
                <span className={s.buttonText}>Cancel</span>
              </Button>
            </ModalHeader>
            <div className={s.modalContent}>
              <div className={s.modalImage}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Post image"
                    fill
                    className={s.postImage} // добавь стили при необходимости
                    unoptimized
                  />
                ) : (
                  <Typography variant="text-s">No image</Typography> // или просто "Image"
                )}
              </div>
              <div className={s.updatePanel}>
                <div className={s.authorBlock}>
                  <span className={s.avatarPlaceholder} />
                  <Typography variant="text-m-bold" className={s.userName}>
                    {user?.login ?? 'User'}
                  </Typography>
                </div>

                <TextArea
                  className={s.descriptionField}
                  label="Add publication descriptions"
                  value={localDescription}
                  onChange={e => setLocalDescription(e.currentTarget.value)}
                  placeholder="Text-area"
                  rows={7}
                  maxLength={500}
                  disabled={isLoading}
                />

                <Typography variant="text-s" className={s.counter}>
                  {localDescription?.length ?? 0}/500
                </Typography>
                <Button
                  variant={'primary'}
                  onClick={handleSave}
                  disabled={isLoading || !hasChanges}
                  className={s.saveChangesButton}
                >
                  <span className={s.saveChanges}>{t('post.updateModalSaveChanges')}</span>
                  <span className={s.save}>{t('post.updateModalSave')}</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </BaseModal>

      <CloseEditionModal
        open={isCloseEditionModalOpen}
        isLoading={isLoading}
        onConfirm={() => {
          setIsCloseEditionModalOpen(false)
          onCancel() // Закрываем первую модалку и отменяем изменения
        }}
        onCancel={() => {
          setIsCloseEditionModalOpen(false) // Только закрываем вторую модалку
        }}
      />
    </>
  )
}
