'use client'

import { BaseModal, ModalClose, ModalHeader, ModalTitle } from '@/shared/ui/BaseModal'
import { useRef, useState, useCallback, useEffect } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import s from './AddProfilePhotoModal.module.scss'
import { Button } from '@/shared/ui/Button'
import { CloseIcon } from '@/shared/ui/icons/CloseIcon'
import { useI18n } from '@/shared/i18n'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/Avatar'
import Image from 'next/image'
import clsx from 'clsx'
import { validateImageFile, getCroppedImg } from '@/features/profile-photo/model/cropImage'

type Props = {
  open: boolean
  onCancel: () => void
  onSave: (avatarUrl: string) => void
  className?: string
}

export const AddProfilePhotoModal = ({ open, onCancel, onSave, className }: Props) => {
  const { t } = useI18n()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Состояния выбора и редактирования
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  // Очистка objectURL при смене или размонтировании
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage)
      }
    }
  }, [selectedImage])

  // Открыть диалог выбора файла
  const handleSelectClick = () => {
    fileInputRef.current?.click()
  }

  // Валидация и установка выбранного изображения
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = '' // сброс для повторного выбора того же файла

      if (!file) return

      const errorMsg = validateImageFile(file)
      if (errorMsg) {
        setError(errorMsg)
        return
      }

      setError('')

      // Освобождаем предыдущий URL, если есть
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage)
      }

      const objectUrl = URL.createObjectURL(file)
      setSelectedImage(objectUrl)
    },
    [selectedImage],
  )

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleSave = async () => {
    if (!selectedImage || !croppedAreaPixels) {
      setError('Нет данных для обрезки')
      return
    }
    try {
      const dataUrl = await getCroppedImg(selectedImage, croppedAreaPixels)
      onSave(dataUrl)
    } catch (err) {
      console.error(err)
      setError('Не удалось обработать изображение')
    }
  }

  return (
    <BaseModal open={open} className={clsx(s.content, s.addProfilePhotoModal)}>
      <>
        <ModalHeader className={s.header}>
          <ModalTitle className={s.title}>{t('profile.addProfilePhotoModalTitle')}</ModalTitle>
          <Button
            iconOnly
            className={s.close}
            onClick={onCancel}
            aria-label="Close modal"
            // disabled={isLoading}
          >
            <CloseIcon />
          </Button>
        </ModalHeader>

        {/* Скрытый input для выбора файла */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <div className={s.body}>
          {error && <p className={s.error}>{error}</p>}
          {!selectedImage ? (
            // Шаг 1: выбор фото
            <div className={s.selectStep}>
              <div className={s.avatarWrapper}>
                <Avatar>
                  <AvatarImage src="/images/default-avatar.sv" alt="Profile avatar" />
                  <AvatarFallback>
                    <Image
                      alt="Default avatar"
                      className={s.defaultAvatar}
                      width={48}
                      height={48}
                      src="/images/default-avatar.svg"
                    />
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button variant="outlined" onClick={handleSelectClick}>
                Select from Computer
              </Button>
            </div>
          ) : (
            // Шаг 2: центрирование и сохранение
            <div className={s.cropStep}>
              <div className={s.cropperWrapper}>
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <Button variant="primary" onClick={handleSave} className={s.saveBtn}>
                Save
              </Button>
            </div>
          )}
        </div>
      </>
    </BaseModal>
  )
}
