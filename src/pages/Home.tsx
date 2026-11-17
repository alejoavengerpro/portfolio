import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../i18n'
import { academic, cats, certs, education, experience, profile, projects, skills, stack, stats, type Cat } from '../data/content'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Particles() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    let w = 0
    let h = 0
    let raf = 0
    const mouse = { x: -999, y: -999 }
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const n = Math.min(80, Math.floor((w * h) / 16000))
    const pts = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }))
    const colors = ['#22d3ee', '#8b5cf6', '#f472b6']
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      pts.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.fillStyle = colors[i % 3]
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, 7)
        ctx.fill()
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j]
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 130) {
            ctx.strokeStyle = `rgba(139,92,246,${0.35 * (1 - d / 130)})`
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        if (dm < 190) {
          ctx.strokeStyle = `rgba(34,211,238,${0.7 * (1 - dm / 190)})`
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      })
      if (!reduced()) raf = requestAnimationFrame(draw)
    }
    draw()
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
    }
  }, [])
  return <canvas ref={ref} aria-hidden="true" />
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current!
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [v, setV] = useState(reduced() ? to : 0)
  useEffect(() => {
    if (reduced()) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 1400)
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return (
    <b className="grad-text">
      {v}
      {suffix}
    </b>
  )
}

// Shows a download button only when public/cv.pdf exists in the deployment.
function CvButton() {
  const { t } = useApp()
  const [ok, setOk] = useState(false)
  useEffect(() => {
    fetch('/cv.pdf', { method: 'HEAD' })
      .then((r) => setOk(r.ok && (r.headers.get('content-type') ?? '').includes('pdf')))
      .catch(() => setOk(false))
  }, [])
  if (!ok) return null
  return (
    <a href="/cv.pdf" download="CV_Alejandro_Avila_Flores.pdf" className="btn btn-ghost">
      ↓ {t({ es: 'Descargar CV', en: 'Download CV' })}
    </a>
  )
}

const levelLabel = (v: number) =>
  v >= 85 ? { es: 'Avanzado', en: 'Advanced' } : v >= 60 ? { es: 'Intermedio', en: 'Intermediate' } : { es: 'Básico-Intermedio', en: 'Basic-Intermediate' }

