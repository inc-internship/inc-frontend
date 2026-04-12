import { Typography } from '@/shared/ui/Typography'
import { ROUTES } from '@/shared/constants'
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
      <Link href={ROUTES.register} className={s.link}>
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
