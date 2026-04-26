'use client'

import { useAddPostImages } from '../../model/useAddPostImages'
import { IMAGE_INPUT_ACCEPT } from '../../model/fileValidation'

type Props = {
  fileInputRef: ReturnType<typeof useAddPostImages>['fileInputRef']
  onFilesSelected: ReturnType<typeof useAddPostImages>['handleFilesSelected']
}

export const HiddenImageInput = ({ fileInputRef, onFilesSelected }: Props) => (
  <input
    ref={fileInputRef}
    type="file"
    accept={IMAGE_INPUT_ACCEPT}
    multiple
    hidden
    onChange={onFilesSelected}
  />
)