function glow(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export default function Home() {
  const { t } = useApp()
  const [role, setRole] = useState(0)
  const [tab, setTab] = useState(0)
  const [cat, setCat] = useState<Cat | 'all'>('all')
  const shown = projects.filter((p) => cat === 'all' || p.cats.includes(cat))

  useEffect(() => {
    const id = setInterval(() => setRole((r) => (r + 1) % profile.roles.length), 2400)
    return () => clearInterval(id)
  }, [])

  return (
    <main>
      <section className="hero">
        <Particles />
        <div className="wrap">
          <div className="hero-grid">
            <div>
          <span className="tag">
            <i className="dot" /> {t({ es: 'Disponible para nuevas oportunidades · Lima, Perú', en: 'Open to new opportunities · Lima, Peru' })}
          </span>
          <h1>
            Alejandro
            <br />
            <span className="grad-text">Avila Flores</span>
          </h1>
          <div className="roles">
            <span key={role}>
              <span className="muted">{'> '}</span>
              {t(profile.roles[role])}
            </span>
          </div>
          <p className="lead">{t(profile.lead)}</p>
          <div className="cta">
            <a href="#proyectos" className="btn btn-primary">
              {t({ es: 'Probar mis demos', en: 'Try my demos' })} ↓
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost">
              LinkedIn ↗
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
              GitHub ↗
            </a>
            <CvButton />
          </div>
            </div>
            <div className="portrait">
              <div className="portrait-ring">
                <img src="/foto.jpg" alt="Alejandro Avila Flores" width="600" height="600" />
              </div>
              <span className="float f1">🎓 {t({ es: 'Décimo superior · UPC', en: 'Top 10% · UPC' })}</span>
              <span className="float f2">📊 {t({ es: 'Analítica de datos & Auditoría TI', en: 'Data Analytics & IT Audit' })}</span>
              <span className="float f3">🛡️ ISO 27001</span>
            </div>
          </div>
          <div className="stats">
            {stats.map((s, i) => (
              <div className="stat" key={i}>
                <Counter to={s.value} suffix={s.suffix} />
                <span>{t(s.label)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div>
          {[...stack, ...stack].map((x, i) => (
            <span key={i}>{x}</span>
          ))}
        </div>
      </div>

      <section className="block" id="proyectos">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">01 — {t({ es: 'Laboratorio', en: 'Lab' })}</span>
            <h2>{t({ es: 'Proyectos que puedes usar ahora', en: 'Projects you can use right now' })}</h2>
          </Reveal>
          <div className="skill-tabs" role="tablist">
            {cats.map((c) => (
              <button key={c.key} role="tab" aria-selected={cat === c.key} className={`tab ${cat === c.key ? 'on' : ''}`} onClick={() => setCat(c.key)}>
                {t(c.label)} <span className="mono">{c.key === 'all' ? projects.length : projects.filter((p) => p.cats.includes(c.key as Cat)).length}</span>
              </button>
            ))}
          </div>
          <div className="grid-3">
            {shown.map((p) => (
              <Link key={p.to} to={p.to} className="proj pop" style={{ ['--pc' as string]: p.color }} onMouseMove={glow}>
                <div className="ico">{p.icon}</div>
                <h3>{t(p.title)}</h3>
                <p>{t(p.desc)}</p>
                <div className="chips">
                  {p.tags.map((x) => (
                    <span className="chip" key={x}>
                      {x}
                    </span>
                  ))}
                </div>
                <div className="go">
                  {t({ es: 'Abrir demo', en: 'Open demo' })} <span>→</span>
                </div>
              </Link>
            ))}
          </div>

          <Reveal>
            <h3 className="subhead">{t({ es: 'Proyectos académicos y personales', en: 'Academic and personal projects' })}</h3>
          </Reveal>
          <div className="grid-2 even">
            {academic.map((a, i) => (
              <Reveal key={i} delay={i * 110}>
                <div className="card acad">
                  <div className="xp-head">
                    <div className="ico-sm">{a.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="kind">{t(a.kind)}</span>
                      <h3>{t(a.title)}</h3>
                      <span className="muted" style={{ fontSize: 13 }}>
                        {t(a.meta)}
                      </span>
                    </div>
                  </div>
                  <ul className="bul">
                    {a.points.map((b, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: t(b) }} />
                    ))}
                  </ul>
                  <div className="chips" style={{ marginTop: 16 }}>
                    {a.tags.map((x) => (
                      <span className="chip" key={x}>
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="experiencia">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">02 — {t({ es: 'Experiencia', en: 'Experience' })}</span>
            <h2>{t({ es: 'Dónde he generado impacto', en: 'Where I have made an impact' })}</h2>
          </Reveal>
          <div className="grid-2">
            <Reveal>
              <div className="card">
                <div className="xp-head">
                  <div>
                    <h3>{experience.company}</h3>
                    <span className="muted">{t(experience.role)}</span>
                  </div>
                  <span className="chip">{t(experience.period)}</span>
                </div>
                <ul className="bul">
                  {experience.bullets.map((b, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: t(b) }} />
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="stack">
                {education.map((e) => (
                  <div className="card" key={e.name}>
                    <span className="chip">{t(e.period)}</span>
                    <h3 style={{ fontSize: 18, margin: '10px 0 4px' }}>{e.name}</h3>
                    <span className="muted" style={{ fontSize: 14 }}>
                      {t(e.detail)}
                    </span>
                  </div>
                ))}
                <div className="card">
                  <h3 style={{ fontSize: 18, marginBottom: 8 }}>{t({ es: 'Idiomas', en: 'Languages' })}</h3>
                  <div className="chips">
                    <span className="chip">{t({ es: 'Español — Nativo', en: 'Spanish — Native' })}</span>
                    <span className="chip">{t({ es: 'Inglés — Avanzado', en: 'English — Advanced' })}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="block" id="habilidades">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">03 — {t({ es: 'Habilidades', en: 'Skills' })}</span>
            <h2>{t({ es: 'Mi caja de herramientas', en: 'My toolbox' })}</h2>
          </Reveal>
          <div className="grid-2">
            <Reveal>
              <div className="card">
                <div className="skill-tabs" role="tablist">
                  {skills.map((s, i) => (
                    <button key={i} role="tab" aria-selected={tab === i} className={`tab ${tab === i ? 'on' : ''}`} onClick={() => setTab(i)}>
                      {t(s.group)}
                    </button>
                  ))}
                </div>
                <div className="skills" key={tab}>
                  {skills[tab].items.map((it) => (
                    <div className="skill-row" key={it.name}>
                      <div>
                        <span>{it.name}</span>
                        <span className="mono muted">{t(levelLabel(it.level))}</span>
                      </div>
                      <div className="bar">
                        <i style={{ width: `${it.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="stack">
                {certs.map((c) => (
                  <div className="card cert" key={c.name}>
                    <span className="yr">{c.year}</span>
                    <div>
                      <b>{c.name}</b>
                      <span>{c.org}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="block" id="contacto">
        <div className="wrap">
          <Reveal>
            <div className="card contact">
              <span className="eyebrow">04 — {t({ es: 'Contacto', en: 'Contact' })}</span>
              <h2>
                {t({ es: '¿Trabajamos ', en: 'Shall we work ' })}
                <span className="grad-text">{t({ es: 'juntos?', en: 'together?' })}</span>
              </h2>
              <p className="muted">
                {t({
                  es: 'Busco oportunidades en Data Analytics, Ciberseguridad y Gestión de Riesgos Tecnológicos.',
                  en: 'I am looking for opportunities in Data Analytics, Cybersecurity and Technology Risk Management.',
                })}
              </p>
              <div className="cta">
                <a href={`mailto:${profile.email}`} className="btn btn-primary">
                  ✉ {profile.email}
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <footer>
        <div className="wrap foot">
          <span>© 2026 Alejandro Avila Flores</span>
          <nav>
            <a href={`mailto:${profile.email}`}>Email</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
              ↑ {t({ es: 'Inicio', en: 'Top' })}
            </a>
          </nav>
        </div>
      </footer>
    </main>
  )
}
