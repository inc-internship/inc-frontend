'use client'

import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import s from './BaseModal.module.scss'

type ModalCloseProps = ComponentPropsWithoutRef<'button'> & {
  children?: ReactNode
}

export const ModalClose = ({ children, className, ...rest }: ModalCloseProps) => (
  <Dialog.Close asChild>
    <button type="button" className={clsx(s.close, className)} {...rest}>
      {children ?? 'X'}
    </button>
  </Dialog.Close>
)
