import Image from 'next/image'
import s from './Gallery.module.scss'
import { useParams } from 'next/navigation'
import { useGetUserPostsQuery } from '@/entities/post'
import { Typography } from '@/shared/ui/Typography'

export const Gallery = () => {
  const params = useParams()
  const userId = String(params.slug)

  const { data, isLoading } = useGetUserPostsQuery({ userId })

  if (isLoading) return <h1>Loading...</h1>

  console.log(data)

  const hasItems = data?.items.length

  if (!hasItems) {
    return (
      <section className={s.emptyState}>
        <Typography variant="h2" className={s.noPosts}>
          Oops! No posts yet
        </Typography>
      </section>
    )
  }

  return (
    <section className={s.container}>
      {data?.items.map(image => (
        <div key={image.id} className={s.card}>
          <Image className={s.image} src={image.images[0].url} fill alt={image.images[0].id} />
        </div>
      ))}
    </section>
  )
}
