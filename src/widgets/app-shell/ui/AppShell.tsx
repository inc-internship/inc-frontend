import { ReactNode } from 'react'
import { Sidebar } from '@/widgets/sidebar'
import s from './AppShell.module.scss'

type Props = {
  children: ReactNode
  /** Слот для сайдбара. По умолчанию обычный Sidebar, но можно передать SidebarSkeleton и т.п. */
  sidebar?: ReactNode
}

export const AppShell = ({ children, sidebar = <Sidebar /> }: Props) => (
  <div className={s.page}>
    {sidebar}
    <main className={s.content}>{children}</main>
  </div>
)
