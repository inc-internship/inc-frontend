import { Avatar } from '@/shared/ui/Avatar'
import s from './UserListItem.module.scss'
import Link from 'next/link'

type Props = {
  link: string
  size?: number
  alt: string
  login: string
  userId?: string
}

export const UserListItem = ({ link, size, alt, login, userId }: Props) => {
  return (
    <div className={s.userListItem}>
      <Avatar src={link} size={size} alt={alt} />
      <div className={s.userInfo}>
        <Link className={s.userLink} href={`profile/${userId}`}>
          {login}
        </Link>
      </div>
    </div>
  )
}
