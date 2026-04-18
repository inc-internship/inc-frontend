'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { CreatePostModal } from '@/features/add-post'
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
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)
  const activeItemId = isCreatePostModalOpen ? 'create' : getActiveSidebarItem(pathname)

  const openLogoutModalHandler = () => setIsLogoutModalOpen(true)
  const closeLogoutModalHandler = () => setIsLogoutModalOpen(false)
  const openCreatePostModalHandler = () => setIsCreatePostModalOpen(true)
  const closeCreatePostModalHandler = () => setIsCreatePostModalOpen(false)

  return (
    <aside className={s.sidebar} aria-label="Registered user sidebar">
      <nav className={s.navigation} aria-label="Main navigation">
        <SidebarNavList
          items={PRIMARY_NAV_ITEMS}
          activeItemId={activeItemId}
          className={s.primaryList}
          onCreateClick={openCreatePostModalHandler}
        />
        <SidebarNavList
          items={SECONDARY_NAV_ITEMS}
          activeItemId={activeItemId}
          className={s.secondaryList}
          onCreateClick={openCreatePostModalHandler}
        />
        <SidebarLogoutButton onClick={openLogoutModalHandler} isLoading={isLoading} />
      </nav>
      {isCreatePostModalOpen ? (
        <CreatePostModal open={isCreatePostModalOpen} onClose={closeCreatePostModalHandler} />
      ) : null}
      <LogoutModal
        open={isLogoutModalOpen}
        isLoading={isLoading}
        onConfirm={handleLogout}
        onCancel={closeLogoutModalHandler}
      />
    </aside>
  )
}
