'use client'

import { AuthProvider } from './context/AuthContext'
import { ProgramProvider } from './context/ProgramContext'
import { DailyCompassProvider } from './context/DailyCompassContext'

export function Providers({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <AuthProvider>
      <ProgramProvider>
        <DailyCompassProvider>
          {children}
        </DailyCompassProvider>
      </ProgramProvider>
    </AuthProvider>
  )
}
