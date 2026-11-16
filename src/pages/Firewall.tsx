import { useCallback, useEffect, useRef, useState } from 'react'
import BuildNotes from '../components/BuildNotes'
import { Link } from 'react-router-dom'
import { load, save, useApp } from '../i18n'

type Packet = { x: number; y: number; w: number; vy: number; label: string; kind: 'bad' | 'good' | 'patch' }
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string }

const BAD = ['SQLi', 'DDoS', 'Malware.exe', 'Phishing', 'Ransomware', 'Brute force', 'XSS', 'Telnet :23', 'Botnet']
const GOOD = ['HTTPS :443', 'DNS', 'Backup', 'Email', 'API OK', 'Update', 'VPN']
const H = 520

export default function Firewall() {
  const { t, lang } = useApp()
  const box = useRef<HTMLDivElement>(null)
  const cvRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'intro' | 'play' | 'pause' | 'over'>('intro')
  const [result, setResult] = useState({ score: 0, level: 1, blocked: 0 })
  const [best, setBest] = useState(() => load('fw-best', 0))
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const langRef = useRef(lang)
  langRef.current = lang
  const game = useRef({
    W: 720,
    sx: 360,
    target: 360,
    dir: 0,
    packets: [] as Packet[],
    sparks: [] as Spark[],
    score: 0,
    combo: 0,
    health: 100,
    level: 1,
    blocked: 0,
    spawn: 0,
    burst: 0,
    shake: 0,
    flash: 0,
    toast: '',
    toastT: 0,
  })

  const start = useCallback(() => {
    const g = game.current
    Object.assign(g, { packets: [], sparks: [], score: 0, combo: 0, health: 100, level: 1, blocked: 0, spawn: 0.4, burst: 0, shake: 0, flash: 0, toast: '', toastT: 0 })
    g.sx = g.target = g.W / 2
    setPhase('play')
  }, [])

  useEffect(() => {
    const cv = cvRef.current!
    const ctx = cv.getContext('2d')!
    const g = game.current
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      g.W = Math.min(760, box.current!.clientWidth)
      cv.width = g.W * dpr
      cv.height = H * dpr
      cv.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const burst = (x: number, y: number, color: string, n = 14) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const v = 60 + Math.random() * 180
        g.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5 + Math.random() * 0.4, color })
      }
    }
    const spawnPacket = (forceBad = false) => {
      const r = Math.random()
      const kind: Packet['kind'] = forceBad ? 'bad' : r < 0.04 && g.health < 80 ? 'patch' : r < 0.62 ? 'bad' : 'good'
      const list = kind === 'bad' ? BAD : GOOD
      const label = kind === 'patch' ? '+ PATCH' : list[Math.floor(Math.random() * list.length)]
      ctx.font = '600 13px JetBrains Mono, monospace'
      const w = ctx.measureText(label).width + 26
      g.packets.push({ x: 8 + Math.random() * (g.W - w - 16), y: -30, w, vy: (105 + g.level * 20) * (0.85 + Math.random() * 0.3), label, kind })
    }
    const pill = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, r)
    }

    let last = performance.now()
    let raf = 0
    const SW = () => Math.min(130, g.W * 0.28)
    const SY = H - 96

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const playing = phaseRef.current === 'play'
      const sw = SW()

      if (playing) {
        if (g.dir) g.target = Math.max(sw / 2, Math.min(g.W - sw / 2, g.target + g.dir * 620 * dt))
        g.sx += (g.target - g.sx) * Math.min(1, dt * 18)
        g.spawn -= dt
        if (g.spawn <= 0) {
          spawnPacket(g.burst > 0)
          if (g.burst > 0) g.burst--
          g.spawn = g.burst > 0 ? 0.16 : Math.max(0.38, 1.05 - g.level * 0.07)
        }
        for (const p of g.packets) p.y += p.vy * dt
        g.packets = g.packets.filter((p) => {
          const hit = p.y + 26 >= SY && p.y <= SY + 14 && p.x + p.w > g.sx - sw / 2 && p.x < g.sx + sw / 2
          if (hit) {
            if (p.kind === 'bad') {
              g.combo++
              g.blocked++
              g.score += 10 * Math.min(8, 1 + Math.floor(g.combo / 5))
              burst(p.x + p.w / 2, SY, '#f472b6')
              const lvl = 1 + Math.floor(g.blocked / 12)
              if (lvl > g.level) {
                g.level = lvl
                g.burst = Math.min(10, 4 + lvl)
                g.toast = langRef.current === 'es' ? `NIVEL ${lvl} — ¡oleada DDoS!` : `LEVEL ${lvl} — DDoS wave!`
                g.toastT = 1.8
              }
            } else if (p.kind === 'patch') {
              g.health = Math.min(100, g.health + 25)
              burst(p.x + p.w / 2, SY, '#fbbf24', 20)
              g.toast = langRef.current === 'es' ? 'Parche aplicado +25' : 'Patch applied +25'
              g.toastT = 1.2
            } else {
              g.combo = 0
              g.score = Math.max(0, g.score - 30)
              g.shake = 0.25
              g.toast = langRef.current === 'es' ? 'Falso positivo −30' : 'False positive −30'
              g.toastT = 1.2
              burst(p.x + p.w / 2, SY, '#94a3b8', 8)
            }
            return false
          }
          if (p.y > H - 58) {
            if (p.kind === 'bad') {
              g.health -= 15
              g.combo = 0
              g.flash = 0.35
              g.shake = 0.35
              burst(p.x + p.w / 2, H - 50, '#fb7185', 22)
            } else if (p.kind === 'good') {
              g.score += 5
            }
            return false
          }
          return true
        })
        if (g.health <= 0) {
          g.health = 0
          const res = { score: g.score, level: g.level, blocked: g.blocked }
          setResult(res)
          setBest((b: number) => {
            const nb = Math.max(b, res.score)
            save('fw-best', nb)
            return nb
          })
          setPhase('over')
        }
      }
      for (const s of g.sparks) {
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.vy += 300 * dt
        s.life -= dt
      }
      g.sparks = g.sparks.filter((s) => s.life > 0)
      g.shake = Math.max(0, g.shake - dt)
      g.flash = Math.max(0, g.flash - dt)
      g.toastT = Math.max(0, g.toastT - dt)

      // draw
      ctx.save()
      ctx.clearRect(0, 0, g.W, H)
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#070b1a')
      bg.addColorStop(1, '#131a44')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, g.W, H)
      if (g.shake > 0) ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
      ctx.strokeStyle = 'rgba(139,92,246,0.10)'
      ctx.lineWidth = 1
      const off = (now / 40) % 40
      for (let x = 0; x < g.W; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.stroke()
      }
      for (let y = off; y < H; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(g.W, y)
        ctx.stroke()
      }
      // server
      ctx.fillStyle = g.flash > 0 ? '#5b1a2e' : '#0e1433'
      pill(10, H - 52, g.W - 20, 42, 12)
      ctx.fill()
      ctx.strokeStyle = g.flash > 0 ? '#fb7185' : 'rgba(255,255,255,0.14)'
      ctx.stroke()
      ctx.font = '600 12px JetBrains Mono, monospace'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#9aa4cc'
      ctx.fillText(langRef.current === 'es' ? 'SERVIDOR' : 'SERVER', 24, H - 31)
      const bx = 104
      const bwid = g.W - bx - 30
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      pill(bx, H - 37, bwid, 12, 6)
      ctx.fill()
      ctx.fillStyle = g.health > 50 ? '#34d399' : g.health > 25 ? '#fbbf24' : '#fb7185'
      pill(bx, H - 37, Math.max(0, (bwid * g.health) / 100), 12, 6)
      ctx.fill()
      // packets
      ctx.textAlign = 'center'
      ctx.font = '600 13px JetBrains Mono, monospace'
      for (const p of g.packets) {
        const c = p.kind === 'bad' ? '#fb7185' : p.kind === 'good' ? '#22d3ee' : '#fbbf24'
        ctx.fillStyle = c + '26'
        ctx.strokeStyle = c
        ctx.lineWidth = 1.5
        pill(p.x, p.y, p.w, 26, 13)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = '#f1f5ff'
        ctx.fillText(p.label, p.x + p.w / 2, p.y + 14)
      }
      // shield
      const sg = ctx.createLinearGradient(g.sx - sw / 2, 0, g.sx + sw / 2, 0)
      sg.addColorStop(0, '#22d3ee')
      sg.addColorStop(0.55, '#8b5cf6')
      sg.addColorStop(1, '#f472b6')
      ctx.shadowColor = '#8b5cf6'
      ctx.shadowBlur = 22
      ctx.fillStyle = sg
      pill(g.sx - sw / 2, SY, sw, 14, 7)
      ctx.fill()
      ctx.shadowBlur = 0
      for (const s of g.sparks) {
        ctx.globalAlpha = Math.max(0, s.life * 1.6)
        ctx.fillStyle = s.color
        ctx.fillRect(s.x, s.y, 3, 3)
      }
      ctx.globalAlpha = 1
      // HUD
      ctx.textAlign = 'left'
      ctx.font = '700 20px Space Grotesk, sans-serif'
      ctx.fillStyle = '#eaeeff'
      ctx.fillText(String(g.score), 16, 26)
      ctx.font = '600 12px JetBrains Mono, monospace'
      ctx.fillStyle = '#9aa4cc'
      ctx.fillText(`x${Math.min(8, 1 + Math.floor(g.combo / 5))}  🔥${g.combo}`, 16, 48)
      ctx.textAlign = 'right'
      ctx.fillText(`${langRef.current === 'es' ? 'NIVEL' : 'LEVEL'} ${g.level}`, g.W - 16, 26)
      if (g.toastT > 0) {
        ctx.globalAlpha = Math.min(1, g.toastT * 2)
        ctx.textAlign = 'center'
        ctx.font = '700 22px Space Grotesk, sans-serif'
        ctx.fillStyle = '#fbbf24'
        ctx.fillText(g.toast, g.W / 2, 130)
        ctx.globalAlpha = 1
      }
      ctx.restore()
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      const sw = SW()
      g.target = Math.max(sw / 2, Math.min(g.W - sw / 2, e.clientX - r.left))
    }
    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') g.dir = -1
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') g.dir = 1
      if (e.key.toLowerCase() === 'p' && (phaseRef.current === 'play' || phaseRef.current === 'pause')) setPhase(phaseRef.current === 'play' ? 'pause' : 'play')
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault()
    }
    const up = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) g.dir = 0
    }
    cv.addEventListener('pointermove', move)
    cv.addEventListener('pointerdown', move)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      cv.removeEventListener('pointermove', move)
      cv.removeEventListener('pointerdown', move)
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  return (
    <main className="lab wrap">
      <div className="game">
        <Link to="/#proyectos" className="back">
          ← {t({ es: 'Volver al portafolio', en: 'Back to portfolio' })}
        </Link>
        <div className="lab-head" style={{ marginTop: 8 }}>
          <div>
            <h1>
              Firewall <span className="grad-text">Defender</span>
            </h1>
            <p>
              {t({
                es: 'Eres el firewall. Bloquea el tráfico malicioso y deja pasar el legítimo: cada falso positivo también cuesta.',
                en: 'You are the firewall. Block malicious traffic and let legitimate traffic through: every false positive costs too.',
              })}
            </p>
          </div>
          {(phase === 'play' || phase === 'pause') && (
            <button className="btn btn-ghost btn-sm" onClick={() => setPhase(phase === 'play' ? 'pause' : 'play')}>
              {phase === 'play' ? '⏸' : '▶'} {phase === 'play' ? t({ es: 'Pausa', en: 'Pause' }) : t({ es: 'Seguir', en: 'Resume' })}
            </button>
          )}
        </div>
        <div className="arena" ref={box}>
          <canvas ref={cvRef} style={{ width: '100%', touchAction: 'none', display: 'block' }} />
          {phase !== 'play' && (
            <div className="overlay">
              {phase === 'intro' && (
                <>
                  <div className="emoji">🧱</div>
                  <div className="legend">
                    <span className="lg" style={{ ['--tc' as string]: '#fb7185' }}>
                      SQLi · {t({ es: 'bloquéalo', en: 'block it' })}
                    </span>
                    <span className="lg" style={{ ['--tc' as string]: '#22d3ee' }}>
                      HTTPS · {t({ es: 'déjalo pasar', en: 'let it through' })}
                    </span>
                    <span className="lg" style={{ ['--tc' as string]: '#fbbf24' }}>
                      + PATCH · {t({ es: 'atrápalo', en: 'catch it' })}
                    </span>
                  </div>
                  <p className="muted">{t({ es: 'Mueve el escudo con el mouse, el dedo o ← →. P para pausar.', en: 'Move the shield with mouse, finger or ← →. P to pause.' })}</p>
                  <button className="btn btn-primary" onClick={start}>
                    ▶ {t({ es: 'Jugar', en: 'Play' })}
                  </button>
                  {best > 0 && <p className="mono muted">{t({ es: 'Récord', en: 'Best' })}: {best}</p>}
                </>
              )}
              {phase === 'pause' && (
                <>
                  <h2>{t({ es: 'En pausa', en: 'Paused' })}</h2>
                  <button className="btn btn-primary" onClick={() => setPhase('play')}>
                    ▶ {t({ es: 'Seguir', en: 'Resume' })}
                  </button>
                </>
              )}
              {phase === 'over' && (
                <>
                  <p className="eyebrow">{t({ es: 'Servidor comprometido', en: 'Server compromised' })}</p>
                  <div className="big-score grad-text">{result.score}</div>
                  <p className="muted">
                    {t({ es: `Nivel ${result.level} · ${result.blocked} ataques bloqueados`, en: `Level ${result.level} · ${result.blocked} attacks blocked` })}
                    {' · '}
                    {result.score >= best && result.score > 0 ? t({ es: '¡Nuevo récord!', en: 'New best!' }) : `${t({ es: 'Récord', en: 'Best' })}: ${best}`}
                  </p>
                  <button className="btn btn-primary" onClick={start}>
                    ↻ {t({ es: 'Reintentar', en: 'Retry' })}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <BuildNotes k="firewall" />
      </div>
    </main>
  )
}
