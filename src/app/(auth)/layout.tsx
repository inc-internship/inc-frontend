import s from './layout.module.scss'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className={s.wrapper}>{children}</div>
}
