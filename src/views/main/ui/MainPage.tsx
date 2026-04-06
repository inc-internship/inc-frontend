import { Card } from '@/shared/ui/Card'
import { Typography } from '@/shared/ui/Typography'
import s from './MainPage.module.scss'

export const MainPage = () => {
  return (
    <main className={s.main}>
      <Card className={s.card}>
        <Typography variant="h1" align="center">
          Main page
        </Typography>
        <Typography variant="text-l" align="center" className={s.description}>
          You are on the main page of the application.
        </Typography>
      </Card>
    </main>
  )
}
