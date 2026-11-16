import { useEffect, useRef, useState } from 'react'
import BuildNotes from '../components/BuildNotes'
import type { Database } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { useApp } from '../i18n'
import { LabHead } from '../components/Nav'
import { buildSql, missions, schema } from '../data/sqlcase'

type Result = { columns: string[]; values: (string | number | null)[][] }

export default function SqlDetective() {
  const { t } = useApp()
  const db = useRef<Database | null>(null)
  const [ready, setReady] = useState(false)
  const [loadErr, setLoadErr] = useState(false)
  const [step, setStep] = useState(0)
  const [sql, setSql] = useState('SELECT * FROM incidentes;')
  const [res, setRes] = useState<Result | null>(null)
  const [err, setErr] = useState('')
  const [solved, setSolved] = useState(false)
  const [tries, setTries] = useState(0)
  const [hint, setHint] = useState(false)
  const [notes, setNotes] = useState<number[]>([])
  const done = step >= missions.length
  const m = missions[Math.min(step, missions.length - 1)]

  useEffect(() => {
    let alive = true
    import('sql.js')
      .then(({ default: init }) => init({ locateFile: () => wasmUrl }))
      .then((SQL) => {
        if (!alive) return
        const d = new SQL.Database()
        d.run(buildSql())
        db.current = d
        setReady(true)
      })
      .catch(() => setLoadErr(true))
    return () => {
      alive = false
      db.current?.close()
      db.current = null
    }
  }, [])

  const run = () => {
    if (!db.current || !sql.trim()) return
    setErr('')
    if (!/^\s*(select|with)\b/i.test(sql)) {
      setRes(null)
      setErr(t({ es: 'Solo se permiten consultas SELECT: un detective no altera la evidencia.', en: 'Only SELECT queries are allowed: a detective does not tamper with evidence.' }))
      return
    }
    try {
      const out = db.current.exec(sql)
      const r: Result = out.length ? { columns: out[0].columns, values: out[0].values as Result['values'] } : { columns: [], values: [] }
      setRes(r)
      if (!solved && !done) {
        const cells = r.values.flat().map((x) => String(x))
        if (m.check(cells, r.values.length, r.columns.length)) {
          setSolved(true)
          setNotes((n) => [...n, step])
        } else setTries((x) => x + 1)
      }
    } catch (e) {
      setRes(null)
      setErr(String((e as Error).message))
      setTries((x) => x + 1)
    }
  }

  const next = () => {
    setStep(step + 1)
    setSolved(false)
    setTries(0)
    setHint(false)
    setRes(null)
    setSql('')
  }
  const restart = () => {
    setStep(0)
    setSolved(false)
    setTries(0)
    setHint(false)
    setRes(null)
    setNotes([])
    setSql('SELECT * FROM incidentes;')
  }

  return (
    <main className="lab wrap">
      <LabHead
        title={t({ es: 'Detective SQL: fuga de madrugada', en: 'SQL Detective: the midnight leak' })}
        desc={t({
          es: 'Alguien robó la base de clientes. Resuelve el caso con consultas SQL reales sobre una base SQLite que corre en tu navegador.',
          en: 'Someone stole the client database. Solve the case with real SQL queries on a SQLite database running in your browser. (The schema is in Spanish.)',
        })}
      />
      <div className="steps" aria-label="progress">
        {missions.map((x, i) => (
          <span key={i} className={`step ${i < step ? 'ok' : i === step ? 'cur' : ''}`}>
            {i < step ? '✓' : i + 1} <em>{t(x.title)}</em>
          </span>
        ))}
      </div>

      <div className="sql-grid">
        <div className="stack">
          {!done ? (
            <div className="card">
              <span className="eyebrow">
                {t({ es: 'Misión', en: 'Mission' })} {step + 1}/{missions.length}
              </span>
              <h3 style={{ fontSize: 22, margin: '6px 0 8px' }}>{t(m.title)}</h3>
              <p className="muted">{t(m.brief)}</p>
              {solved ? (
                <div className="verdict good" style={{ marginTop: 14 }} aria-live="polite">
                  <h3>🔍 {t({ es: 'Pista encontrada', en: 'Clue found' })}</h3>
                  <p style={{ marginBottom: 14 }}>{t(m.found)}</p>
                  <button className="btn btn-primary btn-sm" onClick={next}>
                    {step + 1 >= missions.length ? t({ es: 'Cerrar el caso', en: 'Close the case' }) : t({ es: 'Siguiente misión', en: 'Next mission' })} →
                  </button>
                </div>
              ) : (
                <div className="toolbar" style={{ marginTop: 14 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setHint(true)}>
                    💡 {t({ es: 'Pista', en: 'Hint' })}
                  </button>
                  {tries >= 2 && (
                    <button className="btn btn-ghost btn-sm" onClick={() => setSql(m.solution)}>
                      {t({ es: 'Ver solución', en: 'Show solution' })}
                    </button>
                  )}
                </div>
              )}
              {hint && !solved && <p className="hint mono">{t(m.hint)}</p>}
            </div>
          ) : (
            <div className="card intro-card">
              <div className="emoji">🕵️</div>
              <h2 style={{ fontSize: 28 }}>
                {t({ es: 'Caso ', en: 'Case ' })}
                <span className="grad-text">{t({ es: 'resuelto', en: 'closed' })}</span>
              </h2>
              <p>{t(missions[missions.length - 1].found)}</p>
              <button className="btn btn-primary" onClick={restart}>
                ↻ {t({ es: 'Jugar de nuevo', en: 'Play again' })}
              </button>
            </div>
          )}

          {notes.length > 0 && (
            <div className="card">
              <h3>📓 {t({ es: 'Libreta del caso', en: 'Case notebook' })}</h3>
              <ul className="bul" style={{ marginTop: 10 }}>
                {notes.map((i) => (
                  <li key={i}>{t(missions[i].found)}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="card">
            <h3>{t({ es: 'Tablas disponibles', en: 'Available tables' })}</h3>
            <p className="sub">{t({ es: 'Clic para explorar una tabla', en: 'Click to explore a table' })}</p>
            {schema.map((s) => (
              <button key={s.table} className="tbl-btn" onClick={() => setSql(`SELECT * FROM ${s.table} LIMIT 5;`)}>
                <b className="mono">{s.table}</b>
                <span className="mono">{s.cols}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <label className="field" htmlFor="sql">
              {t({ es: 'Tu consulta (Ctrl + Enter para ejecutar)', en: 'Your query (Ctrl + Enter to run)' })}
            </label>
            <textarea
              id="sql"
              className="editor mono"
              spellCheck={false}
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run()
              }}
              placeholder="SELECT ..."
            />
            <div className="toolbar" style={{ marginTop: 10 }}>
              <button className="btn btn-primary btn-sm" onClick={run} disabled={!ready}>
                ▶ {ready ? t({ es: 'Ejecutar', en: 'Run' }) : t({ es: 'Cargando base…', en: 'Loading database…' })}
              </button>
              {loadErr && <span style={{ color: 'var(--bad)' }}>{t({ es: 'No se pudo cargar el motor SQL. Recarga la página.', en: 'Could not load the SQL engine. Reload the page.' })}</span>}
            </div>
          </div>
          <div className="card">
            <h3>{t({ es: 'Resultado', en: 'Result' })}</h3>
            {err && <p className="hint mono" style={{ borderColor: 'var(--bad)', color: 'var(--bad)' }}>{err}</p>}
            {!err && !res && <p className="sub">{t({ es: 'Ejecuta una consulta para ver filas aquí.', en: 'Run a query to see rows here.' })}</p>}
            {res && res.values.length === 0 && <p className="sub">{t({ es: 'La consulta no devolvió filas.', en: 'The query returned no rows.' })}</p>}
            {res && res.values.length > 0 && (
              <>
                <p className="sub">
                  {res.values.length} {res.values.length === 1 ? t({ es: 'fila', en: 'row' }) : t({ es: 'filas', en: 'rows' })}
                  {res.values.length > 60 && ` · ${t({ es: 'mostrando 60', en: 'showing 60' })}`}
                  {!solved && !done && tries > 0 && ` · ${t({ es: 'aún no es lo que buscamos', en: 'not what we are looking for yet' })}`}
                </p>
                <div className="tbl-wrap">
                  <table>
                    <thead>
                      <tr>
                        {res.columns.map((c, i) => (
                          <th key={i}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {res.values.slice(0, 60).map((row, i) => (
                        <tr key={i}>
                          {row.map((v, j) => (
                            <td key={j} className={typeof v === 'number' ? 'num' : ''}>
                              {v === null ? 'NULL' : String(v)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <BuildNotes k="sql" />
    </main>
  )
}
