'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { ImageSlide } from '@/shared/ui/ImageSlider'
import { AddPostImageSlider } from '../AddPostImageSlider/AddPostImageSlider'
import s from './AddPostImageSliderWrapper.module.scss'

type Props = {
  initialSlides?: ImageSlide[]
  className?: string
  defaultThumbsOpen?: boolean
  maxImages?: number
}

export const AddPostImageSliderWrapper = ({
  initialSlides = [],
  className,
  defaultThumbsOpen = false,
  maxImages = 10,
}: Props) => {
  const rootClassName = [s.root, className].filter(Boolean).join(' ')
  const [slides, setSlides] = useState<ImageSlide[]>(initialSlides)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const blobUrlsRef = useRef<Set<string>>(new Set())
  const canAddMore = slides.length < maxImages

  const handleOpenFilePicker = () => {
    if (!canAddMore) {
      return
    }

    fileInputRef.current?.click()
  }

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files

    if (!files || files.length === 0) {
      return
    }

    setSlides(prev => {
      const availableSlots = maxImages - prev.length

      if (availableSlots <= 0) {
        return prev
      }

      const filesToAdd = Array.from(files).slice(0, availableSlots)
      const newSlides: ImageSlide[] = filesToAdd.map(file => {
        const previewUrl = URL.createObjectURL(file)

        blobUrlsRef.current.add(previewUrl)

        return {
          id: crypto.randomUUID(),
          src: previewUrl,
          alt: file.name || 'Uploaded image',
        }
      })

      return [...prev, ...newSlides]
    })
    event.currentTarget.value = ''
  }

  const handleRemoveImage = (slideId: string) => {
    setSlides(prev => {
      const slideToRemove = prev.find(slide => slide.id === slideId)

      if (
        slideToRemove &&
        typeof slideToRemove.src === 'string' &&
        slideToRemove.src.startsWith('blob:')
      ) {
        URL.revokeObjectURL(slideToRemove.src)
        blobUrlsRef.current.delete(slideToRemove.src)
      }

      return prev.filter(slide => slide.id !== slideId)
    })
  }

  useEffect(() => {
    const blobUrls = blobUrlsRef.current

    return () => {
      blobUrls.forEach(url => {
        URL.revokeObjectURL(url)
      })
      blobUrls.clear()
    }
  }, [])

  return (
    <div className={rootClassName}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        disabled={!canAddMore}
        onChange={handleFilesSelected}
      />
      <AddPostImageSlider
        slides={slides}
        defaultThumbsOpen={defaultThumbsOpen}
        onAddImage={canAddMore ? handleOpenFilePicker : undefined}
        onRemoveImage={handleRemoveImage}
      />
    </div>
  )
}
