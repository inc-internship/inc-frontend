'use client'

import Image from 'next/image'
import { BaseModal, ModalClose, ModalHeader, ModalTitle } from '@/shared/ui/BaseModal'
import { CloseIcon } from '@/shared/ui/icons/CloseIcon'
import { Typography } from '@/shared/ui/Typography'
import { useI18n } from '@/shared/i18n'
import type { Post } from '@/entities/post'
import s from './ViewPostModal.module.scss'

type Props = {
  open: boolean
  post: Post | null
  onClose: () => void
}

export const ViewPostModal = ({ open, post, onClose }: Props) => {
  const { t } = useI18n()

  if (!open || !post) {
    return null
  }

  const imageUrl = post.images[0]?.url
  const description = post.description.trim() || t('post.noDescription')

  return (
    <BaseModal
      open={open}
      onOpenChange={nextOpen => !nextOpen && onClose()}
      className={s.container}
    >
      <ModalHeader className={s.header}>
        <ModalTitle className={s.title}>{t('post.viewTitle')}</ModalTitle>
        <ModalClose className={s.close} onClick={onClose} aria-label={t('post.closeView')}>
          <CloseIcon />
        </ModalClose>
      </ModalHeader>

      <div className={s.content}>
        <div className={s.imageArea}>
          {imageUrl ? (
            <div className={s.imageWrapper}>
              <Image
                src={imageUrl}
                alt={t('post.imageAlt', { login: post.owner.login })}
                fill
                unoptimized
                className={s.image}
              />
            </div>
          ) : (
            <div className={s.imageFallback}>
              <Typography variant="text-s">{t('main.noImage')}</Typography>
            </div>
          )}
        </div>

        <div className={s.info}>
          <Typography variant="text-m-bold" className={s.author}>
            {post.owner.login || t('common.user')}
          </Typography>
          <Typography variant="text-m" className={s.description}>
            {description}
          </Typography>
        </div>
      </div>
    </BaseModal>
  )
}
