'use client'

import { useEffect, useMemo, useState } from 'react'
import { useGetMeQuery } from '@/entities/auth/api/auth.api'
import { BaseModal, ModalBody, ModalHeader, ModalTitle } from '@/shared/ui/BaseModal'
import { Button } from '@/shared/ui/Button'
import type { ImageSlide } from '@/shared/ui/ImageSlider'
import { Typography } from '@/shared/ui/Typography'
import { useAddPostImages } from '../../model/useAddPostImages'
import { AddPostImageSlider } from '../AddPostImageSlider/AddPostImageSlider'
import s from './CreatePostModal.module.scss'

type CreatePostStep = 'add-photo' | 'cropping' | 'filters' | 'publication'

const STEP_FLOW: CreatePostStep[] = ['add-photo', 'cropping', 'filters', 'publication']

const STEP_TITLES: Record<CreatePostStep, string> = {
  'add-photo': 'Add Photo',
  cropping: 'Cropping',
  filters: 'Filters',
  publication: 'Publication',
}

type Props = {
  open: boolean
  onClose: () => void
  onPublish?: (payload: { description: string; slides: ImageSlide[] }) => Promise<void> | void
}

const noop = () => {}

export const CreatePostModal = ({ open, onClose, onPublish }: Props) => {
  const { data: user } = useGetMeQuery(undefined, { skip: !open })
  const [step, setStep] = useState<CreatePostStep>('add-photo')
  const [description, setDescription] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const {
    slides,
    activeSlideId,
    isThumbsOpen,
    canAddMore,
    fileInputRef,
    handleFilesSelected,
    openFilePicker,
    removeImage,
    selectSlide,
    toggleThumbs,
  } = useAddPostImages({
    defaultThumbsOpen: true,
  })

  const hasSlides = slides.length > 0
  const currentStepIndex = useMemo(() => STEP_FLOW.indexOf(step), [step])
  const isPublicationStep = step === 'publication'
  const canMoveToNextStep = hasSlides && !isPublicationStep
  const isNextVisible = !isPublicationStep && hasSlides

  useEffect(() => {
    if (!open) {
      setStep('add-photo')
      setDescription('')
      setIsPublishing(false)
    }
  }, [open])

  const goBack = () => {
    if (currentStepIndex <= 0) {
      return
    }

    setStep(STEP_FLOW[currentStepIndex - 1])
  }

  const goNext = () => {
    if (!canMoveToNextStep) {
      return
    }

    setStep(STEP_FLOW[currentStepIndex + 1])
  }

  const handlePublish = async () => {
    if (!hasSlides || isPublishing) {
      return
    }

    setIsPublishing(true)

    try {
      await onPublish?.({
        description: description.trim(),
        slides,
      })
      onClose()
    } finally {
      setIsPublishing(false)
    }
  }

  if (!open) {
    return null
  }

  return (
    <BaseModal
      open={open}
      size="lg"
      className={s.content}
      closeOnOverlay={!isPublishing}
      onOpenChange={nextOpen => {
        if (!nextOpen && !isPublishing) {
          onClose()
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFilesSelected}
      />

      <ModalHeader className={s.header}>
        <button
          type="button"
          className={s.iconButton}
          onClick={goBack}
          disabled={currentStepIndex === 0 || isPublishing}
          aria-label="Go back"
        >
          <span className={s.backIcon} />
        </button>

        <ModalTitle className={s.title}>{STEP_TITLES[step]}</ModalTitle>

        <div className={s.headerActions}>
          {isNextVisible ? (
            <button
              type="button"
              className={s.actionButton}
              onClick={goNext}
              disabled={!canMoveToNextStep || isPublishing}
            >
              Next
            </button>
          ) : null}

          {isPublicationStep ? (
            <button
              type="button"
              className={s.actionButton}
              onClick={handlePublish}
              disabled={!hasSlides || isPublishing}
            >
              Publish
            </button>
          ) : null}

          <button
            type="button"
            className={s.iconButton}
            onClick={onClose}
            aria-label="Close modal"
            disabled={isPublishing}
          >
            <span className={s.closeIcon} />
          </button>
        </div>
      </ModalHeader>

      <ModalBody className={s.body}>
        {step === 'add-photo' && !hasSlides ? (
          <div className={s.emptyState}>
            <div className={s.emptyPreview}>
              <span className={s.imageIcon} />
            </div>
            <Button variant="primary" onClick={openFilePicker} className={s.selectButton}>
              Select from Computer
            </Button>
            <Button variant="outlined" disabled>
              Open Draft
            </Button>
          </div>
        ) : null}

        {step === 'add-photo' && hasSlides ? (
          <div className={s.sliderStage}>
            <AddPostImageSlider
              slides={slides}
              activeSlideId={activeSlideId}
              isThumbsOpen={isThumbsOpen}
              onToggleThumbs={toggleThumbs}
              onSelectSlide={selectSlide}
              onAddImage={canAddMore ? openFilePicker : undefined}
              onRemoveImage={removeImage}
            />
          </div>
        ) : null}

        {(step === 'cropping' || step === 'filters') && hasSlides ? (
          <div className={s.sliderStage}>
            <AddPostImageSlider
              slides={slides}
              activeSlideId={activeSlideId}
              isThumbsOpen={isThumbsOpen}
              onToggleThumbs={toggleThumbs}
              onSelectSlide={selectSlide}
              onAddImage={canAddMore ? openFilePicker : undefined}
              onRemoveImage={removeImage}
            />
            <div className={s.comingSoon}>
              <Typography variant="text-m-medium">
                {step === 'cropping' ? 'Cropping tools coming soon' : 'Filters coming soon'}
              </Typography>
            </div>
          </div>
        ) : null}

        {isPublicationStep && hasSlides ? (
          <div className={s.publicationLayout}>
            <div className={s.publicationSlider}>
              <AddPostImageSlider
                slides={slides}
                activeSlideId={activeSlideId}
                isThumbsOpen={false}
                showThumbsToggle={false}
                onToggleThumbs={noop}
                onSelectSlide={selectSlide}
              />
            </div>
            <div className={s.publicationPanel}>
              <div className={s.authorBlock}>
                <span className={s.avatarPlaceholder} />
                <Typography variant="text-m-bold">{user?.login ?? 'User'}</Typography>
              </div>

              <label className={s.descriptionField}>
                <Typography variant="text-s" as="span" className={s.descriptionLabel}>
                  Add publication descriptions
                </Typography>
                <textarea
                  value={description}
                  onChange={event => setDescription(event.currentTarget.value)}
                  placeholder="Text-area"
                  rows={7}
                  className={s.textArea}
                  maxLength={500}
                />
              </label>

              <Typography variant="text-s" className={s.counter}>
                {description.length}/500
              </Typography>
            </div>
          </div>
        ) : null}
      </ModalBody>
    </BaseModal>
  )
}
