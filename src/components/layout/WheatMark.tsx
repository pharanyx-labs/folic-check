export function WheatMark({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="7" className="fill-brand" />
      <path d="M16 6 L16 22 M16 22 L11 26 M16 22 L21 26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16 6 C12 9 12 13 16 15 C20 13 20 9 16 6 Z" className="fill-gold" />
      <path d="M16 10 C13 12.5 13 15 16 17 C19 15 19 12.5 16 10 Z" className="fill-gold" />
      <path d="M16 14 C13.5 16 13.5 18.5 16 20 C18.5 18.5 18.5 16 16 14 Z" className="fill-gold" />
    </svg>
  )
}
