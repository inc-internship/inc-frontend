import clsx from 'clsx'
import Link from 'next/link'
import { Typography } from '@/shared/ui/Typography'
import { SidebarNavItem as SidebarNavItemType } from '../model/types'
import s from './Sidebar.module.scss'

type Props = {
  item: SidebarNavItemType
  isActive: boolean
}

export const SidebarNavItem = ({ item, isActive }: Props) => {
  const iconName = isActive && item.activeIcon ? item.activeIcon : item.icon
  const content = (
    <>
      <span className={clsx(s.icon, s[`icon_${iconName}`])} aria-hidden={true} />
      <Typography variant={isActive ? 'text-m-bold' : 'text-m'} as="span" className={s.label}>
        {item.label}
      </Typography>
    </>
  )

  if (item.disabled) {
    return (
      <span className={clsx(s.item, s.itemDisabled)} aria-disabled={true}>
        {content}
      </span>
    )
  }

  return (
    <Link
      href={item.href}
      className={clsx(s.item, isActive && s.itemActive)}
      aria-current={isActive ? 'page' : undefined}
    >
      {content}
    </Link>
  )
}
