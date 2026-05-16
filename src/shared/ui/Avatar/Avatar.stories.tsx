import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Shared/UI/Avatar',
}

export default meta

type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    className: '',
    src: 'https://img.goodfon.ru/wallpaper/big/d/1c/smailiki-zheltye-shary-ulybki.webp',
  },
  render: args => <Avatar {...args} alt={'User Avatar'} />,
}

export const WithImage: Story = {
  render: () => (
    <Avatar
      alt={'User Avatar'}
      src={'https://img.goodfon.ru/wallpaper/big/d/1c/smailiki-zheltye-shary-ulybki.webp'}
    />
  ),
}

export const FallbackOnly: Story = {
  render: () => <Avatar alt={'User Avatar'} src={null} />,
}

export const CustomSize: Story = {
  render: () => (
    <Avatar
      alt={'User Avatar'}
      size={40}
      src={'https://img.goodfon.ru/wallpaper/big/d/1c/smailiki-zheltye-shary-ulybki.webp'}
    />
  ),
}
