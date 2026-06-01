import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { GallerySkeleton } from '@/widgets/gallery/ui/GallerySkeleton'
import s from './ProfilePageSkeleton.module.scss'

export const ProfilePageSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className={s.page}>
        <div className={s.container}>
          <section className={s.header} aria-label="Loading profile header">
            <div className={s.avatar}>
              <Skeleton circle className={s.avatarSkeleton} />
            </div>

            <div className={s.top}>
              <div className={s.title}>
                <Skeleton className={s.titleSkeleton} height="100%" width="100%" />
              </div>
              <div className={s.button}>
                <Skeleton className={s.buttonSkeleton} height="100%" width="100%" />
              </div>
            </div>

            <div className={s.statistics}>
              <div className={s.stat}>
                <div className={`${s.statNumber} ${s.statNumberFollowing}`}>
                  <Skeleton className={s.statNumberSkeleton} height="100%" width="100%" />
                </div>
                <div className={`${s.statLabel} ${s.statLabelFollowing}`}>
                  <Skeleton className={s.statLabelSkeleton} height="100%" width="100%" />
                </div>
              </div>

              <div className={s.stat}>
                <div className={`${s.statNumber} ${s.statNumberFollowers}`}>
                  <Skeleton className={s.statNumberSkeleton} height="100%" width="100%" />
                </div>
                <div className={`${s.statLabel} ${s.statLabelFollowers}`}>
                  <Skeleton className={s.statLabelSkeleton} height="100%" width="100%" />
                </div>
              </div>

              <div className={s.stat}>
                <div className={`${s.statNumber} ${s.statNumberPublications}`}>
                  <Skeleton className={s.statNumberSkeleton} height="100%" width="100%" />
                </div>
                <div className={`${s.statLabel} ${s.statLabelPublications}`}>
                  <Skeleton className={s.statLabelSkeleton} height="100%" width="100%" />
                </div>
              </div>
            </div>

            <div className={s.description}>
              <div className={s.descriptionLineWrap}>
                <Skeleton
                  className={`${s.descriptionLine} ${s.descriptionLineFirst}`}
                  height="100%"
                />
              </div>
              <div className={s.descriptionLineWrap}>
                <Skeleton
                  className={`${s.descriptionLine} ${s.descriptionLineSecond}`}
                  height="100%"
                />
              </div>
              <div className={s.descriptionLineWrap}>
                <Skeleton
                  className={`${s.descriptionLine} ${s.descriptionLineThird}`}
                  height="100%"
                />
              </div>
            </div>
          </section>

          <GallerySkeleton />
        </div>
      </div>
    </SkeletonTheme>
  )
}
