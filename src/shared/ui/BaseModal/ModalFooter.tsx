'use client'

import clsx from 'clsx'
import { PartProps } from './types'
import s from './BaseModal.module.scss'

export const ModalFooter = ({ children, className, ...rest }: PartProps<'div'>) => (
  <div className={clsx(s.footer, className)} {...rest}>
    {children}
  </div>
)
