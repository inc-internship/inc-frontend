'use client'

import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { PartProps } from './types'
import s from './BaseModal.module.scss'

export const ModalTitle = ({ children, className, ...rest }: PartProps<'h2'>) => (
  <Dialog.Title asChild>
    <h2 className={clsx(s.title, className)} {...rest}>
      {children}
    </h2>
  </Dialog.Title>
)
