export type SidebarItemId =
  | 'feed'
  | 'create'
  | 'my-profile'
  | 'messenger'
  | 'search'
  | 'statistics'
  | 'favorites'

export type SidebarIconName =
  | 'homeOutline'
  | 'home'
  | 'plusSquareOutline'
  | 'plusSquare'
  | 'personOutline'
  | 'person'
  | 'messageCircleOutline'
  | 'messageCircle'
  | 'searchOutline'
  | 'search'
  | 'trendingUpOutline'
  | 'trendingUp'
  | 'bookmarkOutline'
  | 'bookmark'
  | 'logOutOutline'

export type SidebarNavItem = {
  id: SidebarItemId
  label: string
  href: string
  icon: SidebarIconName
  activeIcon?: SidebarIconName
  disabled?: boolean
}
