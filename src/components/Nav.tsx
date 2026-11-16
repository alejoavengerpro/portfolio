import { Link } from 'react-router-dom'
import { useApp } from '../i18n'

const links = [
  { to: '/#proyectos', label: { es: 'Proyectos', en: 'Projects' } },
  { to: '/#experiencia', label: { es: 'Experiencia', en: 'Experience' } },
  { to: '/#habilidades', label: { es: 'Habilidades', en: 'Skills' } },
  { to: '/#contacto', label: { es: 'Contacto', en: 'Contact' } },
]

export default function Nav() {
  const { t, lang, toggleLang, theme, toggleTheme } = useApp()
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link to="/" className="logo">
          <i>AA</i> Alejandro Avila
        </Link>
        <nav className="nav-links">
          {links.map((l) => (
            <Link key={l.to} to={l.to}>
              {t(l.label)}
            </Link>
          ))}
        </nav>
        <div className="nav-tools">
          <button className="pill-btn" onClick={toggleLang} aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}>
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <button className="pill-btn" onClick={toggleTheme} aria-label={t({ es: 'Cambiar tema', en: 'Toggle theme' })}>
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </header>
  )
}

export function LabHead({ title, desc, children }: { title: string; desc: string; children?: React.ReactNode }) {
  const { t } = useApp()
  return (
    <div className="lab-head">
      <div>
        <Link to="/#proyectos" className="back no-print">
          ← {t({ es: 'Volver al portafolio', en: 'Back to portfolio' })}
        </Link>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {children && <div className="toolbar no-print">{children}</div>}
    </div>
  )
}
