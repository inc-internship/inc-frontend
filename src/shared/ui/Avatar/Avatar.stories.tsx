import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

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
  },
  render: args => (
    <Avatar {...args}>
      <AvatarImage
        alt={'User Avatar'}
        src={'https://img.goodfon.ru/wallpaper/big/d/1c/smailiki-zheltye-shary-ulybki.webp'}
      />
      <AvatarFallback>DK</AvatarFallback>
    </Avatar>
  ),
}

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        alt={'User Avatar'}
        src={'https://img.goodfon.ru/wallpaper/big/d/1c/smailiki-zheltye-shary-ulybki.webp'}
      />
      <AvatarFallback>DK</AvatarFallback>
    </Avatar>
  ),
}

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AV</AvatarFallback>
    </Avatar>
  ),
}

export const CustomSize: Story = {
  render: () => (
    <Avatar className={'custom-avatar'}>
      <AvatarImage
        alt={'User Avatar'}
        src={'https://img.goodfon.ru/wallpaper/big/d/1c/smailiki-zheltye-shary-ulybki.webp'}
      />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
}

const style = document.createElement('style')

style.innerHTML = `
  .custom-avatar {
    width: 40px;
    height: 40px;
  }
`
document.head.appendChild(style)
