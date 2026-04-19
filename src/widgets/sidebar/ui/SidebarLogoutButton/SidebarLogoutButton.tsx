import clsx from 'clsx'
import { Typography } from '@/shared/ui/Typography'
import s from '../Sidebar.module.scss'

type Props = {
  onClick: () => void
  isLoading: boolean
}

export const SidebarLogoutButton = ({ onClick, isLoading }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(s.item, s.logoutItem)}
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
