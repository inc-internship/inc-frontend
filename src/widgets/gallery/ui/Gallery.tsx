import Image from 'next/image'
import s from './Gallery.module.scss'

type Props = {
  images: string[]
}

export const Gallery = ({ images }: Props) => (
  <section className={s.container}>
    {images.map((image, index) => (
      <div key={index} className={s.card}>
        <Image className={s.image} src={image} fill alt="Mount" />
      </div>
    ))}
  </section>
)
