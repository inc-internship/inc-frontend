import s from './AddComment.module.scss'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { useI18n } from '@/shared/i18n'

export const AddComment = () => {
  const { t } = useI18n()

  return (
    <div className={s.container}>
      <Input
        wrapperClassName={s.inputWrapper}
        className={s.input}
        placeholder={`${t('post.addComment')}...`}
      />
      <Button className={s.button}>{t('post.sendComment')}</Button>
    </div>
  )
}
