'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { BaseModal, ModalBody, ModalHeader, ModalTitle } from '@/shared/ui/BaseModal'
import { Button } from '@/shared/ui/Button'
import { Typography } from '@/shared/ui/Typography'
import { createCroppedImageFile } from '../../model/cropImage'
import { getCropSettings, getScaleFromZoom } from '../../model/cropSettings'
import type { AddPostImageSlide, CropSettings } from '../../model/cropTypes'
import { useAddPostImages } from '../../model/useAddPostImages'
import { useCropSettingsBySlide } from '../../model/useCropSettingsBySlide'
import { AddPostImageSlider } from '../AddPostImageSlider/AddPostImageSlider'
import { CropControls } from '../CroppingModal/CropControls'
import cropS from '../CroppingModal/CroppingModal.module.scss'
import s from './CreatePostModal.module.scss'

type CreatePostStep = 'cropping' | 'filters' | 'publication'

const STEP_FLOW: CreatePostStep[] = ['cropping', 'filters', 'publication']

const STEP_TITLES: Record<CreatePostStep, string> = {
  cropping: 'Cropping',
  filters: 'Filters',
  publication: 'Publication',
}

type Props = {
  open: boolean
  onClose: () => void
  onPublish?: (payload: {
    description: string
    slides: AddPostImageSlide[]
  }) => Promise<void> | void
}

type CroppedSlideState = {
  file: File
  previewUrl: string
}

const noop = () => {}
const ASPECT_RATIO_CLASS_NAMES = {
  original: {
    image: cropS.imageOriginal,
    viewport: cropS.viewportOriginal,
  },
  '1:1': {
    image: cropS.imageCropped,
    viewport: cropS.viewportSquare,
  },
  '4:5': {
    image: cropS.imageCropped,
    viewport: cropS.viewportPortrait,
  },
  '16:9': {
    image: cropS.imageCropped,
    viewport: cropS.viewportLandscape,
  },
} as const

const resolveSlideSrc = (slide: AddPostImageSlide) => {
  const slideSrc = typeof slide.src === 'string' ? slide.src : (slide.displaySrc ?? slide.src.src)

  return typeof slideSrc === 'string' ? slideSrc : slideSrc.src
}

