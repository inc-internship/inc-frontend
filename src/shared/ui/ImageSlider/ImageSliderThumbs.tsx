'use client'

import Image, { type StaticImageData } from 'next/image'
import type { Swiper as SwiperType } from 'swiper'
import { FreeMode, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { AddImageIcon } from './ImageSliderIcon/AddImageIcon'
import s from './ImageSliderThumbs.module.scss'

export type ImageSlide = {
  id: string
  src: StaticImageData | string
  alt: string
}

type Props = {
  slides: ImageSlide[]
  onThumbsSwiper: (swiper: SwiperType) => void
  onAddClick: () => void
}

export const ImageSliderThumbs = ({ slides, onThumbsSwiper, onAddClick }: Props) => {
  return (
    <div className={s.thumbsWrap}>
      <div className={s.thumbsRow}>
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={onThumbsSwiper}
          spaceBetween={8}
          slidesPerView={3}
          freeMode
          watchSlidesProgress
          className={s.thumbs}
        >
          {slides.map(slide => (
            <SwiperSlide key={`thumb-${slide.id}`} className={s.thumbSlide}>
              <div className={s.thumbImageWrap}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="120px"
                  className={s.thumbImage}
                />
                <button
                  type="button"
                  className={s.removeButton}
                  aria-label={`Delete ${slide.alt}`}
                  onClick={event => {
                    event.stopPropagation()
                    console.log('удалил', slide.id)
                  }}
                >
                  ×
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button type="button" className={s.addButton} onClick={onAddClick} aria-label="Add image">
          <AddImageIcon />
        </button>
      </div>
    </div>
  )
}
