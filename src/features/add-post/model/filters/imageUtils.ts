export const applyFilterToImage = async (
  imageUrl: string,
  filter: string,
  originalFile?: File,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context not available'))
      ctx.filter = filter
      ctx.drawImage(img, 0, 0)

      const originalType = originalFile?.type

      const supportedOutputTypes = ['image/png', 'image/jpeg', 'image/webp']
      const outputType =
        originalType && supportedOutputTypes.includes(originalType) ? originalType : 'image/png'

      const extensionMap: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
      }
      const extension = extensionMap[outputType] || '.png'

      let fileName: string
      if (originalFile?.name) {
        const baseName = originalFile.name.replace(/\.[^/.]+$/, '')
        fileName = `${baseName}${extension}`
      } else {
        fileName = `filtered_image${extension}`
      }

      const quality = outputType === 'image/jpeg' || outputType === 'image/webp' ? 0.92 : undefined

      canvas.toBlob(
        blob => {
          if (blob) {
            const file = new File([blob], fileName, { type: outputType })
            resolve(file)
          } else {
            reject(new Error('Failed to create blob'))
          }
        },
        outputType,
        quality,
      )
    }
    img.onerror = err => reject(err)
  })
}
