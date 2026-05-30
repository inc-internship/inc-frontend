import { Content } from './Content/Content'
import s from './Comment.module.scss'
import { Post } from '@/entities/post'
import { ExtraInfo } from './ExtraInfo/ExtraInfo'

type Props = {
  post: Post
}

export const Comment = ({ post }: Props) => (
  <div className={s.container}>
    <Content post={post} />
    <ExtraInfo />
  </div>
)
