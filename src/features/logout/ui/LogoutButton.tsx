'use client'

import React from 'react'
import { LogoutModal, useLogout } from '@/features/logout'
import { Button } from '@/shared/ui/Button'
import s from './LogoutButton.module.scss'

export const LogoutButton = () => {
  const [open, setOpen] = React.useState<boolean>(false)
  const { handleLogout, isLoading } = useLogout()

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setOpen(true)}
        className={s.button}
        disabled={isLoading}
      >
        Log Out
      </Button>
      <LogoutModal
        open={open}
        isLoading={isLoading}
        onConfirm={handleLogout}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
