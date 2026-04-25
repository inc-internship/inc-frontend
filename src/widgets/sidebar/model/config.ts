import { SidebarNavItem } from './types'

export const PRIMARY_NAV_ITEMS: SidebarNavItem[] = [
  {
    id: 'feed',
    labelKey: 'sidebar.feed',
    href: '/',
    icon: 'homeOutline',
    activeIcon: 'home',
  },
  {
    id: 'create',
    labelKey: 'sidebar.create',
    href: '/create',
    icon: 'plusSquareOutline',
    activeIcon: 'plusSquare',
  },
  {
    id: 'my-profile',
    labelKey: 'sidebar.myProfile',
    href: '/my-profile',
    icon: 'personOutline',
    activeIcon: 'person',
    disabled: true,
  },
  {
    id: 'messenger',
    labelKey: 'sidebar.messenger',
    href: '/messenger',
    icon: 'messageCircleOutline',
    activeIcon: 'messageCircle',
    disabled: true,
  },
  {
    id: 'search',
    labelKey: 'sidebar.search',
    href: '/search',
    icon: 'searchOutline',
    activeIcon: 'search',
    disabled: true,
  },
]

export const SECONDARY_NAV_ITEMS: SidebarNavItem[] = [
  {
    id: 'statistics',
    labelKey: 'sidebar.statistics',
    href: '/statistics',
    icon: 'trendingUpOutline',
    activeIcon: 'trendingUp',
    disabled: true,
  },
  {
    id: 'favorites',
    labelKey: 'sidebar.favorites',
    href: '/favorites',
    icon: 'bookmarkOutline',
    activeIcon: 'bookmark',
    disabled: true,
  },
]
