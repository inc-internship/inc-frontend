import { LegalPage } from '@/views/legal/ui/LegalPage'
import { PRIVACY_TEXT } from '@/views/legal/content/privacy'

export function PrivacyPolicyPage() {
  return (
    <>
      <LegalPage title={'Privacy Policy'} content={PRIVACY_TEXT} />
    </>
  )
}
