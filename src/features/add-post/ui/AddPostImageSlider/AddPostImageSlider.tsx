'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Button } from '@/shared/ui/Button'
import { ImageSlider, ImageSliderThumbs, type ImageSlide } from '@/shared/ui/ImageSlider'
import { ImageIcon } from '@/shared/ui/ImageSlider/ImageSliderIcon/ImageIcon'
import s from './AddPostImageSlider.module.scss'
import { useI18n } from '@/shared/i18n'

type Props = {
  slides: ImageSlide[]
  activeSlideId?: string
  isThumbsOpen?: boolean
  className?: string
  imageClassName?: string
  imageViewportClassName?: string
  imageStyle?: CSSProperties
  getImageClassName?: (slide: ImageSlide, index: number) => string | undefined
  getImageViewportClassName?: (slide: ImageSlide, index: number) => string | undefined
  getImageStyle?: (slide: ImageSlide, index: number) => CSSProperties | undefined
  overlayControls?: ReactNode
  editControls?: ReactNode
  onToggleThumbs?: () => void
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
  imageClassName,
  imageViewportClassName,
  imageStyle,
  getImageClassName,
  getImageViewportClassName,
  getImageStyle,
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
        imageClassName={imageClassName}
        imageViewportClassName={imageViewportClassName}
        imageStyle={imageStyle}
        getImageClassName={getImageClassName}
        getImageViewportClassName={getImageViewportClassName}
        getImageStyle={getImageStyle}
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
        <Button
          type="button"
          className={s.thumbsToggle}
          iconOnly
          hasIconBackground
          onClick={onToggleThumbs}
          aria-label={isThumbsOpen ? t('common.hideThumbnails') : t('common.showThumbnails')}
          aria-pressed={isThumbsOpen}
        >
          <ImageIcon className={isThumbsOpen ? s.iconActive : s.icon} />
        </Button>
      )}
    </div>
  )
}
