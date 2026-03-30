'use client'

import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { PartProps } from './types'
import s from './BaseModal.module.scss'

export const ModalDescription = ({ children, className, ...rest }: PartProps<'p'>) => (
  <Dialog.Description asChild>
    <p className={clsx(s.description, className)} {...rest}>
      {children}
    </p>
  </Dialog.Description>
)
