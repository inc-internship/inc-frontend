'use client'

import { useState } from 'react'
import { Column, DataTable } from '@/shared/ui/Table/Table'
import { Pagination } from '@/shared/ui/Pagination/Pagination'
import { useGetPaymentsHistoryQuery } from '@/entities/billing/api/billing.api'
import { PaymentsHistoryItem } from '@/entities/billing/api/billing.types'
import { useI18n } from '@/shared/i18n'
import { getApiErrorMessage } from '@/shared/api/lib/getApiErrorMessage'

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const ProfilePayments = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { t } = useI18n()

  const { data, isLoading, isError, error } = useGetPaymentsHistoryQuery(
    { page, pageSize },
    { skip: false },
  )

  const currentPageData: PaymentsHistoryItem[] = data?.items ?? []
  const totalCount = data?.totalCount ?? 0

  const paymentColumns: Column<PaymentsHistoryItem>[] = [
    {
      key: 'paymentDate',
      title: t('paymentsTable.dateOfPayment'),
      render: row => formatDate(row.paymentDate),
    },
    {
      key: 'subscriptionExpiresAt',
      title: t('paymentsTable.endDateOfSubscription'),
      render: row => formatDate(row.subscriptionExpiresAt),
    },
    {
      key: 'amount',
      title: t('paymentsTable.price'),
      render: row => {
        const num = parseFloat(row.amount)
        return isNaN(num) ? `$${row.amount}` : `$${num.toFixed(2)}`
      },
    },
    {
      key: 'planName',
      title: t('paymentsTable.subscriptionType'),
      render: row => row.planName,
    },
    {
      key: 'paymentSystem',
      title: t('paymentsTable.paymentsType'),
      render: row => (row.paymentSystem === 'PAYPAL' ? 'PayPal' : 'Stripe'),
    },
  ]

  return (
    <div>
      <DataTable
        columns={paymentColumns}
        data={currentPageData}
        loading={isLoading}
        error={isError ? getApiErrorMessage(error, t('paymentsTable.downloadError')) : null}
      />
      {!isLoading && data && data.totalCount > 0 && (
        <Pagination
          currentPage={page}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={newSize => {
            setPageSize(newSize)
            setPage(1)
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
        />
      )}
    </div>
  )
}
