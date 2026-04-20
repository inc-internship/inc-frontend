'use client'

import { getScaleFromZoom } from './cropSettings'

export const ASPECT_RATIO_VALUES = {
  original: null,
  '1:1': 1,
  '4:5': 4 / 5,
  '16:9': 16 / 9,
} as const

export type AspectRatioPreset = keyof typeof ASPECT_RATIO_VALUES

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image()

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    image.src = src
  })

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error('Failed to create cropped image blob'))

          return
        }

        resolve(blob)
      },
      type,
      quality,
    )
  })

const getCenteredCropArea = (
  imageWidth: number,
  imageHeight: number,
  aspectRatio: AspectRatioPreset,
  zoom: number,
) => {
  const targetAspectRatio = ASPECT_RATIO_VALUES[aspectRatio]
  const scale = getScaleFromZoom(zoom)

  let cropWidth = imageWidth
  let cropHeight = imageHeight

  if (targetAspectRatio) {
    const sourceAspectRatio = imageWidth / imageHeight

    if (sourceAspectRatio > targetAspectRatio) {
      cropHeight = imageHeight
      cropWidth = cropHeight * targetAspectRatio
    } else {
      cropWidth = imageWidth
      cropHeight = cropWidth / targetAspectRatio
    }
  }

  cropWidth /= scale
  cropHeight /= scale

  return {
    x: (imageWidth - cropWidth) / 2,
    y: (imageHeight - cropHeight) / 2,
    width: cropWidth,
    height: cropHeight,
  }
}

const getOutputMimeType = (file?: File) => {
  if (file?.type === 'image/png' || file?.type === 'image/webp' || file?.type === 'image/jpeg') {
    return file.type
  }

  return 'image/png'
}

const getOutputFileName = (fileName: string | undefined, mimeType: string) => {
  const safeName = fileName?.replace(/\.[^.]+$/, '') || 'cropped-image'
  const extension = mimeType === 'image/jpeg' ? 'jpg' : mimeType.replace('image/', '')

  return `${safeName}.${extension}`
}

type Params = {
  src: string
  aspectRatio: AspectRatioPreset
  zoom: number
  file?: File
  fileName?: string
}

export const createCroppedImageFile = async ({
  src,
  aspectRatio,
  zoom,
  file,
  fileName,
}: Params) => {
  const image = await loadImage(src)
  const cropArea = getCenteredCropArea(image.naturalWidth, image.naturalHeight, aspectRatio, zoom)
  const canvas = document.createElement('canvas')

  canvas.width = Math.max(1, Math.round(cropArea.width))
  canvas.height = Math.max(1, Math.round(cropArea.height))

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Failed to get canvas context for cropping')
  }

  context.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  const mimeType = getOutputMimeType(file)
  const blob = await canvasToBlob(canvas, mimeType, mimeType === 'image/jpeg' ? 0.92 : undefined)

  return new File([blob], getOutputFileName(file?.name ?? fileName, mimeType), {
    type: mimeType,
  })
}
