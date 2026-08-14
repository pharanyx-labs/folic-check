import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'

export function NotFoundPage() {
  return (
    <Container className="py-20 text-center">
      <p className="font-display text-2xl font-semibold text-ink">Page not found</p>
      <p className="mt-2 text-sm text-ink-muted">
        <Link to="/" className="text-brand hover:underline">
          Back to search
        </Link>
      </p>
    </Container>
  )
}
