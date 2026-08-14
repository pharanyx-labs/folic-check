import { ProfileForm } from '../components/profile/ProfileForm'
import { ProfileSwitcher } from '../components/profile/ProfileSwitcher'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { useProfile } from '../state/ProfileContext'

export function ProfileSettingsPage() {
  const { activeProfile, updateProfile } = useProfile()

  return (
    <Container className="py-10">
      <Eyebrow>Personalization</Eyebrow>
      <h1 className="font-display text-2xl font-semibold text-ink">Risk profile</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Stored only on this device (never sent anywhere), and used to tailor the guidance shown on product
        reports. This is general information, not medical advice.
      </p>

      <div className="mt-6">
        <ProfileSwitcher />
      </div>

      <div className="mt-8 max-w-xl">
        <ProfileForm profile={activeProfile} onChange={(updates) => updateProfile(activeProfile.id, updates)} />
      </div>
    </Container>
  )
}
