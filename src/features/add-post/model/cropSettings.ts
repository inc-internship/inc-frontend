'use client'

import type { CropSettings, PartialCropSettingsBySlideId } from './cropTypes'

export const DEFAULT_CROP_SETTINGS: CropSettings = {
  aspectRatio: 'original',
  zoom: 0,
}

const MIN_ZOOM = 0
const MAX_ZOOM = 100
const MIN_SCALE = 1
const MAX_SCALE = 2

export const getCropSettings = (
  cropSettingsBySlideId: PartialCropSettingsBySlideId,
  slideId?: string,
): CropSettings => {
  if (!slideId) {
    return DEFAULT_CROP_SETTINGS
  }

  return cropSettingsBySlideId[slideId] ?? DEFAULT_CROP_SETTINGS
}

export const getScaleFromZoom = (zoom: number) =>
  MIN_SCALE + (Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM) / MAX_ZOOM) * (MAX_SCALE - MIN_SCALE)
