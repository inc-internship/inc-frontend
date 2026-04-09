import { useGetSessionsQuery } from '@/entities/auth/api/auth.api'
import { PageSpinner } from '@/shared/ui/Spinner'
import { Typography } from '@/shared/ui/Typography'
import s from './ProfileDevices.module.scss'
import { DeviceCard } from '@/entities/Device/device/ui/DeviceCard'
import clsx from 'clsx'
import { Button } from '@/shared/ui/Button'

export const ProfileDevices = () => {
  const { data: sessions, isLoading, error } = useGetSessionsQuery()

  console.log(sessions)

  if (isLoading) {
    return <PageSpinner />
  }

  if (error) {
    return (
      <div className={s.error}>
        <Typography variant="text-m">Не удалось загрузить список устройств</Typography>
      </div>
    )
  }

  return (
    <div className={s.container}>
      <Typography variant="h3" className={s.title}>
        Current Device
      </Typography>
      <div className={clsx(s.devicesContainer, s.currentSession)}>
        <div className={s.devicesItem}>
          <DeviceCard
            device={{
              browserName: 'session.browserName',
              ip: 'session.ip',
              // osName: "session.osName",
            }}
          />
        </div>
      </div>

      <div className={s.buttonContainer}>
        <Button variant="outlined">
          <Typography variant="text-l-bold">Terminate all other session</Typography>
        </Button>
      </div>

      {sessions?.length === 0 ? (
        <Typography variant="text-m">Нет активных сессий</Typography>
      ) : (
        <div className={clsx(s.devicesContainer, s.allSessions)}>
          <Typography variant="h3" className={s.title}>
            Active sessions
          </Typography>

          {sessions?.map(session => (
            <div key={session.deviceId} className={s.devicesItem}>
              <DeviceCard
                device={{
                  ip: session.ip,
                  lastActive: session.lastActive,
                  deviceName: session.deviceName,
                  osName: session.osName,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
