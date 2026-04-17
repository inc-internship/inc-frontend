'use client'

import { useEffect, useState } from 'react'
import { CroppingModal } from '@/features/add-post'
import type { CroppingModalResult } from '@/features/add-post/ui/CroppingModal/CroppingModal'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Typography } from '@/shared/ui/Typography'
import Image from 'next/image'
import s from './MainPage.module.scss'

type CroppedPreview = {
  id: string
  alt: string
  src: string
  fileName: string
}

export const MainPage = () => {
  const [isCroppingModalOpen, setIsCroppingModalOpen] = useState(true)
  const [croppedPreviews, setCroppedPreviews] = useState<CroppedPreview[]>([])

  useEffect(() => {
    return () => {
      croppedPreviews.forEach(preview => {
        URL.revokeObjectURL(preview.src)
      })
    }
  }, [croppedPreviews])

  const handleNext = async (images: CroppingModalResult[]) => {
    setCroppedPreviews(prev => {
      prev.forEach(preview => {
        URL.revokeObjectURL(preview.src)
      })

      return images.map(image => ({
        id: image.id,
        alt: image.alt,
        src: URL.createObjectURL(image.file),
        fileName: image.file.name,
      }))
    })

    setIsCroppingModalOpen(false)
  }

  return (
    <main className={s.main}>
      <Card className={s.card}>
        <Typography variant="h1" align="center">
          Main page
        </Typography>
        <Typography variant="text-l" align="center" className={s.description}>
          You are on the main page of the application.
        </Typography>
        <Button variant="primary" onClick={() => setIsCroppingModalOpen(true)}>
          Open cropping modal
        </Button>
      </Card>

      {croppedPreviews.length ? (
        <Card className={s.resultCard}>
          <Typography variant="h2" align="center">
            Cropped Result
          </Typography>

          <div className={s.previewGrid}>
            {croppedPreviews.map(preview => (
              <div key={preview.id} className={s.previewItem}>
                <div className={s.previewImageWrap}>
                  <Image
                    src={preview.src}
                    alt={preview.alt}
                    fill
                    sizes="240px"
                    className={s.previewImage}
                  />
                </div>
                <Typography variant="text-s" className={s.previewCaption}>
                  {preview.fileName}
                </Typography>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <CroppingModal
        open={isCroppingModalOpen}
        onOpenChange={setIsCroppingModalOpen}
        imageSrc="/images/auth/auth-girl.svg"
        imageAlt="Demo image for cropping modal"
        onNext={handleNext}
      />
    </main>
  )
}
