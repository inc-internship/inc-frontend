import { Typography } from '@/shared/ui/Typography'
import s from './ExtraInfo.module.scss'

export const ExtraInfo = () => (
  <Typography className={s.extraInfo} variant="text-s">
    <span>2 hours ago</span>
    <span>Like: 1</span>
    <span>Answer</span>
  </Typography>
)
