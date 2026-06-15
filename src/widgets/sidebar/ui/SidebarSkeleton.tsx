'use client'

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import s from './SidebarSkeleton.module.scss'

const NAV_ITEMS_COUNT = 6

export const SidebarSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <aside className={s.sidebar}>
        <nav className={s.navigation}>
          {Array.from({ length: NAV_ITEMS_COUNT }).map((_, index) => (
            <Skeleton key={index} className={s.item} />
          ))}
        </nav>
      </aside>
    </SkeletonTheme>
  )
}
