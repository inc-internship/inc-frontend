import {
  useGetSessionsQuery,
  useTerminateAllOtherSessionsMutation,
  useTerminateSessionMutation,
} from '@/entities/auth/api/auth.api'
import { PageSpinner } from '@/shared/ui/Spinner'
import { Typography } from '@/shared/ui/Typography'
import s from './ProfileDevices.module.scss'
import { DeviceCard } from '@/entities/Device/device/ui/DeviceCard'
import clsx from 'clsx'
import { Button } from '@/shared/ui/Button'
import { LogoutIcon } from '@/shared/ui/icons'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { getApiErrorMessage } from '@/shared/api'

export const ProfileDevices = () => {
  const { data: sessions, isLoading, error } = useGetSessionsQuery()

  const [terminateSession, { isLoading: isTerminatingLoading }] = useTerminateSessionMutation()

  const [terminateAllOtherSessions, { isLoading: isTerminatingAllLoading }] =
    useTerminateAllOtherSessionsMutation()

  useEffect(() => {
    if (error) {
      toast.error(getApiErrorMessage(error))
    }
  }, [error])

  const currentSession = sessions?.find(s => s.isCurrent)
  const otherSessions = sessions?.filter(s => !s.isCurrent) ?? []

  const terminateSessionHandle = async (deviceId: string) => {
    try {
      await terminateSession({ deviceId }).unwrap()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const terminateAllOtherSessionsHandler = async () => {
    if (otherSessions?.length === 0) return

    try {
      await terminateAllOtherSessions().unwrap()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  if (isLoading) {
    return <PageSpinner />
  }

  return (
    <div className={s.container}>
      {currentSession && (
        <>
          <Typography variant="h3" className={s.title}>
            Current Device
          </Typography>
          <div className={clsx(s.devicesContainer, s.currentSession)}>
            <div className={s.devicesItem}>
              <DeviceCard
                device={{
                  browserName: currentSession.browserName,
                  ip: currentSession.ip,
                }}
              />
            </div>
          </div>
        </>
      )}

      {otherSessions.length > 0 && (
        <div className={s.buttonContainer}>
          <Button
            variant="outlined"
            onClick={terminateAllOtherSessionsHandler}
            disabled={isTerminatingAllLoading || otherSessions?.length === 0}
          >
            <Typography variant="text-l-bold">Terminate all other session</Typography>
          </Button>
        </div>
      )}

      {
        <div className={clsx(s.devicesContainer, s.allSessions)}>
          <Typography variant="h3" className={s.title}>
            Active sessions
          </Typography>

          {otherSessions.map(session => (
            <div key={session.deviceId} className={s.devicesItem}>
              <DeviceCard
                device={{
                  osName: session.osName,
                  ip: session.ip,
                  lastActive: session.lastActive,
                  deviceName: session.deviceName,
                }}
              />
              <Button
                className={s.logOutSessionButton}
                onClick={() => terminateSessionHandle(session.deviceId)}
                disabled={isTerminatingLoading}
              >
                <LogoutIcon />
                Log Out
              </Button>
            </div>
          ))}
        </div>
      }

      {otherSessions?.length === 0 && (
        <div className={s.noDevicesMessageWrapper}>
          <Typography variant="text-l" className={s.noDevicesMessage}>
            You have not yet logged in from other devices
          </Typography>
        </div>
      )}
    </div>
  )
}
