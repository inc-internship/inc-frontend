import { LegalPage } from '@/widgets/legal/ui/LegalPage'
import { PRIVACY_TEXT } from '@/shared/content/privacy'

export function PrivacyPolicyPage() {
  return (
    <>
      <LegalPage title={'Privacy Policy'} content={PRIVACY_TEXT} />
    </>
  )
}
