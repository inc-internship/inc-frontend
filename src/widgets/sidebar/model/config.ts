import { SidebarNavItem } from './types'

export const PRIMARY_NAV_ITEMS: SidebarNavItem[] = [
  {
    id: 'feed',
    label: 'Feed',
    href: '/',
    icon: 'homeOutline',
    activeIcon: 'home',
  },
  {
    id: 'create',
    label: 'Create',
    href: '/create',
    icon: 'plusSquareOutline',
    activeIcon: 'plusSquare',
  },
  {
    id: 'my-profile',
    label: 'My Profile',
    href: '/my-profile',
    icon: 'personOutline',
    activeIcon: 'person',
  },
  {
    id: 'messenger',
    label: 'Messenger',
    href: '/messenger',
    icon: 'messageCircleOutline',
    activeIcon: 'messageCircle',
  },
  {
    id: 'search',
    label: 'Search',
    href: '/search',
    icon: 'searchOutline',
    activeIcon: 'search',
  },
]

export const SECONDARY_NAV_ITEMS: SidebarNavItem[] = [
  {
    id: 'statistics',
    label: 'Statistics',
    href: '/statistics',
    icon: 'trendingUpOutline',
    activeIcon: 'trendingUp',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    href: '/favorites',
    icon: 'bookmarkOutline',
    activeIcon: 'bookmark',
  },
]
