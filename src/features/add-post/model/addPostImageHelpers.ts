import type { AddPostImageSlide } from './cropTypes'

export const getActiveSlideId = (slides: AddPostImageSlide[], selectedSlideId?: string) => {
  return selectedSlideId && slides.some(slide => slide.id === selectedSlideId)
    ? selectedSlideId
    : slides[0]?.id
}

export const createSlidesFromFiles = (
  files: File[],
  availableSlots: number,
  trackObjectUrl: (url: string) => string,
): AddPostImageSlide[] => {
  return files.slice(0, availableSlots).map(file => {
    const previewUrl = trackObjectUrl(URL.createObjectURL(file))

    return {
      id: crypto.randomUUID(),
      src: previewUrl,
      alt: file.name || 'Uploaded image',
      file,
    }
  })
}

export const revokeSlideBlobUrl = (slide?: AddPostImageSlide) => {
  if (!slide || typeof slide.src !== 'string' || !slide.src.startsWith('blob:')) {
    return
  }

  return slide.src
}

export const clearFileInput = (input: HTMLInputElement | null) => {
  if (input) {
    input.value = ''
  }
}
