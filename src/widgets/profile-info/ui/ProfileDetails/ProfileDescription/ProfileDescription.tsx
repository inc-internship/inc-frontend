import { Typography } from '@/shared/ui/Typography'
import s from './ProfileDescription.module.scss'

export const ProfileDescription = () => (
  <Typography variant="text-l" className={s.description}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat.
  </Typography>
)
