import z from 'zod/v4'

export const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().nonempty({ error: 'Password field is required' }),
})
