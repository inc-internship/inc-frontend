import z from 'zod/v4'

export const MIN_PASSWORD_LENGTH = 6
export const MAX_PASSWORD_LENGTH = 20

const minPasswordLengthError = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
const maxPasswordLengthError = `Password must be at most ${MAX_PASSWORD_LENGTH} characters`
const passwordComplexityError =
  'Password must contain at least 1 digit, 1 uppercase and 1 lowercase letter'
const passwordComplexityPattern =
  /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~]+$/

export const createNewPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty({ error: 'New password field is required' })
      .min(MIN_PASSWORD_LENGTH, { error: minPasswordLengthError })
      .max(MAX_PASSWORD_LENGTH, { error: maxPasswordLengthError })
      .regex(passwordComplexityPattern, { error: passwordComplexityError }),
    passwordConfirmation: z.string().nonempty({ error: 'Password confirmation field is required' }),
  })
  .refine(({ newPassword, passwordConfirmation }) => newPassword === passwordConfirmation, {
    error: 'The passwords must match',
    path: ['passwordConfirmation'],
  })
