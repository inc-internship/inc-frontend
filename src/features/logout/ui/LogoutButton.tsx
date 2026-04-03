'use client'

import React from 'react'
import { LogoutModal, useLogout } from '@/features/logout'
import { Button } from '@/shared/ui/Button'
import s from './LogoutButton.module.scss'
import { LogoutIcon } from '@/features/logout/ui/LogoutIcon/LogoutIcon'

type Props = {
  email: string
}

export const LogoutButton = ({ email }: Props) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const { handleLogout, isLoading } = useLogout()

  return (
    <>
      <Button onClick={() => setOpen(true)} className={s.button} disabled={isLoading}>
        <LogoutIcon />
        Log Out
      </Button>
      <LogoutModal
        open={open}
        email={email}
        onConfirm={handleLogout}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
