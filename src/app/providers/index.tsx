import type { ReactNode } from 'react'
import { StoreProvider } from './store'

type AppProvidersProps = Readonly<{
  children: ReactNode
}>

export function AppProviders({ children }: AppProvidersProps) {
  return <StoreProvider>{children}</StoreProvider>
}
