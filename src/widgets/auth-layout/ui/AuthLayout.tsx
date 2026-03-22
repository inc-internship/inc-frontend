import s from './AuthLayout.module.scss'
import { Typography } from '@/shared/ui/Typography'

type Props = {
  title: string
  subtitle: string
}

export const AuthLayout = ({ title, subtitle }: Props) => {
  return (
    <div className={s.container}>
      <Typography variant="h1" as="h1">
        {title}
      </Typography>
      <Typography variant="text-l">{subtitle}</Typography>
    </div>
  )
}
