'use client'

import React from 'react'
import { Table } from '@radix-ui/themes'
import s from './Table.module.scss'

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
}

export const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  loading,
  error,
  rowKey,
}: DataTableProps<T>) => {
  if (loading) {
    //это потом
    return <span>Нету данных</span>
  }

  if (error) {
    //тоже потом
  }

  if (data?.length === 0) {
    // и это потом
    return <span>Нету данных</span>
  }

  const getRowKey = (row: T, index: number): string | number => {
    //ункция для присвоения каждой строке таблицы уникальный идентификатор, дальше для сортировки надо будет
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
        {data.map((row, index) => (
          <Table.Row key={getRowKey(row, index)} className={s.tableRow}>
            {columns.map(column => {
              const cellContent = column.render ? column.render(row) : String(row[column.key] ?? '')

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
        ))}
      </Table.Body>
    </Table.Root>
  )
}
