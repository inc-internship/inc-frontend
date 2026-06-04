'use client'

import {
  forwardRef,
  type ComponentRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from 'react'

import { Root, Image, Fallback } from '@radix-ui/react-avatar'

import clsx from 'clsx'

import avatarFallback from './AvatarFallback.svg'
import s from './Avatar.module.scss'

type AvatarImageProps = ComponentPropsWithoutRef<typeof Image>
type AvatarProps = Omit<ComponentPropsWithoutRef<typeof Root>, 'children'> & {
  alt?: string
  fallbackSrc?: string
  imageClassName?: string
  imageProps?: Omit<AvatarImageProps, 'alt' | 'className' | 'src'>
  size?: number
  src: AvatarImageProps['src'] | null
}
type AvatarFallbackStyle = CSSProperties & {
  '--avatar-fallback-src': string
}

const DEFAULT_SIZE = 204
const DEFAULT_FALLBACK_SRC = avatarFallback.src

const Avatar = forwardRef<ComponentRef<typeof Root>, AvatarProps>((props, ref) => {
  const {
    alt = 'Avatar',
    className,
    fallbackSrc = DEFAULT_FALLBACK_SRC,
    imageClassName,
    imageProps,
    size = DEFAULT_SIZE,
    src,
    style,
    ...rootProps
  } = props
  const fallbackStyle: AvatarFallbackStyle = {
    ...style,
    '--avatar-fallback-src': `url("${fallbackSrc}")`,
    height: size,
    width: size,
  }

  return (
    <Root className={clsx(s.avatar, className)} ref={ref} style={fallbackStyle} {...rootProps}>
      {src && (
        <Image
          className={clsx(s.avatarImage, imageClassName)}
          {...imageProps}
          alt={alt}
          src={src}
        />
      )}
      <Fallback aria-label={alt} className={s.avatarFallback} />
    </Root>
  )
})

Avatar.displayName = Root.displayName

export { Avatar }
