interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const STORAGE_PREFIX = 'off-cache:'
const MAX_STORED_ENTRIES = 200

export const CACHE_TTL_MS = {
  product: 24 * 60 * 60 * 1000,
  search: 60 * 60 * 1000,
} as const

const memoryCache = new Map<string, CacheEntry<unknown>>()

function hasLocalStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined'
  } catch {
    return false
  }
}

function readFromStorage<T>(key: string): CacheEntry<T> | null {
  if (!hasLocalStorage()) return null
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CacheEntry<T>
    if (typeof parsed.expiresAt !== 'number' || parsed.expiresAt < Date.now()) {
      localStorage.removeItem(STORAGE_PREFIX + key)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function evictOldestIfNeeded(): void {
  if (!hasLocalStorage()) return
  try {
    const entries: { key: string; expiresAt: number }[] = []
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (!key?.startsWith(STORAGE_PREFIX)) continue
      try {
        const parsed = JSON.parse(localStorage.getItem(key) ?? '') as CacheEntry<unknown>
        entries.push({ key, expiresAt: parsed.expiresAt ?? 0 })
      } catch {
        entries.push({ key, expiresAt: 0 })
      }
    }
    if (entries.length <= MAX_STORED_ENTRIES) return
    // Approximate LRU: entries cached earlier under the same TTL also expire earlier,
    // so evicting the soonest-to-expire entries approximates evicting the oldest ones.
    entries.sort((a, b) => a.expiresAt - b.expiresAt)
    const toRemove = entries.slice(0, entries.length - MAX_STORED_ENTRIES)
    for (const entry of toRemove) localStorage.removeItem(entry.key)
  } catch {
    // storage unavailable/full — in-memory cache still works, nothing further to do
  }
}

function writeToStorage<T>(key: string, entry: CacheEntry<T>): void {
  if (!hasLocalStorage()) return
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry))
    evictOldestIfNeeded()
  } catch {
    // storage full/unavailable (e.g. private browsing) — silently degrade to memory-only
  }
}

export function getCached<T>(key: string): T | null {
  const inMemory = memoryCache.get(key) as CacheEntry<T> | undefined
  if (inMemory && inMemory.expiresAt > Date.now()) return inMemory.data

  const stored = readFromStorage<T>(key)
  if (stored) {
    memoryCache.set(key, stored)
    return stored.data
  }
  return null
}

export function setCached<T>(key: string, data: T, ttlMs: number): void {
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs }
  memoryCache.set(key, entry)
  writeToStorage(key, entry)
}

export function clearCacheForTests(): void {
  memoryCache.clear()
  if (!hasLocalStorage()) return
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_PREFIX)) keys.push(key)
  }
  for (const key of keys) localStorage.removeItem(key)
}
