import { useState } from 'react'
import { useProfile } from '../../state/ProfileContext'
import { Button } from '../ui/Button'

export function ProfileSwitcher() {
  const { profiles, activeProfile, setActiveProfileId, addProfile, removeProfile } = useProfile()
  const [newName, setNewName] = useState('')

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {profiles.map((profile) => (
          <div key={profile.id} className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveProfileId(profile.id)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                profile.id === activeProfile.id
                  ? 'border-brand bg-brand text-white'
                  : 'border-line text-ink-muted hover:border-brand hover:text-brand'
              }`}
            >
              {profile.name}
            </button>
            {profiles.length > 1 && (
              <button
                type="button"
                onClick={() => removeProfile(profile.id)}
                aria-label={`Remove ${profile.name}`}
                className="text-ink-muted hover:text-status-contains"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!newName.trim()) return
          addProfile(newName.trim())
          setNewName('')
        }}
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add a family member…"
          className="rounded-md border border-line bg-surface px-3 py-1.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand"
        />
        <Button type="submit" variant="secondary" size="sm">
          Add profile
        </Button>
      </form>
    </div>
  )
}
