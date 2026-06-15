export const MAX_IMAGE_FILE_SIZE_BYTES = 3 * 1024 * 1024
export const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png'])
export const IMAGE_INPUT_ACCEPT = '.jpg,.jpeg,.png,image/jpeg,image/png'

export type ImageFilesValidationError = 'invalidTypeOrSize'

export const getImageFilesValidationError = (files: File[]): ImageFilesValidationError | null => {
  const hasInvalidType = files.some(file => !ALLOWED_IMAGE_MIME_TYPES.has(file.type))

  if (hasInvalidType) {
    return 'invalidTypeOrSize'
  }

  const hasInvalidSize = files.some(file => file.size > MAX_IMAGE_FILE_SIZE_BYTES)

  return hasInvalidSize ? 'invalidTypeOrSize' : null
}
