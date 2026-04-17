'use client'

import { AspectRatioButton } from '@/shared/ui/AspectRatioButton'
import { MaximizeButton } from '@/shared/ui/MaximizeButton'
import type { ImageSlide } from '@/shared/ui/ImageSlider'
import { useAddPostImages } from '../../model/useAddPostImages'
import { AddPostImageSlider } from '../AddPostImageSlider/AddPostImageSlider'
import s from './CroppingModal.module.scss'

type Props = {
  initialSlides: ImageSlide[]
}

export const CroppingModalSlider = ({ initialSlides }: Props) => {
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

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFilesSelected}
      />

      <AddPostImageSlider
        className={s.slider}
        imageClassName={s.image}
        slides={slides}
        activeSlideId={activeSlideId}
        isThumbsOpen={isThumbsOpen}
        onToggleThumbs={toggleThumbs}
        onSelectSlide={selectSlide}
        onAddImage={openFilePicker}
        onRemoveImage={removeImage}
        editControls={
          <>
            <AspectRatioButton />
            <MaximizeButton />
          </>
        }
      />
    </>
  )
}
