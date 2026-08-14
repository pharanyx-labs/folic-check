import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NavBar, NAV_ITEMS } from './NavBar'
import { ThemeToggle } from './ThemeToggle'
import { WheatMark } from './WheatMark'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <WheatMark />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">Folic-Alert</span>
        </Link>

        <div className="flex items-center gap-3">
          <NavBar />
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <Link
            to="/profile"
            className="hidden rounded-md border border-line px-3 py-2 text-sm font-medium text-ink-muted hover:border-brand hover:text-brand lg:inline-flex"
          >
            Profile
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-line p-2 text-ink lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span aria-hidden="true" className="block h-4 w-5">
              <span className={`block h-0.5 w-5 bg-current transition-transform ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`mt-1 block h-0.5 w-5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`mt-1 block h-0.5 w-5 bg-current transition-transform ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="border-t border-line px-4 pb-4 pt-2 lg:hidden">
          <nav aria-label="Main" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-line/40 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-line/40 hover:text-ink"
            >
              Profile
            </Link>
          </nav>
          <div className="mt-3">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  )
}
