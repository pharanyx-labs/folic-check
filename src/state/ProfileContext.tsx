import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { createDefaultProfile, type RiskProfile } from '../domain/profile/riskProfile'
import { useLocalStorage } from './useLocalStorage'

interface ProfileState {
  profiles: RiskProfile[]
  activeProfileId: string
}

const STORAGE_KEY = 'folic-alert:profiles'

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function initialState(): ProfileState {
  const first = createDefaultProfile(createId(), 'My profile')
  return { profiles: [first], activeProfileId: first.id }
}

interface ProfileContextValue {
  profiles: RiskProfile[]
  activeProfile: RiskProfile
  setActiveProfileId: (id: string) => void
  updateProfile: (id: string, updates: Partial<Omit<RiskProfile, 'id'>>) => void
  addProfile: (name: string) => void
  removeProfile: (id: string) => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<ProfileState>(STORAGE_KEY, initialState())
  const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId) ?? state.profiles[0]

  const value = useMemo<ProfileContextValue>(
    () => ({
      profiles: state.profiles,
      activeProfile,
      setActiveProfileId: (id) => setState((prev) => ({ ...prev, activeProfileId: id })),
      updateProfile: (id, updates) =>
        setState((prev) => ({
          ...prev,
          profiles: prev.profiles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      addProfile: (name) =>
        setState((prev) => {
          const newProfile = createDefaultProfile(createId(), name)
          return { profiles: [...prev.profiles, newProfile], activeProfileId: newProfile.id }
        }),
      removeProfile: (id) =>
        setState((prev) => {
          if (prev.profiles.length <= 1) return prev // always keep at least one profile
          const remaining = prev.profiles.filter((p) => p.id !== id)
          const activeProfileId = prev.activeProfileId === id ? remaining[0].id : prev.activeProfileId
          return { profiles: remaining, activeProfileId }
        }),
    }),
    [state, activeProfile, setState],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider')
  return ctx
}
