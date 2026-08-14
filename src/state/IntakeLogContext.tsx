import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { createLogEntry, type IntakeLogEntry } from '../domain/intake/intakeLog'
import { useLocalStorage } from './useLocalStorage'

interface IntakeLogContextValue {
  entries: IntakeLogEntry[]
  addEntry: (entry: Omit<IntakeLogEntry, 'id' | 'timestampMs'>) => void
  removeEntry: (id: string) => void
  clearAll: () => void
}

const IntakeLogContext = createContext<IntakeLogContextValue | null>(null)

export function IntakeLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useLocalStorage<IntakeLogEntry[]>('folic-alert:intake-log', [])

  const value = useMemo<IntakeLogContextValue>(
    () => ({
      entries,
      addEntry: (entry) => setEntries((prev) => [...prev, createLogEntry(entry)]),
      removeEntry: (id) => setEntries((prev) => prev.filter((e) => e.id !== id)),
      clearAll: () => setEntries([]),
    }),
    [entries, setEntries],
  )

  return <IntakeLogContext.Provider value={value}>{children}</IntakeLogContext.Provider>
}

export function useIntakeLog(): IntakeLogContextValue {
  const ctx = useContext(IntakeLogContext)
  if (!ctx) throw new Error('useIntakeLog must be used within an IntakeLogProvider')
  return ctx
}
