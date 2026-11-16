import { useMemo, useState } from 'react'
import { useApp, type T } from '../i18n'
import { LabHead } from '../components/Nav'

type Flag = 'dup' | 'weekend' | 'round' | 'threshold' | 'offhours'
type Entry = { id: string; date: Date; hour: number; account: string; user: string; amount: number; flags: Flag[]; score: number }

const THRESHOLD = 10000
const TESTS: Record<Flag, { label: T; color: string; weight: number; help: T }> = {
  dup: {
    label: { es: 'Duplicados', en: 'Duplicates' },
    color: '#f472b6',
    weight: 4,
    help: { es: 'Misma cuenta, monto y fecha', en: 'Same account, amount and date' },
  },
  threshold: {
    label: { es: 'Bajo el umbral', en: 'Below threshold' },
    color: '#fb7185',
    weight: 4,
    help: { es: 'Entre 9,500 y 9,999: justo antes de requerir aprobación', en: 'Between 9,500 and 9,999: just before approval is required' },
  },
  weekend: {
    label: { es: 'Fin de semana', en: 'Weekend' },
    color: '#fbbf24',
    weight: 2,
    help: { es: 'Registrado sábado o domingo', en: 'Posted on Saturday or Sunday' },
  },
  offhours: {
    label: { es: 'Fuera de horario', en: 'Off-hours' },
    color: '#a78bfa',
    weight: 2,
    help: { es: 'Registrado entre 22:00 y 05:00', en: 'Posted between 22:00 and 05:00' },
  },
  round: {
    label: { es: 'Montos redondos', en: 'Round amounts' },
    color: '#22d3ee',
    weight: 1,
    help: { es: 'Múltiplos exactos de 1,000', en: 'Exact multiples of 1,000' },
  },
}
const FLAGS = Object.keys(TESTS) as Flag[]
const ACCOUNTS = ['1041 Bancos', '1212 Clientes', '4011 IGV', '4212 Proveedores', '6011 Mercaderías', '6311 Transporte', '6561 Suministros', '7011 Ventas']
const USERS = ['mrojas', 'lquispe', 'cvargas', 'jtorres', 'apaz', 'dsalas']

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generate(seed: number, ratePct: number): Entry[] {
  const r = rng(seed)
  const pick = <V,>(a: V[]) => a[Math.floor(r() * a.length)]
  const normal = () => Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r())
  const weekday = () => {
    for (;;) {
      const d = new Date(2025, 0, 1 + Math.floor(r() * 365))
      if (d.getDay() !== 0 && d.getDay() !== 6) return d
    }
  }
  const out: Entry[] = []
  const N = 1200
  for (let i = 0; i < N; i++) {
    let date = weekday()
    let hour = 8 + Math.floor(r() * 11)
    let account = pick(ACCOUNTS)
    let user = pick(USERS)
    let amount = Math.round(Math.exp(normal() * 1.5 + 6.6) * 100) / 100
    // keep natural data clean of the patterns the tests look for
    if (amount % 1000 === 0 || (amount >= 9500 && amount < THRESHOLD)) amount += 137.45
    if (r() * 100 < ratePct && out.length > 5) {
      const kind = Math.floor(r() * 5)
      if (kind === 0) {
        const src = out[Math.floor(r() * out.length)]
        date = src.date
        account = src.account
        amount = src.amount
        user = src.user
      } else if (kind === 1) {
        date = new Date(date.getTime() + (6 - date.getDay()) * 864e5 + (r() < 0.5 ? 864e5 : 0))
      } else if (kind === 2) {
        amount = (1 + Math.floor(r() * 25)) * 1000
      } else if (kind === 3) {
        amount = 9500 + Math.floor(r() * 49900) / 100
      } else {
        hour = pick([22, 23, 0, 1, 2, 3, 4])
      }
    }
    out.push({ id: `JE-${String(i + 1).padStart(5, '0')}`, date, hour, account, user, amount, flags: [], score: 0 })
  }
  // run the tests
  const seen = new Map<string, Entry[]>()
  for (const e of out) {
    const k = `${e.account}|${e.amount}|${e.date.toDateString()}`
    seen.set(k, [...(seen.get(k) ?? []), e])
  }
  for (const group of seen.values()) if (group.length > 1) group.forEach((e) => e.flags.push('dup'))
  for (const e of out) {
    const d = e.date.getDay()
    if (d === 0 || d === 6) e.flags.push('weekend')
    if (e.amount % 1000 === 0) e.flags.push('round')
    if (e.amount >= 9500 && e.amount < THRESHOLD) e.flags.push('threshold')
    if (e.hour >= 22 || e.hour < 5) e.flags.push('offhours')
    e.score = e.flags.reduce((s, f) => s + TESTS[f].weight, 0)
  }
  return out
}

