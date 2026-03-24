import s from './StatusWidget.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import Image, { StaticImageData } from 'next/image'
import clsx from 'clsx'

type Props = ComponentPropsWithoutRef<'div'> & {
  title: string
  text: string
  children: ReactNode
  imageSrc: StaticImageData
  imageAlt: string
  childrenClassName?: string
  imageWrapperClassName?: string
}

export const StatusWidget = ({
  title,
  text,
  children,
  imageSrc,
  imageAlt,
  childrenClassName,
  imageWrapperClassName,
  ...rest
}: Props) => {
  return (
    <div className={s.container} {...rest}>
      <div className={s.textContainer}>
        <Typography variant="h1">{title}</Typography>

        <Typography variant="text-l">{text}</Typography>
      </div>

      <div className={clsx(s.childrenContainer, childrenClassName)}>{children}</div>

      <div className={clsx(s.imageWrapper, imageWrapperClassName)}>
        <Image alt={imageAlt} src={imageSrc} className={s.image} />
      </div>
    </div>
  )
}
