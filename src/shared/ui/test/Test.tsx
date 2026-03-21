'use client'

import React from 'react'
import s from './Test.module.scss'
export const Test = () => {
  const [state, setState] = React.useState(0)

  return (
    <div className={s.testWrapper}>
      <p className={s.testWrapperState}>{state}</p>
      <button onClick={() => setState(prev => prev + 1)}>+</button>
      <button onClick={() => setState(prev => prev - 1)}>+</button>
    </div>
  )
}
