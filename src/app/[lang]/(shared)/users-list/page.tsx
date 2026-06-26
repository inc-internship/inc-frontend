import { UsersListPage } from '@/views/users-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Users list',
}

export default function UsersList() {
  return <UsersListPage />
}
