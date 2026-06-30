import s from './PostImage.module.scss'
import { ImageSlide, ImageSlider } from '@/shared/ui/ImageSlider'
import { Typography } from '@/shared/ui/Typography'
import { Image } from '@/entities/post'
import { useI18n } from '@/shared/i18n'

type Props = {
  images: Image[]
}

export const PostImage = ({ images }: Props) => {
  const { t } = useI18n()

  const slides: ImageSlide[] = images.map(image => ({
    ...image,
    src: image.url,
    alt: t('post.imageAlt'),
  }))
  const hasImages = slides.length > 0

  return (
    <div className={s.container}>
      {hasImages ? (
        <ImageSlider
          slides={slides}
          imageViewportClassName={s.imageWrapper}
          imageClassName={s.image}
        />
      ) : (
        <div className={s.imageFallback}>
          <Typography variant="text-s">{t('main.noImage')}</Typography>
        </div>
      )}
    </div>
  )
}
