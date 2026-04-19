'use client'

import type { CSSProperties } from 'react'
import { getCropSettings, getScaleFromZoom } from '../../model/cropSettings'
import type {
  AddPostImageSlide,
  CropSettings,
  PartialCropSettingsBySlideId,
} from '../../model/cropTypes'
import { AddPostImageSlider } from '../AddPostImageSlider/AddPostImageSlider'
import { CropControls } from './CropControls'
import s from './CroppingModal.module.scss'

type Props = {
  activeSlideId?: string
  cropSettingsBySlideId: PartialCropSettingsBySlideId
  isThumbsOpen: boolean
  slides: AddPostImageSlide[]
  onAddImage: () => void
  onRemoveImage: (slideId: string) => void
  onSelectSlide: (slideId: string) => void
  onToggleThumbs: () => void
  onUpdateCropSettings: (patch: Partial<CropSettings>) => void
}

const ASPECT_RATIO_CLASS_NAMES = {
  original: {
    image: s.imageOriginal,
    viewport: s.viewportOriginal,
  },
  '1:1': {
    image: s.imageCropped,
    viewport: s.viewportSquare,
  },
  '4:5': {
    image: s.imageCropped,
    viewport: s.viewportPortrait,
  },
  '16:9': {
    image: s.imageCropped,
    viewport: s.viewportLandscape,
  },
} as const

const getSlideCropSettings = (
  cropSettingsBySlideId: PartialCropSettingsBySlideId,
  slideId: string,
) => getCropSettings(cropSettingsBySlideId, slideId)

const getSlideImageStyle = (cropSettingsBySlideId: PartialCropSettingsBySlideId, slideId: string) =>
  ({
    transform: `scale(${getScaleFromZoom(getSlideCropSettings(cropSettingsBySlideId, slideId).zoom)})`,
  }) satisfies CSSProperties

export const SliderContent = ({
  activeSlideId,
  cropSettingsBySlideId,
  isThumbsOpen,
  slides,
  onAddImage,
  onRemoveImage,
  onSelectSlide,
  onToggleThumbs,
  onUpdateCropSettings,
}: Props) => {
  const activeCropSettings = getCropSettings(cropSettingsBySlideId, activeSlideId)

  return (
    <AddPostImageSlider
      className={s.slider}
      slides={slides}
      activeSlideId={activeSlideId}
      getImageClassName={slide =>
        ASPECT_RATIO_CLASS_NAMES[getSlideCropSettings(cropSettingsBySlideId, slide.id).aspectRatio]
          .image
      }
      getImageViewportClassName={slide =>
        ASPECT_RATIO_CLASS_NAMES[getSlideCropSettings(cropSettingsBySlideId, slide.id).aspectRatio]
          .viewport
      }
      getImageStyle={slide => getSlideImageStyle(cropSettingsBySlideId, slide.id)}
      isThumbsOpen={isThumbsOpen}
      onToggleThumbs={onToggleThumbs}
      onSelectSlide={onSelectSlide}
      onAddImage={onAddImage}
      onRemoveImage={onRemoveImage}
      editControls={
        <CropControls
          activeSlideId={activeSlideId}
          cropSettings={activeCropSettings}
          onAspectRatioChange={aspectRatio => {
            if (aspectRatio in ASPECT_RATIO_CLASS_NAMES) {
              onUpdateCropSettings({ aspectRatio })
            }
          }}
          onZoomChange={zoom => onUpdateCropSettings({ zoom })}
        />
      }
    />
  )
}
