import s from './AddComment.module.scss'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'

export const AddComment = () => {
  return (
    <div className={s.container}>
      <Input wrapperClassName={s.inputWrapper} className={s.input} placeholder="Add a Comment..." />
      <Button className={s.button}>Publish</Button>
    </div>
  )
}
