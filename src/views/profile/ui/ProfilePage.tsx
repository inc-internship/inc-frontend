'use client'

import { Gallery } from '@/widgets/gallery'
import { ProfileInfo } from '@/widgets/profile-info'
import s from './ProfilePage.module.scss'
import { Post, ResponseGetUserPosts } from '@/entities/post/api/post.types'
import { useHydratePostsCache } from '../model/useHydratePostsCache'
import { useGetProfileQuery } from '@/entities/profile'
import { ProfilePageSkeleton } from './ProfilePageSkeleton'
import { postApi } from '@/entities/post/api/post.api'

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    postApi.useGetUserPostsInfiniteQuery({ userId }, { skip: !isPostCacheHydrated })

  if (!isPostCacheHydrated || isProfileLoading) {
    return <ProfilePageSkeleton />
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <ProfileInfo
          userId={userId}
          profile={profile}
          userName={postsData?.items[0]?.owner?.login}
        />
        <Gallery
          data={data}
          ferchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          userId={userId}
          initialPosts={postsData}
          initialSelectedPost={initialSelectedPost}
          skipQuery={!isPostCacheHydrated}
        />
      </div>
    </div>
  )
}
