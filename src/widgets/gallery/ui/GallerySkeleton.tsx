'use client'

import s from './Gallery.module.scss'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const SKELETON_POSTS_COUNT = 8

export const GallerySkeleton = () => {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <section className={s.container} aria-label="Loading posts">
        {Array.from({ length: SKELETON_POSTS_COUNT }).map((_, index) => (
          <div key={index} className={s.card}>
            <Skeleton className={s.skeleton} height="100%" width="100%" />
          </div>
        ))}
      </section>
    </SkeletonTheme>
  )
}
