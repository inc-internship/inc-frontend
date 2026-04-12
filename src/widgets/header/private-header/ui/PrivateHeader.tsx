import s from '@/widgets/header/styles/Header.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { BellIcon } from '@/widgets/header/icons/BellIcon'
import { MingloIcon } from '@/widgets/header/icons/MingloIcon'
import { HeaderLanguageSelect } from '@/widgets/header/language-select'
import Link from 'next/link'
import { ROUTES } from '@/shared/constants'
import { Button } from '@/shared/ui/Button'

export const PrivateHeader = () => {
  return (
    <header className={s.container}>
      <Link href={ROUTES.main} className={s.logo}>
        <MingloIcon />
        <Typography variant="large">Minglo</Typography>
      </Link>
      <div className={s.actions}>
        <Button iconOnly>
          <BellIcon />
        </Button>
        <HeaderLanguageSelect />
      </div>
    </header>
  )
}
