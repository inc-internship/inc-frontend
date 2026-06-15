'use client'

import { Gallery } from '@/widgets/gallery'
import { ProfileInfo } from '@/widgets/profile-info'
import s from './ProfilePage.module.scss'
import { Post, ResponseGetUserPosts } from '@/entities/post/api/post.types'
import { useHydratePostsCache } from '../model/useHydratePostsCache'
import { useGetProfileQuery } from '@/entities/profile'
import { ProfilePageSkeleton } from './ProfilePageSkeleton'

type Props = {
  userId: string
  postsData: ResponseGetUserPosts
  initialSelectedPost: Post | null
}

export const ProfilePage = ({ userId, postsData, initialSelectedPost }: Props) => {
  const isPostCacheHydrated = useHydratePostsCache({
    userId,
    initialPosts: postsData,
  })

  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery({ userId })

  if (!isPostCacheHydrated || isProfileLoading) {
    return <ProfilePageSkeleton />
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <ProfileInfo profile={profile} userName={postsData?.items[0]?.owner?.login} />
        <Gallery
          userId={userId}
          initialPosts={postsData}
          initialSelectedPost={initialSelectedPost}
          skipQuery={!isPostCacheHydrated}
        />
      </div>
    </div>
  )
}
