import { Typography } from '@/shared/ui/Typography'
import s from './ExtraInfo.module.scss'
import { useI18n } from '@/shared/i18n'

export const ExtraInfo = () => {
  const { t } = useI18n()

  return (
    <Typography className={s.extraInfo} variant="text-s">
      <span>2 {t('post.postedAgo')}</span>
      <span>{t('post.liked')}: 1</span>
      <span>{t('post.reply')}</span>
    </Typography>
  )
}
