'use client'

import { ResponseGetUserPosts } from '@/entities/post/api/post.types'
import { useAppDispatch, useAppSelector } from '@/shared/store'
import { useEffect, useRef } from 'react'
import { postApi } from '@/entities/post/api/post.api'

type Props = {
  userId: string
  initialPosts: ResponseGetUserPosts
}

export function useHydratePostsCache({ userId, initialPosts }: Props) {
  const dispatch = useAppDispatch()
  const hydratedUserIdRef = useRef<string | null>(null)

  const cachedPosts = useAppSelector(postApi.endpoints.getUserPosts.select({ userId }))

  useEffect(() => {
    if (hydratedUserIdRef.current === userId) return

    if (cachedPosts.data) {
      hydratedUserIdRef.current = userId
      return
    }
    dispatch(
      postApi.util.upsertQueryEntries([
        {
          endpointName: 'getUserPosts',
          arg: { userId },
          value: {
            pages: [initialPosts],
            pageParams: [null],
          },
        },
      ]),
    )

    hydratedUserIdRef.current = userId
  }, [dispatch, userId, initialPosts, cachedPosts.data])

  return Boolean(cachedPosts.data)
}
