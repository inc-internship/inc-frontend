'use client'

import { ReactNode, useEffect } from 'react'
import Image from 'next/image'
import s from './BaseModal.module.scss'

type Props = {
  // Controls modal visibility.
  isOpen: boolean
  // Called when modal should close.
  onClose: () => void
  // Optional heading text in the header.
  title?: string
  // Main modal body content.
  children: ReactNode
  // Enables close on backdrop click.
  closeOnOverlay?: boolean
  // Optional image source for close icon.
  closeIconSrc?: string
  // Optional class for modal container customization.
  className?: string
}

export const BaseModal = ({
  isOpen,
  onClose,
  title,
  children,
  closeOnOverlay = true,
  closeIconSrc,
  className,
}: Props) => {
  useEffect(() => {
    if (!isOpen) return
    // Close modal on Escape key.
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    // Lock page scroll while modal is open.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onEsc)
    return () => {
      // Restore previous scroll state and cleanup listener.
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    // Backdrop click can close modal when enabled.
    <div className={s.overlay} onClick={closeOnOverlay ? onClose : undefined} role="presentation">
      {/* Stop click propagation so inner clicks do not close modal. */}
      <div
        className={`${s.modal} ${className ?? ''}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={s.header}>
          {title && <h2 className={s.title}>{title}</h2>}
          <button
            className={`${s.close} ${closeIconSrc ? s.closeWithIcon : ''}`}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            {closeIconSrc ? (
              <Image
                src={closeIconSrc}
                alt=""
                width={24}
                height={24}
                aria-hidden
                className={s.closeIcon}
              />
            ) : (
              'X'
            )}
          </button>
        </div>
        <div className={s.content}>{children}</div>
      </div>
    </div>
  )
}
