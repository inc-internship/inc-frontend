import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Recaptcha } from './Recaptcha'

const sitekey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string

const meta: Meta<typeof Recaptcha> = {
  title: 'Shared/UI/Recaptcha',
  component: Recaptcha,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
}

export default meta

type Story = StoryObj<typeof Recaptcha>

export const Default: Story = {
  args: {
    sitekey: sitekey,
    language: 'en',
    theme: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default variant',
      },
    },
  },
}

export const RussianLanguage: Story = {
  args: {
    sitekey: sitekey,
    language: 'ru',
    theme: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story: 'With russian language',
      },
    },
  },
}

export const LightTheme: Story = {
  args: {
    sitekey: sitekey,
    language: 'en',
    theme: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Light theme',
      },
    },
    backgrounds: {
      default: 'light',
    },
  },
}