const firstDigit = (x: number) => Number(String(Math.abs(x)).replace(/[0.]/g, '')[0])
const fmt = (x: number) => x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Anomalies() {
  const { t, lang } = useApp()
  const [seed, setSeed] = useState(2025)
  const [rate, setRate] = useState(6)
  const [active, setActive] = useState<Flag | null>(null)
  const [digit, setDigit] = useState<number | null>(null)

  const data = useMemo(() => generate(seed, rate), [seed, rate])
  const flagged = useMemo(() => data.filter((e) => e.score > 0), [data])
  const counts = useMemo(() => Object.fromEntries(FLAGS.map((f) => [f, data.filter((e) => e.flags.includes(f)).length])) as Record<Flag, number>, [data])

  const benford = useMemo(() => {
    const obs = Array(10).fill(0) as number[]
    data.forEach((e) => obs[firstDigit(e.amount)]++)
    const rows = Array.from({ length: 9 }, (_, i) => {
      const d = i + 1
      return { d, obs: obs[d] / data.length, exp: Math.log10(1 + 1 / d) }
    })
    const mad = rows.reduce((s, x) => s + Math.abs(x.obs - x.exp), 0) / 9
    return { rows, mad }
  }, [data])

  const verdict: { label: T; color: string } =
    benford.mad < 0.006
      ? { label: { es: 'Conformidad alta', en: 'Close conformity' }, color: 'var(--ok)' }
      : benford.mad < 0.012
        ? { label: { es: 'Conformidad aceptable', en: 'Acceptable conformity' }, color: 'var(--ok)' }
        : benford.mad < 0.015
          ? { label: { es: 'Conformidad marginal', en: 'Marginal conformity' }, color: 'var(--warn)' }
          : { label: { es: 'No conforme: revisar', en: 'Nonconformity: review' }, color: 'var(--bad)' }

  const heat = useMemo(() => {
    const g = Array.from({ length: 7 }, () => Array(24).fill(0) as number[])
    data.forEach((e) => g[(e.date.getDay() + 6) % 7][e.hour]++)
    return { g, max: Math.max(...g.flat()) }
  }, [data])

  const rows = useMemo(() => {
    let r = active ? flagged.filter((e) => e.flags.includes(active)) : flagged
    if (digit) r = data.filter((e) => firstDigit(e.amount) === digit && (!active || e.flags.includes(active)))
    return [...r].sort((a, b) => b.score - a.score || b.amount - a.amount).slice(0, 150)
  }, [flagged, data, active, digit])

  const atRisk = flagged.reduce((s, e) => s + e.amount, 0)
  const days = lang === 'es' ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const exportCsv = () => {
    const lines = ['id,date,hour,account,user,amount,score,flags', ...flagged.map((e) => [e.id, e.date.toISOString().slice(0, 10), e.hour, e.account, e.user, e.amount, e.score, e.flags.join(' ')].join(','))]
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }))
    a.download = 'flagged-entries.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const W = 520
  const H = 210
  const bw = W / 9
  const maxY = 0.36
  const y = (v: number) => H - 26 - (v / maxY) * (H - 40)

  return (
    <main className="lab wrap">
      <LabHead
        title={t({ es: 'Detector de anomalías contables', en: 'Accounting anomaly detector' })}
        desc={t({
          es: 'Un libro diario sintético de 1,200 asientos con irregularidades ocultas. Las pruebas forenses las encuentran y priorizan por riesgo, como en una auditoría real.',
          en: 'A synthetic ledger of 1,200 journal entries with hidden irregularities. Forensic tests find them and rank them by risk, as in a real audit.',
        })}
      >
        <label className="field">
          {t({ es: 'Irregularidades inyectadas', en: 'Injected irregularities' })}: {rate}%
          <input type="range" min={0} max={15} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label>
        <button className="btn btn-ghost btn-sm" onClick={() => setSeed((s) => s + 1)}>
          ↻ {t({ es: 'Nuevos datos', en: 'New data' })}
        </button>
        <button className="btn btn-primary btn-sm" onClick={exportCsv}>
          ↓ CSV
        </button>
      </LabHead>

      <div className="kpis">
        <div className="card kpi">
          <b>{data.length.toLocaleString()}</b>
          <span>{t({ es: 'Asientos analizados', en: 'Entries analysed' })}</span>
        </div>
        <div className="card kpi">
          <b style={{ color: 'var(--bad)' }}>{flagged.length}</b>
          <span>{t({ es: 'Asientos con alertas', en: 'Flagged entries' })}</span>
        </div>
        <div className="card kpi">
          <b>{((flagged.length / data.length) * 100).toFixed(1)}%</b>
          <span>{t({ es: 'De la población', en: 'Of the population' })}</span>
        </div>
        <div className="card kpi">
          <b>S/ {Math.round(atRisk / 1000).toLocaleString()}k</b>
          <span>{t({ es: 'Monto bajo revisión', en: 'Amount under review' })}</span>
        </div>
      </div>

      <div className="tests">
        {FLAGS.map((f) => (
          <button
            key={f}
            className={`test ${active === f ? 'on' : ''}`}
            style={{ ['--tc' as string]: TESTS[f].color }}
            title={t(TESTS[f].help)}
            aria-pressed={active === f}
            onClick={() => setActive(active === f ? null : f)}
          >
            {t(TESTS[f].label)} <b>{counts[f]}</b>
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3>{t({ es: 'Ley de Benford — primer dígito', en: 'Benford’s law — first digit' })}</h3>
          <p className="sub">
            MAD = <span className="mono">{benford.mad.toFixed(4)}</span> ·{' '}
            <b style={{ color: verdict.color }}>{t(verdict.label)}</b> · {t({ es: 'clic en una barra para filtrar', en: 'click a bar to filter' })}
          </p>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Benford chart">
            {benford.rows.map((b, i) => {
              const off = Math.abs(b.obs - b.exp) > 0.02
              return (
                <g key={b.d} onClick={() => setDigit(digit === b.d ? null : b.d)} style={{ cursor: 'pointer' }}>
                  <rect x={i * bw} y={0} width={bw} height={H} fill="transparent" />
                  <rect
                    x={i * bw + 9}
                    y={y(b.obs)}
                    width={bw - 18}
                    height={H - 26 - y(b.obs)}
                    rx={5}
                    fill={off ? 'var(--bad)' : 'var(--c2)'}
                    opacity={digit && digit !== b.d ? 0.3 : 0.9}
                  />
                  <line x1={i * bw + 4} x2={(i + 1) * bw - 4} y1={y(b.exp)} y2={y(b.exp)} stroke="var(--c1)" strokeWidth={3} strokeLinecap="round" />
                  <text x={i * bw + bw / 2} y={y(Math.max(b.obs, b.exp)) - 7} textAnchor="middle" fontSize={11} fill="var(--muted)" fontFamily="var(--mono)">
                    {(b.obs * 100).toFixed(1)}
                  </text>
                  <text x={i * bw + bw / 2} y={H - 7} textAnchor="middle" fontSize={13} fill="var(--text)" fontFamily="var(--mono)">
                    {b.d}
                  </text>
                </g>
              )
            })}
          </svg>
          <p className="sub" style={{ margin: '8px 0 0' }}>
            <span style={{ color: 'var(--c2)' }}>■</span> {t({ es: 'Observado (%)', en: 'Observed (%)' })} &nbsp;
            <span style={{ color: 'var(--c1)' }}>▬</span> {t({ es: 'Esperado por Benford', en: 'Benford expected' })}
          </p>
        </div>

        <div className="card">
          <h3>{t({ es: '¿Cuándo se registran los asientos?', en: 'When are entries posted?' })}</h3>
          <p className="sub">{t({ es: 'Día × hora. Lo que aparece fuera del horario laboral merece una mirada.', en: 'Day × hour. Anything outside working hours deserves a look.' })}</p>
          <div className="heat">
            <span />
            {Array.from({ length: 24 }, (_, h) => (
              <span className="hh" key={h}>
                {h % 3 === 0 ? h : ''}
              </span>
            ))}
            {heat.g.map((row, d) => [
              <span className="lbl" key={`l${d}`}>
                {days[d]}
              </span>,
              ...row.map((v, h) => {
                const odd = d >= 5 || h >= 22 || h < 5
                return (
                  <span
                    key={`${d}-${h}`}
                    className="c"
                    title={`${days[d]} ${h}:00 — ${v}`}
                    style={{
                      background: v === 0 ? 'var(--line)' : odd ? 'var(--bad)' : `color-mix(in srgb, var(--c2) ${25 + (v / heat.max) * 75}%, transparent)`,
                    }}
                  />
                )
              }),
            ])}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>
          {digit
            ? t({ es: `Asientos que empiezan con ${digit}`, en: `Entries starting with ${digit}` })
            : t({ es: 'Asientos priorizados por riesgo', en: 'Entries ranked by risk' })}
          {active && ` · ${t(TESTS[active].label)}`}
        </h3>
        <p className="sub">
          {t({ es: `Mostrando ${rows.length}. Puntaje = suma del peso de cada prueba que falla.`, en: `Showing ${rows.length}. Score = sum of the weight of each failed test.` })}
          {(digit || active) && (
            <button
              className="x"
              onClick={() => {
                setDigit(null)
                setActive(null)
              }}
            >
              ✕ {t({ es: 'quitar filtros', en: 'clear filters' })}
            </button>
          )}
        </p>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>{t({ es: 'Riesgo', en: 'Risk' })}</th>
                <th>ID</th>
                <th>{t({ es: 'Fecha', en: 'Date' })}</th>
                <th>{t({ es: 'Hora', en: 'Hour' })}</th>
                <th>{t({ es: 'Cuenta', en: 'Account' })}</th>
                <th>{t({ es: 'Usuario', en: 'User' })}</th>
                <th className="num">{t({ es: 'Monto (S/)', en: 'Amount (S/)' })}</th>
                <th>{t({ es: 'Alertas', en: 'Flags' })}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td>
                    <span className="score" style={{ background: e.score >= 5 ? 'var(--bad)' : e.score >= 3 ? 'var(--warn)' : e.score > 0 ? 'var(--c1)' : 'var(--line)' }}>
                      {e.score}
                    </span>
                  </td>
                  <td className="mono">{e.id}</td>
                  <td>{e.date.toLocaleDateString(lang === 'es' ? 'es-PE' : 'en-US', { weekday: 'short', day: '2-digit', month: 'short' })}</td>
                  <td className="mono">{String(e.hour).padStart(2, '0')}:00</td>
                  <td>{e.account}</td>
                  <td className="mono">{e.user}</td>
                  <td className="num">{fmt(e.amount)}</td>
                  <td>
                    {e.flags.map((f) => (
                      <span key={f} className="badge" style={{ ['--tc' as string]: TESTS[f].color }}>
                        {t(TESTS[f].label)}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
