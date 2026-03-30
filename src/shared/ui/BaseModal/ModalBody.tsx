'use client'

import clsx from 'clsx'
import { PartProps } from './types'
import s from './BaseModal.module.scss'

export const ModalBody = ({ children, className, ...rest }: PartProps<'div'>) => (
  <div className={clsx(s.body, className)} {...rest}>
    {children}
  </div>
)
