'use client'

import { useAddPostImages } from '../../model/useAddPostImages'

type Props = {
  fileInputRef: ReturnType<typeof useAddPostImages>['fileInputRef']
  onFilesSelected: ReturnType<typeof useAddPostImages>['handleFilesSelected']
}

export const HiddenImageInput = ({ fileInputRef, onFilesSelected }: Props) => (
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    multiple
    hidden
    onChange={onFilesSelected}
  />
)
