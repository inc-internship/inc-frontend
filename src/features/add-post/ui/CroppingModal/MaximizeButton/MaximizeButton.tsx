'use client'

import { FocusEvent, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import { MaximizeIcon } from '@/shared/ui/icons/MaximizeIcon'
import { MaximizeOutlineIcon } from '@/shared/ui/icons/MaximizeOutlineIcon'
import { Button } from '@/shared/ui/Button'
import { ExpandedPanel } from './ExpandedPanel/ExpandedPanel'
import s from './MaximizeButton.module.scss'
import { useI18n } from '@/shared/i18n'

type Props = {
  defaultValue?: number
  onChange?: (value: number) => void
}

const MIN_VALUE = 0
const MAX_VALUE = 100

const clampValue = (value: number) => Math.min(Math.max(value, MIN_VALUE), MAX_VALUE)

export const MaximizeButton = ({ defaultValue = 0, onChange }: Props) => {
  const { t } = useI18n()
  const [isActive, setIsActive] = useState(false)
  const [value, setValue] = useState(() => clampValue(defaultValue))
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  const toggleHandler = () => {
    setIsActive(prev => !prev)
  }

  const blurHandler = (event: FocusEvent<HTMLDivElement>) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
      setIsActive(false)
    }
  }

  const changeHandler = (nextValue: number) => {
    setValue(nextValue)
    onChange?.(nextValue)
  }

  return (
    <div ref={rootRef} className={s.wrapper} onBlur={blurHandler}>
      {isActive && <ExpandedPanel id={panelId} value={value} onChange={changeHandler} />}
      <Button
        aria-controls={isActive ? panelId : undefined}
        aria-expanded={isActive}
        aria-label={isActive ? t('common.closeZoomControls') : t('common.openZoomControls')}
        className={clsx(s.toggle, isActive && s.toggleActive)}
        iconOnly
        hasIconBackground
        onClick={toggleHandler}
      >
        {isActive ? <MaximizeIcon /> : <MaximizeOutlineIcon />}
      </Button>
    </div>
  )
}
