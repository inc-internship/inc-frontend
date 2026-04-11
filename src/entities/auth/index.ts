export {
  authApi,
  useRegisterMutation,
  useLoginMutation,
  useConfirmationMutation,
  useResendConfirmationMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
  usePasswordRecoveryMutation,
  useNewPasswordMutation,
} from './api/auth.api'

export { meSchema } from './model/user-schema'
export type { MeData } from './model/types'
