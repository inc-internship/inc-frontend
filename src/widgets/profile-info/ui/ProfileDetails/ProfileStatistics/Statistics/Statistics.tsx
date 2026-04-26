import { Typography } from '@/shared/ui/Typography'
import s from './Statistics.module.scss'

type Props = {
  number: number
  title: string
}

export const Statistics = ({ number, title }: Props) => (
  <div className={s.container}>
    <Typography variant="text-m-bold" className={s.number}>
      {number}
    </Typography>
    <Typography variant="text-m" className={s.title}>
      {title}
    </Typography>
  </div>
)
