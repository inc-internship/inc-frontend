export const applyFilterToImage = async (imageUrl: string, filter: string): Promise<File> => {
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
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'filtered_image.png', { type: blob.type })
          resolve(file)
        } else {
          reject(new Error('Failed to create blob'))
        }
      }, 'image/png')
    }
    img.onerror = err => reject(err)
  })
}
