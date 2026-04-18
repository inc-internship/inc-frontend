'use client'

import type { CropSettings } from '../../model/cropTypes'
import { AspectRatioButton } from './AspectRatioButton/AspectRatioButton'
import { MaximizeButton } from './MaximizeButton/MaximizeButton'

type Props = {
  activeSlideId?: string
  cropSettings: CropSettings
  onAspectRatioChange: (value: CropSettings['aspectRatio']) => void
  onZoomChange: (value: number) => void
}

export const CropControls = ({
  activeSlideId,
  cropSettings,
  onAspectRatioChange,
  onZoomChange,
}: Props) => {
  const controlKey = activeSlideId ?? 'no-active-slide'

  return (
    <>
      <AspectRatioButton
        key={controlKey}
        defaultValue={cropSettings.aspectRatio}
        onChange={value => onAspectRatioChange(value as CropSettings['aspectRatio'])}
      />
      <MaximizeButton
        key={`zoom-${controlKey}`}
        defaultValue={cropSettings.zoom}
        onChange={onZoomChange}
      />
    </>
  )
}
