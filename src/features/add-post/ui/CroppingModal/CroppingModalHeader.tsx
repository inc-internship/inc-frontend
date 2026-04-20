'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { ModalHeader } from '@/shared/ui/BaseModal'
import { Button } from '@/shared/ui/Button'
import { Typography } from '@/shared/ui/Typography'
import { SliderArrow } from '@/shared/ui/ImageSlider/ImageSliderIcon/SliderArrow'
import s from './CroppingModal.module.scss'

type Props = {
  isSubmitting: boolean
  onNext: () => void
}

export const CroppingModalHeader = ({ isSubmitting, onNext }: Props) => (
  <ModalHeader className={s.header}>
    <Button type="button" className={s.backButton} iconOnly aria-label="Back">
      <SliderArrow />
    </Button>

    <Dialog.Title asChild>
      <Typography variant="h2" align="center" className={s.title}>
        Cropping
      </Typography>
    </Dialog.Title>

    <Button type="button" className={s.nextButton} onClick={onNext} disabled={isSubmitting}>
      Next
    </Button>
  </ModalHeader>
)
