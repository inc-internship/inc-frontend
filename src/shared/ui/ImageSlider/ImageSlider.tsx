'use client'

import Image from 'next/image'
import { useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import s from './ImageSlider.module.scss'
import { SliderArrow } from './ImageSliderIcon/SliderArrow'
import { type ImageSlide } from './ImageSliderThumbs'

type ImageSliderProps = {
  slides: ImageSlide[]
  className?: string
  imageClassName?: string
  imageViewportClassName?: string
  imageStyle?: CSSProperties
  getImageClassName?: (slide: ImageSlide, index: number) => string | undefined
  getImageViewportClassName?: (slide: ImageSlide, index: number) => string | undefined
  getImageStyle?: (slide: ImageSlide, index: number) => CSSProperties | undefined
  overlayControls?: ReactNode

  defaultActiveSlideId?: string
  activeSlideId?: string
  onActiveSlideChange?: (slide: ImageSlide, index: number) => void
  thumbsSwiper?: SwiperType | null
  filter?: string
}

export const ImageSlider = ({
  slides,
  className,
  imageClassName,
  imageViewportClassName,
  imageStyle,
  getImageClassName,
  getImageViewportClassName,
  getImageStyle,
  overlayControls,
  defaultActiveSlideId,
  activeSlideId,
  onActiveSlideChange,
  thumbsSwiper = null,
  filter,
}: ImageSliderProps) => {
  const sliderId = useId()
  const prevClassName = useMemo(() => `slider-prev-${sliderId.replace(/:/g, '')}`, [sliderId])
  const nextClassName = useMemo(() => `slider-next-${sliderId.replace(/:/g, '')}`, [sliderId])

  const hasSlides = slides.length > 0

  const getInitialIndex = () => {
    if (!slides.length) return 0

    const targetId = activeSlideId ?? defaultActiveSlideId
    if (!targetId) return 0

    const foundIndex = slides.findIndex(slide => slide.id === targetId)
    return foundIndex >= 0 ? foundIndex : 0
  }

  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const controlledActiveIndex =
    activeSlideId === undefined ? -1 : slides.findIndex(slide => slide.id === activeSlideId)
  const safeControlledActiveIndex = hasSlides ? Math.max(0, controlledActiveIndex) : 0

  useEffect(() => {
    if (!mainSwiper || !hasSlides || activeSlideId === undefined) return

    if (mainSwiper.activeIndex !== safeControlledActiveIndex) {
      mainSwiper.slideTo(safeControlledActiveIndex)
    }
  }, [activeSlideId, hasSlides, mainSwiper, safeControlledActiveIndex])

  const updateEdges = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  const handleMainSwiper = (swiper: SwiperType) => {
    setMainSwiper(swiper)
    updateEdges(swiper)
  }

  const handleSlideChange = (swiper: SwiperType) => {
    updateEdges(swiper)

    const nextIndex = swiper.activeIndex
    const nextSlide = slides[nextIndex]

    if (!nextSlide) return

    onActiveSlideChange?.(nextSlide, nextIndex)
  }

  const rootClassName = [s.slider, className].filter(Boolean).join(' ')

  return (
    <div className={rootClassName}>
      {hasSlides ? (
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation={{
            prevEl: `.${prevClassName}`,
            nextEl: `.${nextClassName}`,
          }}
          pagination={{ clickable: true }}
          thumbs={{
            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          initialSlide={getInitialIndex()}
          loop={false}
          onSwiper={handleMainSwiper}
          onSlideChange={handleSlideChange}
          className={s.swiper}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className={s.slideContent}>
                <div
                  className={[
                    s.imageWrap,
                    getImageViewportClassName?.(slide, index) ?? imageViewportClassName,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <Image
                    src={slide.displaySrc ?? slide.src}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    sizes={slide.sizes ?? '(max-width: 768px) 100vw, 900px'}
                    style={getImageStyle?.(slide, index) ?? imageStyle}
                    className={[s.image, getImageClassName?.(slide, index) ?? imageClassName]
                      .filter(Boolean)
                      .join(' ')}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className={s.swiper}>
          <div className={s.slideContent}>
            <div className={[s.imageWrap, imageViewportClassName].filter(Boolean).join(' ')} />
          </div>
        </div>
      )}

      {overlayControls}

      <button
        type="button"
        className={`${s.nav} ${s.prev} ${prevClassName}`}
        disabled={!hasSlides || isBeginning}
        aria-label="Previous slide"
      >
        <SliderArrow />
      </button>

      <button
        type="button"
        className={`${s.nav} ${s.next} ${nextClassName}`}
        disabled={!hasSlides || isEnd}
        aria-label="Next slide"
      >
        <SliderArrow />
      </button>
    </div>
  )
}
