'use client'

import clsx from 'clsx'
import {
  ComponentPropsWithoutRef,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  JSX,
} from 'react'
import s from './BaseModal.module.scss'

const ModalContext = createContext<(() => void) | null>(null)

type BaseModalProps = ComponentPropsWithoutRef<'div'> & {
  /** Controls modal visibility. */
  open: boolean
  /** Called when modal open state changes. */
  onOpenChange: (open: boolean) => void
  /** Content rendered inside modal. */
  children?: ReactNode
  /** Enables close on backdrop click. */
  closeOnOverlay?: boolean
  /** Class name for overlay node. */
  overlayClassName?: string
}

export const BaseModal = ({
  open,
  onOpenChange,
  children,
  closeOnOverlay = true,
  overlayClassName,
  className,
  onClick,
  ...rest
}: BaseModalProps) => {
  const close = useMemo(() => () => onOpenChange(false), [onOpenChange])

  useEffect(() => {
    if (!open) return
    /** Close on Escape key. */
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && close()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onEsc)

    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onEsc)
    }
  }, [open, close])

  if (!open) return null

  const handleOverlayClick: ComponentPropsWithoutRef<'div'>['onClick'] = event => {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (closeOnOverlay && event.target === event.currentTarget) close()
  }

  return (
    <div
      className={clsx(s.overlay, overlayClassName)}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div className={clsx(s.modal, className)} role="dialog" aria-modal="true" {...rest}>
        <ModalContext.Provider value={close}>{children}</ModalContext.Provider>
      </div>
    </div>
  )
}

type PartProps<T extends keyof JSX.IntrinsicElements> = ComponentPropsWithoutRef<T> & {
  children: ReactNode
}

/** Modal header wrapper. */
export const ModalHeader = ({ children, className, ...rest }: PartProps<'div'>) => (
  <div className={clsx(s.header, className)} {...rest}>
    {children}
  </div>
)

/** Modal title element. */
export const ModalTitle = ({ children, className, ...rest }: PartProps<'h2'>) => (
  <h2 className={clsx(s.title, className)} {...rest}>
    {children}
  </h2>
)

/** Modal content wrapper. */
export const ModalBody = ({ children, className, ...rest }: PartProps<'div'>) => (
  <div className={clsx(s.body, className)} {...rest}>
    {children}
  </div>
)

/** Modal footer wrapper. */
export const ModalFooter = ({ children, className, ...rest }: PartProps<'div'>) => (
  <div className={clsx(s.footer, className)} {...rest}>
    {children}
  </div>
)

type ModalCloseProps = ComponentPropsWithoutRef<'button'> & {
  /** Optional custom close content. */
  children?: ReactNode
}

/** Modal close button bound to modal context. */
export const ModalClose = ({ children, className, onClick, ...rest }: ModalCloseProps) => {
  const close = useContext(ModalContext)

  const handleClick: ComponentPropsWithoutRef<'button'>['onClick'] = event => {
    onClick?.(event)
    if (event.defaultPrevented) return
    close?.()
  }

  return (
    <button
      type="button"
      className={clsx(s.close, className)}
      aria-label="Close modal"
      onClick={handleClick}
      {...rest}
    >
      {children ?? 'X'}
    </button>
  )
}
