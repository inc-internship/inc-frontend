'use client'

import * as React from 'react'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import clsx from 'clsx'

import s from './Avatar.module.scss'

type AvatarSize = 'small' | 'large'

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & { size?: AvatarSize }
>(({ className, size = 'large', ...props }, ref) => (
  <AvatarPrimitive.Root
    className={clsx(s.avatar, size && s[`avatar--${size}`], className)}
    ref={ref}
    {...props}
  />
))

Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image className={clsx(s.avatarImage, className)} ref={ref} {...props} />
))

AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback className={clsx(s.avatarFallback, className)} ref={ref} {...props} />
))

AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarFallback, AvatarImage }
