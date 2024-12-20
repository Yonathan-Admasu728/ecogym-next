'use client'

import { AuthProvider } from './context/AuthContext'
import { ProgramProvider } from './context/ProgramContext'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProgramProvider>
        {children}
      </ProgramProvider>
    </AuthProvider>
  )
}
