import { useMemo, useState } from 'react'
import { useApp, type T } from '../i18n'
import { LabHead } from '../components/Nav'
import data from '../data/peru.json'

type Series = Record<string, Record<string, Record<string, number>>>
const series = data.series as Series

const countries: { code: string; name: T; color: string }[] = [
  { code: 'PER', name: { es: 'Perú', en: 'Peru' }, color: '#f43f5e' },
  { code: 'CHL', name: { es: 'Chile', en: 'Chile' }, color: '#22d3ee' },
  { code: 'COL', name: { es: 'Colombia', en: 'Colombia' }, color: '#fbbf24' },
  { code: 'MEX', name: { es: 'México', en: 'Mexico' }, color: '#34d399' },
  { code: 'BRA', name: { es: 'Brasil', en: 'Brazil' }, color: '#a78bfa' },
  { code: 'ARG', name: { es: 'Argentina', en: 'Argentina' }, color: '#60a5fa' },
  { code: 'ECU', name: { es: 'Ecuador', en: 'Ecuador' }, color: '#fb923c' },
  { code: 'BOL', name: { es: 'Bolivia', en: 'Bolivia' }, color: '#f472b6' },
]

type Ind = { id: string; group: 'digital' | 'economy'; name: T; unit: T; higherIsBetter: boolean }
const allIndicators: Ind[] = [
  { id: 'IT.NET.USER.ZS', group: 'digital', name: { es: 'Usuarios de internet', en: 'Internet users' }, unit: { es: '% de la población', en: '% of population' }, higherIsBetter: true },
  { id: 'IT.NET.BBND.P2', group: 'digital', name: { es: 'Banda ancha fija', en: 'Fixed broadband' }, unit: { es: 'suscripciones por 100 hab.', en: 'subscriptions per 100 people' }, higherIsBetter: true },
  { id: 'IT.CEL.SETS.P2', group: 'digital', name: { es: 'Líneas móviles', en: 'Mobile lines' }, unit: { es: 'por 100 hab.', en: 'per 100 people' }, higherIsBetter: true },
  { id: 'IT.NET.SECR.P6', group: 'digital', name: { es: 'Servidores seguros', en: 'Secure servers' }, unit: { es: 'por millón de hab.', en: 'per million people' }, higherIsBetter: true },
  { id: 'NY.GDP.PCAP.CD', group: 'economy', name: { es: 'PBI per cápita', en: 'GDP per capita' }, unit: { es: 'US$ corrientes', en: 'current US$' }, higherIsBetter: true },
  { id: 'SL.UEM.TOTL.ZS', group: 'economy', name: { es: 'Desempleo', en: 'Unemployment' }, unit: { es: '% de la fuerza laboral', en: '% of labour force' }, higherIsBetter: false },
  { id: 'FP.CPI.TOTL.ZG', group: 'economy', name: { es: 'Inflación', en: 'Inflation' }, unit: { es: '% anual', en: 'annual %' }, higherIsBetter: false },
  { id: 'SE.TER.ENRR', group: 'economy', name: { es: 'Matrícula en educación superior', en: 'Tertiary enrolment' }, unit: { es: '% bruto', en: '% gross' }, higherIsBetter: true },
]
const indicators = allIndicators.filter((i) => series[i.id]?.PER)

const fmt = (v: number) => (Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('en-US') : v.toFixed(1))
const latest = (s: Record<string, number> | undefined) => {
  if (!s) return null
  const y = Object.keys(s).sort().pop()
  return y ? { year: y, value: s[y] } : null
}

