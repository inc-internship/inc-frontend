import s from './Header.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { HeaderActions } from './HeaderActions/HeaderActions'
import { MingloIcon } from '@/widgets/header/ui/icons/MingloIcon'
import Link from 'next/link'

export const Header = () => (
  <header className={s.container}>
    <Link href="/" className={s.logo}>
      <MingloIcon />
      <Typography variant="large">Minglo</Typography>
    </Link>
    <HeaderActions />
  </header>
)
