import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import clsx from 'clsx'
import { Button } from '@/shared/ui/Button'
import { MaximizeIcon } from '@/shared/ui/icons/MaximizeIcon'
import { ExpandedPanel } from './ExpandedPanel/ExpandedPanel'
import { MaximizeButton } from './MaximizeButton'
import s from './MaximizeButton.module.scss'

const meta = {
  title: 'Features/AddPost/CroppingModal/MaximizeButton',
  component: MaximizeButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toggle button that opens a compact zoom control panel with a slider.',
      },
    },
    backgrounds: {
      default: 'inctagram-dark',
      values: [{ name: 'inctagram-dark', value: '#0d0d0d' }],
    },
  },
  decorators: [
    Story => (
      <div style={{ minHeight: 120, minWidth: 220, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MaximizeButton>

export default meta
type Story = StoryObj<typeof meta>

const ExpandedPreview = () => {
  const [value, setValue] = useState(0)

  return (
    <div className={s.wrapper}>
      <ExpandedPanel id="maximize-slider-story" value={value} onChange={setValue} />
      <Button
        aria-label="Close zoom controls"
        className={clsx(s.toggle, s.toggleActive)}
        iconOnly
        hasIconBackground
      >
        <MaximizeIcon />
      </Button>
    </div>
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Closed state. Click the control to open the zoom slider.',
      },
    },
  },
}

export const Expanded: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Opened state with visible zoom slider panel.',
      },
    },
  },
  render: () => <ExpandedPreview />,
}
