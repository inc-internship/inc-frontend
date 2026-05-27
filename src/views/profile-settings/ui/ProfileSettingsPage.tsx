'use client'

import s from './ProfileSettingsPage.module.scss'
import { ProfileInformation } from '@/views/profile-settings/ui/profile-information/ProfileInformation'
import { Tabs } from '@/shared/ui/Tabs'
import { useState } from 'react'
import { AccountManagementPage } from '@/views/profile-settings/ui/account-management/AccountManagementPage'
import { ProfileDevices } from '@/views/profile-settings/ui/profile-devices/ProfileDevices'
import { ProfilePayments } from '@/views/profile-settings/ui/profile-payments/ProfilePayments'
import { PROFILE_SETTINGS_ACTIVE_TAB } from '@/views/profile-settings/model/local-storage-tab-value'
import { PageSpinner } from '@/shared/ui/Spinner'
import { Typography } from '@/shared/ui/Typography'
import { ArrowBackIcon } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/shared/i18n'

export const ProfileSettingsPage = () => {
  const router = useRouter()
  const { t } = useI18n()

  const tabs = [
    {
      content: <ProfileInformation />,
      title: t('profile.profilePageTabsGeneral'),
      value: '1',
    },
    {
      content: <ProfileDevices />,
      title: t('profile.profilePageTabsDevices'),
      value: '2',
    },
    {
      content: <AccountManagementPage />,
      title: t('profile.profilePageTabsAccountManagement'),
      value: '3',
    },
    {
      content: <ProfilePayments />,
      title: t('profile.profilePageTabsPayments'),
      value: '4',
    },
  ]

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
