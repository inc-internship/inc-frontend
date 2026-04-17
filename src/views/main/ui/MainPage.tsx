'use client'

import { CroppingModal } from '@/features/add-post'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Typography } from '@/shared/ui/Typography'
import { useState } from 'react'
import s from './MainPage.module.scss'

export const MainPage = () => {
  const [isCroppingModalOpen, setIsCroppingModalOpen] = useState(true)

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

      <CroppingModal
        open={isCroppingModalOpen}
        onOpenChange={setIsCroppingModalOpen}
        imageSrc="/images/auth/auth-girl.svg"
        imageAlt="Demo image for cropping modal"
      />
    </main>
  )
}
