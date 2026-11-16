import { StrictMode, Suspense, lazy, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider } from './i18n'
import Nav from './components/Nav'
import Home from './pages/Home'

const Anomalies = lazy(() => import('./pages/Anomalies'))
const Iso = lazy(() => import('./pages/Iso'))
const Phishing = lazy(() => import('./pages/Phishing'))
const Threats = lazy(() => import('./pages/Threats'))
const Firewall = lazy(() => import('./pages/Firewall'))
const SqlDetective = lazy(() => import('./pages/SqlDetective'))
import './styles.css'

function ScrollTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <ScrollTop />
        <Nav />
        <Suspense fallback={<div className="loading" />}>
        <Routes>
          <Route path="/lab/anomalias" element={<Anomalies />} />
          <Route path="/lab/iso27001" element={<Iso />} />
          <Route path="/lab/phishing" element={<Phishing />} />
          <Route path="/lab/amenazas" element={<Threats />} />
          <Route path="/lab/firewall" element={<Firewall />} />
          <Route path="/lab/sql" element={<SqlDetective />} />
          <Route path="*" element={<Home />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)
