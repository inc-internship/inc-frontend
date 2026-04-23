import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Tabs } from './Tabs'

const meta = {
  title: 'Shared/UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

// Base tabs
const basicTabs = [
  { title: 'Tab 1', value: '1', content: <div>Content 1</div> },
  { title: 'Tab 2', value: '2', content: <div>Content 2</div> },
  { title: 'Tab 3', value: '3', content: <div>Content 3</div> },
]

export const Default: Story = {
  args: {
    tabs: basicTabs,
    defaultValue: '1',
  },
}

// With unlock tab
const tabsWithDisabled = [
  { title: 'Active', value: '1', content: <div>Active content</div> },
  { title: 'Disabled', value: '2', content: <div>Disabled content</div>, disabled: true },
  { title: 'Active 2', value: '3', content: <div>Active content 2</div> },
]

export const WithDisabledTab: Story = {
  args: {
    tabs: tabsWithDisabled,
    defaultValue: '1',
  },
}

// Many tabs
const manyTabs = Array.from({ length: 10 }, (_, i) => ({
  title: `Tab ${i + 1}`,
  value: `${i + 1}`,
  content: <div>Content {i + 1}</div>,
}))

export const ManyTabs: Story = {
  args: {
    tabs: manyTabs,
    defaultValue: '1',
  },
}

// With custom component
const complexTabs = [
  {
    title: 'Profile',
    value: 'profile',
    content: (
      <div style={{ padding: '20px', width: '300px' }}>
        <h3>Information</h3>
        <p>User details go here</p>
      </div>
    ),
  },
  {
    title: 'Settings',
    value: 'settings',
    content: (
      <div style={{ padding: '20px', width: '300px' }}>
        <h3>Devices</h3>
        <label>
          <input type="checkbox" /> Enable
        </label>
      </div>
    ),
  },
]

export const ComplexContent: Story = {
  args: {
    tabs: complexTabs,
    defaultValue: 'profile',
  },
}
