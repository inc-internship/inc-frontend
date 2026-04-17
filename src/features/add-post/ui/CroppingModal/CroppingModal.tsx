'use client'

import { useMemo, useState } from 'react'
import { BaseModal, ModalBody, ModalHeader, ModalTitle } from '@/shared/ui/BaseModal'
import { Button } from '@/shared/ui/Button'
import { createCroppedImageFile } from '../../model/cropImage'
import type { AddPostImageSlide, CropSettings } from '../../model/cropTypes'
import Image from 'next/image'
import { CroppingModalSlider } from './CroppingModalSlider'
import s from './CroppingModal.module.scss'

export type CroppingModalResult = {
  id: string
  alt: string
  file: File
  crop: CropSettings
}

type Props = {
  open: boolean
  imageSrc?: string
  imageAlt?: string
  slides?: AddPostImageSlide[]
  onOpenChange?: (open: boolean) => void
  onNext?: (images: CroppingModalResult[]) => void | Promise<void>
}

export const CroppingModal = ({
  open,
  imageSrc,
  imageAlt = 'Selected image for cropping',
  slides,
  onOpenChange,
  onNext,
}: Props) => {
  const [sliderState, setSliderState] = useState<{
    slides: AddPostImageSlide[]
    cropSettingsBySlideId: Record<string, CropSettings>
  }>({
    slides: [],
    cropSettingsBySlideId: {},
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const imageSlides = useMemo<AddPostImageSlide[]>(() => {
    if (slides?.length) {
      return slides
    }

    if (!imageSrc) {
      return []
    }

    return [
      {
        id: 'cropping-image',
        src: imageSrc,
        alt: imageAlt,
        sizes: '(max-width: 768px) calc(100vw - 32px), 564px',
      },
    ]
  }, [imageAlt, imageSrc, slides])
  const sliderKey = useMemo(
    () => imageSlides.map(slide => `${slide.id}:${String(slide.src)}`).join('|'),
    [imageSlides],
  )

  const handleNext = async () => {
    const currentSlides = sliderState.slides.length ? sliderState.slides : imageSlides

    if (!currentSlides.length) {
      return
    }

    setIsSubmitting(true)

    try {
      const croppedImages = await Promise.all(
        currentSlides.map(async slide => {
          const crop = sliderState.cropSettingsBySlideId[slide.id] ?? {
            aspectRatio: 'original',
            zoom: 0,
          }
          const slideSrc =
            typeof slide.src === 'string' ? slide.src : (slide.displaySrc ?? slide.src.src)
          const resolvedSrc = typeof slideSrc === 'string' ? slideSrc : slideSrc.src
          const file = await createCroppedImageFile({
            src: resolvedSrc,
            aspectRatio: crop.aspectRatio,
            zoom: crop.zoom,
            file: slide.file,
            fileName: slide.alt,
          })

          return {
            id: slide.id,
            alt: slide.alt,
            file,
            crop,
          }
        }),
      )

      await onNext?.(croppedImages)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} size="lg" className={s.modal}>
      <ModalHeader className={s.header}>
        <Button type="button" className={s.backButton} iconOnly aria-label="Back">
          <Image src="/icons/ui/arrow-back-outline.svg" alt="" width={24} height={24} />
        </Button>

        <ModalTitle className={s.title}>Cropping</ModalTitle>

        <Button type="button" className={s.nextButton} onClick={handleNext} disabled={isSubmitting}>
          Next
        </Button>
      </ModalHeader>

      <ModalBody className={s.body}>
        <CroppingModalSlider
          key={sliderKey}
          initialSlides={imageSlides}
          onStateChange={setSliderState}
        />
      </ModalBody>
    </BaseModal>
  )
}
