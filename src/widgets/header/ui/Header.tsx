import s from './Header.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { HeaderActions } from './HeaderActions/HeaderActions'

export const Header = () => (
  <header className={s.container}>
    <Typography variant="large">Inctagram</Typography>
    <HeaderActions />
  </header>
)
