'use client'

import { Typography } from '@/shared/ui/Typography'
import { ROUTES, getLocalizedRoute } from '@/shared/constants'
import Link from 'next/link'
import s from './LegalDocument.module.scss'
import { ArrowBack } from './icons/ArrowBack'
import { useI18n } from '@/shared/i18n'

type Props = {
  title: string
  content: string
}

export const LegalDocument = ({ title, content }: Props) => {
  const { locale, t } = useI18n()

  return (
    <>
      <div className={s.linkContainer}>
        <Link href={getLocalizedRoute(locale, ROUTES.register)} className={s.link}>
          <Typography variant="text-m" as="span">
            <ArrowBack />
            {t('legal.backToSignUp')}
          </Typography>
        </Link>
      </div>

      <div className={s.textContainer}>
        <Typography variant="h1">{title}</Typography>
        <Typography variant="text-m">{content}</Typography>
      </div>
    </>
  )
}
