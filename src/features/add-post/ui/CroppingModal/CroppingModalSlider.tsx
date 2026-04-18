'use client'

import type { AddPostImageSlide, CroppingModalSliderState } from '../../model/cropTypes'
import { useCropSettingsBySlide } from '../../model/useCropSettingsBySlide'
import { useAddPostImages } from '../../model/useAddPostImages'
import { HiddenImageInput } from './HiddenImageInput'
import { SliderContent } from './SliderContent'

type Props = {
  initialSlides: AddPostImageSlide[]
  onStateChange?: (state: CroppingModalSliderState) => void
}

export const CroppingModalSlider = ({ initialSlides, onStateChange }: Props) => {
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
  } = useAddPostImages({
    initialSlides,
    maxImages: 10,
  })
  const { cropSettingsBySlideId, updateActiveSlideCropSettings, removeImageWithCropSettings } =
    useCropSettingsBySlide({
      slides,
      activeSlideId,
      onStateChange,
      removeImage,
    })

  return (
    <>
      <HiddenImageInput fileInputRef={fileInputRef} onFilesSelected={handleFilesSelected} />

      <SliderContent
        slides={slides}
        activeSlideId={activeSlideId}
        cropSettingsBySlideId={cropSettingsBySlideId}
        isThumbsOpen={isThumbsOpen}
        onAddImage={openFilePicker}
        onRemoveImage={removeImageWithCropSettings}
        onSelectSlide={selectSlide}
        onToggleThumbs={toggleThumbs}
        onUpdateCropSettings={updateActiveSlideCropSettings}
      />
    </>
  )
}
