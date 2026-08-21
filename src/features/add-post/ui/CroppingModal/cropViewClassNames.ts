import type { CropSettings } from '../../model/cropTypes'
import s from './CroppingModal.module.scss'

type CropViewClassNames = {
  image: string
  viewport: string
}

const ASPECT_RATIO_CLASS_NAMES: Record<CropSettings['aspectRatio'], CropViewClassNames> = {
  original: {
    image: s.imageOriginal,
    viewport: s.viewportOriginal,
  },
  '1:1': {
    image: s.imageCropped,
    viewport: s.viewportSquare,
  },
  '4:5': {
    image: s.imageCropped,
    viewport: s.viewportPortrait,
  },
  '16:9': {
    image: s.imageCropped,
    viewport: s.viewportLandscape,
  },
}

const MOBILE_ASPECT_RATIO_CLASS_NAMES: Partial<
  Record<CropSettings['aspectRatio'], CropViewClassNames>
> = {
  '4:5': {
    image: s.imageCropped,
    viewport: s.viewportPortraitMobile,
  },
}

export const isCropAspectRatio = (value: string): value is CropSettings['aspectRatio'] =>
  value in ASPECT_RATIO_CLASS_NAMES

export const getCropViewClassNames = (
  aspectRatio: CropSettings['aspectRatio'],
  isMobile: boolean,
) => {
  return (
    (isMobile ? MOBILE_ASPECT_RATIO_CLASS_NAMES[aspectRatio] : undefined) ??
    ASPECT_RATIO_CLASS_NAMES[aspectRatio]
  )
}
