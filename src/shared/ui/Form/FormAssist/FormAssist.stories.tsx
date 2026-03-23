import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FormAssist } from '@/shared/ui/Form'
import { JSX } from 'react'

const withWidth = (Story: () => JSX.Element) => (
  <div style={{ width: '320px', padding: '8px', border: '1px solid gray' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Shared/Ui/Form/FormAssist',
  component: FormAssist,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FormAssist>

export default meta
type Story = StoryObj<typeof meta>

/** Left-aligned assist text inside a fixed-width form area. */
export const LeftAlign: Story = {
  args: {
    align: 'left',
    children: <>Your password must be between 6 and 20 characters</>,
  },
  decorators: [withWidth],
}

/** Right-aligned assist content inside a fixed-width form area. */
export const RightAlign: Story = {
  args: {
    align: 'right',
    children: 'Forgot Password',
  },
  decorators: [withWidth],
}