export const CreatePostModal = ({ open, onClose, onPublish }: Props) => {
  const user = useAppSelector(selectUser)
  const [step, setStep] = useState<CreatePostStep>('cropping')
  const [description, setDescription] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [isApplyingCropping, setIsApplyingCropping] = useState(false)
  const [croppedSlidesById, setCroppedSlidesById] = useState<Record<string, CroppedSlideState>>({})
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
  const { cropSettingsBySlideId, updateActiveSlideCropSettings, removeImageWithCropSettings } =
    useCropSettingsBySlide({
      slides,
      activeSlideId,
      removeImage,
    })

  const hasSlides = slides.length > 0
  const currentStepIndex = useMemo(() => STEP_FLOW.indexOf(step), [step])
  const isPublicationStep = step === 'publication'
  const canMoveToNextStep = hasSlides && !isPublicationStep
  const isNextVisible = !isPublicationStep && hasSlides
  const isBusy = isPublishing || isApplyingCropping

  const previewSlides = useMemo(
    () =>
      slides.map(slide => {
        const cropped = croppedSlidesById[slide.id]

        return cropped
          ? {
              ...slide,
              displaySrc: cropped.previewUrl,
              file: cropped.file,
            }
          : slide
      }),
    [croppedSlidesById, slides],
  )

  useEffect(() => {
    if (!open) {
      setStep('cropping')
      setDescription('')
      setIsPublishing(false)
      setIsApplyingCropping(false)
      setCroppedSlidesById(prev => {
        Object.values(prev).forEach(cropped => URL.revokeObjectURL(cropped.previewUrl))

        return {}
      })
    }
  }, [open])

  const goBack = () => {
    if (currentStepIndex <= 0) {
      return
    }

    setStep(STEP_FLOW[currentStepIndex - 1])
  }

  const applyCroppingToSlides = async () => {
    if (!slides.length) {
      return
    }

    setIsApplyingCropping(true)

    try {
      const croppedEntries = await Promise.all(
        slides.map(async slide => {
          const cropSettings = getSlideCropSettings(slide.id)
          const isDefaultCrop = cropSettings.aspectRatio === 'original' && cropSettings.zoom === 0

          if (!slide.file || isDefaultCrop) {
            return { slideId: slide.id, cropped: null as CroppedSlideState | null }
          }

          const file = await createCroppedImageFile({
            src: resolveSlideSrc(slide),
            aspectRatio: cropSettings.aspectRatio,
            zoom: cropSettings.zoom,
            file: slide.file,
            fileName: slide.alt,
          })

          return {
            slideId: slide.id,
            cropped: {
              file,
              previewUrl: URL.createObjectURL(file),
            },
          }
        }),
      )

      setCroppedSlidesById(prev => {
        const next: Record<string, CroppedSlideState> = {}

        for (const entry of croppedEntries) {
          const prevEntry = prev[entry.slideId]

          if (!entry.cropped) {
            if (prevEntry) {
              URL.revokeObjectURL(prevEntry.previewUrl)
            }
            continue
          }

          if (prevEntry && prevEntry.previewUrl !== entry.cropped.previewUrl) {
            URL.revokeObjectURL(prevEntry.previewUrl)
          }

          next[entry.slideId] = entry.cropped
        }

        Object.entries(prev).forEach(([slideId, prevEntry]) => {
          if (!(slideId in next) && !slides.some(slide => slide.id === slideId)) {
            URL.revokeObjectURL(prevEntry.previewUrl)
          }
        })

        return next
      })
    } finally {
      setIsApplyingCropping(false)
    }
  }

  const goNext = async () => {
    if (!canMoveToNextStep) {
      return
    }

    if (step === 'cropping') {
      await applyCroppingToSlides()
    }

    setStep(STEP_FLOW[currentStepIndex + 1])
  }

  const getSlideCropSettings = (slideId?: string) => getCropSettings(cropSettingsBySlideId, slideId)

  const getSlideImageStyle = (slide: AddPostImageSlide) =>
    ({
      transform: `scale(${getScaleFromZoom(getSlideCropSettings(slide.id).zoom)})`,
    }) satisfies CSSProperties

  const handlePublish = async () => {
    if (!hasSlides || isBusy) {
      return
    }

    setIsPublishing(true)

    try {
      const publicationSlides = slides.map(slide => {
        const cropped = croppedSlidesById[slide.id]

        return cropped
          ? {
              ...slide,
              file: cropped.file,
              displaySrc: cropped.previewUrl,
            }
          : slide
      })

      await onPublish?.({
        description: description.trim(),
        slides: publicationSlides,
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
      closeOnOverlay={!isBusy}
      onOpenChange={nextOpen => {
        if (!nextOpen && !isBusy) {
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
          disabled={currentStepIndex === 0 || isBusy}
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
              disabled={!canMoveToNextStep || isBusy}
            >
              Next
            </button>
          ) : null}

          {isPublicationStep ? (
            <button
              type="button"
              className={s.actionButton}
              onClick={handlePublish}
              disabled={!hasSlides || isBusy}
            >
              Publish
            </button>
          ) : null}

          <button
            type="button"
            className={s.iconButton}
            onClick={onClose}
            aria-label="Close modal"
            disabled={isBusy}
          >
            <span className={s.closeIcon} />
          </button>
        </div>
      </ModalHeader>

      <ModalBody className={s.body}>
        {step === 'cropping' && !hasSlides ? (
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

        {step === 'cropping' && hasSlides ? (
          <div className={s.sliderStage}>
            <AddPostImageSlider
              slides={slides}
              activeSlideId={activeSlideId}
              getImageClassName={slide =>
                ASPECT_RATIO_CLASS_NAMES[getSlideCropSettings(slide.id).aspectRatio].image
              }
              getImageViewportClassName={slide =>
                ASPECT_RATIO_CLASS_NAMES[getSlideCropSettings(slide.id).aspectRatio].viewport
              }
              getImageStyle={getSlideImageStyle}
              isThumbsOpen={isThumbsOpen}
              onToggleThumbs={toggleThumbs}
              onSelectSlide={selectSlide}
              onAddImage={canAddMore ? openFilePicker : undefined}
              onRemoveImage={slideId => {
                setCroppedSlidesById(prev => {
                  const target = prev[slideId]

                  if (!target) {
                    return prev
                  }

                  const next = { ...prev }

                  delete next[slideId]
                  URL.revokeObjectURL(target.previewUrl)

                  return next
                })
                removeImageWithCropSettings(slideId)
              }}
              editControls={
                <CropControls
                  activeSlideId={activeSlideId}
                  cropSettings={getSlideCropSettings(activeSlideId)}
                  onAspectRatioChange={aspectRatio => {
                    if (aspectRatio in ASPECT_RATIO_CLASS_NAMES) {
                      updateActiveSlideCropSettings({
                        aspectRatio: aspectRatio as CropSettings['aspectRatio'],
                      })
                    }
                  }}
                  onZoomChange={zoom => updateActiveSlideCropSettings({ zoom })}
                />
              }
            />
          </div>
        ) : null}

        {step === 'filters' && hasSlides ? (
          <div className={s.sliderStage}>
            <AddPostImageSlider
              slides={previewSlides}
              activeSlideId={activeSlideId}
              imageClassName={cropS.imageOriginal}
              imageViewportClassName={cropS.viewportOriginal}
              isThumbsOpen={isThumbsOpen}
              onToggleThumbs={toggleThumbs}
              onSelectSlide={selectSlide}
              onAddImage={canAddMore ? openFilePicker : undefined}
              onRemoveImage={slideId => {
                setCroppedSlidesById(prev => {
                  const target = prev[slideId]

                  if (!target) {
                    return prev
                  }

                  const next = { ...prev }

                  delete next[slideId]
                  URL.revokeObjectURL(target.previewUrl)

                  return next
                })
                removeImageWithCropSettings(slideId)
              }}
            />
            <div className={s.comingSoon}>
              <Typography variant="text-m-medium">Filters coming soon</Typography>
            </div>
          </div>
        ) : null}

        {isPublicationStep && hasSlides ? (
          <div className={s.publicationLayout}>
            <div className={s.publicationSlider}>
              <AddPostImageSlider
                slides={previewSlides}
                activeSlideId={activeSlideId}
                imageClassName={cropS.imageOriginal}
                imageViewportClassName={cropS.viewportOriginal}
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
