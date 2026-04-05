import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Spinner } from './Spinner'

const meta = {
  title: 'Shared/UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Spinner shows loading state while content or an action is being processed.',
      },
    },
  },
  args: {
    size: 'sm',
  },
  argTypes: {
    className: {
      control: false,
      description: 'Additional CSS class for custom positioning or spacing.',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md'],
      description: 'Controls the rendered spinner size.',
      table: {
        type: { summary: "'sm' | 'md'" },
        defaultValue: { summary: 'sm' },
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground for checking the available spinner sizes.',
      },
    },
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small spinner variant for compact layouts and inline loading states.',
      },
    },
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium spinner variant for more prominent loading feedback.',
      },
    },
  },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Spinner size="sm" />
      <Spinner size="md" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of all supported spinner sizes.',
      },
    },
  },
}
