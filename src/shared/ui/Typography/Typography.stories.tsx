import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TYPOGRAPHY_VARIANTS } from './typography.constants'
import type { TypographyVariant } from './typography.types'
import { Typography } from './Typography'

const isLinkVariant = (
  variant: TypographyVariant,
): variant is Extract<TypographyVariant, 'link-m' | 'link-s'> =>
  variant === 'link-m' || variant === 'link-s'

const meta = {
  title: 'Shared/UI/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'text-m',
    children: 'Typography text',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: TYPOGRAPHY_VARIANTS,
    },
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const LinkVariant: Story = {
  args: {
    variant: 'link-m',
    children: 'Open documentation',
    href: '#',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 420 }}>
      {TYPOGRAPHY_VARIANTS.map(variant =>
        isLinkVariant(variant) ? (
          <Typography key={variant} variant={variant} href="#">
            {variant}
          </Typography>
        ) : (
          <Typography key={variant} variant={variant}>
            {variant}
          </Typography>
        ),
      )}
    </div>
  ),
}
