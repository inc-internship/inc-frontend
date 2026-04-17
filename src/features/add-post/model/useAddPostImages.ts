'use client'

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import type { AddPostImageSlide } from './cropTypes'

type Params = {
  initialSlides?: AddPostImageSlide[]
  defaultThumbsOpen?: boolean
  maxImages?: number
}

export const useAddPostImages = ({
  initialSlides = [],
  defaultThumbsOpen = false,
  maxImages = 10,
}: Params) => {
  const [slides, setSlides] = useState<AddPostImageSlide[]>(initialSlides)
  const [selectedSlideId, setSelectedSlideId] = useState<string | undefined>(initialSlides[0]?.id)
  const [isThumbsOpen, setIsThumbsOpen] = useState(defaultThumbsOpen)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const blobUrlsRef = useRef<Set<string>>(new Set())

  const canAddMore = slides.length < maxImages
  const activeSlideId = useMemo(() => {
    return selectedSlideId && slides.some(slide => slide.id === selectedSlideId)
      ? selectedSlideId
      : slides[0]?.id
  }, [selectedSlideId, slides])

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files

    if (!files || files.length === 0) {
      return
    }

    const selectedFiles = Array.from(files)

    setSlides(prev => {
      const availableSlots = maxImages - prev.length

      if (availableSlots <= 0) {
        return prev
      }

      const filesToAdd = selectedFiles.slice(0, availableSlots)
      const newSlides: AddPostImageSlide[] = filesToAdd.map(file => {
        const previewUrl = URL.createObjectURL(file)

        blobUrlsRef.current.add(previewUrl)

        return {
          id: crypto.randomUUID(),
          src: previewUrl,
          alt: file.name || 'Uploaded image',
          file,
        }
      })

      return [...prev, ...newSlides]
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (slideId: string) => {
    setSlides(prev => {
      const slideToRemove = prev.find(slide => slide.id === slideId)

      if (
        slideToRemove &&
        typeof slideToRemove.src === 'string' &&
        slideToRemove.src.startsWith('blob:')
      ) {
        URL.revokeObjectURL(slideToRemove.src)
        blobUrlsRef.current.delete(slideToRemove.src)
      }

      return prev.filter(slide => slide.id !== slideId)
    })
  }

  const selectSlide = (slideId: string) => {
    setSelectedSlideId(slideId)
  }

  const toggleThumbs = () => {
    setIsThumbsOpen(prev => !prev)
  }

  useEffect(() => {
    const blobUrls = blobUrlsRef.current

    return () => {
      blobUrls.forEach(url => {
        URL.revokeObjectURL(url)
      })
      blobUrls.clear()
    }
  }, [])

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
