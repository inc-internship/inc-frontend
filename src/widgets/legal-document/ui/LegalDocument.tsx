import { Typography } from '@/shared/ui/Typography'
import Link from 'next/link'
import s from './LegalDocument.module.scss'
import { ArrowBack } from './icons/ArrowBack'

type Props = {
  title: string
  content: string
}

export const LegalDocument = ({ title, content }: Props) => (
  <>
    <div className={s.linkContainer}>
      <Link href="/sign-up" className={s.link}>
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
