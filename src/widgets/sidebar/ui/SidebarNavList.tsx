import clsx from 'clsx'
import { SidebarItemId, SidebarNavItem as SidebarNavItemType } from '../model/types'
import s from './Sidebar.module.scss'
import { SidebarNavItem } from './SidebarNavItem'

type Props = {
  items: SidebarNavItemType[]
  activeItemId?: SidebarItemId
  className?: string
}

export const SidebarNavList = ({ items, activeItemId, className }: Props) => {
  return (
    <ul className={clsx(s.list, className)}>
      {items.map(item => (
        <li key={item.id}>
          <SidebarNavItem item={item} isActive={item.id === activeItemId} />
        </li>
      ))}
    </ul>
  )
}
