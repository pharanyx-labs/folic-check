import { Button } from '../ui/Button'

export function ShareReportButton() {
  return (
    <Button variant="secondary" size="sm" className="no-print" onClick={() => window.print()}>
      Print / save report
    </Button>
  )
}
