'use client'

import React from 'react'
import { Checkbox } from '@/shared/ui/Checkbox'

// export function MainPage() {
//   return <h1>Main page</h1>
// }

export function MainPage() {
  const [checked, setChecked] = React.useState(false)

  return (
    <>
      <Checkbox
        checked={checked}
        label={'Check-box'}
        disabled={false}
        onCheckedChange={value => setChecked(value === true)}
      />
    </>
  )
}
