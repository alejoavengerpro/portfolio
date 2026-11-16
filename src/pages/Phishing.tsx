import { useCallback, useEffect, useState } from 'react'
import BuildNotes from '../components/BuildNotes'
import { Link } from 'react-router-dom'
import { load, save, useApp, type T } from '../i18n'
import { mails, type Mail } from '../data/emails'

const ROUNDS = 10
const SECONDS = 20

const ranks: { min: number; label: T; emoji: string }[] = [
  { min: 2200, label: { es: 'Analista SOC', en: 'SOC Analyst' }, emoji: '🏆' },
  { min: 1500, label: { es: 'Cazador de amenazas', en: 'Threat hunter' }, emoji: '🛡️' },
  { min: 800, label: { es: 'Usuario alerta', en: 'Alert user' }, emoji: '👀' },
  { min: 0, label: { es: 'Presa fácil', en: 'Easy prey' }, emoji: '🐟' },
]

function shuffle<V>(a: V[]) {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

export default function Phishing() {
  const { t } = useApp()
  const [phase, setPhase] = useState<'intro' | 'play' | 'result' | 'end'>('intro')
  const [deck, setDeck] = useState<Mail[]>([])
  const [idx, setIdx] = useState(0)
  const [time, setTime] = useState(SECONDS)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [hits, setHits] = useState(0)
  const [last, setLast] = useState<{ ok: boolean; gained: number; timeout: boolean } | null>(null)
  const [best, setBest] = useState(() => load('phish-best', 0))

  const mail = deck[idx]

  const start = () => {
    setDeck(shuffle(mails).slice(0, ROUNDS))
    setIdx(0)
    setScore(0)
    setStreak(0)
    setHits(0)
    setTime(SECONDS)
    setPhase('play')
  }

  const answer = useCallback(
    (guess: boolean | null) => {
      if (phase !== 'play' || !mail) return
      const ok = guess !== null && guess === mail.phish
      const gained = ok ? 100 + Math.ceil(time) * 5 + streak * 20 : 0
      setScore((s) => s + gained)
      setStreak((s) => (ok ? s + 1 : 0))
      if (ok) setHits((h) => h + 1)
      setLast({ ok, gained, timeout: guess === null })
      setPhase('result')
    },
    [phase, mail, time, streak],
  )

  useEffect(() => {
    if (phase !== 'play') return
    if (time <= 0) {
      answer(null)
      return
    }
    const id = setTimeout(() => setTime((x) => Math.max(0, x - 0.25)), 250)
    return () => clearTimeout(id)
  }, [phase, time, answer])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'play') return
      if (e.key.toLowerCase() === 'p') answer(true)
      if (e.key.toLowerCase() === 'l') answer(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, answer])

  const next = () => {
    if (idx + 1 >= deck.length) {
      if (score > best) {
        setBest(score)
        save('phish-best', score)
      }
      setPhase('end')
    } else {
      setIdx(idx + 1)
      setTime(SECONDS)
      setPhase('play')
    }
  }

  const rank = ranks.find((r) => score >= r.min)!

  return (
    <main className="lab wrap">
      <div className="game">
        <Link to="/#proyectos" className="back">
          ← {t({ es: 'Volver al portafolio', en: 'Back to portfolio' })}
        </Link>

        {phase === 'intro' && (
          <div className="card intro-card" style={{ marginTop: 16 }}>
            <div className="emoji">🎣</div>
            <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', marginTop: 8 }}>
              {t({ es: '¿Phishing o ', en: 'Phishing or ' })}
              <span className="grad-text">{t({ es: 'legítimo?', en: 'legit?' })}</span>
            </h1>
            <p>
              {t({
                es: 'Llegan 10 correos a tu bandeja. Revisa el remitente, el enlace y el tono, y decide antes de que se acabe el tiempo.',
                en: '10 emails land in your inbox. Check the sender, the link and the tone, and decide before time runs out.',
              })}
            </p>
            <div className="rules">
              <span className="chip">⏱ {SECONDS}s {t({ es: 'por correo', en: 'per email' })}</span>
              <span className="chip">⚡ {t({ es: 'Más rápido = más puntos', en: 'Faster = more points' })}</span>
              <span className="chip">🔥 {t({ es: 'Las rachas dan bonus', en: 'Streaks give a bonus' })}</span>
              <span className="chip">⌨ P / L</span>
            </div>
            <button className="btn btn-primary" onClick={start}>
              ▶ {t({ es: 'Empezar', en: 'Start' })}
            </button>
            {best > 0 && (
              <p style={{ marginBottom: 0 }} className="mono">
                {t({ es: 'Tu récord', en: 'Your best' })}: {best}
              </p>
            )}
          </div>
        )}

        {(phase === 'play' || phase === 'result') && mail && (
          <div style={{ marginTop: 16 }}>
            <div className="hud">
              <span className="h">
                {idx + 1}/{deck.length}
              </span>
              <span className="h">
                <b>{score}</b> pts
              </span>
              <span className="h">🔥 {streak}</span>
              <div className={`timer ${time <= 5 ? 'low' : ''}`} role="timer" aria-label={`${Math.ceil(time)}s`}>
                <i style={{ width: `${(time / SECONDS) * 100}%` }} />
              </div>
              <span className="h">{Math.ceil(time)}s</span>
            </div>

            <article className="mail" key={idx}>
              <div className="mail-top">
                <div className="avatar">{mail.from[0]}</div>
                <div>
                  <b>{mail.from}</b>
                  <span className="addr">&lt;{mail.addr}&gt;</span>
                </div>
              </div>
              <div className="mail-body">
                <h3>{t(mail.subject)}</h3>
                <p>{t(mail.body)}</p>
                {mail.link && <span className="fake-link">{mail.link}</span>}
                {mail.attach && <span className="attach">📎 {mail.attach}</span>}
              </div>
            </article>

            {phase === 'play' && (
              <div className="answers">
                <button className="ans p" onClick={() => answer(true)}>
                  🎣 Phishing
                </button>
                <button className="ans l" onClick={() => answer(false)}>
                  ✅ {t({ es: 'Legítimo', en: 'Legit' })}
                </button>
              </div>
            )}

            {phase === 'result' && last && (
              <div className={`verdict ${last.ok ? 'good' : 'bad'}`} aria-live="polite">
                <h3>
                  {last.ok
                    ? `${t({ es: '¡Correcto!', en: 'Correct!' })} +${last.gained}`
                    : last.timeout
                      ? t({ es: 'Se acabó el tiempo', en: 'Time is up' })
                      : t({ es: 'Incorrecto', en: 'Wrong' })}
                </h3>
                <p>
                  {mail.phish
                    ? t({ es: 'Este correo era phishing. Las señales:', en: 'This email was phishing. The red flags:' })
                    : t({ es: 'Este correo era legítimo. Por qué:', en: 'This email was legitimate. Why:' })}
                </p>
                <ul>
                  {mail.clues.map((c, i) => (
                    <li key={i}>{t(c)}</li>
                  ))}
                </ul>
                <button className="btn btn-primary btn-sm" onClick={next} autoFocus>
                  {idx + 1 >= deck.length ? t({ es: 'Ver resultado', en: 'See result' }) : t({ es: 'Siguiente', en: 'Next' })} →
                </button>
              </div>
            )}
          </div>
        )}

        {phase === 'end' && (
          <div className="card intro-card" style={{ marginTop: 16 }}>
            <div className="emoji">{rank.emoji}</div>
            <div className="big-score grad-text">{score}</div>
            <h2 style={{ fontSize: 30, marginTop: 8 }}>{t(rank.label)}</h2>
            <p>
              {t({ es: `Acertaste ${hits} de ${deck.length} correos.`, en: `You got ${hits} of ${deck.length} emails right.` })}{' '}
              {score >= best && score > 0 ? t({ es: '¡Nuevo récord!', en: 'New best!' }) : `${t({ es: 'Tu récord', en: 'Your best' })}: ${best}`}
            </p>
            <div className="cta" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={start}>
                ↻ {t({ es: 'Jugar de nuevo', en: 'Play again' })}
              </button>
              <Link to="/#proyectos" className="btn btn-ghost">
                {t({ es: 'Ver más proyectos', en: 'More projects' })}
              </Link>
            </div>
          </div>
        )}
        <BuildNotes k="phishing" />
      </div>
    </main>
  )
}
