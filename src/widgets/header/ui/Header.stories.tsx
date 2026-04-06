import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Header } from './Header'

const meta = {
  component: Header,
  tags: ['autodocs'],
  title: 'Widgets/header',
  decorators: [
    Story => (
      <div style={{ backgroundColor: '#0d0d0d', height: '150px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

/** Header for auth and pages */
export const Auth: Story = {}
