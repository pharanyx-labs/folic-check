import { useTheme } from '../../state/ThemeContext'

const OPTIONS: { value: 'system' | 'light' | 'dark'; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀' },
  { value: 'dark', label: 'Dark', icon: '☾' },
  { value: 'system', label: 'System', icon: '◐' },
]

export function ThemeToggle() {
  const { preference, setPreference } = useTheme()

  return (
    <div className="inline-flex rounded-md border border-line p-0.5" role="radiogroup" aria-label="Colour theme">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={preference === opt.value}
          onClick={() => setPreference(opt.value)}
          title={opt.label}
          className={`rounded px-2 py-1 text-sm transition-colors ${
            preference === opt.value ? 'bg-brand text-white' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <span aria-hidden="true">{opt.icon}</span>
          <span className="sr-only">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
