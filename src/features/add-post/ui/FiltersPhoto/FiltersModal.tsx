'use client'

import { BaseModal, ModalBody } from '@/shared/ui/BaseModal'
import { FiltersModalResult, useFiltersModal } from '../../model/filters/useFiltersModal'
import { FiltersModalHeader } from './FiltersModalHeader'
import { FiltersWithSlider } from './FiltersWithSlider'
import s from './FiltersModal.module.scss'
import { AddPostImageSlide } from '@/features/add-post/model/filters/filtersTypes'

type Props = {
  open: boolean
  initialSlides?: AddPostImageSlide[]
  maxImages?: number
  onOpenChange?: (open: boolean) => void
  onNext?: (results: FiltersModalResult[]) => void | Promise<void>
}

export const FiltersModal = ({
  open,
  initialSlides = [],
  maxImages = 10,
  onOpenChange,
  onNext,
}: Props) => {
  const {
    slides,
    activeSlideId,
    isThumbsOpen,
    fileInputRef,
    filters,
    filtersForImages,
    isSubmitting,
    handleFilesSelected,
    openFilePicker,
    removeImage,
    selectSlide,
    toggleThumbs,
    applyFilter,
    handleNext,
  } = useFiltersModal({ initialSlides, maxImages, onNext })

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} size="lg" className={s.modal}>
      <FiltersModalHeader isSubmitting={isSubmitting} onNext={handleNext} />

      <ModalBody className={s.body}>
        <FiltersWithSlider
          slides={slides}
          activeSlideId={activeSlideId}
          isThumbsOpen={isThumbsOpen}
          fileInputRef={fileInputRef}
          filters={filters}
          filtersForImages={filtersForImages}
          onFilesSelected={handleFilesSelected}
          onAddImage={openFilePicker}
          onRemoveImage={removeImage}
          onSelectSlide={selectSlide}
          onToggleThumbs={toggleThumbs}
          onApplyFilter={filter => applyFilter(activeSlideId, filter)}
        />
      </ModalBody>
    </BaseModal>
  )
}
