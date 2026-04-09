'use client'

import Image from 'next/image'
import img1 from './Images/1.png'
import img2 from './Images/22.png'
import img3 from './Images/33.png'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import s from './ImageSlider.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'
import { SliderArrow } from './ImageSliderIcon/SliderArrow'
import type { Swiper as SwiperType } from 'swiper'
import { useState } from 'react'
import { ImageSliderThumbs, type ImageSlide } from './ImageSliderThumbs'

const initialSlides: ImageSlide[] = [
  { id: '1', src: img1, alt: 'Beach 1' },
  { id: '2', src: img2, alt: 'Beach 2' },
  { id: '3', src: img3, alt: 'Beach 3' },
  { id: '4', src: img1, alt: 'Beach 4' },
  { id: '5', src: img2, alt: 'Beach 5' },
  { id: '6', src: img3, alt: 'Beach 6' },
]

export const ImageSlider = () => {
  const [slides] = useState<ImageSlide[]>(initialSlides)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)

  const updateEdges = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  return (
    <div className={s.slider}>
      {slides.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation={{ prevEl: '.slider-prev', nextEl: '.slider-next' }}
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          loop={false}
          onSwiper={updateEdges}
          onSlideChange={updateEdges}
          className={s.swiper}
        >
          {slides.map(slide => (
            <SwiperSlide key={slide.id}>
              <div className={s.imageWrap}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={slide.id === '1'}
                  sizes="(max-width: 768px) 100vw, 900px"
                  className={s.image}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <ImageSliderThumbs
        slides={slides}
        onThumbsSwiper={setThumbsSwiper}
        onAddClick={() => undefined}
      />
      <button
        type="button"
        className={`${s.nav} ${s.prev} slider-prev`}
        disabled={slides.length === 0 || isBeginning}
        aria-label="Previous slide"
      >
        <SliderArrow />
      </button>

      <button
        type="button"
        className={`${s.nav} ${s.next} slider-next`}
        disabled={slides.length === 0 || isEnd}
        aria-label="Next slide"
      >
        <SliderArrow />
      </button>
    </div>
  )
}
