import { useEffect, useMemo, useState } from 'react'
import BuildNotes from '../components/BuildNotes'
import { load, save, useApp, type T } from '../i18n'
import { LabHead } from '../components/Nav'
import { controls, themes } from '../data/iso'

type Status = 'none' | 'partial' | 'done' | 'na'
type Risk = { id: number; name: string; l: number; i: number }

const STATUS: { key: Status; label: T; color: string; value: number }[] = [
  { key: 'none', label: { es: 'No', en: 'No' }, color: '#fb7185', value: 0 },
  { key: 'partial', label: { es: 'Parcial', en: 'Partial' }, color: '#fbbf24', value: 0.5 },
  { key: 'done', label: { es: 'Sí', en: 'Yes' }, color: '#34d399', value: 1 },
  { key: 'na', label: { es: 'N/A', en: 'N/A' }, color: '#94a3b8', value: 0 },
]
const sColor = (s: Status) => STATUS.find((x) => x.key === s)!.color

const level = (v: number): { label: T; color: string } =>
  v <= 4
    ? { label: { es: 'Bajo', en: 'Low' }, color: '#34d399' }
    : v <= 9
      ? { label: { es: 'Medio', en: 'Medium' }, color: '#fbbf24' }
      : v <= 16
        ? { label: { es: 'Alto', en: 'High' }, color: '#fb923c' }
        : { label: { es: 'Crítico', en: 'Critical' }, color: '#fb7185' }

const SAMPLE_RISKS: { name: T; l: number; i: number }[] = [
  { name: { es: 'Ransomware en servidores de archivos', en: 'Ransomware on file servers' }, l: 3, i: 5 },
  { name: { es: 'Phishing a personal de finanzas', en: 'Phishing against finance staff' }, l: 4, i: 4 },
  { name: { es: 'Fuga de datos por proveedor cloud', en: 'Data leak through cloud supplier' }, l: 2, i: 5 },
  { name: { es: 'Accesos de ex-empleados no revocados', en: 'Former employee access not revoked' }, l: 3, i: 3 },
  { name: { es: 'Pérdida de laptop sin cifrado', en: 'Loss of unencrypted laptop' }, l: 2, i: 2 },
]

