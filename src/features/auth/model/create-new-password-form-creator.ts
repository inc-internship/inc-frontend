import z from 'zod/v4'

export const MIN_PASSWORD_LENGTH = 6
export const MAX_PASSWORD_LENGTH = 20

const passwordLengthError = `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`

export const createNewPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty({ error: 'New password field is required' })
      .min(MIN_PASSWORD_LENGTH, { error: passwordLengthError })
      .max(MAX_PASSWORD_LENGTH, { error: passwordLengthError }),
    passwordConfirmation: z.string().nonempty({ error: 'Password confirmation field is required' }),
  })
  .refine(
    ({ newPassword, passwordConfirmation }) =>
      !passwordConfirmation || newPassword === passwordConfirmation,
    {
      error: 'The passwords must match',
      path: ['passwordConfirmation'],
    },
  )
