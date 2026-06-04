'use client'

import { useEffect, useMemo, useState, type ChangeEvent, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { BackArrow } from '@/features/add-post/ui/icons/BackArrow'
import { CloseIcon } from '@/features/add-post/ui/icons/CloseIcon'
import { ImageOutline } from '@/features/add-post/ui/icons/ImageOutline'
import { selectUser } from '@/entities/user/user.slice'
import { ROUTES, getLocalizedRoute } from '@/shared/constants'
import { useAppSelector } from '@/shared/store'
import {
  BaseModal,
  ModalBody,
  ModalClose,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/shared/ui/BaseModal'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { PageSpinner } from '@/shared/ui/Spinner'
import { TextArea } from '@/shared/ui/TextArea'
import { Typography } from '@/shared/ui/Typography'
import { createCroppedImageFile } from '../../model/cropImage'
import { getCropSettings, getScaleFromZoom } from '../../model/cropSettings'
import type { AddPostImageSlide, CropSettings } from '../../model/cropTypes'
import {
  IMAGE_INPUT_ACCEPT,
  getImageFilesValidationError,
  type ImageFilesValidationError,
} from '../../model/fileValidation'
import { applyFilterToImage } from '../../model/filters/imageUtils'
import { useFilters } from '../../model/filters/useFilter'
import { useAddPostImages } from '../../model/useAddPostImages'
import { useCropSettingsBySlide } from '../../model/useCropSettingsBySlide'
import { usePublishPost } from '../../model/usePublishPost'
import { AddPostImageSlider } from '../AddPostImageSlider/AddPostImageSlider'
import { CropControls } from '../CroppingModal/CropControls'
import { FiltersPhoto } from '../FiltersPhoto/FiltersPhoto'
import cropS from '../CroppingModal/CroppingModal.module.scss'
import s from './CreatePostModal.module.scss'
import { useI18n } from '@/shared/i18n'

type CreatePostStep = 'cropping' | 'filters' | 'publication'

const STEP_FLOW: CreatePostStep[] = ['cropping', 'filters', 'publication']

const STEP_TITLE_KEYS: Record<CreatePostStep, string> = {
  cropping: 'createPost.cropping',
  filters: 'createPost.filters',
  publication: 'createPost.publication',
}

type Props = {
  open: boolean
  onClose: () => void
}

type CroppedSlideState = {
  file: File
  previewUrl: string
}

type FilteredSlideState = {
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

export const CreatePostModal = ({ open, onClose }: Props) => {
  const { locale, t } = useI18n()

  const { publishPost, isLoading: isPublishRequestLoading } = usePublishPost()

  const router = useRouter()
  const user = useAppSelector(selectUser)
  const [step, setStep] = useState<CreatePostStep>('cropping')
  const [description, setDescription] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [isApplyingCropping, setIsApplyingCropping] = useState(false)
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false)
  const [isFileValidationModalOpen, setIsFileValidationModalOpen] = useState(false)
  const [fileValidationError, setFileValidationError] = useState<ImageFilesValidationError | null>(
    null,
  )
  const [isSelectingPhoto, setIsSelectingPhoto] = useState(true)
  const [croppedSlidesById, setCroppedSlidesById] = useState<Record<string, CroppedSlideState>>({})
  const [filteredSlidesById, setFilteredSlidesById] = useState<Record<string, FilteredSlideState>>(
    {},
  )

  const { filters, filtersForImages, applyFilter } = useFilters()
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
  const isPhotoSelectionStage = step === 'cropping' && isSelectingPhoto
  const isCompactStage = step === 'cropping'
  const canMoveToNextStep = hasSlides && !isPublicationStep && !isPhotoSelectionStage
  const isPublishingInProgress = isPublishing || isPublishRequestLoading
  const isBusy = isApplyingCropping || isPublishingInProgress
  const modalTitle = isPhotoSelectionStage ? t('createPost.addPhoto') : t(STEP_TITLE_KEYS[step])

  const previewSlides = useMemo(
    () =>
      slides.map(slide => {
        const filtered = filteredSlidesById[slide.id]
        const cropped = croppedSlidesById[slide.id]

        if (filtered) {
          return {
            ...slide,
            displaySrc: filtered.previewUrl,
            file: filtered.file,
          }
        }

        return cropped
          ? {
              ...slide,
              displaySrc: cropped.previewUrl,
              file: cropped.file,
            }
          : slide
      }),
    [croppedSlidesById, filteredSlidesById, slides],
  )

  useEffect(() => {
    if (!open) {
      setStep('cropping')
      setDescription('')
      setIsPublishing(false)
      setIsApplyingCropping(false)
      setIsExitConfirmOpen(false)
      setIsFileValidationModalOpen(false)
      setFileValidationError(null)
      setIsSelectingPhoto(true)
      setCroppedSlidesById(prev => {
        Object.values(prev).forEach(cropped => URL.revokeObjectURL(cropped.previewUrl))

        return {}
      })
      setFilteredSlidesById(prev => {
        Object.values(prev).forEach(filtered => URL.revokeObjectURL(filtered.previewUrl))

        return {}
      })
    }
  }, [open])

  useEffect(() => {
    if (step === 'cropping' && !isPhotoSelectionStage && slides.length === 0) {
      setIsSelectingPhoto(true)
    }
  }, [isPhotoSelectionStage, slides.length, step])

  useEffect(() => {
    if (!isPublishingInProgress) {
      return
    }

    const activeElement = document.activeElement

    if (activeElement instanceof HTMLElement) {
      activeElement.blur()
    }
  }, [isPublishingInProgress])

  const goBack = () => {
    if (step === 'cropping' && !isPhotoSelectionStage) {
      slides.forEach(slide => {
        removeImageWithCropSettings(slide.id)
      })
      setCroppedSlidesById(prev => {
        Object.values(prev).forEach(cropped => URL.revokeObjectURL(cropped.previewUrl))

        return {}
      })
      clearFilteredSlidesState()
      setIsSelectingPhoto(true)

      return
    }

    if (currentStepIndex <= 0) {
      return
    }

    if (step === 'filters') {
      clearFilteredSlidesState()
    }

    setStep(STEP_FLOW[currentStepIndex - 1])
  }

  const handleImageFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files ? Array.from(event.currentTarget.files) : []

    if (!files.length) {
      return
    }

    const validationError = getImageFilesValidationError(files)

    if (validationError) {
      event.currentTarget.value = ''
      setFileValidationError(validationError)
      setIsFileValidationModalOpen(true)

      return
    }

    handleFilesSelected(event)
    setIsSelectingPhoto(false)
  }

  const getSlideCropSettings = (slideId?: string) => getCropSettings(cropSettingsBySlideId, slideId)

  const clearFilteredSlidesState = () => {
    setFilteredSlidesById(prev => {
      Object.values(prev).forEach(filtered => URL.revokeObjectURL(filtered.previewUrl))

      return {}
    })
  }

  const clearProcessedImageStates = (slideId: string) => {
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

    setFilteredSlidesById(prev => {
      const target = prev[slideId]

      if (!target) {
        return prev
      }

      const next = { ...prev }

      delete next[slideId]
      URL.revokeObjectURL(target.previewUrl)

      return next
    })
  }

  const mergeProcessedSlidesState = <T extends { previewUrl: string }>(
    prev: Record<string, T>,
    entries: Array<{ slideId: string; item: T | null }>,
  ) => {
    const next: Record<string, T> = {}

    for (const entry of entries) {
      const prevEntry = prev[entry.slideId]

      if (!entry.item) {
        if (prevEntry) {
          URL.revokeObjectURL(prevEntry.previewUrl)
        }
        continue
      }

      if (prevEntry && prevEntry.previewUrl !== entry.item.previewUrl) {
        URL.revokeObjectURL(prevEntry.previewUrl)
      }

      next[entry.slideId] = entry.item
    }

    Object.entries(prev).forEach(([slideId, prevEntry]) => {
      if (!(slideId in next) && !slides.some(slide => slide.id === slideId)) {
        URL.revokeObjectURL(prevEntry.previewUrl)
      }
    })

    return next
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
            return { slideId: slide.id, item: null as CroppedSlideState | null }
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
            item: {
              file,
              previewUrl: URL.createObjectURL(file),
            },
          }
        }),
      )

      setCroppedSlidesById(prev => mergeProcessedSlidesState(prev, croppedEntries))
    } finally {
      setIsApplyingCropping(false)
    }
  }

  const applyFiltersToSlides = async () => {
    if (!slides.length) {
      return
    }

    setIsApplyingCropping(true)

    try {
      const filteredEntries = await Promise.all(
        slides.map(async slide => {
          const selectedFilter = filtersForImages[slide.id] || 'none'

          if (selectedFilter === 'none') {
            return { slideId: slide.id, item: null as FilteredSlideState | null }
          }

          const cropped = croppedSlidesById[slide.id]
          const sourceUrl = cropped ? cropped.previewUrl : resolveSlideSrc(slide)
          const sourceFile = cropped ? cropped.file : slide.file

          if (!sourceFile) {
            return { slideId: slide.id, item: null as FilteredSlideState | null }
          }

          const filteredFile = await applyFilterToImage(sourceUrl, selectedFilter, sourceFile)

          return {
            slideId: slide.id,
            item: {
              file: filteredFile,
              previewUrl: URL.createObjectURL(filteredFile),
            },
          }
        }),
      )

      setFilteredSlidesById(prev => mergeProcessedSlidesState(prev, filteredEntries))
    } finally {
      setIsApplyingCropping(false)
    }
  }

  const goNext = async () => {
    if (!canMoveToNextStep) {
      return
    }

    if (step === 'cropping' && !isPhotoSelectionStage) {
      await applyCroppingToSlides()
      clearFilteredSlidesState()
    }

    if (step === 'filters') {
      await applyFiltersToSlides()
    }

    setStep(STEP_FLOW[currentStepIndex + 1])
  }

  const getSlideImageStyle = (slide: AddPostImageSlide) =>
    ({
      transform: `scale(${getScaleFromZoom(getSlideCropSettings(slide.id).zoom)})`,
    }) satisfies CSSProperties

  const handlePublish = async () => {
    if (!hasSlides || isBusy) return
    setIsPublishing(true)
    const publicationSlides = slides.map(slide => {
      const filtered = filteredSlidesById[slide.id]
      const cropped = croppedSlidesById[slide.id]
      if (filtered) return { ...slide, file: filtered.file, displaySrc: filtered.previewUrl }
      if (cropped) return { ...slide, file: cropped.file, displaySrc: cropped.previewUrl }
      return slide
    })

    onClose()

    publishPost({
      description,
      slides: publicationSlides,
    }).catch(error => {
      console.error('Post publish failed', error)
    })
  }

  const closePublicationCreation = () => {
    setIsExitConfirmOpen(false)
    onClose()
    router.push(getLocalizedRoute(locale, ROUTES.main))
  }

  if (!open) {
    return null
  }

  return (
    <>
      {isPublishingInProgress ? (
        <div className={s.pageSpinnerOverlay}>
          <PageSpinner />
        </div>
      ) : null}

      <BaseModal
        open={open}
        size="lg"
        className={[
          s.content,
          isCompactStage ? s.contentCompact : '',
          isPublicationStep ? s.contentPublication : '',
          isPublishingInProgress ? s.contentLocked : '',
        ].join(' ')}
        closeOnOverlay={!isBusy && !isPhotoSelectionStage}
        onOpenChange={nextOpen => {
          if (!nextOpen && !isBusy) {
            if (isPhotoSelectionStage) {
              onClose()
            } else {
              setIsExitConfirmOpen(true)
            }
          }
        }}
      >
        <Input
          ref={fileInputRef}
          type="file"
          accept={IMAGE_INPUT_ACCEPT}
          multiple
          wrapperClassName={s.hiddenFileInputWrapper}
          onChange={handleImageFilesSelected}
        />

        <ModalHeader
          className={[s.header, isPhotoSelectionStage ? s.headerAddPhoto : ''].join(' ')}
        >
          {!isPhotoSelectionStage ? (
            <Button
              iconOnly
              className={s.headerIconButton}
              onClick={goBack}
              disabled={(currentStepIndex === 0 && step !== 'cropping') || isBusy}
              aria-label={t('common.goBack')}
            >
              <BackArrow />
            </Button>
          ) : null}

          <ModalTitle
            className={[s.title, isPhotoSelectionStage ? s.titlePhotoSelection : ''].join(' ')}
          >
            {modalTitle}
          </ModalTitle>

          <div className={s.headerActions}>
            {canMoveToNextStep ? (
              <Button
                className={s.actionButton}
                onClick={goNext}
                disabled={!canMoveToNextStep || isBusy}
              >
                {t('common.next')}
              </Button>
            ) : null}

            {isPublicationStep ? (
              <Button
                className={s.actionButton}
                onClick={handlePublish}
                disabled={!hasSlides || isBusy}
              >
                {t('createPost.publish')}
              </Button>
            ) : null}

            {isPhotoSelectionStage ? (
              <Button
                iconOnly
                className={s.headerIconButton}
                onClick={onClose}
                aria-label={t('common.closeModal')}
                disabled={isBusy}
              >
                <CloseIcon className={s.closeIcon} />
              </Button>
            ) : null}
          </div>
        </ModalHeader>

        <ModalBody className={s.body}>
          {step === 'cropping' && isPhotoSelectionStage ? (
            <div className={s.emptyState}>
              <div className={s.emptyPreview}>
                <ImageOutline className={s.ImageOutline} />
              </div>

              <div className={s.btnsWrapper}>
                <Button variant="primary" onClick={openFilePicker} className={s.selectButton}>
                  {t('createPost.selectFromComputer')}
                </Button>
                <Button variant="outlined" disabled className={s.selectButton} fullWidth={true}>
                  {t('createPost.openDraft')}
                </Button>
              </div>
            </div>
          ) : null}

          {step === 'cropping' && hasSlides && !isPhotoSelectionStage ? (
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
                  clearProcessedImageStates(slideId)
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
            <div className={`${s.sliderStage} ${s.sliderStageFilters}`}>
              <div className={s.filtersSliderPane}>
                <AddPostImageSlider
                  slides={previewSlides}
                  activeSlideId={activeSlideId}
                  imageClassName={cropS.imageOriginal}
                  imageViewportClassName={cropS.viewportOriginal}
                  getImageStyle={slide => {
                    const filterValue = filtersForImages[slide.id]

                    if (!filterValue || filterValue === 'none') {
                      return undefined
                    }

                    return { filter: filterValue }
                  }}
                  isThumbsOpen={false}
                  showThumbsToggle={false}
                  onSelectSlide={selectSlide}
                  onAddImage={canAddMore ? openFilePicker : undefined}
                  onRemoveImage={slideId => {
                    clearProcessedImageStates(slideId)
                    removeImageWithCropSettings(slideId)
                  }}
                />
              </div>
              <div className={s.filtersPanelPane}>
                <FiltersPhoto
                  slides={previewSlides}
                  activeSlideId={activeSlideId}
                  filters={filters}
                  currentFilter={activeSlideId ? filtersForImages[activeSlideId] || 'none' : 'none'}
                  onApplyFilter={filter => {
                    if (activeSlideId) {
                      applyFilter(activeSlideId, filter)
                    }
                  }}
                />
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

              <div className={s.publicationPaneWrapper}>
                <div className={s.publicationPanel}>
                  <div className={s.authorBlock}>
                    <span className={s.avatarPlaceholder} />
                    <Typography variant="text-m-bold">{user?.login ?? t('common.user')}</Typography>
                  </div>

                  <TextArea
                    className={s.descriptionField}
                    label={t('createPost.addPublicationDescription')}
                    placeholder={t('createPost.textArea')}
                    value={description}
                    onChange={event => setDescription(event.currentTarget.value)}
                    rows={7}
                    maxLength={500}
                    disabled={isPublishingInProgress}
                  />

                  <Typography variant="text-s" className={s.counter}>
                    {description.length}/500
                  </Typography>
                </div>
                <div className={s.locationPanel}>
                  <div className={s.locationBlock}>{t('createPost.location')}</div>
                </div>
              </div>
            </div>
          ) : null}
        </ModalBody>
      </BaseModal>

      <BaseModal
        open={isExitConfirmOpen}
        size="sm"
        className={s.exitConfirmContent}
        closeOnOverlay={false}
      >
        <ModalHeader className={s.exitConfirmHeader}>
          <ModalTitle className={s.exitConfirmTitle}>{t('createPost.closePublication')}</ModalTitle>
          <ModalClose
            className={s.exitConfirmClose}
            onClick={() => setIsExitConfirmOpen(false)}
            disabled={isBusy}
          >
            <CloseIcon className={s.closeIcon} />
          </ModalClose>
        </ModalHeader>

        <ModalDescription className={s.exitConfirmDescription}>
          {t('createPost.closePublicationDescription')}
        </ModalDescription>

        <ModalFooter className={s.exitConfirmFooter}>
          <Button variant="outlined" onClick={closePublicationCreation} disabled={isBusy}>
            {t('createPost.saveDraft')}
          </Button>
          <Button variant="primary" onClick={closePublicationCreation} disabled={isBusy}>
            {t('createPost.discard')}
          </Button>
        </ModalFooter>
      </BaseModal>

      <BaseModal
        open={isFileValidationModalOpen}
        size="sm"
        className={s.fileValidationContent}
        onOpenChange={nextOpen => {
          if (!nextOpen) {
            setIsFileValidationModalOpen(false)
            setFileValidationError(null)
          }
        }}
      >
        <ModalHeader className={s.exitConfirmHeader}>
          <ModalTitle className={s.exitConfirmTitle}>{t('common.error')}</ModalTitle>
          <ModalClose
            className={s.exitConfirmClose}
            onClick={() => {
              setIsFileValidationModalOpen(false)
              setFileValidationError(null)
            }}
          >
            <CloseIcon className={s.closeIcon} />
          </ModalClose>
        </ModalHeader>

        <ModalDescription className={s.exitConfirmDescription}>
          {fileValidationError
            ? t(`createPost.validation.${fileValidationError}`)
            : t('common.somethingWentWrong')}
        </ModalDescription>

        <ModalFooter className={s.exitConfirmFooter}>
          <Button
            variant="primary"
            onClick={() => {
              setIsFileValidationModalOpen(false)
              setFileValidationError(null)
            }}
          >
            {t('common.ok')}
          </Button>
        </ModalFooter>
      </BaseModal>
    </>
  )
}
