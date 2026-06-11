export {
  authApi,
  useRegisterMutation,
  useLoginMutation,
  useConfirmationMutation,
  useResendConfirmationMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
  usePasswordRecoveryMutation,
  useNewPasswordMutation,
} from './api/auth.api'

export { meSchema, type MeData } from './model/user-schema'
export {
  sessionSchema,
  getSessionsResponseSchema,
  type Session,
  type GetSessionsResponse,
} from './model/session.schema'
