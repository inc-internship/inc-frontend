'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { LogoutModal, useLogout } from '@/features/logout'
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '../model/config'
import { getActiveSidebarItem } from '../model/getActiveSidebarItem'
import s from './Sidebar.module.scss'
import { SidebarLogoutButton } from './SidebarLogoutButton/SidebarLogoutButton'
import { SidebarNavList } from './SidebarNavList/SidebarNavList'

export const Sidebar = () => {
  const pathname = usePathname()
  const { handleLogout, isLoading } = useLogout()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const activeItemId = getActiveSidebarItem(pathname)

  const openLogoutModalHandler = () => setIsLogoutModalOpen(true)
  const closeLogoutModalHandler = () => setIsLogoutModalOpen(false)

  return (
    <aside className={s.sidebar} aria-label="Registered user sidebar">
      <nav className={s.navigation} aria-label="Main navigation">
        <SidebarNavList items={PRIMARY_NAV_ITEMS} activeItemId={activeItemId} />
        <SidebarNavList
          items={SECONDARY_NAV_ITEMS}
          activeItemId={activeItemId}
          className={s.secondaryList}
        />
        <SidebarLogoutButton onClick={openLogoutModalHandler} isLoading={isLoading} />
      </nav>
      <LogoutModal
        open={isLogoutModalOpen}
        isLoading={isLoading}
        onConfirm={handleLogout}
        onCancel={closeLogoutModalHandler}
      />
    </aside>
  )
}
