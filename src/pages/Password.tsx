import { useMemo, useState } from 'react'
import BuildNotes from '../components/BuildNotes'
import { useApp, type T } from '../i18n'
import { LabHead } from '../components/Nav'

const COMMON = [
  'password', 'contraseña', 'contrasena', '123456', '12345678', '123456789', 'qwerty', 'abc123', 'iloveyou', 'admin', 'welcome', 'letmein',
  'monkey', 'dragon', 'football', 'futbol', 'peru', 'lima', 'alianza', 'universitario', 'cristal', 'tequiero', 'teamo', 'hola', 'amor',
  'princesa', 'master', 'login', 'passw0rd', 'p@ssw0rd', 'secret', 'secreto', 'usuario', 'user', 'test', 'clave', 'bienvenido', '111111', '000000',
]
const WALKS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890', 'abcdefghijklmnopqrstuvwxyz']
type Issue = { text: T; bad: boolean }

function analyse(pw: string) {
  const lower = pw.toLowerCase()
  const sets = [/[a-z]/.test(pw) ? 26 : 0, /[A-Z]/.test(pw) ? 26 : 0, /\d/.test(pw) ? 10 : 0, /[^A-Za-z0-9]/.test(pw) ? 33 : 0]
  const pool = sets.reduce((a, b) => a + b, 0) || 1
  let bits = pw.length * Math.log2(pool)
  const issues: Issue[] = []

  const common = COMMON.find((w) => lower.includes(w))
  const deleet = lower.replace(/0/g, 'o').replace(/[1!]/g, 'i').replace(/3/g, 'e').replace(/[4@]/g, 'a').replace(/[5$]/g, 's')
  const leet = !common && COMMON.find((w) => deleet.includes(w))
  if (common || leet) {
    const w = (common || leet) as string
    bits -= w.length * Math.log2(pool) - 6
    issues.push({ bad: true, text: { es: `Contiene una palabra muy común ("${w}")${leet ? ', aunque esté disfrazada con símbolos' : ''}.`, en: `Contains a very common word ("${w}")${leet ? ', even if disguised with symbols' : ''}.` } })
  }
  let walk = ''
  for (const s of WALKS) {
    for (const seq of [s, [...s].reverse().join('')]) {
      for (let i = 0; i + 4 <= seq.length; i++) {
        for (let l = Math.min(seq.length - i, lower.length); l >= 4; l--) {
          if (l > walk.length && lower.includes(seq.slice(i, i + l))) walk = seq.slice(i, i + l)
        }
      }
    }
  }
  if (walk) {
    bits -= (walk.length - 1) * Math.log2(pool) * 0.85
    issues.push({ bad: true, text: { es: `Secuencia predecible ("${walk}").`, en: `Predictable sequence ("${walk}").` } })
  }
  const rep = pw.match(/(.)\1{2,}/)
  if (rep) {
    bits -= (rep[0].length - 1) * Math.log2(pool) * 0.8
    issues.push({ bad: true, text: { es: 'Caracteres repetidos seguidos.', en: 'Repeated characters in a row.' } })
  }
  const year = pw.match(/(19[5-9]\d|20[0-3]\d)/)
  if (year) {
    bits -= 4 * Math.log2(pool) - 7
    issues.push({ bad: true, text: { es: `Incluye un año (${year[0]}): es lo primero que prueba un atacante.`, en: `Includes a year (${year[0]}): one of the first things an attacker tries.` } })
  }
  if (pw.length < 12) issues.push({ bad: true, text: { es: 'Tiene menos de 12 caracteres.', en: 'Shorter than 12 characters.' } })
  else issues.push({ bad: false, text: { es: `Buena longitud (${pw.length} caracteres).`, en: `Good length (${pw.length} characters).` } })
  const kinds = sets.filter(Boolean).length
  if (kinds <= 1) issues.push({ bad: true, text: { es: 'Usa un solo tipo de carácter.', en: 'Uses a single character type.' } })
  else if (kinds >= 3) issues.push({ bad: false, text: { es: 'Mezcla varios tipos de caracteres.', en: 'Mixes several character types.' } })

  return { bits: Math.max(0, bits), issues, pool }
}

function human(seconds: number, lang: 'es' | 'en') {
  const u: [number, string, string][] = [
    [31557600 * 1e9, 'miles de millones de años', 'billions of years'],
    [31557600 * 1e6, 'millones de años', 'million years'],
    [31557600 * 1000, 'miles de años', 'thousand years'],
    [31557600, 'años', 'years'],
    [86400, 'días', 'days'],
    [3600, 'horas', 'hours'],
    [60, 'minutos', 'minutes'],
    [1, 'segundos', 'seconds'],
  ]
  if (seconds < 1) return lang === 'es' ? 'al instante' : 'instantly'
  if (seconds > 31557600 * 1e12) return lang === 'es' ? 'más que la edad del universo' : 'longer than the age of the universe'
  for (const [s, es, en] of u) if (seconds >= s) return `${Math.round(seconds / s).toLocaleString()} ${lang === 'es' ? es : en}`
  return ''
}

const rand = (n: number) => crypto.getRandomValues(new Uint32Array(1))[0] % n

