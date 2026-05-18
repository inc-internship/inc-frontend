'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Post } from '@/entities/post/api/post.types'
import { Typography } from '@/shared/ui/Typography'
import { ImageOutlineIcon } from '@/shared/ui/icons'
import s from './Gallery.module.scss'

type Props = {
  post: Post
  noImageLabel: string
  onClick: (post: Post) => void
}

export const GalleryCard = ({ post, noImageLabel, onClick }: Props) => {
  const image = post.images[0]
  const [imageLoadFailed, setImageLoadFailed] = useState(false)

  if (!image || imageLoadFailed) {
    return (
      <div onClick={() => onClick(post)} className={s.card}>
        <div className={s.imageFallback} aria-label={noImageLabel}>
          <ImageOutlineIcon />
          <Typography variant="text-s" className={s.imageFallbackText}>
            {noImageLabel}
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div onClick={() => onClick(post)} className={s.card}>
      <Image
        className={s.image}
        src={image.url}
        unoptimized
        fill
        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 228px"
        alt={image.id}
        onError={() => setImageLoadFailed(true)}
      />
    </div>
  )
}
