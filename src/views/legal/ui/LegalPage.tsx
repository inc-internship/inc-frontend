import { Typography } from '@/shared/ui/Typography'
import Link from 'next/link'
import s from './LegalPage.module.scss'
import { ArrowBack } from '@/views/legal/icons/ArrowBack'

type Props = {
  title: string
  content: string
}

export function LegalPage({ title, content }: Props) {
  return (
    <>
      <div className={s.linkContainer}>
        <Link href="/" className={s.link}>
          <Typography variant="text-m" as="span">
            <ArrowBack />
            Back to Sign Up
          </Typography>
        </Link>
      </div>

      <div className={s.textContainer}>
        <Typography variant="h1">{title}</Typography>
        <Typography variant="text-m">{content}</Typography>
      </div>
    </>
  )
}
