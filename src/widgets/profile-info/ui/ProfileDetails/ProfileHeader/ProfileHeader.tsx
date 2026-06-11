import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import s from './ProfileHeader.module.scss'
import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { useParams } from 'next/navigation'
import type { Profile } from '@/entities/profile'
import Link from 'next/link'
import { ROUTES } from '@/shared/constants'

type Props = {
  profile?: Profile
  userName: string
}

export const ProfileHeader = ({ profile, userName }: Props) => {
  const params = useParams()
  const user = useAppSelector(selectUser)

  const userId = params.id ? String(params.id) : undefined

  return (
    <section className={s.container}>
      <Typography variant="h1" className={s.title}>
        {profile?.login ?? userName ?? ''}
      </Typography>
      {user && userId && user.publicId === userId && (
        <Button variant="secondary" className={s.button} asChild>
          <Link href={ROUTES.profileSettings}>Profile Settings</Link>
        </Button>
      )}
    </section>
  )
}
