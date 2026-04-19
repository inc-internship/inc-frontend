import { useAddPostImages } from '../../model/useAddPostImages'
import { useFilters } from '../../model/useFilter'
import { AddPostImageSlider } from '../AddPostImageSlider/AddPostImageSlider'
import { FiltersPhoto } from '../FiltersPhoto/FiltersPhoto'
import s from './FiltersWithSlider.module.scss'

export const FiltersWithSlider = () => {
  const {
    slides,
    activeSlideId,
    isThumbsOpen,
    fileInputRef,
    handleFilesSelected,
    openFilePicker,
    removeImage,
    selectSlide,
    toggleThumbs,
  } = useAddPostImages({ maxImages: 10 })

  const { applyFilter, filters, filtersForImages } = useFilters()
  const currentFilter = activeSlideId ? filtersForImages[activeSlideId] || 'none' : 'none'

  return (
    <div className={s.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFilesSelected}
      />

      <div className={s.sliderWrapper}>
        <AddPostImageSlider
          slides={slides}
          activeSlideId={activeSlideId}
          isThumbsOpen={isThumbsOpen}
          onToggleThumbs={toggleThumbs}
          onSelectSlide={selectSlide}
          onAddImage={openFilePicker}
          onRemoveImage={removeImage}
          imageFilter={currentFilter}
        />
      </div>

      {/* Панель фильтров с превью */}
      {activeSlideId && (
        <FiltersPhoto
          slides={slides}
          activeSlideId={activeSlideId}
          filters={filters}
          currentFilter={currentFilter}
          onApplyFilter={filter => applyFilter(activeSlideId, filter)}
        />
      )}
    </div>
  )
}
