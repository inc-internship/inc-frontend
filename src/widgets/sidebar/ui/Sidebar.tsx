'use client'

import { usePathname } from 'next/navigation'
import { useLogout } from '@/features/logout'
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '../model/config'
import { getActiveSidebarItem } from '../model/getActiveSidebarItem'
import s from './Sidebar.module.scss'
import { SidebarLogoutButton } from './SidebarLogoutButton'
import { SidebarNavList } from './SidebarNavList'

export const Sidebar = () => {
  const pathname = usePathname()
  const { logoutHandler, isLoading } = useLogout()
  const activeItemId = getActiveSidebarItem(pathname)

  return (
    <aside className={s.sidebar} aria-label="Registered user sidebar">
      <nav className={s.navigation} aria-label="Main navigation">
        <SidebarNavList items={PRIMARY_NAV_ITEMS} activeItemId={activeItemId} />
        <SidebarNavList
          items={SECONDARY_NAV_ITEMS}
          activeItemId={activeItemId}
          className={s.secondaryList}
        />
        <SidebarLogoutButton onLogout={logoutHandler} isLoading={isLoading} />
      </nav>
    </aside>
  )
}
