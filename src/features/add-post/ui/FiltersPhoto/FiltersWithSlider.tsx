import { AddPostImageSlider } from '../AddPostImageSlider/AddPostImageSlider'
import { FiltersPhoto } from '../FiltersPhoto/FiltersPhoto'
import { IMAGE_INPUT_ACCEPT } from '../../model/fileValidation'
import s from './FiltersWithSlider.module.scss'
import { ImageSlide } from '@/shared/ui/ImageSlider'

type FilterItem = {
  filter: string
  name: string
}

type FiltersWithSliderProps = {
  slides: ImageSlide[]
  activeSlideId?: string
  isThumbsOpen: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  filters: FilterItem[]
  filtersForImages: Record<string, string>
  onFilesSelected: (event: React.ChangeEvent<HTMLInputElement>) => void
  onAddImage: () => void
  onRemoveImage: (id: string) => void
  onSelectSlide: (id: string) => void
  onToggleThumbs: () => void
  onApplyFilter: (filter: string) => void
}

export const FiltersWithSlider = ({
  slides,
  activeSlideId,
  isThumbsOpen,
  fileInputRef,
  filters,
  filtersForImages,
  onFilesSelected,
  onAddImage,
  onRemoveImage,
  onSelectSlide,
  onToggleThumbs,
  onApplyFilter,
}: FiltersWithSliderProps) => {
  const currentFilter = activeSlideId ? filtersForImages[activeSlideId] || 'none' : 'none'

  const getImageStyleForSlide = (slide: ImageSlide) => {
    const filterValue = filtersForImages[slide.id]
    if (!filterValue || filterValue === 'none') return {}
    return { filter: filterValue }
  }

  return (
    <div className={s.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_INPUT_ACCEPT}
        multiple
        hidden
        onChange={onFilesSelected}
      />

      <div className={s.sliderWrapper}>
        <AddPostImageSlider
          slides={slides}
          activeSlideId={activeSlideId}
          isThumbsOpen={isThumbsOpen}
          onToggleThumbs={onToggleThumbs}
          onSelectSlide={onSelectSlide}
          onAddImage={onAddImage}
          onRemoveImage={onRemoveImage}
          getImageStyle={getImageStyleForSlide}
        />
      </div>

      {activeSlideId && (
        <FiltersPhoto
          slides={slides}
          activeSlideId={activeSlideId}
          filters={filters}
          currentFilter={currentFilter}
          onApplyFilter={onApplyFilter}
        />
      )}
    </div>
  )
}
