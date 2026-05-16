'use client'

import React from 'react'
import { Table } from '@radix-ui/themes'

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
  rowKey?: keyof T | ((row: T) => string | number)
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
  }

  if (error) {
    //тоже потом
  }

  if (data.length === 0) {
    // и это потом
  }

  const getRowKey = (row: T, index: number): string | number => {
    //ункция для присвоения каждой строке таблицы уникальный идентификатор, дальше для сортировки надо будет
    if (typeof rowKey === 'function') return rowKey(row)
    if (rowKey) return row[rowKey]
    return index
  }

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          {columns.map(column => (
            <Table.ColumnHeaderCell key={column.key}>{column.title}</Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((row, index) => (
          <Table.Row key={getRowKey(row, index)}>
            {columns.map(column => {
              const cellContent = column.render ? column.render(row) : String(row[column.key] ?? '')

              return column.isRowHeader ? (
                <Table.RowHeaderCell key={column.key}>{cellContent}</Table.RowHeaderCell>
              ) : (
                <Table.Cell key={column.key}>{cellContent}</Table.Cell>
              )
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
