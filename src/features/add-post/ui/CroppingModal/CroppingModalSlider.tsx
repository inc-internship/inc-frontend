'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { AspectRatioButton } from '@/shared/ui/AspectRatioButton'
import { MaximizeButton } from '@/shared/ui/MaximizeButton'
import type { AddPostImageSlide, CropSettings } from '../../model/cropTypes'
import { useAddPostImages } from '../../model/useAddPostImages'
import { AddPostImageSlider } from '../AddPostImageSlider/AddPostImageSlider'
import s from './CroppingModal.module.scss'

type Props = {
  initialSlides: AddPostImageSlide[]
  onStateChange?: (state: {
    slides: AddPostImageSlide[]
    cropSettingsBySlideId: Record<string, CropSettings>
  }) => void
}

const ASPECT_RATIO_VIEWPORT_CLASS_NAMES = {
  original: s.viewportOriginal,
  '1:1': s.viewportSquare,
  '4:5': s.viewportPortrait,
  '16:9': s.viewportLandscape,
} as const

const ASPECT_RATIO_IMAGE_CLASS_NAMES = {
  original: s.imageOriginal,
  '1:1': s.imageCropped,
  '4:5': s.imageCropped,
  '16:9': s.imageCropped,
} as const

const MIN_ZOOM = 0
const MAX_ZOOM = 100
const MIN_SCALE = 1
const MAX_SCALE = 2

const getScaleFromZoom = (zoom: number) =>
  MIN_SCALE + (Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM) / MAX_ZOOM) * (MAX_SCALE - MIN_SCALE)

export const CroppingModalSlider = ({ initialSlides, onStateChange }: Props) => {
  const [aspectRatiosBySlideId, setAspectRatiosBySlideId] = useState<
    Partial<Record<string, CropSettings['aspectRatio']>>
  >({})
  const [zoomBySlideId, setZoomBySlideId] = useState<Partial<Record<string, number>>>({})
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

  const activeAspectRatio = useMemo<CropSettings['aspectRatio']>(() => {
    if (!activeSlideId) {
      return 'original'
    }

    return aspectRatiosBySlideId[activeSlideId] ?? 'original'
  }, [activeSlideId, aspectRatiosBySlideId])

  const activeZoom = useMemo(() => {
    if (!activeSlideId) {
      return MIN_ZOOM
    }

    return zoomBySlideId[activeSlideId] ?? MIN_ZOOM
  }, [activeSlideId, zoomBySlideId])

  useEffect(() => {
    onStateChange?.({
      slides,
      cropSettingsBySlideId: Object.fromEntries(
        slides.map(slide => [
          slide.id,
          {
            aspectRatio: aspectRatiosBySlideId[slide.id] ?? 'original',
            zoom: zoomBySlideId[slide.id] ?? MIN_ZOOM,
          },
        ]),
      ),
    })
  }, [aspectRatiosBySlideId, onStateChange, slides, zoomBySlideId])

  const handleRemoveImage = (slideId: string) => {
    setAspectRatiosBySlideId(prev => {
      if (!(slideId in prev)) {
        return prev
      }

      const next = { ...prev }

      delete next[slideId]

      return next
    })
    setZoomBySlideId(prev => {
      if (!(slideId in prev)) {
        return prev
      }

      const next = { ...prev }

      delete next[slideId]

      return next
    })

    removeImage(slideId)
  }

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
        slides={slides}
        activeSlideId={activeSlideId}
        getImageClassName={slide =>
          ASPECT_RATIO_IMAGE_CLASS_NAMES[aspectRatiosBySlideId[slide.id] ?? 'original']
        }
        getImageViewportClassName={slide =>
          ASPECT_RATIO_VIEWPORT_CLASS_NAMES[aspectRatiosBySlideId[slide.id] ?? 'original']
        }
        getImageStyle={slide =>
          ({
            transform: `scale(${getScaleFromZoom(zoomBySlideId[slide.id] ?? MIN_ZOOM)})`,
          }) satisfies CSSProperties
        }
        isThumbsOpen={isThumbsOpen}
        onToggleThumbs={toggleThumbs}
        onSelectSlide={selectSlide}
        onAddImage={openFilePicker}
        onRemoveImage={handleRemoveImage}
        editControls={
          <>
            <AspectRatioButton
              key={activeSlideId ?? 'no-active-slide'}
              defaultValue={activeAspectRatio}
              onChange={value => {
                if (value in ASPECT_RATIO_VIEWPORT_CLASS_NAMES && activeSlideId) {
                  setAspectRatiosBySlideId(prev => ({
                    ...prev,
                    [activeSlideId]: value as CropSettings['aspectRatio'],
                  }))
                }
              }}
            />
            <MaximizeButton
              key={`zoom-${activeSlideId ?? 'no-active-slide'}`}
              defaultValue={activeZoom}
              onChange={value => {
                if (!activeSlideId) {
                  return
                }

                setZoomBySlideId(prev => ({
                  ...prev,
                  [activeSlideId]: value,
                }))
              }}
            />
          </>
        }
      />
    </>
  )
}
