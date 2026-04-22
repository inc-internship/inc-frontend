'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { LogoutModal, useLogout } from '@/features/logout'
import { ROUTES } from '@/shared/constants'
import { Typography } from '@/shared/ui/Typography'
import s from './MobileMoreMenu.module.scss'
import { useI18n } from '@/shared/i18n'

type MenuItem = {
  id: 'profile-settings' | 'statistics' | 'favorites'
  labelKey: string
  href: string
  iconClassName: string
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'profile-settings',
    labelKey: 'menu.profileSettings',
    href: ROUTES.profileSettings,
    iconClassName: s.icon_settingsOutline,
  },
  {
    id: 'statistics',
    labelKey: 'sidebar.statistics',
    href: ROUTES.statistics,
    iconClassName: s.icon_trendingUpOutline,
  },
  {
    id: 'favorites',
    labelKey: 'sidebar.favorites',
    href: ROUTES.favorites,
    iconClassName: s.icon_bookmarkOutline,
  },
]

export const MobileMoreMenu = () => {
  const { t } = useI18n()
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
        aria-label={t('menu.openMoreMenu')}
        aria-haspopup={true}
        aria-expanded={isOpen}
        onClick={toggleMenuHandler}
      >
        <span className={clsx(s.icon, s.icon_moreHorizontalOutline)} aria-hidden={true} />
      </button>

      {isOpen && (
        <nav className={s.menu} aria-label={t('menu.moreActions')}>
          <ul className={s.list}>
            {MENU_ITEMS.map(item => (
              <li key={item.id}>
                <Link href={item.href} className={s.item} onClick={closeMenuHandler}>
                  <span className={clsx(s.icon, item.iconClassName)} aria-hidden={true} />
                  <Typography variant="text-m" as="span" className={s.itemLabel}>
                    {t(item.labelKey)}
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
                  {t('sidebar.logOut')}
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
