import { useState } from 'react'

// массив с объектами, описывающими фильтры
const filters = [
  { filter: 'none', name: 'Normal' },
  { filter: 'sepia(.15) contrast(1.25) brightness(1.25) hue-rotate(5deg)', name: 'Clarendon' },
  { filter: 'sepia(.25) contrast(1.2) brightness(1.3) saturate(1.25)', name: 'Lark' },
  { filter: 'contrast(1.1) brightness(1.1)', name: 'Gingham' },
  { filter: 'grayscale(1) brightness(1.05) contrast(0.9)', name: 'Moon' },
  { filter: 'sepia(.75) contrast(.75) brightness(1.25) saturate(1.4)', name: 'Reyes' },
  { filter: 'contrast(1.1) brightness(1.25) saturate(1.1)', name: 'Perpetua' },
  { filter: ' sepia(.2) brightness(1.15) saturate(1.4)', name: 'Aden' },
  { filter: 'sepia(.5) hue-rotate(-30deg) saturate(1.4)', name: '1977' },
]

// хук
export const useFilters = () => {
  const [filtersForImages, setFiltersForImages] = useState<Record<string, string>>({}) //cостояние для фильтра, изначально - пустой объект

  const applyFilter = (imageId: string, filter: string) => {
    setFiltersForImages(prev => ({ ...prev, [imageId]: filter }))
  }

  return {
    applyFilter,
    filters,
    filtersForImages,
  }
}
