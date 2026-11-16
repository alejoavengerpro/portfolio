import { useEffect, useRef, useState } from 'react'
import { useApp, type T } from '../i18n'
import { LabHead } from '../components/Nav'

const manualSteps: T[] = [
  { es: 'Exportar datos', en: 'Export data' },
  { es: 'Copiar y pegar', en: 'Copy and paste' },
  { es: 'Limpiar a mano', en: 'Clean by hand' },
  { es: 'Armar tabla dinámica', en: 'Build pivot table' },
  { es: 'Revisar y enviar', en: 'Review and send' },
]
const autoSteps: T[] = [
  { es: 'Entrada', en: 'Input' },
  { es: 'Flujo automatizado', en: 'Automated workflow' },
  { es: 'Validación', en: 'Validation' },
  { es: 'Reporte', en: 'Report' },
]

function Slider({ label, value, min, max, step = 1, unit, onChange }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (v: number) => void }) {
  return (
    <label className="field slider">
      <span>
        {label} <b className="mono">{value.toLocaleString()} {unit}</b>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  )
}

export default function Automation() {
  const { t } = useApp()
  const [reports, setReports] = useState(20)
  const [before, setBefore] = useState(5)
  const [after, setAfter] = useState(3)
  const [cost, setCost] = useState(25)
  const [build, setBuild] = useState(16)
  const [running, setRunning] = useState(false)
  const [prog, setProg] = useState({ m: 0, a: 0 })
  const raf = useRef(0)

  const aft = Math.min(after, before)
  const savedMin = (before - aft) * reports
  const pct = before > 0 ? ((before - aft) / before) * 100 : 0
  const hoursYear = (savedMin * 52) / 60
  const money = hoursYear * cost
  const payback = savedMin > 0 ? (build * 60) / savedMin : Infinity

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const race = () => {
    cancelAnimationFrame(raf.current)
    setRunning(true)
    const start = performance.now()
    const total = 6000 // the manual lane always takes 6 s; the automated one is proportionally faster
    const tick = (now: number) => {
      const k = (now - start) / total
      const m = Math.min(1, k)
      const a = Math.min(1, before > 0 ? k * (before / Math.max(0.1, aft)) : 1)
      setProg({ m, a })
      if (m < 1) raf.current = requestAnimationFrame(tick)
      else setRunning(false)
    }
    raf.current = requestAnimationFrame(tick)
  }

  const lane = (label: string, steps: T[], p: number, color: string, mins: number) => (
    <div className="lane">
      <div className="lane-head">
        <b>{label}</b>
        <span className="mono muted">
          {Math.round(p * reports)}/{reports} {t({ es: 'reportes', en: 'reports' })} · {(mins * reports).toFixed(0)} min
        </span>
      </div>
      <div className="lane-steps">
        {steps.map((s, i) => {
          const local = (p * reports * steps.length) % steps.length
          const on = p > 0 && p < 1 && Math.floor(local) === i
          return (
            <span key={i} className={`lstep ${on ? 'on' : ''}`} style={{ ['--tc' as string]: color }}>
              {t(s)}
            </span>
          )
        })}
      </div>
      <div className="bar" style={{ height: 12 }}>
        <i style={{ width: `${p * 100}%`, background: color, animation: 'none' }} />
      </div>
    </div>
  )

  return (
    <main className="lab wrap">
      <LabHead
        title={t({ es: 'Simulador de automatización', en: 'Automation simulator' })}
        desc={t({
          es: 'En EY automaticé reportes contables con Alteryx y bajé de 5 a 3 minutos por reporte. Mueve los controles y mira cuánto vale automatizar un proceso como el tuyo.',
          en: 'At EY I automated accounting reports with Alteryx, going from 5 to 3 minutes per report. Move the controls and see what automating a process like yours is worth.',
        })}
      >
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setReports(20)
            setBefore(5)
            setAfter(3)
            setCost(25)
            setBuild(16)
          }}
        >
          ↺ {t({ es: 'Mi caso en EY', en: 'My EY case' })}
        </button>
      </LabHead>

      <div className="sql-grid">
        <div className="card">
          <h3>{t({ es: 'Tu proceso', en: 'Your process' })}</h3>
          <p className="sub">{t({ es: 'Los valores iniciales son los de mi práctica; el costo por hora y el tiempo de construcción son supuestos editables.', en: 'The starting values come from my internship; hourly cost and build time are editable assumptions.' })}</p>
          <Slider label={t({ es: 'Reportes por semana', en: 'Reports per week' })} value={reports} min={1} max={500} unit="" onChange={setReports} />
          <Slider label={t({ es: 'Tiempo manual por reporte', en: 'Manual time per report' })} value={before} min={1} max={60} unit="min" onChange={setBefore} />
          <Slider label={t({ es: 'Tiempo automatizado por reporte', en: 'Automated time per report' })} value={aft} min={0.5} max={before} step={0.5} unit="min" onChange={setAfter} />
          <Slider label={t({ es: 'Costo por hora del analista', en: 'Analyst hourly cost' })} value={cost} min={5} max={200} step={5} unit="S/" onChange={setCost} />
          <Slider label={t({ es: 'Horas para construir la automatización', en: 'Hours to build the automation' })} value={build} min={1} max={200} unit="h" onChange={setBuild} />
        </div>

        <div className="stack">
          <div className="kpis" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 0 }}>
            <div className="card kpi">
              <b className="grad-text">{pct.toFixed(0)}%</b>
              <span>{t({ es: 'menos tiempo por reporte', en: 'less time per report' })}</span>
            </div>
            <div className="card kpi">
              <b>{hoursYear.toFixed(0)} h</b>
              <span>{t({ es: 'liberadas al año', en: 'freed up per year' })}</span>
            </div>
            <div className="card kpi">
              <b>S/ {Math.round(money).toLocaleString()}</b>
              <span>{t({ es: 'ahorro anual estimado', en: 'estimated yearly saving' })}</span>
            </div>
            <div className="card kpi">
              <b style={{ color: payback <= 26 ? 'var(--ok)' : payback <= 104 ? 'var(--warn)' : 'var(--bad)' }}>{Number.isFinite(payback) ? `${payback.toFixed(payback < 10 ? 1 : 0)} ${t({ es: 'sem', en: 'wk' })}` : '—'}</b>
              <span>{t({ es: 'para recuperar la inversión', en: 'to pay back the build' })}</span>
            </div>
          </div>

          <div className="card">
            <div className="lab-head" style={{ marginBottom: 12, alignItems: 'center' }}>
              <div>
                <h3>{t({ es: 'Una semana de reportes, lado a lado', en: 'A week of reports, side by side' })}</h3>
                <p className="sub" style={{ margin: 0 }}>{t({ es: 'La carrera está acelerada; la proporción es la real.', en: 'The race is sped up; the ratio is the real one.' })}</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={race} disabled={running}>
                ▶ {t({ es: 'Iniciar carrera', en: 'Start race' })}
              </button>
            </div>
            {lane(t({ es: 'Manual', en: 'Manual' }), manualSteps, prog.m, 'var(--bad)', before)}
            {lane(t({ es: 'Automatizado', en: 'Automated' }), autoSteps, prog.a, 'var(--ok)', aft)}
            <p className="sub" style={{ margin: '14px 0 0' }} aria-live="polite">
              {savedMin > 0
                ? t({
                    es: `Cada semana se liberan ${savedMin.toFixed(0)} minutos para análisis en lugar de tareas repetitivas.`,
                    en: `Every week ${savedMin.toFixed(0)} minutes are freed for analysis instead of repetitive tasks.`,
                  })
                : t({ es: 'Sin diferencia de tiempo no hay ahorro: reduce el tiempo automatizado.', en: 'With no time difference there is no saving: lower the automated time.' })}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
