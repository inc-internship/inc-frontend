'use client'

import s from './ProfileSettingsPage.module.scss'
import { ProfileInformation } from '@/views/profile-settings/ui/profile-information/ProfileInformation'
import { Tabs } from '@/shared/ui/Tabs'
import { useState } from 'react'
import { ProfileManagement } from '@/views/profile-settings/ui/profile-management/ProfileManagement'
import { ProfileDevices } from '@/views/profile-settings/ui/profile-devices/ProfileDevices'
import { ProfilePayments } from '@/views/profile-settings/ui/profile-payments/ProfilePayments'

export const ProfileSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('1')

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

  const onValueChangeHandler = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className={s.container}>
      <Tabs className={s.tabs} tabs={tabs} value={activeTab} onValueChange={onValueChangeHandler} />
    </div>
  )
}
