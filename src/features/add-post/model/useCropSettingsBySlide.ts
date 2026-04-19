'use client'

import { useEffect, useState } from 'react'
import { getCropSettings } from './cropSettings'
import type {
  AddPostImageSlide,
  CropSettings,
  CroppingModalSliderState,
  PartialCropSettingsBySlideId,
} from './cropTypes'

type Params = {
  slides: AddPostImageSlide[]
  activeSlideId: string | undefined
  onStateChange?: (state: CroppingModalSliderState) => void
  removeImage: (slideId: string) => void
}

const buildCropSettingsBySlideId = (
  slides: AddPostImageSlide[],
  cropSettingsBySlideId: PartialCropSettingsBySlideId,
) =>
  Object.fromEntries(
    slides.map(slide => [slide.id, getCropSettings(cropSettingsBySlideId, slide.id)]),
  )

export const useCropSettingsBySlide = ({
  slides,
  activeSlideId,
  onStateChange,
  removeImage,
}: Params) => {
  const [cropSettingsBySlideId, setCropSettingsBySlideId] = useState<PartialCropSettingsBySlideId>(
    {},
  )

  useEffect(() => {
    onStateChange?.({
      slides,
      cropSettingsBySlideId: buildCropSettingsBySlideId(slides, cropSettingsBySlideId),
    })
  }, [cropSettingsBySlideId, onStateChange, slides])

  const updateActiveSlideCropSettings = (patch: Partial<CropSettings>) => {
    if (!activeSlideId) {
      return
    }

    setCropSettingsBySlideId(prev => ({
      ...prev,
      [activeSlideId]: {
        ...getCropSettings(prev, activeSlideId),
        ...patch,
      },
    }))
  }

  const removeImageWithCropSettings = (slideId: string) => {
    setCropSettingsBySlideId(prev => {
      if (!(slideId in prev)) {
        return prev
      }

      const next = { ...prev }

      delete next[slideId]

      return next
    })

    removeImage(slideId)
  }

  return {
    cropSettingsBySlideId,
    updateActiveSlideCropSettings,
    removeImageWithCropSettings,
  }
}
