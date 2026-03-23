export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div style={{ padding: '0 64px' }}>{children}</div>
}
