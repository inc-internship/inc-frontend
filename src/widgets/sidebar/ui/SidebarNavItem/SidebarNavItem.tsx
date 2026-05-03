'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { Typography } from '@/shared/ui/Typography'
import { SidebarNavItem as SidebarNavItemType } from '../../model/types'
import s from '../Sidebar.module.scss'
import { getLocalizedPath, useI18n } from '@/shared/i18n'

type Props = {
  item: SidebarNavItemType
  isActive: boolean
  onCreateClick?: () => void
}

export const SidebarNavItem = ({ item, isActive, onCreateClick }: Props) => {
  const { locale, t } = useI18n()
  const iconName = isActive && item.activeIcon ? item.activeIcon : item.icon
  const content = (
    <>
      <span className={clsx(s.icon, s[`icon_${iconName}`])} aria-hidden={true} />
      <Typography variant={isActive ? 'text-m-bold' : 'text-m'} as="span" className={s.label}>
        {t(item.labelKey)}
      </Typography>
    </>
  )

  if (item.id === 'create') {
    return (
      <button
        type="button"
        className={clsx(s.item, isActive && s.itemActive, item.disabled && s.itemDisabled)}
        onClick={onCreateClick}
        disabled={item.disabled}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </button>
    )
  }

  if (item.disabled) {
    return (
      <span className={clsx(s.item, s.itemDisabled)} aria-disabled={true}>
        {content}
      </span>
    )
  }

  return (
    <Link
      href={getLocalizedPath(locale, item.href)}
      className={clsx(s.item, isActive && s.itemActive)}
      aria-current={isActive ? 'page' : undefined}
    >
      {content}
    </Link>
  )
}
