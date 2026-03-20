import { LegalPage } from '@/views/legal/ui/LegalPage'
import { TERMS_TEXT } from '@/views/legal/content/terms'

export function TermsOfServicePage() {
  return (
    <>
      <LegalPage title={'Terms of service'} content={TERMS_TEXT} />
    </>
  )
}
