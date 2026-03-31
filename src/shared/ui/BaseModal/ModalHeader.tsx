'use client'

import clsx from 'clsx'
import { PartProps } from './types'
import s from './BaseModal.module.scss'

export const ModalHeader = ({ children, className, ...rest }: PartProps<'div'>) => (
  <div className={clsx(s.header, className)} {...rest}>
    {children}
  </div>
)
