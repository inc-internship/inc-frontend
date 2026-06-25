'use client'

import React, { useMemo } from 'react'
import { Select, type SelectOption } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import clsx from 'clsx'
import s from './Pagination.module.scss'

export interface PaginationProps {
  currentPage: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  disabled?: boolean
  siblingCount?: number
  labels?: {
    pageSize?: string
    first?: string
    last?: string
    previous?: string
    next?: string
  }
}

export const Pagination = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  disabled = false,
  siblingCount = 2,
  labels,
}: PaginationProps) => {
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / pageSize)),
    [totalCount, pageSize],
  )

  //  массив номеров страниц
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 5) {
      // Показываем все страницы без точек
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1) // первая страница всегда видна

      let left: number
      let right: number

      if (currentPage <= 4) {
        // Прижимаем диапазон к началу: 1 2 3 4 5 ... 10
        left = 2
        right = 5
      } else if (currentPage >= totalPages - 3) {
        // Прижимаем к концу
        left = totalPages - 4
        right = totalPages - 1
      } else {
        // окно в 5 страниц вокруг текущей
        left = currentPage - 2
        right = currentPage + 2
      }

      // Корректируем границы, чтобы не выйти за пределы
      left = Math.max(2, left)
      right = Math.min(totalPages - 1, right)

      // Левое многоточие, если есть пропуск после 1
      if (left > 2) {
        pages.push('ellipsis')
      }

      // Средние страницы
      for (let i = left; i <= right; i++) {
        pages.push(i)
      }

      // Правое многоточие, если есть пропуск перед последней
      if (right < totalPages - 1) {
        pages.push('ellipsis')
      }

      pages.push(totalPages) // последняя страница
    }

    return pages
  }, [currentPage, totalPages])

  // если записей нет или одна страница и не нужен выбор размера — можно не рендерить
  if (totalCount === 0 && !onPageSizeChange) return null

  const sizeOptions: SelectOption[] = pageSizeOptions.map(size => ({
    value: String(size),
    label: String(size),
  }))

  const selectedSize = String(pageSize)

  const handleSizeChange = (value: string) => {
    const newSize = Number(value)
    if (isNaN(newSize)) return
    onPageSizeChange?.(newSize)
    //при смене размера страницы сбрасывает на первую
    onPageChange(1)
  }

  // Обработчики с проверкой границ
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || disabled) return
    onPageChange(page)
  }

  return (
    <nav className={clsx(s.pagination, disabled && s.disabled)} aria-label="Pagination">
      <div className={s.controls}>
        <Button
          variant="default"
          iconOnly
          disabled={disabled || currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          ‹
        </Button>

        <div className={s.pages}>
          {pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className={s.ellipsis}>
                  …
                </span>
              )
            }
            return (
              <Button
                key={page}
                variant="default"
                disabled={disabled}
                onClick={() => goToPage(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                className={
                  page === currentPage
                    ? `${s.paginationButton} ${s.paginationButtonActive}`
                    : s.paginationButton
                }
              >
                {page}
              </Button>
            )
          })}
        </div>

        <Button
          variant="default"
          iconOnly
          disabled={disabled || currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          ›
        </Button>
      </div>
      {onPageSizeChange && (
        <div className={s.pageSizeSelector}>
          <span>Show</span>
          <Select
            options={sizeOptions}
            value={selectedSize}
            onChange={handleSizeChange}
            placeholder={labels?.pageSize}
            disabled={disabled}
            className={s.paginationSelect}
          />
          <span>on page</span>
        </div>
      )}
    </nav>
  )
}
