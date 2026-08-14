import type { AgeBand, RiskProfile } from '../../domain/profile/riskProfile'

const AGE_BAND_OPTIONS: { value: AgeBand; label: string }[] = [
  { value: 'under_18', label: 'Under 18' },
  { value: '18_49', label: '18–49' },
  { value: '50_plus', label: '50 or over' },
]

export function ProfileForm({
  profile,
  onChange,
}: {
  profile: RiskProfile
  onChange: (updates: Partial<Omit<RiskProfile, 'id'>>) => void
}) {
  return (
    <div className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-ink">Profile name</span>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-ink focus:border-brand sm:max-w-xs"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-ink">Age band</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {AGE_BAND_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ageBand: profile.ageBand === opt.value ? null : opt.value })}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                profile.ageBand === opt.value
                  ? 'border-brand bg-brand text-white'
                  : 'border-line text-ink-muted hover:border-brand hover:text-brand'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3">
        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={profile.pregnantOrTTC}
            onChange={(e) => onChange({ pregnantOrTTC: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-line accent-brand"
          />
          <span className="text-sm text-ink">Pregnant, or trying to conceive</span>
        </label>
        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={profile.hasB12Issues}
            onChange={(e) => onChange({ hasB12Issues: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-line accent-brand"
          />
          <span className="text-sm text-ink">Known vitamin B12 deficiency or absorption issues</span>
        </label>
        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={profile.hasAdenomaHistory}
            onChange={(e) => onChange({ hasAdenomaHistory: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-line accent-brand"
          />
          <span className="text-sm text-ink">History of colorectal adenomas (polyps)</span>
        </label>
      </div>
    </div>
  )
}
