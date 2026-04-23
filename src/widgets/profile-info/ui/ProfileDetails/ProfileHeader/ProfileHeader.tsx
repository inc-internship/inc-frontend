import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import s from './ProfileHeader.module.scss'
import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { useParams } from 'next/navigation'

export const ProfileHeader = () => {
  const params = useParams()
  const user = useAppSelector(selectUser)

  return (
    <section className={s.container}>
      <Typography variant="h1" className={s.title}>
        UserName
      </Typography>
      {user?.publicId === params.slug && (
        <Button variant="secondary" className={s.button}>
          Profile settings
        </Button>
      )}
    </section>
  )
}
