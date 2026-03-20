import { TERMS_TEXT } from '../model/terms-text'
import { LegalDocument } from '@/widgets/legal-document'

export function TermsOfServicePage() {
  return <LegalDocument title="Terms of service" content={TERMS_TEXT} />
}
