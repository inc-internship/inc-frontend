import { PRIVACY_TEXT } from '../model/privacy-text'
import { LegalDocument } from '@/widgets/legal-document'

export function PrivacyPolicyPage() {
  return <LegalDocument title="Privacy Policy" content={PRIVACY_TEXT} />
}
