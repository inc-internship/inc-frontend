import { Button } from './Button'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import Image from 'next/image'
import { ExpandIcon } from '@/shared/ui/icons'

const meta = {
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Default variant */
export const Default: Story = {
  args: {
    children: 'Default',
  },
}

/** Outlined variant */
export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined',
  },
}

/** Primary variant */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
}

/** Secondary variant */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

/** Icon variant */
export const Icon: Story = {
  args: {
    iconOnly: true,
    children: <ExpandIcon />,
  },
}

/** Icon with background variant */
export const IconWithBackground: Story = {
  args: {
    iconOnly: true,
    hasIconBackground: true,
    children: <ExpandIcon />,
  },
}

/** Disabled default variant */
export const DefaultDisabled: Story = {
  args: {
    ...Default.args,
    children: 'Default disabled',
    disabled: true,
  },
}

/** Disabled outlined variant */
export const OutlinedDisabled: Story = {
  args: {
    ...Outlined.args,
    children: 'Outlined disabled',
    disabled: true,
  },
}

/** Disabled primary variant */
export const PrimaryDisabled: Story = {
  args: {
    ...Primary.args,
    children: 'Primary disabled',
    disabled: true,
  },
}

/** Disabled secondary variant */
export const SecondaryDisabled: Story = {
  args: {
    ...Secondary.args,
    children: 'Secondary disabled',
    disabled: true,
  },
}

/** Choose the language variant */
export const ChooseLanguage: Story = {
  args: {
    ...Secondary.args,
    children: (
      <>
        <Image
          src="/icons/flags/flag-united-kingdom.svg"
          width={24}
          height={24}
          alt={"United Kingdom's flag"}
        />
        &nbsp; English
      </>
    ),
  },
}

/** Button as link variant */
export const ButtonAsLink: Story = {
  args: {
    ...Primary.args,
    asChild: true,
    children: <a href="https://minglo.blog/api/v1">Minglo Api</a>,
  },
}
