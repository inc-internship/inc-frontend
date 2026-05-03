'use client'

import { StatusWidget } from '@/widgets/status-widget'
import { Button } from '@/shared/ui/Button'
import { ROUTES, getLocalizedRoute } from '@/shared/constants'
import authGirlImage from '../../../../public/images/auth/auth-girl.svg'
import s from './EmailConfirmedPage.module.scss'
import { useI18n } from '@/shared/i18n'

export const EmailConfirmedPage = () => {
  const { locale, t } = useI18n()

  return (
    <StatusWidget
      text={t('auth.emailConfirmed.text')}
      title={t('auth.emailConfirmed.title')}
      imageSrc={authGirlImage}
      imageAlt={t('auth.emailConfirmed.text')}
      childrenClassName={s.confirmedChildren}
      imageWrapperClassName={s.confirmedImageWrapper}
    >
      <Button asChild variant="primary" className={s.button}>
        <a href={getLocalizedRoute(locale, ROUTES.login)}>
          {t('auth.emailConfirmed.signInButton')}
        </a>
      </Button>
    </StatusWidget>
  )
}
