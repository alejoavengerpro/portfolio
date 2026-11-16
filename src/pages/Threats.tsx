import { useMemo, useState } from 'react'
import BuildNotes from '../components/BuildNotes'
import { useApp } from '../i18n'
import { LabHead } from '../components/Nav'
import kev from '../data/kev.json'

type Row = { id: string; vendor: string; product: string; name: string; date: string; ransom: boolean; cwe: string }
const ALL: Row[] = (kev.items as (string | number)[][]).map((x) => ({
  id: String(x[0]),
  vendor: String(x[1]),
  product: String(x[2]),
  name: String(x[3]),
  date: String(x[4]),
  ransom: x[5] === 1,
  cwe: String(x[6]),
}))
const CUTOFF = new Date(new Date(kev.version.replace(/\./g, '-') + 'T12:00:00').getTime() - 90 * 864e5).toISOString().slice(0, 10)
const YEARS = [...new Set(ALL.map((r) => r.date.slice(0, 4)))].sort()

const CWE: Record<string, string> = {
  'CWE-20': 'Improper Input Validation',
  'CWE-78': 'OS Command Injection',
  'CWE-416': 'Use After Free',
  'CWE-787': 'Out-of-bounds Write',
  'CWE-119': 'Memory Buffer Overflow',
  'CWE-22': 'Path Traversal',
  'CWE-94': 'Code Injection',
  'CWE-502': 'Insecure Deserialization',
  'CWE-287': 'Improper Authentication',
  'CWE-843': 'Type Confusion',
  'CWE-79': 'Cross-site Scripting',
  'CWE-89': 'SQL Injection',
  'CWE-918': 'Server-Side Request Forgery',
  'CWE-306': 'Missing Authentication',
  'CWE-122': 'Heap Overflow',
  'CWE-269': 'Improper Privilege Management',
  'CWE-284': 'Improper Access Control',
  'CWE-434': 'Unrestricted File Upload',
  'CWE-77': 'Command Injection',
  'CWE-190': 'Integer Overflow',
  'CWE-125': 'Out-of-bounds Read',
  'CWE-362': 'Race Condition',
  'CWE-264': 'Permissions & Privileges',
}

function top(rows: Row[], key: (r: Row) => string, n: number) {
  const m = new Map<string, number>()
  rows.forEach((r) => {
    const k = key(r)
    if (k) m.set(k, (m.get(k) ?? 0) + 1)
  })
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n)
}

