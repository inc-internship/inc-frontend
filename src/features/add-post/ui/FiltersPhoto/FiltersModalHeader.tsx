'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { ModalHeader } from '@/shared/ui/BaseModal'
import { Button } from '@/shared/ui/Button'
import s from './FiltersModal.module.scss'
import { SliderArrow } from '@/shared/ui/ImageSlider/ImageSliderIcon/SliderArrow'
import { Typography } from '@/shared/ui/Typography'

type Props = {
  isSubmitting: boolean
  onNext: () => void
}

export const FiltersModalHeader = ({ isSubmitting, onNext }: Props) => (
  <ModalHeader className={s.header}>
    <Button type="button" className={s.backButton} iconOnly aria-label="Back">
      <SliderArrow />
    </Button>

    <Dialog.Title asChild>
      <Typography variant="h2" align="center" className={s.title}>
        Filters
      </Typography>
    </Dialog.Title>

    <Button
      type="button"
      variant="primary"
      onClick={onNext}
      disabled={isSubmitting}
      className={s.nextButton}
    >
      Next
    </Button>
  </ModalHeader>
)
