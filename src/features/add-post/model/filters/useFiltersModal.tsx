import { useState, useCallback } from 'react'
import { useAddPostImages } from '../useAddPostImages'
import { useFilters } from './useFilter'
import type { ImageSlide } from '@/shared/ui/ImageSlider'

export type FiltersModalResult = {
  id: string
  alt: string
  src: string
  filter: string
}

type UseFiltersModalProps = {
  initialSlides?: ImageSlide[]
  maxImages?: number
  onNext?: (results: FiltersModalResult[]) => void | Promise<void>
}

export const useFiltersModal = ({
  initialSlides = [],
  maxImages = 10,
  onNext,
}: UseFiltersModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    slides,
    activeSlideId,
    isThumbsOpen,
    fileInputRef,
    handleFilesSelected,
    openFilePicker,
    removeImage,
    selectSlide,
    toggleThumbs,
  } = useAddPostImages({ initialSlides, maxImages })

  const { applyFilter, filters, filtersForImages } = useFilters()

  const handleNext = useCallback(async () => {
    if (!onNext) return

    const results: FiltersModalResult[] = slides.map(slide => ({
      id: slide.id,
      alt: slide.alt,
      src: typeof slide.src === 'string' ? slide.src : slide.src.src,
      filter: filtersForImages[slide.id] || 'none',
    }))

    setIsSubmitting(true)
    try {
      await onNext(results)
    } finally {
      setIsSubmitting(false)
    }
  }, [slides, filtersForImages, onNext])

  return {
    slides,
    activeSlideId,
    isThumbsOpen,
    fileInputRef,
    filters,
    filtersForImages,
    isSubmitting,
    handleFilesSelected,
    openFilePicker,
    removeImage,
    selectSlide,
    toggleThumbs,
    applyFilter,
    handleNext,
  }
}
