'use client'

import { BaseModal, ModalBody } from '@/shared/ui/BaseModal'
import { useCroppingModal } from '../../model/useCroppingModal'
import type { AddPostImageSlide, CropSettings } from '../../model/cropTypes'
import { CroppingModalHeader } from './CroppingModalHeader'
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
  const { imageSlides, isSubmitting, sliderKey, handleNext, handleSliderStateChange } =
    useCroppingModal({
      imageSrc,
      imageAlt,
      slides,
      onNext,
    })

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} size="lg" className={s.modal}>
      <CroppingModalHeader isSubmitting={isSubmitting} onNext={handleNext} />

      <ModalBody className={s.body}>
        <CroppingModalSlider
          key={sliderKey}
          initialSlides={imageSlides}
          onStateChange={handleSliderStateChange}
        />
      </ModalBody>
    </BaseModal>
  )
}
