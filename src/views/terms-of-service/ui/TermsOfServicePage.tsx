'use client'

import { TERMS_TEXT } from '../model/terms-text'
import { LegalDocument } from '@/widgets/legal-document'
import { useI18n } from '@/shared/i18n'

export function TermsOfServicePage() {
  const { t } = useI18n()

  return <LegalDocument title={t('legal.termsOfServiceTitle')} content={TERMS_TEXT} />
}
