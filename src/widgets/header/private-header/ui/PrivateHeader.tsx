'use client'

import s from '@/widgets/header/styles/Header.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { MingloIcon } from '@/widgets/header/icons/MingloIcon'
import { HeaderLanguageSelect } from '@/widgets/header/language-select'
import Link from 'next/link'
import { ROUTES, getLocalizedRoute } from '@/shared/constants'
import { MobileMoreMenu } from './MobileMoreMenu/MobileMoreMenu'
import { useI18n } from '@/shared/i18n'
import { NotificationsDropdown } from './NotificationsDropdown/NotificationsDropdown'

export const PrivateHeader = () => {
  const { locale } = useI18n()

  return (
    <header className={s.container}>
      <Link href={getLocalizedRoute(locale, ROUTES.main)} className={s.logo}>
        <MingloIcon />
        <Typography variant="large">Minglo</Typography>
      </Link>
      <div className={s.actions}>
        <NotificationsDropdown />
        <HeaderLanguageSelect />
        <MobileMoreMenu />
      </div>
    </header>
  )
}
