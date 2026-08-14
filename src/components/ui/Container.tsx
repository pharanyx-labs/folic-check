import type { HTMLAttributes, ReactNode } from 'react'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Container({ className = '', children, ...rest }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-4xl px-4 sm:px-6 ${className}`} {...rest}>
      {children}
    </div>
  )
}
