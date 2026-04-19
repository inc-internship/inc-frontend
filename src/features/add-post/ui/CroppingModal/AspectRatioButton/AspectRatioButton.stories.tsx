import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import clsx from 'clsx'
import { Button } from '@/shared/ui/Button'
import { MaximizeIcon } from '@/shared/ui/icons/MaximizeIcon'
import { ExpandIcon } from '@/shared/ui/icons/ExpandIcon'
import { ExpandedPanel } from './ExpandedPanel/ExpandedPanel'
import { AspectRatioButton } from './AspectRatioButton'
import s from './AspectRatioButton.module.scss'

const meta = {
  title: 'Features/AddPost/CroppingModal/AspectRatioButton',
  component: AspectRatioButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Toggle button that opens an aspect-ratio selector panel matching the cropping controls.',
      },
    },
    backgrounds: {
      default: 'inctagram-dark',
      values: [{ name: 'inctagram-dark', value: '#0d0d0d' }],
    },
  },
  decorators: [
    Story => (
      <div
        style={{
          minHeight: 220,
          minWidth: 220,
          padding: 24,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AspectRatioButton>

export default meta
type Story = StoryObj<typeof meta>

const ExpandedPreview = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
    <div className={s.wrapper}>
      <ExpandedPanel
        id="aspect-ratio-story-panel"
        options={[
          { value: 'original', label: 'Original', preview: 'image' },
          { value: '1:1', label: '1:1', preview: 'square' },
          { value: '4:5', label: '4:5', preview: 'portrait' },
          { value: '16:9', label: '16:9', preview: 'landscape' },
        ]}
        value="4:5"
        onChange={() => {}}
      />
      <Button
        aria-label="Close aspect ratio controls"
        className={clsx(s.toggle, s.toggleActive)}
        iconOnly
        hasIconBackground
      >
        <ExpandIcon />
      </Button>
    </div>

    <Button aria-label="Open zoom controls" iconOnly hasIconBackground>
      <MaximizeIcon />
    </Button>
  </div>
)

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Closed state for the aspect-ratio selector button.',
      },
    },
  },
}

export const Expanded: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Opened state with visible aspect-ratio options and frame previews.',
      },
    },
  },
  render: () => <ExpandedPreview />,
}
