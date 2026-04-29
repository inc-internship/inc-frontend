'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { Button } from '@/shared/ui/Button'
import { HorizontalDots } from '@/features/post-actions/ui/icons/HorizontalDots'
import s from './PostActionsMenu.module.scss'

export type PostActionMenuItem = {
  key: string
  label: string
  onClick: () => void
  icon?: ReactNode
  disabled?: boolean
}

type Props = {
  items: PostActionMenuItem[]
  className?: string
  menuClassName?: string
  triggerClassName?: string
  ariaLabel?: string
}

export const PostActionsMenu = ({
  items,
  className,
  menuClassName,
  triggerClassName,
  ariaLabel = 'Post actions',
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node

      if (rootRef.current && !rootRef.current.contains(target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const hasItems = items.length > 0

  return (
    <div className={clsx(s.root, className)} ref={rootRef}>
      <Button
        iconOnly
        className={clsx(s.trigger, triggerClassName)}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        disabled={!hasItems}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <HorizontalDots />
      </Button>

      {isOpen && hasItems ? (
        <div className={clsx(s.menu, menuClassName)} role="menu" aria-label={ariaLabel}>
          {items.map(item => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={s.item}
              onClick={() => {
                if (item.disabled) {
                  return
                }
                item.onClick()
                setIsOpen(false)
              }}
            >
              {item.icon ? <span className={s.icon}>{item.icon}</span> : null}
              <span className={s.label}>{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
