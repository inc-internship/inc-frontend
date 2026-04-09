import { ReactNode } from 'react'
import s from './DeviceCard.module.scss'

type Props = {
  device: {
    browserName: string
    deviceName: string
    ip: string
    lastActive: string
    osName: string
  }
  children?: ReactNode
}

export const DeviceCard = ({ device, children }: Props) => {
  return (
    <div className={s.card}>
      <div className={s.cardIcon}></div>
      <div className={s.cardContent}>
        <div>{device.browserName}</div>
        <div>{device.ip}</div>
        <div>{device.lastActive}</div>
        <div>{device.deviceName}</div>
        <div>{device.osName}</div>
      </div>

      {children && <div className="actions">{children}</div>}
    </div>
  )
}
