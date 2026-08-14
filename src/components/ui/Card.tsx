import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
