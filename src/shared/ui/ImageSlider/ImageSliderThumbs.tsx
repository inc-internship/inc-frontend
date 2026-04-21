'use client'

import Image, { type StaticImageData } from 'next/image'
import type { Swiper as SwiperType } from 'swiper'
import { FreeMode, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import clsx from 'clsx'
import { Button } from '@/shared/ui/Button'
import { AddImageIcon } from './ImageSliderIcon/AddImageIcon'
import { CloseIcon } from './ImageSliderIcon/CloseIcon'
import s from './ImageSliderThumbs.module.scss'
import { useI18n } from '@/shared/i18n'

export type ImageSlideResolution = {
  label: string
  src: string
}

export type ImageSlide = {
  id: string
  alt: string
  src: StaticImageData | string
  displaySrc?: StaticImageData | string
  zoomSrc?: string
  sizes?: string
  resolutions?: ImageSlideResolution[]
}

type Props = {
  slides: ImageSlide[]
  activeSlideId?: string
  onThumbsSwiper: (swiper: SwiperType) => void
  onSelectSlide?: (slideId: string) => void
  onAddClick?: () => void
  onRemoveClick?: (slideId: string) => void
  disabled?: boolean
}

export const ImageSliderThumbs = ({
  slides,
  activeSlideId,
  onThumbsSwiper,
  onSelectSlide,
  onAddClick,
  onRemoveClick,
}: Props) => {
  const { t } = useI18n()

  return (
    <div className={s.thumbsWrap}>
      <div className={s.thumbsRow}>
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={onThumbsSwiper}
          spaceBetween={8}
          slidesPerView={2}
          freeMode
          watchSlidesProgress
          className={s.thumbs}
        >
          {slides.map(slide => (
            <SwiperSlide
              key={slide.id}
              className={clsx(s.thumbSlide, slide.id === activeSlideId && s.thumbSlideActive)}
              onClick={() => onSelectSlide?.(slide.id)}
            >
              <div className={s.thumbImageWrap}>
                <Image
                  src={slide.displaySrc ?? slide.src}
                  alt={slide.alt}
                  fill
                  sizes="120px"
                  className={s.thumbImage}
                />

                {onRemoveClick ? (
                  <Button
                    type="button"
                    className={s.removeButton}
                    iconOnly
                    aria-label={`Delete ${slide.alt}`}
                    onClick={event => {
                      event.stopPropagation()
                      onRemoveClick(slide.id)
                    }}
                  >
                    <CloseIcon />
                  </Button>
                ) : null}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {onAddClick ? (
          <Button
            type="button"
            className={s.addButton}
            iconOnly
            onClick={onAddClick}
            aria-label="Add image"
          >
            <AddImageIcon />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
