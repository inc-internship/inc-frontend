'use client'

import { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from 'react'

import { Root, Image, Fallback } from '@radix-ui/react-avatar'

import clsx from 'clsx'

import s from './Avatar.module.scss'

type AvatarSize = 'small' | 'large'

const Avatar = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> & { size?: AvatarSize }
>(({ className, size = 'large', ...props }, ref) => (
  <Root className={clsx(s.avatar, size && s[`avatar--${size}`], className)} ref={ref} {...props} />
))

Avatar.displayName = Root.displayName

const AvatarImage = forwardRef<ComponentRef<typeof Image>, ComponentPropsWithoutRef<typeof Image>>(
  ({ className, ...props }, ref) => (
    <Image className={clsx(s.avatarImage, className)} ref={ref} {...props} />
  ),
)

AvatarImage.displayName = Image.displayName

const AvatarFallback = forwardRef<
  ComponentRef<typeof Fallback>,
  ComponentPropsWithoutRef<typeof Fallback>
>(({ className, ...props }, ref) => (
  <Fallback className={clsx(s.avatarFallback, className)} ref={ref} {...props} />
))

AvatarFallback.displayName = Fallback.displayName

export { Avatar, AvatarFallback, AvatarImage }
