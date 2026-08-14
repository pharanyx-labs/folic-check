import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initialValue
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // storage unavailable/full — state still updates in memory for this session
        }
        return next
      })
    },
    [key],
  )

  useEffect(() => {
    function handleExternalChange(event: StorageEvent) {
      if (event.key !== key) return
      try {
        setState(event.newValue !== null ? (JSON.parse(event.newValue) as T) : initialValue)
      } catch {
        // ignore malformed external write
      }
    }
    window.addEventListener('storage', handleExternalChange)
    return () => window.removeEventListener('storage', handleExternalChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [state, setValue]
}
