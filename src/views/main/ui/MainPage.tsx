'use client'

import { Card } from '@/shared/ui/Card'
import { Typography } from '@/shared/ui/Typography'
import { useI18n } from '@/shared/i18n'
import s from './MainPage.module.scss'

export const MainPage = () => {
  const { t } = useI18n()

  return (
    <main className={s.main}>
      <Card className={s.card}>
        <Typography variant="h1" align="center">
          {t('main.title')}
        </Typography>
        <Typography variant="text-l" align="center" className={s.description}>
          {t('main.description')}
        </Typography>
      </Card>
    </main>
  )
}
