'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { MaximizeIcon } from '@/shared/ui/icons/MaximizeIcon'
import { MaximizeOutlineIcon } from '@/shared/ui/icons/MaximizeOutlineIcon'
import { Button } from '@/shared/ui/Button'
import { ExpandedPanel } from './ExpandedPanel/ExpandedPanel'
import s from './MaximizeButton.module.scss'

export const MaximizeButton = () => {
  const [isActive, setIsActive] = useState(false)

  const toggleHandler = () => {
    setIsActive(prev => !prev)
  }

  return (
    <div className={s.wrapper}>
      {isActive && <ExpandedPanel />}
      <Button
        aria-label={isActive ? 'Close zoom controls' : 'Open zoom controls'}
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
