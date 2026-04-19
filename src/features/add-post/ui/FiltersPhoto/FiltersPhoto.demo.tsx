'use client'

import s from './FiltersPhoto.demo.module.scss'
import { FiltersWithSlider } from '@/features/add-post/ui/FiltersPhoto/FiltersWithSlider'

export const FiltersPhotoDemo = () => {
  return (
    <div>
      <h2>Тест компонента FiltersPhoto</h2>
      <div className={s.container}>
        <FiltersWithSlider />
      </div>
    </div>
  )
}
