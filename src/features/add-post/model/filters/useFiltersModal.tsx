import { useState, useCallback } from 'react'
import { useAddPostImages } from '../useAddPostImages'
import { useFilters } from './useFilter'
import type { AddPostImageSlide } from './filtersTypes'
import { applyFilterToImage } from '@/features/add-post/model/filters/imageUtils'

export type FiltersModalResult = {
  id: string
  alt: string
  filter: string
  file: File
}

type UseFiltersModalProps = {
  initialSlides?: AddPostImageSlide[]
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

    setIsSubmitting(true)
    try {
      const processedResults = await Promise.all(
        slides.map(async (slide): Promise<FiltersModalResult> => {
          const filter = filtersForImages[slide.id] || 'none'

          // Получаем URL изображения (blob URL лежит в slide.src)
          const imageUrl = typeof slide.src === 'string' ? slide.src : slide.src.src

          let processedFile: File

          if (filter !== 'none') {
            processedFile = await applyFilterToImage(imageUrl, filter)
          } else {
            // если фильтр не выбран, используем оригинальный файл
            processedFile = slide.file!
          }

          return {
            id: slide.id,
            alt: slide.alt,
            filter,
            file: processedFile,
          }
        }),
      )

      await onNext(processedResults)
    } catch (error) {
      console.error('Failed to process images with filters:', error)
      // Здесь можно добавить вызов тоста с ошибкой
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
