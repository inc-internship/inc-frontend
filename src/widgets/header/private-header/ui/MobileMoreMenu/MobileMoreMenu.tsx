'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { LogoutModal, useLogout } from '@/features/logout'
import { ROUTES } from '@/shared/constants'
import { Typography } from '@/shared/ui/Typography'
import s from './MobileMoreMenu.module.scss'

type MenuItem = {
  id: 'profile-settings' | 'statistics' | 'favorites'
  label: string
  href: string
  iconClassName: string
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'profile-settings',
    label: 'Profile Settings',
    href: ROUTES.profileSettings,
    iconClassName: s.icon_settingsOutline,
  },
  {
    id: 'statistics',
    label: 'Statistics',
    href: ROUTES.statistics,
    iconClassName: s.icon_trendingUpOutline,
  },
  {
    id: 'favorites',
    label: 'Favorites',
    href: ROUTES.favorites,
    iconClassName: s.icon_bookmarkOutline,
  },
]

export const MobileMoreMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const { handleLogout, isLoading } = useLogout()

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const closeOnOutsideClickHandler = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const closeOnEscapeHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('pointerdown', closeOnOutsideClickHandler)
    window.addEventListener('keydown', closeOnEscapeHandler)

    return () => {
      window.removeEventListener('pointerdown', closeOnOutsideClickHandler)
      window.removeEventListener('keydown', closeOnEscapeHandler)
    }
  }, [isOpen])

  const toggleMenuHandler = () => setIsOpen(prev => !prev)
  const closeMenuHandler = () => setIsOpen(false)
  const openLogoutModalHandler = () => {
    setIsOpen(false)
    setIsLogoutModalOpen(true)
  }
  const closeLogoutModalHandler = () => setIsLogoutModalOpen(false)

  return (
    <div ref={rootRef} className={s.root}>
      <button
        type="button"
        className={clsx(s.trigger, isOpen && s.triggerActive)}
        aria-label="Open more menu"
        aria-haspopup={true}
        aria-expanded={isOpen}
        onClick={toggleMenuHandler}
      >
        <span className={clsx(s.icon, s.icon_moreHorizontalOutline)} aria-hidden={true} />
      </button>

      {isOpen && (
        <nav className={s.menu} aria-label="More actions">
          <ul className={s.list}>
            {MENU_ITEMS.map(item => (
              <li key={item.id}>
                <Link href={item.href} className={s.item} onClick={closeMenuHandler}>
                  <span className={clsx(s.icon, item.iconClassName)} aria-hidden={true} />
                  <Typography variant="text-m" as="span" className={s.itemLabel}>
                    {item.label}
                  </Typography>
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                className={s.item}
                onClick={openLogoutModalHandler}
                disabled={isLoading}
              >
                <span className={clsx(s.icon, s.icon_logOutOutline)} aria-hidden={true} />
                <Typography variant="text-m" as="span" className={s.itemLabel}>
                  Log Out
                </Typography>
              </button>
            </li>
          </ul>
        </nav>
      )}

      <LogoutModal
        open={isLogoutModalOpen}
        isLoading={isLoading}
        onConfirm={handleLogout}
        onCancel={closeLogoutModalHandler}
      />
    </div>
  )
}
