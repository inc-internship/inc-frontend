'use client'

import s from './ProfileSettingsPage.module.scss'
import { ProfileInformation } from '@/views/profile-settings/ui/profile-information/ProfileInformation'
import { Tabs } from '@/shared/ui/Tabs'
import { useMemo, useSyncExternalStore } from 'react'
import { AccountManagementPage } from '@/views/profile-settings/ui/account-management/AccountManagementPage'
import { ProfileDevices } from '@/views/profile-settings/ui/profile-devices/ProfileDevices'
import { ProfilePayments } from '@/views/profile-settings/ui/profile-payments/ProfilePayments'
import { PROFILE_SETTINGS_ACTIVE_TAB } from '@/views/profile-settings/model/local-storage-tab-value'
import { Typography } from '@/shared/ui/Typography'
import { ArrowBackIcon } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { useRouter } from 'next/navigation'

const DEFAULT_ACTIVE_TAB = '1'
const ACTIVE_TAB_CHANGE_EVENT = 'profile-settings-active-tab-change'

const getActiveTabSnapshot = () => {
  return localStorage.getItem(PROFILE_SETTINGS_ACTIVE_TAB) ?? DEFAULT_ACTIVE_TAB
}

const getServerActiveTabSnapshot = () => DEFAULT_ACTIVE_TAB

const subscribeToActiveTab = (onStoreChange: () => void) => {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener(ACTIVE_TAB_CHANGE_EVENT, onStoreChange)

  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener(ACTIVE_TAB_CHANGE_EVENT, onStoreChange)
  }
}

export const ProfileSettingsPage = () => {
  const router = useRouter()

  const tabs = useMemo(
    () => [
      {
        content: <ProfileInformation />,
        title: 'General Information',
        value: '1',
      },
      {
        content: <ProfileDevices />,
        title: 'Devices',
        value: '2',
      },
      {
        content: <AccountManagementPage />,
        title: 'Account Management',
        value: '3',
      },
      {
        content: <ProfilePayments />,
        title: 'My Payments',
        value: '4',
      },
    ],
    [],
  )

  const activeTab = useSyncExternalStore(
    subscribeToActiveTab,
    getActiveTabSnapshot,
    getServerActiveTabSnapshot,
  )

  const onValueChangeHandler = (value: string) => {
    localStorage.setItem(PROFILE_SETTINGS_ACTIVE_TAB, value)
    window.dispatchEvent(new Event(ACTIVE_TAB_CHANGE_EVENT))
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className={s.container}>
      <Typography variant="h2" className={s.profileSettingsTitle}>
        Profile Settings
      </Typography>
      <Button iconOnly className={s.backButton} onClick={handleBack}>
        <ArrowBackIcon />
      </Button>
      <Tabs className={s.tabs} tabs={tabs} value={activeTab} onValueChange={onValueChangeHandler} />
    </div>
  )
}
