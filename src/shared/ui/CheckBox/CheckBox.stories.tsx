import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CheckBox } from '@/shared/ui/CheckBox'
import React from 'react'

const meta: Meta<typeof CheckBox> = {
  title: 'Shared/UI/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'inctagram-dark',
      values: [
        {
          name: 'inctagram-dark',
          value: '#0d0d0d',
        },
      ],
    },
  },
  decorators: [
    Story => (
      <div style={{ backgroundColor: '#0d0d0d', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Check-box',
    size: 'md',
    checked: false,
    onCheckedChange: () => {},
  },
  argTypes: {
    label: {
      description: 'Text label displayed next to the checkbox',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    size: {
      description: 'Size of the checkbox',
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: '"md"' },
      },
    },
    checked: {
      description: 'Controls whether the checkbox is checked',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      description: 'Disables the checkbox if true',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      description: 'Displays error state when true',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onCheckedChange: {
      description: 'Callback function called when checked state changes',
      action: 'checkedChanged',
      table: {
        type: { summary: '(checked: boolean | "indeterminate") => void' },
      },
      control: false,
    },
    className: {
      description: 'Additional CSS class name(s) to apply',
      control: false,
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof CheckBox>

export default meta

type Story = StoryObj<typeof CheckBox>

export const Default: Story = {
  args: {
    label: 'CheckBox',
    size: 'md',
    disabled: false,
  },
}

export const Checked: Story = {
  args: {
    label: 'Checked checkbox',
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
    checked: true,
  },
}

export const Error: Story = {
  args: {
    label: 'CheckBox with error',
    error: true,
  },
}

export const ControlledCheckbox: StoryObj<typeof CheckBox> = {
  render: () => {
    const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(false)
    return <CheckBox label="ControlledCheckbox" checked={checked} onCheckedChange={setChecked} />
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20 }}>
      <CheckBox size="sm" label="Small" />
      <CheckBox size="md" label="Medium" />
      <CheckBox size="lg" label="Large" />
    </div>
  ),
}
