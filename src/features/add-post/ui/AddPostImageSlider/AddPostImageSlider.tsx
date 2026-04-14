'use client'

import { useState, type ReactNode } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { ImageSlider, ImageSliderThumbs, type ImageSlide } from '@/shared/ui/ImageSlider'
import { ImageIcon } from '@/shared/ui/ImageSlider/ImageSliderIcon/ImageIcon'
import s from './AddPostImageSlider.module.scss'

type Props = {
  slides: ImageSlide[]
  className?: string
  overlayControls?: ReactNode
  editControls?: ReactNode
  defaultThumbsOpen?: boolean
  onActiveSlideChange?: (slide: ImageSlide, index: number) => void
  onAddImage?: () => void
  onRemoveImage?: (slideId: string) => void
}

export const AddPostImageSlider = ({
  slides,
  className,
  overlayControls,
  editControls,
  defaultThumbsOpen = false,
  onActiveSlideChange,
  onAddImage,
  onRemoveImage,
}: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [isThumbsOpen, setIsThumbsOpen] = useState(defaultThumbsOpen)
  const [activeSlideId, setActiveSlideId] = useState<string | undefined>(slides[0]?.id)
  const resolvedActiveSlideId =
    activeSlideId && slides.some(slide => slide.id === activeSlideId)
      ? activeSlideId
      : slides[0]?.id

  const rootClassName = [s.root, className].filter(Boolean).join(' ')

  return (
    <div className={rootClassName}>
      <ImageSlider
        slides={slides}
        thumbsSwiper={thumbsSwiper}
        activeSlideId={resolvedActiveSlideId}
        onActiveSlideChange={(slide, index) => {
          setActiveSlideId(slide.id)
          onActiveSlideChange?.(slide, index)
        }}
        overlayControls={overlayControls}
      />

      {isThumbsOpen && (
        <ImageSliderThumbs
          slides={slides}
          activeSlideId={resolvedActiveSlideId}
          onThumbsSwiper={setThumbsSwiper}
          onSelectSlide={slideId => setActiveSlideId(slideId)}
          onAddClick={onAddImage}
          onRemoveClick={onRemoveImage}
        />
      )}

      {editControls ? <div className={s.editControls}>{editControls}</div> : null}

      <button
        type="button"
        className={s.thumbsToggle}
        onClick={() => setIsThumbsOpen(prev => !prev)}
        aria-label={isThumbsOpen ? 'Hide thumbnails' : 'Show thumbnails'}
        aria-pressed={isThumbsOpen}
      >
        <ImageIcon className={isThumbsOpen ? s.iconActive : s.icon} />
      </button>
    </div>
  )
}
