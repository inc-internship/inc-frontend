import { SharedHeader } from '@/widgets/header/shared-header'

export default function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SharedHeader />
      {children}
    </>
  )
}
