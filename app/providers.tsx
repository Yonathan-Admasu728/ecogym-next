'use client';

import { AuthProvider } from './context/AuthContext'
import { ProgramProvider } from './context/ProgramContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProgramProvider>
        {children}
      </ProgramProvider>
    </AuthProvider>
  )
}
