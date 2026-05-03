'use client'

import s from '@/widgets/header/styles/Header.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import { ROUTES, getLocalizedRoute } from '@/shared/constants'
import { MingloIcon } from '@/widgets/header/icons/MingloIcon'
import { HeaderLanguageSelect } from '@/widgets/header/language-select'
import { useI18n } from '@/shared/i18n'

export const PublicHeader = () => {
  const { locale, t } = useI18n()

  return (
    <header className={s.container}>
      <Link href={getLocalizedRoute(locale, ROUTES.main)} className={s.logo}>
        <MingloIcon />
        <Typography variant="large">Minglo</Typography>
      </Link>
      <div className={s.actions}>
        <HeaderLanguageSelect />
        <div className={s.authButtons}>
          <Button asChild variant="default" className={s.authButton}>
            <Link href={getLocalizedRoute(locale, ROUTES.login)}>{t('header.logIn')}</Link>
          </Button>
          <Button asChild variant="primary" className={s.authButton}>
            <Link href={getLocalizedRoute(locale, ROUTES.register)}>{t('header.signUp')}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
