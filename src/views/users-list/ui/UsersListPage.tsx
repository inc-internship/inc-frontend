'use client'

import s from './UsersListPage.module.scss'
import { useI18n } from '@/shared/i18n'
import { Input } from '@/shared/ui/Input'
import { getApiErrorMessage } from '@/shared/api'
import { DataTable } from '@/shared/ui/Table'
import { Column } from '@/shared/ui/Table/Table'
import { PaymentsHistoryItem } from '@/entities/billing/api/billing.types'

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const UsersListPage = () => {
  const { t } = useI18n()

  const currentPageData: PaymentsHistoryItem[] = []
  const totalCount = 0

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
    <div className={s.container}>
      <div className={s.usersListTop}>
        <Input />
      </div>
      <DataTable columns={paymentColumns} data={currentPageData} />
    </div>
  )
}
