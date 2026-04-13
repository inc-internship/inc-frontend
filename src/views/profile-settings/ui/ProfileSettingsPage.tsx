'use client'

import s from './ProfileSettingsPage.module.scss'
import { ProfileInformation } from '@/views/profile-settings/ui/profile-information/ProfileInformation'
import { Tabs } from '@/shared/ui/Tabs'
import { useState } from 'react'
import { ProfileManagement } from '@/views/profile-settings/ui/profile-management/ProfileManagement'
import { ProfileDevices } from '@/views/profile-settings/ui/profile-devices/ProfileDevices'
import { ProfilePayments } from '@/views/profile-settings/ui/profile-payments/ProfilePayments'
import { PROFILE_SETTINGS_ACTIVE_TAB } from '@/views/profile-settings/model/local-storage-tab-value'
import { PageSpinner } from '@/shared/ui/Spinner'
import { Typography } from '@/shared/ui/Typography'
import { ArrowBackIcon } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { useRouter } from 'next/navigation'

const tabs = [
  {
    content: <ProfileInformation />,
    title: 'GeneralInformation',
    value: '1',
  },
  {
    content: <ProfileDevices />,
    title: 'Devices',
    value: '2',
  },
  {
    content: <ProfileManagement />,
    title: 'AccountManagement',
    value: '3',
  },
  {
    content: <ProfilePayments />,
    title: 'MyPayments',
    value: '4',
  },
]

export const ProfileSettingsPage = () => {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(PROFILE_SETTINGS_ACTIVE_TAB) ?? '1'
  })

  const onValueChangeHandler = (value: string) => {
    setActiveTab(value)
    localStorage.setItem(PROFILE_SETTINGS_ACTIVE_TAB, value)
  }

  const handleBack = () => {
    router.back()
  }

  if (activeTab === null) {
    return <PageSpinner />
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