export default function Password() {
  const { t, lang } = useApp()
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)
  const a = useMemo(() => analyse(pw), [pw])

  const levels: { min: number; label: T; color: string }[] = [
    { min: 80, label: { es: 'Excelente', en: 'Excellent' }, color: 'var(--ok)' },
    { min: 60, label: { es: 'Fuerte', en: 'Strong' }, color: 'var(--ok)' },
    { min: 40, label: { es: 'Aceptable', en: 'Fair' }, color: 'var(--warn)' },
    { min: 25, label: { es: 'Débil', en: 'Weak' }, color: 'var(--bad)' },
    { min: 0, label: { es: 'Muy débil', en: 'Very weak' }, color: 'var(--bad)' },
  ]
  const lv = levels.find((l) => a.bits >= l.min)!
  const guesses = Math.pow(2, a.bits) / 2
  const scenarios: { name: T; rate: number; note: T }[] = [
    { name: { es: 'Ataque en línea', en: 'Online attack' }, rate: 10, note: { es: '10 intentos por segundo contra un inicio de sesión', en: '10 guesses per second against a login form' } },
    { name: { es: 'Base robada, hash lento', en: 'Stolen database, slow hash' }, rate: 1e4, note: { es: '10 mil por segundo (bcrypt bien configurado)', en: '10 thousand per second (well-configured bcrypt)' } },
    { name: { es: 'Base robada, hash rápido', en: 'Stolen database, fast hash' }, rate: 1e10, note: { es: '10 mil millones por segundo (MD5 con GPUs)', en: '10 billion per second (MD5 on GPUs)' } },
  ]

  // 4 invented words of 3 random syllables each: about 80 bits, and easy to say out loud.
  const genPhrase = () => {
    const cons = 'bcdfghjklmnprstvwxyz'
    const vow = 'aeiou'
    const word = () => Array.from({ length: 3 }, () => cons[rand(cons.length)] + vow[rand(vow.length)]).join('')
    setPw(Array.from({ length: 4 }, word).join('-'))
    setShow(true)
  }
  const genRandom = () => {
    const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*?'
    setPw(Array.from({ length: 18 }, () => chars[rand(chars.length)]).join(''))
    setShow(true)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pw)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <main className="lab wrap">
      <div className="game">
        <LabHead
          title={t({ es: 'Analizador de contraseñas', en: 'Password analyser' })}
          desc={t({
            es: '¿Cuánto tardaría un atacante en adivinarla? El análisis ocurre en tu navegador: lo que escribes no se envía ni se guarda.',
            en: 'How long would an attacker take to guess it? The analysis runs in your browser: what you type is never sent or stored.',
          })}
        />
        <div className="card">
          <label className="field" htmlFor="pw">
            {t({ es: 'Escribe una contraseña de prueba', en: 'Type a test password' })}
          </label>
          <div className="pw-row">
            <input
              id="pw"
              className="input mono pw-input"
              type={show ? 'text' : 'password'}
              value={pw}
              maxLength={64}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••••••"
            />
            <button className="btn btn-ghost btn-sm" onClick={() => setShow(!show)} aria-pressed={show}>
              {show ? t({ es: 'Ocultar', en: 'Hide' }) : t({ es: 'Mostrar', en: 'Show' })}
            </button>
          </div>
          <div className="meter" aria-hidden="true">
            <i style={{ width: `${pw ? Math.min(100, (a.bits / 90) * 100) : 0}%`, background: lv.color }} />
          </div>
          <div className="pw-verdict" aria-live="polite">
            {pw ? (
              <>
                <b style={{ color: lv.color }}>{t(lv.label)}</b>
                <span className="mono muted">
                  ≈ {a.bits.toFixed(0)} bits {t({ es: 'de entropía', en: 'of entropy' })}
                </span>
              </>
            ) : (
              <span className="muted">{t({ es: 'Empieza a escribir o genera una.', en: 'Start typing or generate one.' })}</span>
            )}
          </div>
          <div className="toolbar" style={{ marginTop: 14 }}>
            <button className="btn btn-primary btn-sm" onClick={genPhrase}>
              ✦ {t({ es: 'Generar pronunciable', en: 'Generate pronounceable' })}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={genRandom}>
              🎲 {t({ es: 'Generar aleatoria', en: 'Generate random' })}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={copy} disabled={!pw}>
              {copied ? '✓ ' + t({ es: 'Copiada', en: 'Copied' }) : '⧉ ' + t({ es: 'Copiar', en: 'Copy' })}
            </button>
          </div>
        </div>

        {pw && (
          <>
            <div className="grid-3" style={{ margin: '20px 0' }}>
              {scenarios.map((s, i) => {
                const secs = guesses / s.rate
                return (
                  <div className="card kpi" key={i}>
                    <span>{t(s.name)}</span>
                    <b style={{ fontSize: 22, margin: '6px 0', color: secs < 86400 ? 'var(--bad)' : secs < 31557600 * 10 ? 'var(--warn)' : 'var(--ok)' }}>{human(secs, lang)}</b>
                    <span>{t(s.note)}</span>
                  </div>
                )
              })}
            </div>
            <div className="card">
              <h3>{t({ es: 'Diagnóstico', en: 'Diagnosis' })}</h3>
              <ul className="checks">
                {a.issues.map((x, i) => (
                  <li key={i} className={x.bad ? 'bad' : 'good'}>
                    <span>{x.bad ? '✕' : '✓'}</span> {t(x.text)}
                  </li>
                ))}
              </ul>
              <p className="sub" style={{ margin: '14px 0 0' }}>
                {t({
                  es: 'Es una estimación: asume que el atacante prueba primero palabras comunes, secuencias y años. Usa un gestor de contraseñas y activa el segundo factor.',
                  en: 'This is an estimate: it assumes the attacker tries common words, sequences and years first. Use a password manager and turn on two-factor authentication.',
                })}
              </p>
            </div>
          </>
        )}
        <BuildNotes k="contrasenas" />
      </div>
    </main>
  )
}
