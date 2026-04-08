import React, { ComponentPropsWithoutRef } from 'react'
import * as RadixTabs from '@radix-ui/react-tabs'
import s from './Tabs.module.scss'
import { Typography } from '@/shared/ui/Typography'

type Tab = {
  content?: React.ReactNode
  disabled?: boolean
  title: string
  value: string
}

type TabsProps = {
  tabs: Tab[]
} & ComponentPropsWithoutRef<typeof RadixTabs.Root>

export const Tabs = (props: TabsProps) => {
  const { className, tabs, ...rest } = props

  return (
    <RadixTabs.Root {...rest}>
      <RadixTabs.List className={s.tabsList}>
        {tabs.map(tab => (
          <RadixTabs.Trigger
            value={tab.value}
            className={s.tabsTrigger}
            key={tab.value}
            disabled={tab.disabled}
          >
            <Typography variant="text-m-medium">{tab.title}</Typography>
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {tabs.map((tab, index) => (
        <RadixTabs.Content value={tab.value} key={tab.value}>
          {tab.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}
