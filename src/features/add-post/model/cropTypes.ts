import type { ImageSlide } from '@/shared/ui/ImageSlider'

export type AddPostImageSlide = ImageSlide & {
  file?: File
}

export type CropSettings = {
  aspectRatio: 'original' | '1:1' | '4:5' | '16:9'
  zoom: number
}

export type CropSettingsBySlideId = Record<string, CropSettings>
export type PartialCropSettingsBySlideId = Partial<CropSettingsBySlideId>

export type CroppingModalSliderState = {
  slides: AddPostImageSlide[]
  cropSettingsBySlideId: CropSettingsBySlideId
}
