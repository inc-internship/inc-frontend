import type { ImageSlide } from '@/shared/ui/ImageSlider'

export type AddPostImageSlide = ImageSlide & {
  file?: File
}

export type CropSettings = {
  aspectRatio: 'original' | '1:1' | '4:5' | '16:9'
  zoom: number
}
