import { Typography } from '@/shared/ui/Typography'
import s from './ProfileDescription.module.scss'
import type { Profile } from '@/entities/profile'

type Props = {
  profile?: Profile
}

export const ProfileDescription = ({ profile }: Props) => (
  <Typography variant="text-l" className={s.description}>
    {profile?.aboutMe ?? ''}
  </Typography>
)
