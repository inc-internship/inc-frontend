import clsx from 'clsx'
import { Typography } from '@/shared/ui/Typography'
import s from './Sidebar.module.scss'

type Props = {
  onLogout: () => Promise<void> | void
  isLoading: boolean
}

export const SidebarLogoutButton = ({ onLogout, isLoading }: Props) => {
  return (
    <button
      type="button"
      onClick={onLogout}
      className={s.item}
      aria-label="Log out"
      aria-busy={isLoading}
      disabled={isLoading}
    >
      <span className={clsx(s.icon, s.icon_logOutOutline)} aria-hidden={true} />
      <Typography variant="text-m" as="span" className={s.label}>
        Log Out
      </Typography>
    </button>
  )
}