export default function Peru() {
  const { t } = useApp()
  const [ind, setInd] = useState(indicators[0]?.id ?? '')
  const [on, setOn] = useState<string[]>(['PER', 'CHL', 'COL'])
  const [hover, setHover] = useState<string | null>(null)
  const meta = indicators.find((i) => i.id === ind)!
  const s = series[ind] ?? {}

  const years = useMemo(() => {
    const set = new Set<string>()
    on.forEach((c) => Object.keys(s[c] ?? {}).forEach((y) => set.add(y)))
    return [...set].sort()
  }, [s, on])
  const values = on.flatMap((c) => Object.values(s[c] ?? {}))
  const min = Math.min(0, ...values)
  const max = Math.max(1, ...values) * 1.08

  const W = 760
  const H = 300
  const padL = 46
  const padB = 26
  const x = (y: string) => padL + (years.length > 1 ? (years.indexOf(y) / (years.length - 1)) * (W - padL - 14) : 0)
  const yy = (v: number) => 10 + (1 - (v - min) / (max - min)) * (H - padB - 10)

  const ranking = countries
    .map((c) => ({ ...c, last: latest(s[c.code]) }))
    .filter((c) => c.last)
    .sort((a, b) => (meta.higherIsBetter ? b.last!.value - a.last!.value : a.last!.value - b.last!.value))
  const pos = ranking.findIndex((c) => c.code === 'PER') + 1
  const per = s.PER ?? {}
  const perYears = Object.keys(per).sort()
  const first = perYears[0]
  const lastY = perYears[perYears.length - 1]
  const rmax = Math.max(...ranking.map((c) => Math.abs(c.last!.value)), 1)

  if (!meta) return <main className="lab wrap">No data</main>

  return (
    <main className="lab wrap">
      <LabHead
        title={t({ es: 'Perú en datos', en: 'Peru in data' })}
        desc={t({
          es: `¿Qué tan conectado está el Perú y cómo se compara con sus vecinos? Datos reales del Banco Mundial (actualizados al ${data.updated}).`,
          en: `How connected is Peru and how does it compare with its neighbours? Real World Bank data (updated ${data.updated}).`,
        })}
      />

      <div className="ind-grid">
        {indicators.map((i) => {
          const l = latest(series[i.id]?.PER)
          return (
            <button key={i.id} className={`card ind ${ind === i.id ? 'on' : ''}`} onClick={() => setInd(i.id)} aria-pressed={ind === i.id}>
              <span>{t(i.name)}</span>
              <b>{l ? fmt(l.value) : '—'}</b>
              <em>
                {t(i.unit)} · {l?.year}
              </em>
            </button>
          )
        })}
      </div>

      <div className="card" style={{ margin: '20px 0' }}>
        <h3>
          {t(meta.name)} <span className="muted" style={{ fontWeight: 400, fontSize: 14 }}>({t(meta.unit)})</span>
        </h3>
        <p className="sub">
          {first && lastY && first !== lastY
            ? t({
                es: `Perú pasó de ${fmt(per[first])} en ${first} a ${fmt(per[lastY])} en ${lastY}. Activa países para comparar.`,
                en: `Peru went from ${fmt(per[first])} in ${first} to ${fmt(per[lastY])} in ${lastY}. Toggle countries to compare.`,
              })
            : ''}
        </p>
        <div className="toolbar" style={{ marginBottom: 12 }}>
          {countries.map((c) => (
            <button
              key={c.code}
              className={`test ${on.includes(c.code) ? 'on' : ''}`}
              style={{ ['--tc' as string]: c.color }}
              aria-pressed={on.includes(c.code)}
              onClick={() => setOn(on.includes(c.code) ? on.filter((z) => z !== c.code) : [...on, c.code])}
            >
              <i className="sw" style={{ background: c.color }} /> {t(c.name)}
            </button>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={t(meta.name)} onMouseLeave={() => setHover(null)}>
          {[0, 0.25, 0.5, 0.75, 1].map((k) => {
            const v = min + (max - min) * k
            return (
              <g key={k}>
                <line x1={padL} x2={W - 14} y1={yy(v)} y2={yy(v)} stroke="var(--line)" />
                <text x={padL - 8} y={yy(v) + 4} textAnchor="end" fontSize={11} fill="var(--muted)" fontFamily="var(--mono)">
                  {fmt(v)}
                </text>
              </g>
            )
          })}
          {years.map((y, i) =>
            i % Math.ceil(years.length / 8) === 0 || i === years.length - 1 ? (
              <text key={y} x={x(y)} y={H - 6} textAnchor="middle" fontSize={11} fill="var(--muted)" fontFamily="var(--mono)">
                {y}
              </text>
            ) : null,
          )}
          {countries
            .filter((c) => on.includes(c.code))
            .map((c) => {
              const pts = years.filter((y) => s[c.code]?.[y] !== undefined)
              const d = pts.map((y, i) => `${i ? 'L' : 'M'}${x(y).toFixed(1)},${yy(s[c.code][y]).toFixed(1)}`).join(' ')
              return (
                <g key={c.code}>
                  <path d={d} fill="none" stroke={c.color} strokeWidth={c.code === 'PER' ? 4 : 2.2} strokeLinejoin="round" strokeLinecap="round" opacity={c.code === 'PER' ? 1 : 0.85} />
                  {hover && s[c.code]?.[hover] !== undefined && <circle cx={x(hover)} cy={yy(s[c.code][hover])} r={5} fill={c.color} stroke="var(--bg)" strokeWidth={2} />}
                </g>
              )
            })}
          {hover && <line x1={x(hover)} x2={x(hover)} y1={10} y2={H - padB} stroke="var(--muted)" strokeDasharray="4 4" />}
          {years.map((y) => (
            <rect key={y} x={x(y) - (W - padL) / years.length / 2} y={0} width={(W - padL) / years.length} height={H} fill="transparent" onMouseEnter={() => setHover(y)} />
          ))}
        </svg>
        <p className="sub mono" style={{ margin: '8px 0 0', minHeight: 20 }}>
          {hover &&
            `${hover} · ` +
              countries
                .filter((c) => on.includes(c.code) && s[c.code]?.[hover] !== undefined)
                .map((c) => `${t(c.name)} ${fmt(s[c.code][hover])}`)
                .join(' · ')}
        </p>
      </div>

      <div className="card">
        <h3>{t({ es: 'Ranking regional, último dato disponible', en: 'Regional ranking, latest available figure' })}</h3>
        <p className="sub">
          {pos > 0 &&
            t({
              es: `Perú ocupa el puesto ${pos} de ${ranking.length}${meta.higherIsBetter ? '' : ' (menor es mejor)'}.`,
              en: `Peru ranks ${pos} of ${ranking.length}${meta.higherIsBetter ? '' : ' (lower is better)'}.`,
            })}
        </p>
        {ranking.map((c, i) => (
          <div key={c.code} className="hbar" style={{ cursor: 'default' }}>
            <span className="hl">
              <span style={{ fontWeight: c.code === 'PER' ? 700 : 400 }}>
                {i + 1}. {t(c.name)} <span className="muted mono">({c.last!.year})</span>
              </span>
              <span className="mono">{fmt(c.last!.value)}</span>
            </span>
            <span className="bar">
              <i style={{ width: `${(Math.abs(c.last!.value) / rmax) * 100}%`, background: c.color, animation: 'none', transition: 'width .5s', opacity: c.code === 'PER' ? 1 : 0.6 }} />
            </span>
          </div>
        ))}
        <p className="sub" style={{ margin: '14px 0 0' }}>
          {t({ es: 'Fuente: Banco Mundial, Indicadores del Desarrollo Mundial (licencia CC BY 4.0).', en: 'Source: World Bank, World Development Indicators (CC BY 4.0 licence).' })}
        </p>
      </div>
    </main>
  )
}
