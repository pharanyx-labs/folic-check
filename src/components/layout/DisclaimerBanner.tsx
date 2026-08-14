interface DisclaimerBannerProps {
  variant?: 'strip' | 'inline'
}

/**
 * Rendered persistently at the top of every page (`strip`) and again inline inside
 * any component that shows a health-relevant verdict (`inline`) — deliberately
 * unavoidable at the moment folic-acid-related text is shown to the user.
 */
export function DisclaimerBanner({ variant = 'strip' }: DisclaimerBannerProps) {
  if (variant === 'inline') {
    return (
      <p className="rounded-md border border-line bg-paper px-3 py-2 text-xs leading-relaxed text-ink-muted">
        <strong className="text-ink">Not medical advice.</strong> Fortification is rolling out gradually and
        product data can lag — always check the physical label.
      </p>
    )
  }

  return (
    <div className="no-print border-b border-line bg-status-likely-bg">
      <p className="mx-auto w-full max-w-5xl px-4 py-2 text-center text-xs font-medium text-ink sm:px-6">
        General information only, not medical advice — always check the physical product label.
      </p>
    </div>
  )
}
