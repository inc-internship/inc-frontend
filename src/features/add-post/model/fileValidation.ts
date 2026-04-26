export const MAX_IMAGE_FILE_SIZE_BYTES = 3 * 1024 * 1024
export const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png'])
export const IMAGE_INPUT_ACCEPT = '.jpg,.jpeg,.png,image/jpeg,image/png'
export const FILE_VALIDATION_ERROR_TEXT =
  'The photo must be less than 3 Mb and have JPEG or PNG format'

export const hasInvalidImageFiles = (files: File[]) => {
  const hasInvalidType = files.some(file => !ALLOWED_IMAGE_MIME_TYPES.has(file.type))

  if (hasInvalidType) {
    return true
  }

  return files.some(file => file.size > MAX_IMAGE_FILE_SIZE_BYTES)
}
