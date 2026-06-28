'use client'

import s from './UsersListPage.module.scss'
import { useI18n } from '@/shared/i18n'
import { Input } from '@/shared/ui/Input'
import { DataTable } from '@/shared/ui/Table'
import { Column } from '@/shared/ui/Table/Table'
import { PaymentsHistoryItem } from '@/entities/billing/api/billing.types'
import { Pagination } from '@/shared/ui/Pagination/Pagination'
import { useState } from 'react'
import { BlockFilter } from '@/views/users-list/BlockedFilter/ui/BlockedFilter'

type User = {
  userID: number
  userName: string
  profileLink: string
  dateAdded: string
}

const mockUsers = [
  {
    userID: 1,
    userName: 'ivan_petrov',
    profileLink: 'https://example.com/profile/ivan_petrov',
    dateAdded: '2026-06-20T10:23:00Z',
  },
  {
    userID: 2,
    userName: 'maria_smirnova',
    profileLink: 'https://example.com/profile/maria_smirnova',
    dateAdded: '2026-06-20T11:15:00Z',
  },
  {
    userID: 3,
    userName: 'alex_2024',
    profileLink: 'https://example.com/profile/alex_2024',
    dateAdded: '2026-06-21T08:30:00Z',
  },
  {
    userID: 4,
    userName: 'olga_design',
    profileLink: 'https://example.com/profile/olga_design',
    dateAdded: '2026-06-21T09:45:00Z',
  },
  {
    userID: 5,
    userName: 'dmitry_dev',
    profileLink: 'https://example.com/profile/dmitry_dev',
    dateAdded: '2026-06-22T12:00:00Z',
  },
  {
    userID: 6,
    userName: 'ekaterina_art',
    profileLink: 'https://example.com/profile/ekaterina_art',
    dateAdded: '2026-06-22T14:20:00Z',
  },
  {
    userID: 7,
    userName: 'sergey_qa',
    profileLink: 'https://example.com/profile/sergey_qa',
    dateAdded: '2026-06-23T16:10:00Z',
  },
  {
    userID: 8,
    userName: 'anna_manager',
    profileLink: 'https://example.com/profile/anna_manager',
    dateAdded: '2026-06-23T17:55:00Z',
  },
  // Additional records for pagination (pageSize = 8)
  {
    userID: 9,
    userName: 'maxim_404',
    profileLink: 'https://example.com/profile/maxim_404',
    dateAdded: '2026-06-24T08:00:00Z',
  },
  {
    userID: 10,
    userName: 'tatiana_copy',
    profileLink: 'https://example.com/profile/tatiana_copy',
    dateAdded: '2026-06-24T09:30:00Z',
  },
  {
    userID: 11,
    userName: 'nikolay_green',
    profileLink: 'https://example.com/profile/nikolay_green',
    dateAdded: '2026-06-25T10:00:00Z',
  },
  {
    userID: 12,
    userName: 'yulia_flower',
    profileLink: 'https://example.com/profile/yulia_flower',
    dateAdded: '2026-06-25T11:45:00Z',
  },
  {
    userID: 13,
    userName: 'kirill_admin',
    profileLink: 'https://example.com/profile/kirill_admin',
    dateAdded: '2026-06-26T13:15:00Z',
  },
  {
    userID: 14,
    userName: 'elena_muse',
    profileLink: 'https://example.com/profile/elena_muse',
    dateAdded: '2026-06-26T14:40:00Z',
  },
  {
    userID: 15,
    userName: 'pavel_engine',
    profileLink: 'https://example.com/profile/pavel_engine',
    dateAdded: '2026-06-27T08:20:00Z',
  },
  {
    userID: 16,
    userName: 'veronika_sun',
    profileLink: 'https://example.com/profile/veronika_sun',
    dateAdded: '2026-06-27T09:55:00Z',
  },
  {
    userID: 17,
    userName: 'roman_sharp',
    profileLink: 'https://example.com/profile/roman_sharp',
    dateAdded: '2026-06-28T07:10:00Z',
  },
  {
    userID: 18,
    userName: 'lilia_bloom',
    profileLink: 'https://example.com/profile/lilia_bloom',
    dateAdded: '2026-06-28T08:35:00Z',
  },
]

export const UsersListPage = () => {
  const { t } = useI18n()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  const currentPageData = mockUsers.slice((page - 1) * pageSize, page * pageSize)
  const totalCount = mockUsers.length

  const usersColumns: Column<User>[] = [
    {
      key: 'userID',
      title: t('usersTable.userId'),
    },
    {
      key: 'profileLink',
      title: t('usersTable.profileLink'),
      render: row => (
        <a
          href={row.profileLink}
          className={s.profileLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {row.profileLink}
        </a>
      ),
    },
    {
      key: 'userName',
      title: t('usersTable.userName'),
    },
    {
      key: 'dateAdded',
      title: t('usersTable.dateAdded'),
      render: row => new Date(row.dateAdded).toLocaleDateString(),
    },
  ]

  return (
    <div className={s.container}>
      <div className={s.usersListTop}>
        <div className={s.inputWrapper}>
          <Input type="search" className={s.searchInput} width="auto" />
        </div>
        <BlockFilter />
      </div>
      <DataTable columns={usersColumns} data={currentPageData} error={null} loading={false} />
      <Pagination
        currentPage={page}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={newSize => {
          setPageSize(newSize)
          setPage(1)
        }}
        pageSizeOptions={[8, 10, 20, 50, 100]}
      />
    </div>
  )
}
