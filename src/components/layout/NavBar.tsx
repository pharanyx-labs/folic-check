import { NavLink } from 'react-router-dom'

export const NAV_ITEMS: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Search', end: true },
  { to: '/foods', label: 'Safe foods' },
  { to: '/compare', label: 'Compare' },
  { to: '/track', label: 'Tracker' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/tips', label: 'Label tips' },
  { to: '/about', label: 'Policy & science' },
  { to: '/news', label: 'News' },
]

function linkClasses(isActive: boolean): string {
  return `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'text-brand' : 'text-ink-muted hover:text-ink'
  }`
}

export function NavBar({ onNavigate, orientation = 'horizontal' }: { onNavigate?: () => void; orientation?: 'horizontal' | 'vertical' }) {
  return (
    <nav
      aria-label="Main"
      className={orientation === 'horizontal' ? 'hidden items-center gap-1 lg:flex' : 'flex flex-col gap-1'}
    >
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate} className={({ isActive }) => linkClasses(isActive)}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
