import type { ReactNode } from 'react'

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">{children}</p>
  )
}
