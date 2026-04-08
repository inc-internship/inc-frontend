import s from '@/widgets/header/styles/Header.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { MingloIcon } from '@/widgets/header/icons/MingloIcon'
import { HeaderLanguageSelect } from '@/widgets/header/language-select'
import { ROUTES } from '@/shared/constants'
import Link from 'next/link'

export const AuthHeader = () => {
  return (
    <header className={s.container}>
      <Link href={ROUTES.main} className={s.logo}>
        <MingloIcon />
        <Typography variant="large">Minglo</Typography>
      </Link>
      <div className={s.actions}>
        <HeaderLanguageSelect />
      </div>
    </header>
  )
}
