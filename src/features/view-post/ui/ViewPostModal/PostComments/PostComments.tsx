import s from './PostComments.module.scss'
import { Post } from '@/entities/post'
import { Comment } from './Comment/Comment'

type Props = {
  post: Post
}

export const PostComments = ({ post }: Props) => {
  const comments = [post, post, post, post]

  return (
    <div className={s.container}>
      <>
        <Comment post={post} />
        {comments.map((comment, index) => (
          <Comment key={index} post={comment} />
        ))}
      </>
    </div>
  )
}
