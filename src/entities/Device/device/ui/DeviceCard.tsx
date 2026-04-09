import { ReactNode } from 'react'
import s from './DeviceCard.module.scss'
import {
  BraveIcon,
  ExplorerIcon,
  FirefoxIcon,
  MicrosoftEdgeIcon,
  OperaIcon,
  SafariIcon,
  UcBrowserIcon,
  YandexIcon,
  ChromeIcon,
  PhoneIcon,
  DesktopIcon,
} from "./index"
import {Typography} from "@/shared/ui/Typography";

const getBrowserIcon = (browserName: string) => {
  const name = browserName.toLowerCase()
  if (name.includes('chrome')) return <ChromeIcon />
  if (name.includes('firefox')) return <FirefoxIcon />
  if (name.includes('safari')) return <SafariIcon />
  if (name.includes('edge')) return <MicrosoftEdgeIcon />
  if (name.includes('opera')) return <OperaIcon />
  if (name.includes('yandex')) return <YandexIcon />
  if (name.includes('ucbrowser')) return <UcBrowserIcon />
  if (name.includes('explorer') || name.includes('ie')) return <ExplorerIcon />
  if (name.includes('brave')) return <BraveIcon />
  return null
}

const getOsIcon = (osName?: string) => {
  if (!osName) return null
  const os = osName.toLowerCase()
  if (os.includes('windows') || os.includes('mac') || os.includes('linux')) {
    return <DesktopIcon />
  }
  if (os.includes('android') || os.includes('ios')) {
    return <PhoneIcon />
  }
  return <DesktopIcon />
}

type Props = {
  device: {
    browserName?: string
    deviceName?: string
    ip?: string
    lastActive?: string
    osName?: string
  }
  children?: ReactNode
}

export const DeviceCard = ({ device, children }: Props) => {
  return (
    <div className={s.card}>
      <div className={s.cardIcon}>
        {device.browserName && getBrowserIcon(device.browserName)}
      </div>
      <div className={s.cardContent}>
        <Typography variant="text-l-bold" className={s.browserName}>{device.browserName}</Typography>
        <Typography variant="text-m" className={s.deviceIp}>{device.ip}</Typography>
        {device.lastActive && (
          <Typography variant="text-s" className={s.lastActive}>
            Last visit: {new Date(device.lastActive).toLocaleDateString('ru-RU')}
          </Typography>
        )}
        <div>{device.deviceName}</div>
        <div>{device.osName && getOsIcon(device.osName)}</div>
      </div>

      {children && <div className="actions">{children}</div>}
    </div>
  )
}