export default function Iso() {
  const { t, lang } = useApp()
  const [st, setSt] = useState<Record<string, Status>>(() => load('iso-status', {}))
  const [risks, setRisks] = useState<Risk[]>(() => load('iso-risks', []))
  const [theme, setTheme] = useState('all')
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ name: '', l: 3, i: 3 })

  useEffect(() => save('iso-status', st), [st])
  useEffect(() => save('iso-risks', risks), [risks])

  const get = (id: string): Status => st[id] ?? 'none'
  const score = (list: typeof controls) => {
    const app = list.filter((c) => get(c.id) !== 'na')
    if (!app.length) return 0
    return (app.reduce((s, c) => s + STATUS.find((x) => x.key === get(c.id))!.value, 0) / app.length) * 100
  }
  const total = score(controls)
  const gaps = controls.filter((c) => get(c.id) === 'none').length

  const shown = useMemo(
    () => controls.filter((c) => (theme === 'all' || c.theme === theme) && (c.id + ' ' + c.name[lang]).toLowerCase().includes(q.toLowerCase())),
    [theme, q, lang],
  )

  const loadExample = () => {
    const next: Record<string, Status> = {}
    controls.forEach((c, i) => {
      const k = (i * 7 + c.id.length * 3) % 10
      next[c.id] = k < 5 ? 'done' : k < 8 ? 'partial' : k < 9 ? 'none' : c.theme === '7' ? 'na' : 'none'
    })
    setSt(next)
    setRisks(SAMPLE_RISKS.map((r, i) => ({ id: i + 1, name: r.name[lang], l: r.l, i: r.i })))
  }
  const reset = () => {
    setSt({})
    setRisks([])
  }
  const addRisk = () => {
    if (!form.name.trim()) return
    setRisks((r) => [...r, { ...form, name: form.name.trim(), id: Math.max(0, ...r.map((x) => x.id)) + 1 }])
    setForm({ name: '', l: 3, i: 3 })
  }
  const exportCsv = () => {
    const lines = ['control,name,status', ...controls.map((c) => `${c.id},"${c.name[lang]}",${get(c.id)}`), '', 'risk,likelihood,impact,level', ...risks.map((r) => `"${r.name}",${r.l},${r.i},${r.l * r.i}`)]
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv' }))
    a.download = 'iso27001-assessment.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const R = 62
  const C = 2 * Math.PI * R
  const gColor = total >= 75 ? 'var(--ok)' : total >= 45 ? 'var(--warn)' : 'var(--bad)'
  const sorted = [...risks].sort((a, b) => b.l * b.i - a.l * a.i)

  return (
    <main className="lab wrap">
      <LabHead
        title={t({ es: 'Evaluador ISO/IEC 27001:2022', en: 'ISO/IEC 27001:2022 assessor' })}
        desc={t({
          es: 'Marca el estado de los 93 controles del Anexo A, observa el cumplimiento en vivo y prioriza tus riesgos. Todo se guarda en tu navegador.',
          en: 'Set the status of the 93 Annex A controls, watch compliance update live and prioritise your risks. Everything is saved in your browser.',
        })}
      >
        <button className="btn btn-ghost btn-sm" onClick={loadExample}>
          ✦ {t({ es: 'Cargar ejemplo', en: 'Load example' })}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={reset}>
          ↺ {t({ es: 'Reiniciar', en: 'Reset' })}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={exportCsv}>
          ↓ CSV
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
          ⎙ {t({ es: 'Imprimir / PDF', en: 'Print / PDF' })}
        </button>
      </LabHead>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3>{t({ es: 'Nivel de cumplimiento', en: 'Compliance level' })}</h3>
          <p className="sub">{t({ es: 'Sí = 100%, Parcial = 50%. Los N/A no cuentan.', en: 'Yes = 100%, Partial = 50%. N/A is excluded.' })}</p>
          <div className="gauge-box">
            <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label={`${total.toFixed(0)}%`}>
              <circle cx="80" cy="80" r={R} fill="none" stroke="var(--line)" strokeWidth="14" />
              <circle
                cx="80"
                cy="80"
                r={R}
                fill="none"
                stroke={gColor}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - total / 100)}
                transform="rotate(-90 80 80)"
                style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1), stroke .4s' }}
              />
              <text x="80" y="82" textAnchor="middle" dominantBaseline="middle" fontSize="34" fontWeight="700" fill="var(--text)" fontFamily="var(--display)">
                {total.toFixed(0)}%
              </text>
            </svg>
            <div style={{ flex: 1, minWidth: 200 }}>
              {themes.map((th) => {
                const list = controls.filter((c) => c.theme === th.key)
                const v = score(list)
                return (
                  <div className="theme-row" key={th.key}>
                    <div>
                      <span>
                        A.{th.key} {t(th.label)} <span className="muted">({list.length})</span>
                      </span>
                      <span className="mono">{v.toFixed(0)}%</span>
                    </div>
                    <div className="bar">
                      <i style={{ width: `${v}%`, background: th.color, animation: 'none', transition: 'width .5s' }} />
                    </div>
                  </div>
                )
              })}
              <p className="sub" style={{ margin: 0 }}>
                {t({ es: 'Brechas (controles en "No")', en: 'Gaps (controls set to "No")' })}: <b style={{ color: 'var(--bad)' }}>{gaps}</b>
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>{t({ es: 'Matriz de riesgos', en: 'Risk matrix' })}</h3>
          <p className="sub">{t({ es: 'Probabilidad (↑) × Impacto (→)', en: 'Likelihood (↑) × Impact (→)' })}</p>
          <div className="matrix">
            {[5, 4, 3, 2, 1].map((l) => [
              <span className="ax" key={`a${l}`}>
                {l}
              </span>,
              ...[1, 2, 3, 4, 5].map((i) => (
                <div className="cell" key={`${l}-${i}`} style={{ background: `color-mix(in srgb, ${level(l * i).color} 55%, transparent)` }}>
                  {sorted.map((r, idx) => (r.l === l && r.i === i ? <span className="rdot" key={r.id} title={r.name}>{idx + 1}</span> : null))}
                </div>
              )),
            ])}
            <span />
            {[1, 2, 3, 4, 5].map((i) => (
              <span className="ax" key={i}>
                {i}
              </span>
            ))}
          </div>
          <div className="risk-form no-print">
            <label className="field">
              {t({ es: 'Nuevo riesgo', en: 'New risk' })}
              <input
                className="input"
                value={form.name}
                maxLength={60}
                placeholder={t({ es: 'p. ej. Fuga de credenciales', en: 'e.g. Credential leak' })}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && addRisk()}
              />
            </label>
            <label className="field">
              {t({ es: 'Prob.', en: 'Likel.' })}
              <select className="input" value={form.l} onChange={(e) => setForm({ ...form, l: Number(e.target.value) })}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="field">
              {t({ es: 'Impacto', en: 'Impact' })}
              <select className="input" value={form.i} onChange={(e) => setForm({ ...form, i: Number(e.target.value) })}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <button className="btn btn-primary btn-sm" onClick={addRisk} disabled={!form.name.trim()}>
              + {t({ es: 'Añadir', en: 'Add' })}
            </button>
          </div>
          {sorted.length === 0 && <p className="sub">{t({ es: 'Aún no hay riesgos. Añade uno o carga el ejemplo.', en: 'No risks yet. Add one or load the example.' })}</p>}
          {sorted.map((r, idx) => {
            const lv = level(r.l * r.i)
            return (
              <div className="risk-item" key={r.id}>
                <span className="rdot">{idx + 1}</span>
                <span className="n">{r.name}</span>
                <span className="score" style={{ background: lv.color }}>
                  {t(lv.label)} · {r.l * r.i}
                </span>
                <button className="x no-print" aria-label={t({ es: 'Eliminar', en: 'Delete' })} onClick={() => setRisks((x) => x.filter((y) => y.id !== r.id))}>
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <h3>{t({ es: 'Controles del Anexo A', en: 'Annex A controls' })}</h3>
        <div className="toolbar no-print" style={{ margin: '12px 0' }}>
          <button className={`tab ${theme === 'all' ? 'on' : ''}`} onClick={() => setTheme('all')}>
            {t({ es: 'Todos', en: 'All' })} (93)
          </button>
          {themes.map((th) => (
            <button key={th.key} className={`tab ${theme === th.key ? 'on' : ''}`} onClick={() => setTheme(th.key)}>
              A.{th.key} {t(th.label)}
            </button>
          ))}
          <input className="input" style={{ flex: 1, minWidth: 160 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t({ es: 'Buscar control…', en: 'Search control…' })} />
        </div>
        <div className="ctrl-list">
          {shown.map((c) => (
            <div className="ctrl" key={c.id}>
              <span className="id">A.{c.id}</span>
              <span className="nm">{t(c.name)}</span>
              <div className="seg" role="group" aria-label={t(c.name)}>
                {STATUS.map((s) => (
                  <button
                    key={s.key}
                    className={get(c.id) === s.key ? 'on' : ''}
                    aria-pressed={get(c.id) === s.key}
                    style={get(c.id) === s.key ? { background: sColor(s.key) } : undefined}
                    onClick={() => setSt((x) => ({ ...x, [c.id]: s.key }))}
                  >
                    {t(s.label)}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {shown.length === 0 && <p className="sub" style={{ padding: 16, margin: 0 }}>{t({ es: 'Sin resultados.', en: 'No results.' })}</p>}
        </div>
      </div>
      <BuildNotes k="iso" />
    </main>
  )
}
