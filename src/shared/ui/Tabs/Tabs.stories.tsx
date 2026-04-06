import type { Meta, StoryObj } from '@storybook/nextjs'
import { Tabs } from './Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
}

export default meta

export const Default: StoryObj<typeof Tabs> = {}