export default function Threats() {
  const { t, lang } = useApp()
  const [year, setYear] = useState('all')
  const [vendor, setVendor] = useState<string | null>(null)
  const [onlyRansom, setOnlyRansom] = useState(false)
  const [q, setQ] = useState('')
  const [hover, setHover] = useState<{ m: string; n: number } | null>(null)

  const base = useMemo(() => ALL.filter((r) => (year === 'all' || r.date.startsWith(year)) && (!onlyRansom || r.ransom)), [year, onlyRansom])
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return base.filter((r) => (!vendor || r.vendor === vendor) && (!s || `${r.id} ${r.vendor} ${r.product} ${r.name}`.toLowerCase().includes(s)))
  }, [base, vendor, q])

  const months = useMemo(() => {
    const m = new Map<string, number>()
    rows.forEach((r) => m.set(r.date.slice(0, 7), (m.get(r.date.slice(0, 7)) ?? 0) + 1))
    const keys = [...new Set(ALL.filter((r) => year === 'all' || r.date.startsWith(year)).map((r) => r.date.slice(0, 7)))].sort()
    return keys.map((k) => ({ m: k, n: m.get(k) ?? 0 }))
  }, [rows, year])
  const vendors = useMemo(() => top(base, (r) => r.vendor, 10), [base])
  const cwes = useMemo(() => top(rows, (r) => r.cwe, 7), [rows])
  const ransom = rows.filter((r) => r.ransom).length
  const pct = rows.length ? (ransom / rows.length) * 100 : 0
  const latest = useMemo(() => [...rows].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 80), [rows])
  const maxM = Math.max(1, ...months.map((x) => x.n))
  const recent = rows.filter((r) => r.date >= CUTOFF).length

  const W = 760
  const H = 200
  const bw = W / Math.max(1, months.length)
  const R = 52
  const C = 2 * Math.PI * R

  return (
    <main className="lab wrap">
      <LabHead
        title={t({ es: 'Radar de vulnerabilidades explotadas', en: 'Exploited vulnerabilities radar' })}
        desc={t({
          es: `Las fallas de software que los atacantes están usando de verdad, según el catálogo oficial KEV de CISA (EE.UU.). Datos reales: ${ALL.length.toLocaleString()} vulnerabilidades, corte ${kev.version}.`,
          en: `The software flaws attackers are really using, from CISA’s official KEV catalog (US). Real data: ${ALL.length.toLocaleString()} vulnerabilities, snapshot ${kev.version}.`,
        })}
      />

      <div className="toolbar" style={{ marginBottom: 18 }}>
        <button className={`tab ${year === 'all' ? 'on' : ''}`} onClick={() => setYear('all')}>
          {t({ es: 'Todo', en: 'All' })}
        </button>
        {YEARS.map((y) => (
          <button key={y} className={`tab ${year === y ? 'on' : ''}`} onClick={() => setYear(y)}>
            {y}
          </button>
        ))}
        <button className={`test ${onlyRansom ? 'on' : ''}`} style={{ ['--tc' as string]: '#fb7185' }} aria-pressed={onlyRansom} onClick={() => setOnlyRansom(!onlyRansom)}>
          💀 {t({ es: 'Solo ransomware', en: 'Ransomware only' })}
        </button>
        {vendor && (
          <button className="test on" style={{ ['--tc' as string]: '#22d3ee' }} onClick={() => setVendor(null)}>
            {vendor} ✕
          </button>
        )}
      </div>

      <div className="kpis">
        <div className="card kpi">
          <b className="grad-text">{rows.length.toLocaleString()}</b>
          <span>{t({ es: 'Vulnerabilidades explotadas', en: 'Exploited vulnerabilities' })}</span>
        </div>
        <div className="card kpi">
          <b style={{ color: 'var(--bad)' }}>{ransom}</b>
          <span>{t({ es: 'Usadas en campañas de ransomware', en: 'Used in ransomware campaigns' })}</span>
        </div>
        <div className="card kpi">
          <b>{new Set(rows.map((r) => r.vendor)).size}</b>
          <span>{t({ es: 'Fabricantes afectados', en: 'Vendors affected' })}</span>
        </div>
        <div className="card kpi">
          <b>{recent}</b>
          <span>{t({ es: 'Añadidas en los últimos 90 días', en: 'Added in the last 90 days' })}</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3>{t({ es: 'Vulnerabilidades añadidas por mes', en: 'Vulnerabilities added per month' })}</h3>
        <p className="sub">
          {hover
            ? `${hover.m}: ${hover.n}`
            : t({
                es: 'El catálogo nació en noviembre de 2021: los picos iniciales incluyen fallas antiguas cargadas de golpe.',
                en: 'The catalog launched in November 2021: the early peaks include older flaws loaded in bulk.',
              })}
        </p>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="timeline" onMouseLeave={() => setHover(null)}>
          {months.map((x, i) => {
            const h = (x.n / maxM) * (H - 26)
            return (
              <g key={x.m} onMouseEnter={() => setHover(x)}>
                <rect x={i * bw} y={0} width={bw} height={H} fill="transparent" />
                <rect x={i * bw + bw * 0.12} y={H - 20 - h} width={bw * 0.76} height={h} rx={Math.min(4, bw * 0.3)} fill={hover?.m === x.m ? 'var(--c1)' : 'var(--c2)'} />
                {(x.m.endsWith('-01') || (months.length <= 12 && true)) && (
                  <text x={i * bw + bw / 2} y={H - 5} textAnchor="middle" fontSize={11} fill="var(--muted)" fontFamily="var(--mono)">
                    {months.length <= 12 ? x.m.slice(5) : x.m.slice(0, 4)}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3>{t({ es: 'Fabricantes más atacados', en: 'Most targeted vendors' })}</h3>
          <p className="sub">{t({ es: 'Clic para filtrar', en: 'Click to filter' })}</p>
          {vendors.map(([v, n]) => (
            <button key={v} className={`hbar ${vendor === v ? 'on' : ''}`} onClick={() => setVendor(vendor === v ? null : v)}>
              <span className="hl">
                <span>{v}</span>
                <span className="mono">{n}</span>
              </span>
              <span className="bar">
                <i style={{ width: `${(n / vendors[0][1]) * 100}%`, animation: 'none', transition: 'width .5s' }} />
              </span>
            </button>
          ))}
        </div>
        <div className="card">
          <h3>{t({ es: 'Tipos de falla más comunes', en: 'Most common weakness types' })}</h3>
          <p className="sub">CWE</p>
          {cwes.length === 0 && <p className="sub">{t({ es: 'Sin datos', en: 'No data' })}</p>}
          {cwes.map(([c, n]) => (
            <div key={c} className="hbar" style={{ cursor: 'default' }}>
              <span className="hl">
                <span>{CWE[c] ?? c}</span>
                <span className="mono">{n}</span>
              </span>
              <span className="bar">
                <i style={{ width: `${(n / cwes[0][1]) * 100}%`, background: 'var(--c3)', animation: 'none', transition: 'width .5s' }} />
              </span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>{t({ es: 'Vínculo con ransomware', en: 'Link to ransomware' })}</h3>
          <p className="sub">{t({ es: 'Uso confirmado en campañas', en: 'Confirmed use in campaigns' })}</p>
          <div className="center">
            <svg width="150" height="150" viewBox="0 0 150 150" role="img" aria-label={`${pct.toFixed(0)}%`}>
              <circle cx="75" cy="75" r={R} fill="none" stroke="var(--line)" strokeWidth="16" />
              <circle
                cx="75"
                cy="75"
                r={R}
                fill="none"
                stroke="var(--bad)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - pct / 100)}
                transform="rotate(-90 75 75)"
                style={{ transition: 'stroke-dashoffset .6s' }}
              />
              <text x="75" y="77" textAnchor="middle" dominantBaseline="middle" fontSize="30" fontWeight="700" fill="var(--text)" fontFamily="var(--display)">
                {pct.toFixed(0)}%
              </text>
            </svg>
            <p className="sub" style={{ margin: '8px 0 0' }}>
              {t({
                es: `${ransom} de ${rows.length} con uso conocido. El resto figura como "desconocido", no como descartado.`,
                en: `${ransom} of ${rows.length} with known use. The rest is listed as "unknown", not ruled out.`,
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>{t({ es: 'Últimas incorporaciones', en: 'Latest additions' })}</h3>
        <div className="toolbar" style={{ margin: '10px 0 14px' }}>
          <input className="input" style={{ flex: 1, minWidth: 180 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t({ es: 'Buscar CVE, fabricante o producto…', en: 'Search CVE, vendor or product…' })} />
          <span className="sub" style={{ margin: 0 }}>
            {t({ es: `Mostrando ${latest.length} de ${rows.length}`, en: `Showing ${latest.length} of ${rows.length}` })}
          </span>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>{t({ es: 'Añadida', en: 'Added' })}</th>
                <th>CVE</th>
                <th>{t({ es: 'Fabricante', en: 'Vendor' })}</th>
                <th>{t({ es: 'Producto', en: 'Product' })}</th>
                <th>{t({ es: 'Vulnerabilidad', en: 'Vulnerability' })}</th>
                <th>Ransomware</th>
              </tr>
            </thead>
            <tbody>
              {latest.map((r) => (
                <tr key={r.id}>
                  <td className="mono">{new Date(r.date + 'T12:00:00').toLocaleDateString(lang === 'es' ? 'es-PE' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="mono">{r.id}</td>
                  <td>{r.vendor}</td>
                  <td>{r.product}</td>
                  <td style={{ whiteSpace: 'normal', minWidth: 260 }}>{r.name}</td>
                  <td>{r.ransom && <span className="badge" style={{ ['--tc' as string]: '#fb7185' }}>{t({ es: 'Conocido', en: 'Known' })}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="sub" style={{ margin: '12px 0 0' }}>
          {t({ es: 'Fuente: CISA Known Exploited Vulnerabilities Catalog (dominio público).', en: 'Source: CISA Known Exploited Vulnerabilities Catalog (public domain).' })}
        </p>
      </div>
      <BuildNotes k="amenazas" />
    </main>
  )
}
