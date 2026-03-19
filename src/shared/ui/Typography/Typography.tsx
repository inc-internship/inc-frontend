import clsx from 'clsx'
import { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from 'react'
import type { TypographyVariant } from './typography.types'
import s from './Typography.module.scss'

type VariantConfig = {
  defaultTag: keyof JSX.IntrinsicElements
  className: string
}

type VariantToTagMap = {
  large: 'h1'
  h1: 'h1'
  h2: 'h2'
  h3: 'h3'
  'text-l': 'p'
  'text-l-bold': 'p'
  'text-m': 'p'
  'text-m-medium': 'p'
  'text-m-bold': 'p'
  'text-s': 'p'
  'text-s-semibold': 'p'
  'link-m': 'a'
  'link-s': 'a'
}

type VariantDefaultTag<V extends TypographyVariant> = VariantToTagMap[V]

const VARIANTS: Record<TypographyVariant, VariantConfig> = {
  large: { defaultTag: 'h1', className: s.textLarge },

  h1: { defaultTag: 'h1', className: s.textH1 },
  h2: { defaultTag: 'h2', className: s.textH2 },
  h3: { defaultTag: 'h3', className: s.textH3 },

  'text-l': { defaultTag: 'p', className: s.textL },
  'text-l-bold': { defaultTag: 'p', className: s.textLBold },

  'text-m': { defaultTag: 'p', className: s.textM },
  'text-m-medium': { defaultTag: 'p', className: s.textMMedium },
  'text-m-bold': { defaultTag: 'p', className: s.textMBold },

  'text-s': { defaultTag: 'p', className: s.textS },
  'text-s-semibold': { defaultTag: 'p', className: s.textSSemibold },

  'link-m': { defaultTag: 'a', className: s.textLinkM },
  'link-s': { defaultTag: 'a', className: s.textLinkS },
}

type Props<V extends TypographyVariant, T extends ElementType = VariantDefaultTag<V>> = {
  variant: V
  as?: T
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export const Typography = <V extends TypographyVariant, T extends ElementType = VariantDefaultTag<V>>({
  variant,
  as,
  className,
  children,
  ...props
}: Props<V, T>) => {
  const { defaultTag, className: variantClass } = VARIANTS[variant]
  const Component = (as ?? defaultTag) as ElementType

  return (
    <Component className={clsx(variantClass, className)} {...props}>
      {children}
    </Component>
  )
}
