'use client'

import { StatusWidget } from '@/widgets/status-widget'
import authBoyImage from '../../../../public/images/auth/auth-boy.svg'
import s from './VerificationLinkExpiredPage.module.scss'
import { VerificationLinkExpiredForm } from '@/features/verification-link-expired-form'
import { useI18n } from '@/shared/i18n'

export const VerificationLinkExpiredPage = () => {
  const { t } = useI18n()

  return (
    <StatusWidget
      title={t('auth.verificationExpired.title')}
      text={t('auth.verificationExpired.description')}
      imageSrc={authBoyImage}
      imageAlt={t('auth.verificationExpired.title')}
      childrenClassName={s.expiredChildren}
      imageWrapperClassName={s.expiredImageWrapper}
    >
      <VerificationLinkExpiredForm />
    </StatusWidget>
  )
}
