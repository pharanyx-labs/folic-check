import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ComparePage } from './pages/ComparePage'
import { EducationPolicyPage } from './pages/EducationPolicyPage'
import { HomeSearchPage } from './pages/HomeSearchPage'
import { IntakeTrackerPage } from './pages/IntakeTrackerPage'
import { LabelTipsPage } from './pages/LabelTipsPage'
import { NewsPage } from './pages/NewsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductReportPage } from './pages/ProductReportPage'
import { ProfileSettingsPage } from './pages/ProfileSettingsPage'
import { RecipesPage } from './pages/RecipesPage'
import { SafeFoodsBrowserPage } from './pages/SafeFoodsBrowserPage'
import { SearchResultsPage } from './pages/SearchResultsPage'
import { IntakeLogProvider } from './state/IntakeLogContext'
import { ProfileProvider } from './state/ProfileContext'
import { ThemeProvider } from './state/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <IntakeLogProvider>
          <HashRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<HomeSearchPage />} />
                <Route path="search" element={<SearchResultsPage />} />
                <Route path="product/:code" element={<ProductReportPage />} />
                <Route path="compare" element={<ComparePage />} />
                <Route path="foods" element={<SafeFoodsBrowserPage />} />
                <Route path="tips" element={<LabelTipsPage />} />
                <Route path="about" element={<EducationPolicyPage />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="track" element={<IntakeTrackerPage />} />
                <Route path="recipes" element={<RecipesPage />} />
                <Route path="profile" element={<ProfileSettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </HashRouter>
        </IntakeLogProvider>
      </ProfileProvider>
    </ThemeProvider>
  )
}

export default App
