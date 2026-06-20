'use client'

import React from 'react'
import { Table } from '@radix-ui/themes'
import s from './Table.module.scss'
import { Spinner } from '@/shared/ui/Spinner'
import { Typography } from '@/shared/ui/Typography'
import { useI18n } from '@/shared/i18n'

export type Column<T = unknown> = {
  key: string
  title: string
  isRowHeader?: boolean
  render?: (row: T) => React.ReactNode
}

export type DataTableProps<T = unknown> = {
  columns: Column<T>[]
  data: T[]
  loading: boolean
  error?: string | null
  rowKey?: (row: T) => string | number
  emptyMessage?: string
}

export const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  loading,
  error,
  rowKey,
  emptyMessage,
}: DataTableProps<T>) => {
  const { t } = useI18n()

  if (loading)
    return (
      <div className={s.spinnerContainer}>
        <Spinner size="lg" />
      </div>
    )
  const emptyText = emptyMessage ?? t('common.noData')

  if (error) {
    return (
      <Table.Root className={s.table}>
        <Table.Header className={s.tableHeader}>
          <Table.Row className={s.tableRow}>
            {columns.map(column => (
              <Table.ColumnHeaderCell key={column.key}>{column.title}</Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row className={s.tableRow}>
            <Table.Cell colSpan={columns.length} className={s.errorCell}>
              <Typography variant="text-m" align="center">
                {error}
              </Typography>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    )
  }

  const getRowKey = (row: T, index: number): string | number => {
    if (rowKey) {
      return rowKey(row)
    }
    return index
  }

  return (
    <Table.Root className={s.table}>
      <Table.Header className={s.tableHeader}>
        <Table.Row className={s.tableRow}>
          {columns.map(column => (
            <Table.ColumnHeaderCell key={column.key}>{column.title}</Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.length > 0 ? (
          data.map((row, index) => (
            <Table.Row key={getRowKey(row, index)} className={s.tableRow}>
              {columns.map(column => {
                const cellContent = column.render
                  ? column.render(row)
                  : String(row[column.key] ?? '')

                return column.isRowHeader ? (
                  <Table.RowHeaderCell key={column.key} data-label={column.title}>
                    {cellContent}
                  </Table.RowHeaderCell>
                ) : (
                  <Table.Cell key={column.key} data-label={column.title}>
                    {cellContent}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          ))
        ) : (
          <Table.Row className={s.tableRow}>
            <Table.Cell colSpan={columns.length} className={s.emptyCell}>
              <Typography variant="text-m" align="center">
                {emptyText}
              </Typography>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  )
}
