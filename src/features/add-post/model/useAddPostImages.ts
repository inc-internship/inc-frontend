'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import {
  clearFileInput,
  createSlidesFromFiles,
  getActiveSlideId,
  revokeSlideBlobUrl,
} from './addPostImageHelpers'
import type { AddPostImageSlide } from './cropTypes'
import { useObjectUrlRegistry } from './useObjectUrlRegistry'

type Params = {
  initialSlides?: AddPostImageSlide[]
  defaultThumbsOpen?: boolean
  maxImages?: number
}

const initialSlidesKeyFrom = (slides: AddPostImageSlide[]) =>
  slides.map(slide => `${slide.id}:${String(slide.src)}`).join('|')

export const useAddPostImages = ({
  initialSlides = [],
  defaultThumbsOpen = false,
  maxImages = 10,
}: Params) => {
  const [state, setState] = useState(() => ({
    sourceKey: initialSlidesKeyFrom(initialSlides),
    slides: initialSlides,
    selectedSlideId: initialSlides[0]?.id as string | undefined,
  }))
  const [isThumbsOpen, setIsThumbsOpen] = useState(defaultThumbsOpen)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { track, revoke } = useObjectUrlRegistry()
  const initialSlidesKey = initialSlidesKeyFrom(initialSlides)
  const slides = state.sourceKey === initialSlidesKey ? state.slides : initialSlides
  const selectedSlideId =
    state.sourceKey === initialSlidesKey
      ? state.selectedSlideId
      : getActiveSlideId(initialSlides, state.selectedSlideId)

  const canAddMore = slides.length < maxImages
  const activeSlideId = getActiveSlideId(slides, selectedSlideId)

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files

    if (!files || files.length === 0) {
      return
    }

    const selectedFiles = Array.from(files)

    setState(prev => {
      const currentSlides = prev.sourceKey === initialSlidesKey ? prev.slides : initialSlides
      const currentSelectedSlideId =
        prev.sourceKey === initialSlidesKey
          ? prev.selectedSlideId
          : getActiveSlideId(initialSlides, prev.selectedSlideId)
      const availableSlots = maxImages - currentSlides.length

      if (availableSlots <= 0) {
        return prev
      }

      const newSlides = createSlidesFromFiles(selectedFiles, availableSlots, track)
      const nextSlides = [...currentSlides, ...newSlides]

      return {
        sourceKey: initialSlidesKey,
        slides: nextSlides,
        selectedSlideId: getActiveSlideId(nextSlides, currentSelectedSlideId),
      }
    })

    clearFileInput(fileInputRef.current)
  }

  const removeImage = (slideId: string) => {
    setState(prev => {
      const currentSlides = prev.sourceKey === initialSlidesKey ? prev.slides : initialSlides
      const currentSelectedSlideId =
        prev.sourceKey === initialSlidesKey
          ? prev.selectedSlideId
          : getActiveSlideId(initialSlides, prev.selectedSlideId)
      const slideToRemove = currentSlides.find(slide => slide.id === slideId)
      const blobUrl = revokeSlideBlobUrl(slideToRemove)

      if (blobUrl) {
        revoke(blobUrl)
      }

      const nextSlides = currentSlides.filter(slide => slide.id !== slideId)

      return {
        sourceKey: initialSlidesKey,
        slides: nextSlides,
        selectedSlideId: getActiveSlideId(nextSlides, currentSelectedSlideId),
      }
    })
  }

  const selectSlide = (slideId: string) => {
    setState(prev => ({
      sourceKey: initialSlidesKey,
      slides: prev.sourceKey === initialSlidesKey ? prev.slides : initialSlides,
      selectedSlideId: slideId,
    }))
  }

  const toggleThumbs = () => {
    setIsThumbsOpen(prev => !prev)
  }

  return {
    slides,
    activeSlideId,
    isThumbsOpen,
    canAddMore,
    fileInputRef,
    handleFilesSelected,
    openFilePicker,
    removeImage,
    selectSlide,
    toggleThumbs,
  }
}
