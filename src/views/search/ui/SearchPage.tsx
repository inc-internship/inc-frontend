'use client'

import { useState, useRef, useEffect } from 'react'
import s from './SearchPage.module.scss'

import { Typography } from '@/shared/ui/Typography'
import { Input } from '@/shared/ui/Input'
import { SearchIcon } from '@/shared/ui/Input/icons/SearchIcon'
import { useGetUsersQuery } from '@/entities/user/api/user.api'
import { useDebounce } from '@/shared/lib/useDebounce'
import { UserListItem } from '@/views/search/ui/UserListItem/UserListItem'
import { Spinner } from '@/shared/ui/Spinner'
import { useI18n } from '@/shared/i18n'
import { getApiErrorMessage } from '@/shared/api'

export const SearchPage = () => {
  const { t } = useI18n()

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const [cursor, setCursor] = useState<string | undefined>(undefined)

  const { data, isLoading, isError, error, isFetching, refetch } = useGetUsersQuery(
    { username: debouncedSearchTerm, cursor },
    { skip: debouncedSearchTerm.trim() === '' },
  )

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && data?.hasNextPage && !isFetching) {
          setCursor(data.nextCursor ?? undefined)
        }
      },
      { threshold: 0.1 },
    )

    const currentSentinel = sentinelRef.current
    if (currentSentinel) {
      observer.observe(currentSentinel)
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel)
      }
    }
  }, [data?.hasNextPage, data?.nextCursor, isFetching])

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCursor(undefined)
  }

  return (
    <div className={s.container}>
      <Typography variant="h2" align="left" className={s.title}>
        {t('users.search')}
      </Typography>
      <Input
        leftIcon={<SearchIcon />}
        placeholder={t('users.search')}
        onChange={searchHandler}
        value={searchTerm}
      />

      {isLoading && (
        <div className={s.spinnerWrapper}>
          <Spinner size="lg" className={s.spinner} />
        </div>
      )}

      {isError && (
        <div className={s.error}>
          <span>{getApiErrorMessage(error)}</span>
          <button onClick={refetch}>{t('common.retry')}</button>
        </div>
      )}

      {!isLoading &&
        !isError &&
        data &&
        data.items.length === 0 &&
        debouncedSearchTerm.trim() !== '' && (
          <div className={s.emptyText}>
            <Typography variant="text-m-bold" align="left">
              {t('users.empty')}
            </Typography>
          </div>
        )}

      {data && data.items.length > 0 && (
        <ul className={s.usersList}>
          {data.items.map(user => (
            <li key={user.id}>
              <UserListItem
                link={user.avatarUrl}
                alt={user.login}
                size={48}
                login={user.login}
                userId={user.id}
              />
            </li>
          ))}
        </ul>
      )}

      <div ref={sentinelRef} style={{ height: '10px' }} />

      {isFetching && !isLoading && (
        <div className={s.spinnerWrapper}>
          <Spinner size="sm" className={s.spinner} />
        </div>
      )}
    </div>
  )
}
