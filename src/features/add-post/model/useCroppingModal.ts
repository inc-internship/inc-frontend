'use client'

import { useCallback, useState } from 'react'
import { createCroppedImageFile } from './cropImage'
import type { AddPostImageSlide, CropSettings, CroppingModalSliderState } from './cropTypes'

type CroppingModalResult = {
  id: string
  alt: string
  file: File
  crop: CropSettings
}

type Params = {
  imageAlt?: string
  imageSrc?: string
  slides?: AddPostImageSlide[]
  onNext?: (images: CroppingModalResult[]) => void | Promise<void>
}

type SliderState = CroppingModalSliderState & {
  initialized: boolean
}

const resolveSlideSrc = (slide: AddPostImageSlide) => {
  const slideSrc = typeof slide.src === 'string' ? slide.src : (slide.displaySrc ?? slide.src.src)

  return typeof slideSrc === 'string' ? slideSrc : slideSrc.src
}

const buildCroppingModalResults = async (
  slides: AddPostImageSlide[],
  cropSettingsBySlideId: Record<string, CropSettings>,
) =>
  Promise.all(
    slides.map(async slide => {
      const crop = cropSettingsBySlideId[slide.id] ?? {
        aspectRatio: 'original',
        zoom: 0,
      }
      const file = await createCroppedImageFile({
        src: resolveSlideSrc(slide),
        aspectRatio: crop.aspectRatio,
        zoom: crop.zoom,
        file: slide.file,
        fileName: slide.alt,
      })

      return {
        id: slide.id,
        alt: slide.alt,
        file,
        crop,
      }
    }),
  )

export const useCroppingModal = ({
  imageAlt = 'Selected image for cropping',
  imageSrc,
  slides,
  onNext,
}: Params) => {
  const [sliderState, setSliderState] = useState<SliderState>({
    initialized: false,
    slides: [],
    cropSettingsBySlideId: {},
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  let imageSlides: AddPostImageSlide[] = []

  if (slides?.length) {
    imageSlides = slides
  } else if (imageSrc) {
    imageSlides = [
      {
        id: 'cropping-image',
        src: imageSrc,
        alt: imageAlt,
        sizes: '(max-width: 768px) calc(100vw - 32px), 564px',
      },
    ]
  }

  const sliderKey = imageSlides.map(slide => `${slide.id}:${String(slide.src)}`).join('|')

  const handleSliderStateChange = useCallback((state: CroppingModalSliderState) => {
    setSliderState({
      initialized: true,
      ...state,
    })
  }, [])

  const handleNext = async () => {
    const currentSlides = sliderState.initialized ? sliderState.slides : imageSlides

    if (!currentSlides.length) {
      return
    }

    setIsSubmitting(true)

    try {
      const croppedImages = await buildCroppingModalResults(
        currentSlides,
        sliderState.cropSettingsBySlideId,
      )

      await onNext?.(croppedImages)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    imageSlides,
    isSubmitting,
    sliderKey,
    handleNext,
    handleSliderStateChange,
  }
}
