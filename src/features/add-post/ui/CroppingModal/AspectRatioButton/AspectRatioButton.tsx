'use client'

import { useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import { Button } from '@/shared/ui/Button'
import { ExpandIcon } from '@/shared/ui/icons/ExpandIcon'
import { ExpandOutlineIcon } from '@/shared/ui/icons/ExpandOutlineIcon'
import {
  ExpandedPanel,
  type AspectRatioOption,
  DEFAULT_ASPECT_RATIO_OPTIONS,
} from './ExpandedPanel/ExpandedPanel'
import s from './AspectRatioButton.module.scss'
import { useI18n } from '@/shared/i18n'

type Props = {
  options?: AspectRatioOption[]
  defaultValue?: string
  onChange?: (value: string) => void
}

export const AspectRatioButton = ({
  options = DEFAULT_ASPECT_RATIO_OPTIONS,
  defaultValue,
  onChange,
}: Props) => {
  const { t } = useI18n()
  const [isActive, setIsActive] = useState(false)
  const [selectedValue, setSelectedValue] = useState(
    defaultValue && options.some(option => option.value === defaultValue)
      ? defaultValue
      : (options[0]?.value ?? ''),
  )
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsActive(false)
      }
    }

    window.addEventListener('pointerdown', handleOutsideClick)
    return () => window.removeEventListener('pointerdown', handleOutsideClick)
  }, [])

  const toggleHandler = () => {
    setIsActive(prev => !prev)
  }

  const selectHandler = (value: string) => {
    setSelectedValue(value)
    onChange?.(value)
  }

  return (
    <div ref={rootRef} className={s.wrapper}>
      {isActive && (
        <ExpandedPanel
          id={panelId}
          options={options}
          value={selectedValue}
          onChange={selectHandler}
        />
      )}
      <Button
        aria-controls={isActive ? panelId : undefined}
        aria-expanded={isActive}
        aria-label={
          isActive ? t('common.closeAspectRatioControls') : t('common.openAspectRatioControls')
        }
        className={clsx(s.toggle, isActive && s.toggleActive)}
        iconOnly
        hasIconBackground
        onClick={toggleHandler}
      >
        {isActive ? <ExpandIcon /> : <ExpandOutlineIcon />}
      </Button>
    </div>
  )
}
