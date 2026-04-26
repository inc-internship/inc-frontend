import clsx from 'clsx'
import { SidebarItemId, SidebarNavItem as SidebarNavItemType } from '../../model/types'
import s from '../Sidebar.module.scss'
import { SidebarNavItem } from '../SidebarNavItem/SidebarNavItem'
import { useAppSelector } from '@/shared/store'
import { selectUser } from '@/entities/user/user.slice'

type Props = {
  items: SidebarNavItemType[]
  activeItemId?: SidebarItemId
  className?: string
  onCreateClick?: () => void
}

export const SidebarNavList = ({ items, activeItemId, className, onCreateClick }: Props) => {
  const user = useAppSelector(selectUser)

  return (
    <ul className={clsx(s.list, className)}>
      {items.map(item => {
        const href = item.id === 'my-profile' ? `${item.href}/${user?.publicId}` : item.href

        return (
          <li key={item.id} data-sidebar-item-id={item.id}>
            <SidebarNavItem
              item={{ ...item, href }}
              isActive={item.id === activeItemId}
              onCreateClick={onCreateClick}
            />
          </li>
        )
      })}
    </ul>
  )
}
