import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider } from './i18n'
import Nav from './components/Nav'
import Home from './pages/Home'
import Anomalies from './pages/Anomalies'
import Iso from './pages/Iso'
import Phishing from './pages/Phishing'
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
        <Routes>
          <Route path="/lab/anomalias" element={<Anomalies />} />
          <Route path="/lab/iso27001" element={<Iso />} />
          <Route path="/lab/phishing" element={<Phishing />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)
