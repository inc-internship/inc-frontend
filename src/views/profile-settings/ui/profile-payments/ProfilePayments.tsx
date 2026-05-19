'use client'

import { useState, useMemo } from 'react'
import { Column, DataTable } from '@/shared/ui/Table/Table'
import { Pagination } from '@/shared/ui/Pagination/Pagination'

type SubscriptionDuration = 'DAY' | 'MONTHLY' | 'WEEKLY'

type MyPayments = {
  dateOfPayment: string
  endDateOfSubscription: string
  paymentType: 'PAYPAL' | 'STRIPE'
  price: number
  subscriptionId: string
  subscriptionType: SubscriptionDuration
  userId: number
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const ProfilePayments = () => {
  const data: MyPayments[] = [
    // оковые данные пока
    {
      dateOfPayment: '2021-01-15T10:23:00Z',
      endDateOfSubscription: '2025-02-15T10:23:00Z',
      paymentType: 'STRIPE',
      price: 9.99,
      subscriptionId: 'sub_1A2B3C4D5E',
      subscriptionType: 'MONTHLY',
      userId: 101,
    },
    {
      dateOfPayment: '2025-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-04-20T08:30:00Z',
      endDateOfSubscription: '2025-04-21T08:30:00Z',
      paymentType: 'STRIPE',
      price: 0.99,
      subscriptionId: 'sub_DAY001',
      subscriptionType: 'DAY',
      userId: 103,
    },
    {
      dateOfPayment: '2025-05-01T12:00:00Z',
      endDateOfSubscription: '2025-06-01T12:00:00Z',
      paymentType: 'PAYPAL',
      price: 19.99,
      subscriptionId: 'sub_MONTHPRO',
      subscriptionType: 'MONTHLY',
      userId: 104,
    },
    {
      dateOfPayment: '2025-06-05T09:15:00Z',
      endDateOfSubscription: '2025-06-12T09:15:00Z',
      paymentType: 'STRIPE',
      price: 7.49,
      subscriptionId: 'sub_WEEK123',
      subscriptionType: 'WEEKLY',
      userId: 105,
    },
    {
      dateOfPayment: '2021-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-04-20T08:30:00Z',
      endDateOfSubscription: '2025-04-21T08:30:00Z',
      paymentType: 'STRIPE',
      price: 0.99,
      subscriptionId: 'sub_DAY001',
      subscriptionType: 'DAY',
      userId: 103,
    },
    {
      dateOfPayment: '2025-05-01T12:00:00Z',
      endDateOfSubscription: '2025-06-01T12:00:00Z',
      paymentType: 'PAYPAL',
      price: 19.99,
      subscriptionId: 'sub_MONTHPRO',
      subscriptionType: 'MONTHLY',
      userId: 104,
    },
    {
      dateOfPayment: '2025-06-05T09:15:00Z',
      endDateOfSubscription: '2025-06-12T09:15:00Z',
      paymentType: 'STRIPE',
      price: 7.49,
      subscriptionId: 'sub_WEEK123',
      subscriptionType: 'WEEKLY',
      userId: 105,
    },
    {
      dateOfPayment: '2021-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-05-01T12:00:00Z',
      endDateOfSubscription: '2025-06-01T12:00:00Z',
      paymentType: 'PAYPAL',
      price: 19.99,
      subscriptionId: 'sub_MONTHPRO',
      subscriptionType: 'MONTHLY',
      userId: 104,
    },
    {
      dateOfPayment: '2025-06-05T09:15:00Z',
      endDateOfSubscription: '2025-06-12T09:15:00Z',
      paymentType: 'STRIPE',
      price: 7.49,
      subscriptionId: 'sub_WEEK123',
      subscriptionType: 'WEEKLY',
      userId: 105,
    },
    {
      dateOfPayment: '2021-01-15T10:23:00Z',
      endDateOfSubscription: '2025-02-15T10:23:00Z',
      paymentType: 'STRIPE',
      price: 9.99,
      subscriptionId: 'sub_1A2B3C4D5E',
      subscriptionType: 'MONTHLY',
      userId: 101,
    },
    {
      dateOfPayment: '2025-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-04-20T08:30:00Z',
      endDateOfSubscription: '2025-04-21T08:30:00Z',
      paymentType: 'STRIPE',
      price: 0.99,
      subscriptionId: 'sub_DAY001',
      subscriptionType: 'DAY',
      userId: 103,
    },
    {
      dateOfPayment: '2025-05-01T12:00:00Z',
      endDateOfSubscription: '2025-06-01T12:00:00Z',
      paymentType: 'PAYPAL',
      price: 19.99,
      subscriptionId: 'sub_MONTHPRO',
      subscriptionType: 'MONTHLY',
      userId: 104,
    },
    {
      dateOfPayment: '2025-06-05T09:15:00Z',
      endDateOfSubscription: '2025-06-12T09:15:00Z',
      paymentType: 'STRIPE',
      price: 7.49,
      subscriptionId: 'sub_WEEK123',
      subscriptionType: 'WEEKLY',
      userId: 105,
    },
    {
      dateOfPayment: '2021-01-15T10:23:00Z',
      endDateOfSubscription: '2025-02-15T10:23:00Z',
      paymentType: 'STRIPE',
      price: 9.99,
      subscriptionId: 'sub_1A2B3C4D5E',
      subscriptionType: 'MONTHLY',
      userId: 101,
    },
    {
      dateOfPayment: '2025-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-04-20T08:30:00Z',
      endDateOfSubscription: '2025-04-21T08:30:00Z',
      paymentType: 'STRIPE',
      price: 0.99,
      subscriptionId: 'sub_DAY001',
      subscriptionType: 'DAY',
      userId: 103,
    },
    {
      dateOfPayment: '2025-05-01T12:00:00Z',
      endDateOfSubscription: '2025-06-01T12:00:00Z',
      paymentType: 'PAYPAL',
      price: 19.99,
      subscriptionId: 'sub_MONTHPRO',
      subscriptionType: 'MONTHLY',
      userId: 104,
    },
    {
      dateOfPayment: '2025-06-05T09:15:00Z',
      endDateOfSubscription: '2025-06-12T09:15:00Z',
      paymentType: 'STRIPE',
      price: 7.49,
      subscriptionId: 'sub_WEEK123',
      subscriptionType: 'WEEKLY',
      userId: 105,
    },
    {
      dateOfPayment: '2021-01-15T10:23:00Z',
      endDateOfSubscription: '2025-02-15T10:23:00Z',
      paymentType: 'STRIPE',
      price: 9.99,
      subscriptionId: 'sub_1A2B3C4D5E',
      subscriptionType: 'MONTHLY',
      userId: 101,
    },
    {
      dateOfPayment: '2025-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-04-20T08:30:00Z',
      endDateOfSubscription: '2025-04-21T08:30:00Z',
      paymentType: 'STRIPE',
      price: 0.99,
      subscriptionId: 'sub_DAY001',
      subscriptionType: 'DAY',
      userId: 103,
    },
    {
      dateOfPayment: '2025-05-01T12:00:00Z',
      endDateOfSubscription: '2025-06-01T12:00:00Z',
      paymentType: 'PAYPAL',
      price: 19.99,
      subscriptionId: 'sub_MONTHPRO',
      subscriptionType: 'MONTHLY',
      userId: 104,
    },
    {
      dateOfPayment: '2025-06-05T09:15:00Z',
      endDateOfSubscription: '2025-06-12T09:15:00Z',
      paymentType: 'STRIPE',
      price: 7.49,
      subscriptionId: 'sub_WEEK123',
      subscriptionType: 'WEEKLY',
      userId: 105,
    },
    {
      dateOfPayment: '2021-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-04-20T08:30:00Z',
      endDateOfSubscription: '2025-04-21T08:30:00Z',
      paymentType: 'STRIPE',
      price: 0.99,
      subscriptionId: 'sub_DAY001',
      subscriptionType: 'DAY',
      userId: 103,
    },
    {
      dateOfPayment: '2025-05-01T12:00:00Z',
      endDateOfSubscription: '2025-06-01T12:00:00Z',
      paymentType: 'PAYPAL',
      price: 19.99,
      subscriptionId: 'sub_MONTHPRO',
      subscriptionType: 'MONTHLY',
      userId: 104,
    },
    {
      dateOfPayment: '2025-06-05T09:15:00Z',
      endDateOfSubscription: '2025-06-12T09:15:00Z',
      paymentType: 'STRIPE',
      price: 7.49,
      subscriptionId: 'sub_WEEK123',
      subscriptionType: 'WEEKLY',
      userId: 105,
    },
    {
      dateOfPayment: '2021-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-05-01T12:00:00Z',
      endDateOfSubscription: '2025-06-01T12:00:00Z',
      paymentType: 'PAYPAL',
      price: 19.99,
      subscriptionId: 'sub_MONTHPRO',
      subscriptionType: 'MONTHLY',
      userId: 104,
    },
    {
      dateOfPayment: '2025-06-05T09:15:00Z',
      endDateOfSubscription: '2025-06-12T09:15:00Z',
      paymentType: 'STRIPE',
      price: 7.49,
      subscriptionId: 'sub_WEEK123',
      subscriptionType: 'WEEKLY',
      userId: 105,
    },
    {
      dateOfPayment: '2021-01-15T10:23:00Z',
      endDateOfSubscription: '2025-02-15T10:23:00Z',
      paymentType: 'STRIPE',
      price: 9.99,
      subscriptionId: 'sub_1A2B3C4D5E',
      subscriptionType: 'MONTHLY',
      userId: 101,
    },
    {
      dateOfPayment: '2025-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-04-20T08:30:00Z',
      endDateOfSubscription: '2025-04-21T08:30:00Z',
      paymentType: 'STRIPE',
      price: 0.99,
      subscriptionId: 'sub_DAY001',
      subscriptionType: 'DAY',
      userId: 103,
    },
    {
      dateOfPayment: '2025-05-01T12:00:00Z',
      endDateOfSubscription: '2025-06-01T12:00:00Z',
      paymentType: 'PAYPAL',
      price: 19.99,
      subscriptionId: 'sub_MONTHPRO',
      subscriptionType: 'MONTHLY',
      userId: 104,
    },
    {
      dateOfPayment: '2025-06-05T09:15:00Z',
      endDateOfSubscription: '2025-06-12T09:15:00Z',
      paymentType: 'STRIPE',
      price: 7.49,
      subscriptionId: 'sub_WEEK123',
      subscriptionType: 'WEEKLY',
      userId: 105,
    },
    {
      dateOfPayment: '2021-01-15T10:23:00Z',
      endDateOfSubscription: '2025-02-15T10:23:00Z',
      paymentType: 'STRIPE',
      price: 9.99,
      subscriptionId: 'sub_1A2B3C4D5E',
      subscriptionType: 'MONTHLY',
      userId: 101,
    },
    {
      dateOfPayment: '2025-03-10T14:05:00Z',
      endDateOfSubscription: '2025-03-17T14:05:00Z',
      paymentType: 'PAYPAL',
      price: 2.99,
      subscriptionId: 'sub_9Z8Y7X6W5V',
      subscriptionType: 'WEEKLY',
      userId: 102,
    },
    {
      dateOfPayment: '2025-04-20T08:30:00Z',
      endDateOfSubscription: '2025-04-21T08:30:00Z',
      paymentType: 'STRIPE',
      price: 0.99,
      subscriptionId: 'sub_DAY001',
      subscriptionType: 'DAY',
      userId: 103,
    },
    {
      dateOfPayment: '2025-05-01T12:00:00Z',
      endDateOfSubscription: '2025-06-01T12:00:00Z',
      paymentType: 'PAYPAL',
      price: 19.99,
      subscriptionId: 'sub_MONTHPRO',
      subscriptionType: 'MONTHLY',
      userId: 104,
    },
    {
      dateOfPayment: '2025-06-05T09:15:00Z',
      endDateOfSubscription: '2025-06-12T09:15:00Z',
      paymentType: 'STRIPE',
      price: 7.49,
      subscriptionId: 'sub_WEEK123',
      subscriptionType: 'WEEKLY',
      userId: 105,
    },
  ]

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  //всего записей
  const totalCount = data.length

  // данные для текущей страницы
  const currentPageData = useMemo(() => {
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize])

  const subscriptionTypeMap: Record<SubscriptionDuration, string> = {
    DAY: '1 day',
    WEEKLY: '7 days',
    MONTHLY: '1 month',
  }

  const paymentColumns: Column<MyPayments>[] = [
    {
      key: 'dateOfPayment',
      title: 'Date of Payment',
      render: row => formatDate(row.dateOfPayment),
    },
    {
      key: 'endDateOfSubscription',
      title: 'End date of subscription',
      render: row => formatDate(row.endDateOfSubscription),
    },
    {
      key: 'price',
      title: 'Price',
      render: row => `$${row.price.toFixed(2)}`,
    },
    {
      key: 'subscriptionType',
      title: 'Subscription Type',
      render: row => subscriptionTypeMap[row.subscriptionType] ?? row.subscriptionType,
    },
    {
      key: 'paymentType',
      title: 'Payment Type',
      render: row => (row.paymentType === 'PAYPAL' ? 'PayPal' : 'Stripe'),
    },
  ]

  return (
    <div>
      <DataTable columns={paymentColumns} data={currentPageData} loading={false} />
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
    </div>
  )
}
