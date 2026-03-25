'use client'

import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { ComponentPropsWithoutRef, JSX, ReactNode } from 'react'
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

type PartProps<T extends keyof JSX.IntrinsicElements> = ComponentPropsWithoutRef<T> & {
  children: ReactNode
}

export const ModalHeader = ({ children, className, ...rest }: PartProps<'div'>) => (
  <div className={clsx(s.header, className)} {...rest}>
    {children}
  </div>
)

export const ModalTitle = ({ children, className, ...rest }: PartProps<'h2'>) => (
  <Dialog.Title asChild>
    <h2 className={clsx(s.title, className)} {...rest}>
      {children}
    </h2>
  </Dialog.Title>
)

export const ModalDescription = ({ children, className, ...rest }: PartProps<'p'>) => (
  <Dialog.Description asChild>
    <p className={clsx(s.description, className)} {...rest}>
      {children}
    </p>
  </Dialog.Description>
)

export const ModalBody = ({ children, className, ...rest }: PartProps<'div'>) => (
  <div className={clsx(s.body, className)} {...rest}>
    {children}
  </div>
)

export const ModalFooter = ({ children, className, ...rest }: PartProps<'div'>) => (
  <div className={clsx(s.footer, className)} {...rest}>
    {children}
  </div>
)

type ModalCloseProps = ComponentPropsWithoutRef<'button'> & {
  children?: ReactNode
}

export const ModalClose = ({ children, className, ...rest }: ModalCloseProps) => (
  <Dialog.Close asChild>
    <button className={clsx(s.close, className)} {...rest}>
      {children ?? 'X'}
    </button>
  </Dialog.Close>
)
