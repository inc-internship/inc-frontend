'use client'

import Image, { type StaticImageData } from 'next/image'
import type { Swiper as SwiperType } from 'swiper'
import { FreeMode, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { AddImageIcon } from './ImageSliderIcon/AddImageIcon'
import { CloseIcon } from './ImageSliderIcon/CloseIcon'
import s from './ImageSliderThumbs.module.scss'

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
}

export const ImageSliderThumbs = ({
  slides,
  activeSlideId,
  onThumbsSwiper,
  onSelectSlide,
  onAddClick,
  onRemoveClick,
}: Props) => {
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
              className={s.thumbSlide}
              data-active={slide.id === activeSlideId}
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
                  <button
                    type="button"
                    className={s.removeButton}
                    aria-label={`Delete ${slide.alt}`}
                    onClick={event => {
                      event.stopPropagation()
                      onRemoveClick(slide.id)
                    }}
                  >
                    <CloseIcon />
                  </button>
                ) : null}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {onAddClick ? (
          <button type="button" className={s.addButton} onClick={onAddClick} aria-label="Add image">
            <AddImageIcon />
          </button>
        ) : null}
      </div>
    </div>
  )
}
