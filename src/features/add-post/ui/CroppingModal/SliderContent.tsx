'use client'

import type { CSSProperties } from 'react'
import { getCropSettings, getScaleFromZoom } from '../../model/cropSettings'
import type {
  AddPostImageSlide,
  CropSettings,
  PartialCropSettingsBySlideId,
} from '../../model/cropTypes'
import { useIsMobile } from '@/shared/hooks'
import { AddPostImageSlider } from '../AddPostImageSlider/AddPostImageSlider'
import { CropControls } from './CropControls'
import s from './CroppingModal.module.scss'
import { getCropViewClassNames, isCropAspectRatio } from './cropViewClassNames'

type Props = {
  activeSlideId?: string
  cropSettingsBySlideId: PartialCropSettingsBySlideId
  isThumbsOpen: boolean
  slides: AddPostImageSlide[]
  onAddImage?: () => void
  onRemoveImage: (slideId: string) => void
  onSelectSlide: (slideId: string) => void
  onToggleThumbs: () => void
  onUpdateCropSettings: (patch: Partial<CropSettings>) => void
}

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
  const isMobile = useIsMobile()
  const activeCropSettings = getCropSettings(cropSettingsBySlideId, activeSlideId)

  return (
    <AddPostImageSlider
      className={s.slider}
      slides={slides}
      activeSlideId={activeSlideId}
      getImageClassName={slide =>
        getCropViewClassNames(
          getSlideCropSettings(cropSettingsBySlideId, slide.id).aspectRatio,
          isMobile,
        ).image
      }
      getImageViewportClassName={slide =>
        getCropViewClassNames(
          getSlideCropSettings(cropSettingsBySlideId, slide.id).aspectRatio,
          isMobile,
        ).viewport
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
            if (isCropAspectRatio(aspectRatio)) {
              onUpdateCropSettings({ aspectRatio })
            }
          }}
          onZoomChange={zoom => onUpdateCropSettings({ zoom })}
        />
      }
    />
  )
}
