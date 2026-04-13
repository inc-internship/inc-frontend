'use client'

import Image from 'next/image'
import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import s from './ImageSlider.module.scss'
import { SliderArrow } from './ImageSliderIcon/SliderArrow'
import { ImageIcon } from '@/shared/ui/ImageSlider/ImageSliderIcon/ImageIcon'
import { ImageSliderThumbs, type ImageSlide } from './ImageSliderThumbs'

export type ImageSliderMode = 'view' | 'edit'

type ImageSliderProps = {
  slides: ImageSlide[]
  mode?: ImageSliderMode

  className?: string

  editControls?: ReactNode
  overlayControls?: ReactNode

  defaultActiveSlideId?: string
  activeSlideId?: string
  onActiveSlideChange?: (slide: ImageSlide, index: number) => void

  defaultThumbsOpen?: boolean

  onAddImage?: () => void
  onRemoveImage?: (slideId: string) => void
}

export const ImageSlider = ({
  slides,
  mode = 'view',
  className,
  editControls,
  overlayControls,
  defaultActiveSlideId,
  activeSlideId,
  onActiveSlideChange,
  defaultThumbsOpen = false,
  onAddImage,
  onRemoveImage,
}: ImageSliderProps) => {
  const sliderId = useId()
  const prevClassName = useMemo(() => `slider-prev-${sliderId.replace(/:/g, '')}`, [sliderId])
  const nextClassName = useMemo(() => `slider-next-${sliderId.replace(/:/g, '')}`, [sliderId])

  const isEditMode = mode === 'edit'
  const hasSlides = slides.length > 0
  const isControlled = activeSlideId !== undefined

  const getInitialIndex = () => {
    if (!slides.length) return 0

    const targetId = activeSlideId ?? defaultActiveSlideId
    if (!targetId) return 0

    const foundIndex = slides.findIndex(slide => slide.id === targetId)
    return foundIndex >= 0 ? foundIndex : 0
  }

  const [internalActiveIndex, setInternalActiveIndex] = useState(getInitialIndex)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const [isThumbsOpen, setIsThumbsOpen] = useState(defaultThumbsOpen)

  const rawActiveIndex = isControlled
    ? Math.max(
        0,
        slides.findIndex(slide => slide.id === activeSlideId),
      )
    : internalActiveIndex

  const safeActiveIndex = hasSlides ? Math.min(rawActiveIndex, slides.length - 1) : 0

  useEffect(() => {
    if (!mainSwiper || !hasSlides) return

    if (mainSwiper.activeIndex !== safeActiveIndex) {
      mainSwiper.slideTo(safeActiveIndex)
    }
  }, [hasSlides, mainSwiper, safeActiveIndex])

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

    if (!isControlled) {
      setInternalActiveIndex(nextIndex)
    }

    onActiveSlideChange?.(nextSlide, nextIndex)
  }

  const handleThumbsToggle = () => {
    setIsThumbsOpen(prev => !prev)
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
              <div className={s.imageWrap}>
                <Image
                  src={slide.displaySrc ?? slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes={slide.sizes ?? '(max-width: 768px) 100vw, 900px'}
                  className={s.image}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className={s.swiper}>
          <div className={s.imageWrap} />
        </div>
      )}

      {isEditMode && isThumbsOpen && (
        <ImageSliderThumbs
          slides={slides}
          activeSlideId={slides[safeActiveIndex]?.id}
          onThumbsSwiper={setThumbsSwiper}
          onAddClick={onAddImage}
          onRemoveClick={onRemoveImage}
        />
      )}

      {isEditMode && editControls ? <div className={s.editControls}>{editControls}</div> : null}

      {overlayControls}

      {isEditMode && (
        <button
          type="button"
          className={s.thumbsToggle}
          onClick={handleThumbsToggle}
          aria-label={isThumbsOpen ? 'Hide thumbnails' : 'Show thumbnails'}
          aria-pressed={isThumbsOpen}
        >
          <ImageIcon />
        </button>
      )}

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
