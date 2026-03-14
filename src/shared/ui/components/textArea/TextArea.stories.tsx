import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TextArea } from './TextArea'

const meta = {
  title: 'Shared/UI/TextArea',
  component: TextArea,
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
    label: 'Text-area',
    placeholder: 'Text-area',
  },
  argTypes: {
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {}

export const Error: Story = {
  args: {
    error: 'Error text',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const HiddenLabel: Story = {
  args: {
    hideLabel: true,
  },
}

export const StatesPreview: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '20px' }}>
      <TextArea label="Text-area" placeholder="Text-area" />
      <TextArea label="Text-area" placeholder="Text-area" error="Error text" />
      <TextArea label="Text-area" placeholder="Text-area" disabled />
      <TextArea label="Text-area" placeholder="Text-area" hideLabel />
    </div>
  ),
}
