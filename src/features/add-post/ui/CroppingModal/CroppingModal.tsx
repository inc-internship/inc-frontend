'use client'

import { useMemo } from 'react'
import { BaseModal, ModalBody, ModalHeader, ModalTitle } from '@/shared/ui/BaseModal'
import { Button } from '@/shared/ui/Button'
import type { ImageSlide } from '@/shared/ui/ImageSlider'
import Image from 'next/image'
import { CroppingModalSlider } from './CroppingModalSlider'
import s from './CroppingModal.module.scss'

type Props = {
  open: boolean
  imageSrc?: string
  imageAlt?: string
  slides?: ImageSlide[]
  onOpenChange?: (open: boolean) => void
}

export const CroppingModal = ({
  open,
  imageSrc,
  imageAlt = 'Selected image for cropping',
  slides,
  onOpenChange,
}: Props) => {
  const imageSlides = useMemo<ImageSlide[]>(() => {
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

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} size="lg" className={s.modal}>
      <ModalHeader className={s.header}>
        <Button type="button" className={s.backButton} iconOnly aria-label="Back">
          <Image src="/icons/ui/arrow-back-outline.svg" alt="" width={24} height={24} />
        </Button>

        <ModalTitle className={s.title}>Cropping</ModalTitle>

        <Button type="button" className={s.nextButton}>
          Next
        </Button>
      </ModalHeader>

      <ModalBody className={s.body}>
        <CroppingModalSlider key={sliderKey} initialSlides={imageSlides} />
      </ModalBody>
    </BaseModal>
  )
}
