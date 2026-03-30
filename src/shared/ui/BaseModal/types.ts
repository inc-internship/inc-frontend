import { ComponentPropsWithoutRef, JSX, ReactNode } from 'react'

export type PartProps<T extends keyof JSX.IntrinsicElements> = ComponentPropsWithoutRef<T> & {
  children: ReactNode
}
