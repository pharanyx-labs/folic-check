import { Outlet } from 'react-router-dom'
import { DisclaimerBanner } from './DisclaimerBanner'
import { Footer } from './Footer'
import { Header } from './Header'

export function AppLayout() {
  return (
    <div className="flex min-h-full flex-col">
      <DisclaimerBanner />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
