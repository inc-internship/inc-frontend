'use client'

import { BaseModal, ModalHeader, ModalTitle } from '@/shared/ui/BaseModal'
import { useRef, useState, useCallback, useEffect } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import s from './AddProfilePhotoModal.module.scss'
import { Button } from '@/shared/ui/Button'
import { CloseIcon } from '@/shared/ui/icons/CloseIcon'
import { useI18n } from '@/shared/i18n'
import { Avatar } from '@/shared/ui/Avatar'
import clsx from 'clsx'
import { validateImageFile, getCroppedImg } from '@/features/profile-photo/model/cropImage'
import { useUploadAvatarMediaMutation } from '@/entities/user/api/user.api'
import { toast } from 'react-toastify'
import { Spinner } from '@/shared/ui/Spinner'

type Props = {
  open: boolean
  onCancel: () => void
  onSave: () => void
  className?: string
}

export const AddProfilePhotoModal = ({ open, onCancel, onSave }: Props) => {
  const { t } = useI18n()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadMedia, { isLoading: isUploading }] = useUploadAvatarMediaMutation()

  // cостояния выбора и редактирования
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  // очистка objectURL при смене или размонтировании
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage)
      }
    }
  }, [selectedImage])

  // открыть диалог выбора файла
  const handleSelectClick = () => {
    fileInputRef.current?.click()
  }

  // валидация и установка выбранного изображения
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = '' // сброс для повторного выбора того же файла

      if (!file) return

      if (!validateImageFile(file, t)) return

      setError('')

      // Освобождаем предыдущий URL, если есть
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage)
      }

      const objectUrl = URL.createObjectURL(file)
      setSelectedImage(objectUrl)
    },
    [selectedImage, t],
  )

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleSave = async () => {
    if (!selectedImage || !croppedAreaPixels) {
      toast.error(t('profile.cropNoData'))
      return
    }

    try {
      // 1 кроп
      const dataUrl = await getCroppedImg(selectedImage, croppedAreaPixels)

      // 2. конвертируем в файл
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'avatar.jpeg', { type: 'image/jpeg' })

      // 3. загрузка на сервер
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await uploadMedia(formData).unwrap()

      // 4. проверяем новый формат ответа: берём id из original
      const uploadedImageId = uploadRes.original?.id
      if (!uploadedImageId) {
        toast.error(t('profile.uploadNoImageId'))
        return
      }

      // 5. при успехе – закрываем модалку, профиль обновится
      onSave()
      toast.success(t('profile.updateAvatarSuccess'))
    } catch (error) {
      if (error instanceof Error) {
        // Разбираем ошибки от getCroppedImg
        if (error.message === 'No crop data') {
          toast.error(t('profile.cropNoData'))
        } else if (error.message === 'Failed to load image') {
          toast.error(t('common.somethingWentWrong'))
        } else if (error.message === 'Canvas not supported') {
          toast.error(t('common.somethingWentWrong'))
        } else {
          toast.error(t('profile.serverError'))
        }
      } else {
        toast.error(t('profile.serverError'))
      }
    }
  }

  const handleCancel = () => {
    if (isUploading) return
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage)
      setSelectedImage(null)
    }
    setError('')
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    onCancel()
  }

  return (
    <BaseModal
      open={open}
      onOpenChange={handleCancel}
      closeOnOverlay={!isUploading}
      className={clsx(s.content, s.addProfilePhotoModal)}
    >
      <ModalHeader className={s.header}>
        <ModalTitle className={s.title}>{t('profile.addProfilePhotoModalTitle')}</ModalTitle>
        <Button
          iconOnly
          className={s.close}
          onClick={handleCancel}
          disabled={isUploading}
          aria-label="Close modal"
        >
          <CloseIcon />
        </Button>
      </ModalHeader>

      {/* input для выбора файла */}
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
          // выбор картинки
          <div className={s.selectStep}>
            <div className={s.avatarWrapper}>
              <Avatar
                src={null} // явно без аватара, чтобы показать фолбэк
                alt={t('profile.altAvatar')}
                fallbackSrc="/images/default-avatar.svg"
                size={48}
              />
            </div>
            <Button variant="outlined" onClick={handleSelectClick}>
              {t('profile.selectPhotoButton')}
            </Button>
          </div>
        ) : (
          // центрирование и сохранение картинки
          <div className={s.cropStep}>
            {isUploading ? (
              <div className={s.loaderState} aria-live="polite" aria-busy="true">
                <Spinner size="lg" />
              </div>
            ) : (
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
            )}
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isUploading}
              className={s.saveBtn}
            >
              {t('profile.savePhotoButton')}
            </Button>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
