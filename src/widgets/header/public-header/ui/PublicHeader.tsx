'use client'

import s from '@/widgets/header/styles/Header.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import { ROUTES } from '@/shared/constants'
import { MingloIcon } from '@/widgets/header/icons/MingloIcon'
import { HeaderLanguageSelect } from '@/widgets/header/language-select'
import { useI18n } from '@/shared/i18n'

export const PublicHeader = () => {
  const { t } = useI18n()

  return (
    <header className={s.container}>
      <Link href={ROUTES.main} className={s.logo}>
        <MingloIcon />
        <Typography variant="large">Minglo</Typography>
      </Link>
      <div className={s.actions}>
        <HeaderLanguageSelect />
        <div className={s.authButtons}>
          <Button asChild variant="default">
            <Link href={ROUTES.login}>{t('header.logIn')}</Link>
          </Button>
          <Button asChild variant="primary">
            <Link href={ROUTES.register}>{t('header.signUp')}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
