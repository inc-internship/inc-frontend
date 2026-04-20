import { type ImageSlide } from '@/shared/ui/ImageSlider'

import clsx from 'clsx'
import Image from 'next/image'

import s from './FiltersPhoto.module.scss'
import { Typography } from '@/shared/ui/Typography'

type Props = {
  slides: ImageSlide[]
  activeSlideId?: string
  filters: { filter: string; name: string }[]
  currentFilter: string
  onApplyFilter: (filter: string) => void
}

export const FiltersPhoto = ({
  slides,
  activeSlideId,
  filters,
  currentFilter,
  onApplyFilter,
}: Props) => {
  const activeSlide = slides.find(s => s.id === activeSlideId) ?? slides[0]
  const activeSrc = (activeSlide?.displaySrc ?? activeSlide?.src) as string

  if (!activeSlide) return null

  return (
    <div className={s.wrapper}>
      <div className={s.filters}>
        <div className={s.filtersInner}>
          {filters.map(item => (
            <button
              className={clsx(s.filterButton, {
                [s.active]: currentFilter === item.filter,
              })}
              key={item.name}
              onClick={() => onApplyFilter(item.filter)}
              type="button"
            >
              <Image
                alt={activeSlide.alt}
                className={s.filterThumbnail}
                height={100}
                src={activeSrc}
                style={{ filter: item.filter }}
                width={100}
              />
              <Typography className={s.filterName} variant="text-l" align="center">
                {item.name}
              </Typography>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
