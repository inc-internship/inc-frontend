'use client'

import { PRIVACY_TEXT } from '../model/privacy-text'
import { LegalDocument } from '@/widgets/legal-document'
import { useI18n } from '@/shared/i18n'

export function PrivacyPolicyPage() {
  const { t } = useI18n()

  return <LegalDocument title={t('legal.privacyPolicyTitle')} content={PRIVACY_TEXT} />
}
