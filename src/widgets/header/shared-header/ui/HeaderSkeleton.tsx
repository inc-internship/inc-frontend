'use client'

import Link from 'next/link'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { ROUTES, getLocalizedRoute } from '@/shared/constants'
import { useI18n } from '@/shared/i18n'
import { Typography } from '@/shared/ui/Typography'
import { MingloIcon } from '@/widgets/header/icons/MingloIcon'
import s from '@/widgets/header/styles/Header.module.scss'
import sk from './HeaderSkeleton.module.scss'

export const HeaderSkeleton = () => {
  const { locale } = useI18n()

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <header className={s.container}>
        <Link href={getLocalizedRoute(locale, ROUTES.main)} className={s.logo}>
          <MingloIcon />
          <Typography variant="large">Minglo</Typography>
        </Link>
        <div className={s.actions}>
          <Skeleton className={sk.languageSkeleton} />
          <Skeleton className={sk.buttonSkeleton} />
          <Skeleton className={sk.buttonSkeleton} />
        </div>
      </header>
    </SkeletonTheme>
  )
}
