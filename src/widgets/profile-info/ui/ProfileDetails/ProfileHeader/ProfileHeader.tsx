import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import s from './ProfileHeader.module.scss'

export const ProfileHeader = () => {
  return (
    <section className={s.container}>
      <Typography variant="h1" className={s.title}>
        UserName
      </Typography>
      <Button variant="secondary">Profile settings</Button>
    </section>
  )
}
