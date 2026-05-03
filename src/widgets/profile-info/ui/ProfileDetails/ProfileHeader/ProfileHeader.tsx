import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import s from './ProfileHeader.module.scss'
import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/shared/constants'

export const ProfileHeader = () => {
  const params = useParams()
  const user = useAppSelector(selectUser)

  const userId = params.slug ? String(params.slug) : undefined

  return (
    <section className={s.container}>
      <Typography variant="h1" className={s.title}>
        UserName
      </Typography>
      {user && userId && user.publicId === userId && (
        <Button variant="secondary" className={s.button} asChild>
          <Link href={ROUTES.profileSettings}>Profile Settings</Link>
        </Button>
      )}
    </section>
  )
}
