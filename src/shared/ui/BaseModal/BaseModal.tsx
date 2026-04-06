'use client'

import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import s from './BaseModal.module.scss'

type ModalSize = 'lg' | 'md' | 'sm' | 'xs'

type BaseModalProps = ComponentPropsWithoutRef<'div'> & {
  open: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
  closeOnOverlay?: boolean
  overlayClassName?: string
  size?: ModalSize
}

export const BaseModal = ({
  open,
  onOpenChange,
  children,
  closeOnOverlay = true,
  overlayClassName,
  className,
  size = 'md',
  ...rest
}: BaseModalProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className={clsx(s.overlay, overlayClassName)} />
      <Dialog.Content
        className={clsx(s.modal, s[size], className)}
        onPointerDownOutside={event => {
          if (!closeOnOverlay) event.preventDefault()
        }}
        {...rest}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)
