'use client'

import type { ImageSlide } from '@/shared/ui/ImageSlider'
import { AddPostImageSlider } from '../AddPostImageSlider/AddPostImageSlider'
import { useAddPostImages } from '../../model/useAddPostImages'
import s from './AddPostImageSliderWrapper.module.scss'

type Props = {
  initialSlides?: ImageSlide[]
  className?: string
  defaultThumbsOpen?: boolean
  maxImages?: number
}

export const AddPostImageSliderWrapper = ({
  initialSlides = [],
  className,
  defaultThumbsOpen = false,
  maxImages = 10,
}: Props) => {
  const rootClassName = [s.root, className].filter(Boolean).join(' ')
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
    defaultThumbsOpen,
    maxImages,
  })

  return (
    <div className={rootClassName}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFilesSelected}
      />
      <AddPostImageSlider
        slides={slides}
        activeSlideId={activeSlideId}
        isThumbsOpen={isThumbsOpen}
        onToggleThumbs={toggleThumbs}
        onSelectSlide={selectSlide}
        onAddImage={openFilePicker}
        onRemoveImage={removeImage}
      />
    </div>
  )
}
