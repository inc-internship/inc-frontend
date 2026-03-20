import { LegalPage } from '@/widgets/legal/ui/LegalPage'
import { TERMS_TEXT } from '@/shared/content/terms'

export function TermsOfServicePage() {
  return (
    <>
      <LegalPage title={'Terms of service'} content={TERMS_TEXT} />
    </>
  )
}
