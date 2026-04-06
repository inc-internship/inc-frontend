'use client'

import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '../config/store'

type StoreProviderProps = Readonly<{
  children: ReactNode
}>

export function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>
}
