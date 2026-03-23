import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FormSocials } from './FormSocials'

const meta = {
  title: 'Shared/Ui/Form/FormSocials',
  component: FormSocials,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FormSocials>

export default meta
type Story = StoryObj<typeof meta>

/** Form with social medias for Auth  */
export const SocialsInForm: Story = {}
