'use client'

import { useEffect, useState, type ReactNode } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { ImageSlider, ImageSliderThumbs, type ImageSlide } from '@/shared/ui/ImageSlider'
import { ImageIcon } from '@/shared/ui/ImageSlider/ImageSliderIcon/ImageIcon'
import s from './AddPostImageSlider.module.scss'
import { useI18n } from '@/shared/i18n'

type Props = {
  slides: ImageSlide[]
  activeSlideId?: string
  isThumbsOpen: boolean
  className?: string
  overlayControls?: ReactNode
  editControls?: ReactNode
  onToggleThumbs: () => void
  onSelectSlide: (slideId: string) => void
  onActiveSlideChange?: (slide: ImageSlide, index: number) => void
  onAddImage?: () => void
  onRemoveImage?: (slideId: string) => void
  showThumbsToggle?: boolean
}

export const AddPostImageSlider = ({
  slides,
  activeSlideId,
  isThumbsOpen,
  className,
  overlayControls,
  editControls,
  onToggleThumbs,
  onSelectSlide,
  onActiveSlideChange,
  onAddImage,
  onRemoveImage,
  showThumbsToggle = true,
}: Props) => {
  const { t } = useI18n()
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const activeSlideIndex =
    activeSlideId === undefined ? -1 : slides.findIndex(slide => slide.id === activeSlideId)

  useEffect(() => {
    if (!thumbsSwiper || thumbsSwiper.destroyed || activeSlideIndex < 0) {
      return
    }

    if (thumbsSwiper.activeIndex !== activeSlideIndex) {
      thumbsSwiper.slideTo(activeSlideIndex)
    }
  }, [activeSlideIndex, thumbsSwiper])

  const rootClassName = [s.root, className].filter(Boolean).join(' ')

  return (
    <div className={rootClassName}>
      <ImageSlider
        slides={slides}
        thumbsSwiper={thumbsSwiper}
        activeSlideId={activeSlideId}
        onActiveSlideChange={(slide, index) => {
          onSelectSlide(slide.id)
          onActiveSlideChange?.(slide, index)
        }}
        overlayControls={overlayControls}
      />

      {isThumbsOpen && (
        <ImageSliderThumbs
          slides={slides}
          activeSlideId={activeSlideId}
          onThumbsSwiper={setThumbsSwiper}
          onSelectSlide={onSelectSlide}
          onAddClick={onAddImage}
          onRemoveClick={onRemoveImage}
        />
      )}

      {editControls ? <div className={s.editControls}>{editControls}</div> : null}

      {showThumbsToggle && (
        <button
          type="button"
          className={s.thumbsToggle}
          onClick={onToggleThumbs}
          aria-label={isThumbsOpen ? t('common.hideThumbnails') : t('common.showThumbnails')}
          aria-pressed={isThumbsOpen}
        >
          <ImageIcon className={isThumbsOpen ? s.iconActive : s.icon} />
        </button>
      )}
    </div>
  )
}
