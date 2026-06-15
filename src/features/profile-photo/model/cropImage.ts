import type { Area } from 'react-easy-crop'
import { toast } from 'react-toastify'

export const MAX_SIZE = 3 * 1024 * 1024
export const ALLOWED_TYPES = ['image/jpeg', 'image/png']

/**
 * Проверяет файл изображения на допустимый формат и размер.
 * Возвращает сообщение об ошибке или null, если валидация пройдена.
 */

export function validateImageFile(file: File, t: (key: string) => string): boolean {
  if (!ALLOWED_TYPES.includes(file.type)) {
    toast.error(t('createPost.validation.invalidTypeOrSize'))
    return false
  }
  if (file.size > MAX_SIZE) {
    toast.error(t('createPost.validation.invalidTypeOrSize'))
    return false
  }
  return true
}

/**
 * Создаёт обрезанное изображение из исходного и области кадрирования.
 * @param imageSrc - URL исходного изображения
 * @param croppedAreaPixels - координаты и размеры кропнутой области
 * @param quality - качество JPEG (0 до 1), по умолчанию 0.9
 * @returns Data URL итогового изображения
 */
export async function getCroppedImg(
  imageSrc: string,
  croppedAreaPixels: Area,
  quality = 0.9,
): Promise<string> {
  if (!croppedAreaPixels) {
    throw new Error('No crop data')
  }

  const image = new window.Image()
  image.src = imageSrc
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('Failed to load image'))
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) throw new Error('Canvas not supported')

  canvas.width = croppedAreaPixels.width
  canvas.height = croppedAreaPixels.height

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

  return canvas.toDataURL('image/jpeg', quality)
}
