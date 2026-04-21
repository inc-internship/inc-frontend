'use client'

import clsx from 'clsx'
import { Typography } from '@/shared/ui/Typography'
import s from '../Sidebar.module.scss'
import { useI18n } from '@/shared/i18n'

type Props = {
  onClick: () => void
  isLoading: boolean
}

export const SidebarLogoutButton = ({ onClick, isLoading }: Props) => {
  const { t } = useI18n()

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(s.item, s.logoutItem)}
      aria-label={t('sidebar.logOut')}
      aria-busy={isLoading}
      disabled={isLoading}
    >
      <span className={clsx(s.icon, s.icon_logOutOutline)} aria-hidden={true} />
      <Typography variant="text-m" as="span" className={s.label}>
        {t('sidebar.logOut')}
      </Typography>
    </button>
  )
}
