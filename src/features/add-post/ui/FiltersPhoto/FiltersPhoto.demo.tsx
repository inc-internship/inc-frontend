'use client'

import s from './FiltersPhoto.demo.module.scss'
import { useState } from 'react'
import { FiltersModal } from '@/features/add-post/ui/FiltersPhoto/FiltersModal'
import { ImageSlide } from '@/shared/ui/ImageSlider'
import { FiltersModalResult } from '@/features/add-post/model/filters/useFiltersModal'

const mockSlides: ImageSlide[] = [
  {
    id: '1',
    alt: 'Mountain',
    src: '/images/demo/instagram.jpg',
  },
  {
    id: '2',
    alt: 'River',
    src: '/images/demo/plane.jpeg',
  },
]

export const FiltersPhotoDemo = () => {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<FiltersModalResult[] | null>(null)

  const handleNext = async (results: FiltersModalResult[]) => {
    console.log('Filters applied:', results)
    setResult(results)
    setOpen(false)
    // здесь можно показать результат на странице
  }
  return (
    <div>
      <h2>Тест компонента FiltersPhoto</h2>
      <div className={s.container}>
        <div style={{ padding: '2rem' }}>
          <button onClick={() => setOpen(true)}>Открыть FiltersModal</button>

          <FiltersModal
            open={open}
            onOpenChange={setOpen}
            initialSlides={mockSlides}
            maxImages={10}
            onNext={handleNext}
          />

          {result && <pre style={{ marginTop: '1rem' }}>{JSON.stringify(result, null, 2)}</pre>}
        </div>
      </div>
    </div>
  )
}
