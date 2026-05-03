'use client'

import { BaseModal, ModalClose, ModalHeader, ModalTitle } from '@/shared/ui/BaseModal'
import { useRef, useState, useCallback } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import s from './AddProfilePhotoModal.module.scss'
import { Button } from '@/shared/ui/Button'
import { CloseIcon } from '@/shared/ui/icons/CloseIcon'
import { useI18n } from '@/shared/i18n'

const MAX_SIZE = 3 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png']

type Props = {
  open: boolean
  onCansel: () => void
  onSave: (avatarUrl: string) => void
}

export const AddProfilePhotoModal = ({ open, onCansel, onSave }: Props) => {
  const { t } = useI18n()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Состояния выбора и редактирования
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  // Открыть диалог выбора файла
  const handleSelectClick = () => {
    fileInputRef.current?.click()
  }

  // Валидация и установка выбранного изображения
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // сброс для повторного выбора того же файла

    if (!file) return

    // Проверка формата
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Допустимы только JPEG и PNG')
      return
    }

    // Проверка размера
    if (file.size > MAX_SIZE) {
      setError('Файл не должен превышать 10 МБ')
      return
    }

    setError('')
    const objectUrl = URL.createObjectURL(file)
    setSelectedImage(objectUrl)

    // Освобождаем старый URL, если был предыдущий
    return () => URL.revokeObjectURL(objectUrl)
  }, [])

  // Сохраняем информацию о кадрированной области при каждом изменении
  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  // Функция получения обрезанного изображения (через canvas)
  const createCroppedImage = async (): Promise<string> => {
    if (!selectedImage || !croppedAreaPixels) throw new Error('Нет данных для обрезки')

    const image = new Image()
    image.src = selectedImage
    // Дожидаемся загрузки оригинального изображения
    await new Promise((resolve, reject) => {
      image.onload = resolve
      image.onerror = reject
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('Canvas не поддерживается')

    // Устанавливаем размер под кропнутую область
    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    // Рисуем только нужный фрагмент
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    )

    return canvas.toDataURL('image/jpeg')
  }

  // Сохранение итогового фото
  const handleSave = async () => {
    try {
      const dataUrl = await createCroppedImage()
      onSave(dataUrl) // передаём Data URL в родительский компонент
      // В будущем здесь можно отправить Blob на сервер
    } catch (err) {
      console.error(err)
      setError('Не удалось обработать изображение')
    }
  }

  return (
    <BaseModal open={open} className={s.content}>
      <>
        <ModalHeader className={s.header}>
          <ModalTitle className={s.title}>{t('profile.addProfilePhotoModalTitle')}</ModalTitle>
          <Button
            iconOnly
            className={s.close}
            onClick={onCansel}
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
          {!selectedImage ? (
            // Шаг 1: выбор фото
            <div className={s.selectStep}>
              <Button variant="outlined" onClick={handleSelectClick}>
                Select from Computer
              </Button>
              <p className={s.hint}>{t('profile.photoRequirements')}</p>
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

              <div className={s.controls}>
                <label className={s.zoomLabel}>
                  Zoom:
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={e => setZoom(Number(e.target.value))}
                  />
                </label>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          )}

          {error && <p className={s.error}>{error}</p>}
        </div>
      </>
    </BaseModal>
  )
}
