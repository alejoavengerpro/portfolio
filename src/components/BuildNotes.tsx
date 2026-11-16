import { useApp, type T } from '../i18n'

type Note = { file: string; problem: T; how: T; shows: T; tech: string[] }

const REPO = 'https://github.com/alejoavengerpro/portfolio/blob/main/src/'

const notes: Record<string, Note> = {
  anomalias: {
    file: 'pages/Anomalies.tsx',
    problem: {
      es: 'En una auditoría no se puede revisar cada asiento a mano. Hay que decidir cuáles mirar primero, y justificar por qué.',
      en: 'In an audit you cannot review every entry by hand. You have to decide which ones to look at first, and justify why.',
    },
    how: {
      es: 'Genero 1,200 asientos con una distribución realista e inyecto irregularidades. Cinco pruebas independientes marcan cada asiento, y cada una tiene un peso: la suma da un puntaje de riesgo que ordena la revisión. La ley de Benford se evalúa sobre toda la población con la desviación absoluta media (MAD).',
      en: 'I generate 1,200 entries with a realistic distribution and inject irregularities. Five independent tests flag each entry, each with a weight: the sum gives a risk score that orders the review. Benford’s law is evaluated on the whole population using the mean absolute deviation (MAD).',
    },
    shows: {
      es: 'Criterio de auditoría basado en riesgo: una alerta no es un fraude, es una razón para mirar. Por eso la herramienta prioriza y explica, no acusa.',
      en: 'Risk-based audit judgement: a flag is not fraud, it is a reason to look. That is why the tool prioritises and explains rather than accuses.',
    },
    tech: ['Benford / MAD', 'Scoring', 'SVG', 'CSV export'],
  },
  iso: {
    file: 'pages/Iso.tsx',
    problem: {
      es: 'Un diagnóstico ISO 27001 suele vivir en hojas de cálculo difíciles de leer: no se ve de un vistazo dónde están las brechas ni qué riesgo atender primero.',
      en: 'An ISO 27001 gap assessment usually lives in hard-to-read spreadsheets: you cannot see at a glance where the gaps are or which risk to address first.',
    },
    how: {
      es: 'Cargué los 93 controles del Anexo A (versión 2022) en sus 4 dominios. El cumplimiento se calcula en vivo (Sí = 100%, Parcial = 50%, N/A excluido) y los riesgos se ubican en una matriz 5×5 de probabilidad por impacto. Todo se guarda en el navegador y se exporta a CSV o PDF.',
      en: 'I loaded the 93 Annex A controls (2022 version) in their 4 themes. Compliance is computed live (Yes = 100%, Partial = 50%, N/A excluded) and risks are placed on a 5×5 likelihood-by-impact matrix. Everything is saved in the browser and exports to CSV or PDF.',
    },
    shows: {
      es: 'Que conozco la norma y sé traducirla a algo que un gerente entiende: un porcentaje, las brechas y una lista priorizada de riesgos.',
      en: 'That I know the standard and can translate it into something a manager understands: a percentage, the gaps and a prioritised list of risks.',
    },
    tech: ['ISO/IEC 27001:2022', 'Risk matrix', 'localStorage', 'Print CSS'],
  },
  phishing: {
    file: 'pages/Phishing.tsx',
    problem: {
      es: 'Las capacitaciones de seguridad suelen ser diapositivas que nadie recuerda. La gente aprende a detectar phishing practicando, no leyendo.',
      en: 'Security training is often slides nobody remembers. People learn to spot phishing by practising, not by reading.',
    },
    how: {
      es: 'Escribí 12 correos con empresas ficticias, mezclando fraudes y mensajes legítimos para que no baste con desconfiar de todo. Cada respuesta muestra las señales concretas. El puntaje premia rapidez y rachas, y responder siempre "phishing" no alcanza para el rango más alto.',
      en: 'I wrote 12 emails with fictional companies, mixing scams and legitimate messages so that distrusting everything is not enough. Each answer reveals the concrete signals. Scoring rewards speed and streaks, and always answering "phishing" does not reach the top rank.',
    },
    shows: {
      es: 'Que la concienciación en seguridad se diseña: retroalimentación inmediata, casos realistas y cuidado con los falsos positivos, que también cuestan a una empresa.',
      en: 'That security awareness is designed: immediate feedback, realistic cases and care for false positives, which also cost a company.',
    },
    tech: ['Security awareness', 'Game design', 'Timer', 'Accessibility'],
  },
  amenazas: {
    file: 'pages/Threats.tsx',
    problem: {
      es: 'Cada año se publican decenas de miles de vulnerabilidades y ningún equipo puede parchar todo. La pregunta útil es cuáles se están explotando de verdad.',
      en: 'Tens of thousands of vulnerabilities are published every year and no team can patch everything. The useful question is which ones are actually being exploited.',
    },
    how: {
      es: 'Uso el catálogo KEV de CISA, que solo lista fallas con explotación confirmada. Un script reduce el archivo a los campos necesarios y un flujo de GitHub lo actualiza cada semana. Los filtros por año, fabricante y ransomware recalculan todos los gráficos.',
      en: 'I use CISA’s KEV catalog, which only lists flaws with confirmed exploitation. A script trims the file to the fields needed and a GitHub workflow refreshes it weekly. Filters by year, vendor and ransomware recompute every chart.',
    },
    shows: {
      es: 'Trabajo con datos reales y sus límites: aclaro que los picos de 2021-2022 son carga inicial del catálogo y que "desconocido" no significa "descartado".',
      en: 'Working with real data and its limits: I state that the 2021-2022 peaks are the catalog’s initial load and that "unknown" does not mean "ruled out".',
    },
    tech: ['CISA KEV', 'ETL', 'GitHub Actions', 'SVG charts'],
  },
  firewall: {
    file: 'pages/Firewall.tsx',
    problem: {
      es: 'Explicar a alguien no técnico qué hace un firewall, y por qué bloquear de más también es un error, es difícil con palabras.',
      en: 'Explaining to a non-technical person what a firewall does, and why blocking too much is also a mistake, is hard with words.',
    },
    how: {
      es: 'Lo convertí en mecánica de juego: el escudo bloquea todo lo que toca, así que hay que atrapar los ataques y esquivar el tráfico legítimo. Está programado sobre canvas con un bucle de animación propio, detección de colisiones, partículas y dificultad progresiva. Funciona con mouse, teclado y táctil.',
      en: 'I turned it into a game mechanic: the shield blocks everything it touches, so you must catch attacks and dodge legitimate traffic. It is built on canvas with its own animation loop, collision detection, particles and progressive difficulty. It works with mouse, keyboard and touch.',
    },
    shows: {
      es: 'El equilibrio entre falsos positivos y falsos negativos, que es el dilema central de cualquier control de seguridad, y que puedo programar lógica en tiempo real.',
      en: 'The balance between false positives and false negatives, the central dilemma of any security control, and that I can program real-time logic.',
    },
    tech: ['Canvas 2D', 'Game loop', 'Collision detection', 'Touch input'],
  },
  sql: {
    file: 'pages/SqlDetective.tsx',
    problem: {
      es: 'Decir "sé SQL" en un CV no prueba nada. Quería que el visitante viera consultas reales resolviendo una investigación como las de un equipo forense.',
      en: 'Saying "I know SQL" on a CV proves nothing. I wanted visitors to see real queries solving an investigation like a forensic team’s.',
    },
    how: {
      es: 'Diseñé un modelo de 6 tablas (empleados, dispositivos, logs, accesos, sesiones, incidentes) y una historia donde cada pista exige una técnica: filtros, condiciones combinadas y JOIN. La base es SQLite compilado a WebAssembly, así que las consultas se ejecutan de verdad. Cada misión se valida por el resultado, no por el texto, y solo se permite SELECT.',
      en: 'I designed a 6-table model (employees, devices, logs, access, sessions, incidents) and a story where each clue requires a technique: filters, combined conditions and JOIN. The database is SQLite compiled to WebAssembly, so queries really run. Each mission is validated by its result, not its text, and only SELECT is allowed.',
    },
    shows: {
      es: 'Modelado de datos y razonamiento investigativo: cruzar el log técnico con el acceso físico y la sesión del equipo antes de concluir quién fue.',
      en: 'Data modelling and investigative reasoning: cross-checking the technical log with physical access and the device session before concluding who did it.',
    },
    tech: ['SQLite WASM', 'Data modelling', 'JOIN', 'Result validation'],
  },
  peru: {
    file: 'pages/Peru.tsx',
    problem: {
      es: 'Se habla mucho de la brecha digital del Perú, pero pocas veces con cifras comparables frente a los países vecinos.',
      en: 'Peru’s digital divide is much discussed, but rarely with figures comparable to neighbouring countries.',
    },
    how: {
      es: 'Descargo 8 indicadores de la API del Banco Mundial para 8 países desde 2005. Cada indicador muestra la evolución y un ranking con el último dato disponible de cada país, indicando el año porque no todos reportan al mismo tiempo. En desempleo e inflación el ranking se invierte: menor es mejor.',
      en: 'I download 8 indicators from the World Bank API for 8 countries since 2005. Each indicator shows the trend and a ranking with each country’s latest available figure, stating the year because not all report at the same time. For unemployment and inflation the ranking is inverted: lower is better.',
    },
    shows: {
      es: 'Que sé llevar una fuente pública a un análisis comparativo honesto, cuidando detalles como años distintos y el sentido de cada indicador.',
      en: 'That I can take a public source to an honest comparative analysis, minding details such as differing years and the direction of each indicator.',
    },
    tech: ['World Bank API', 'Time series', 'Benchmarking', 'SVG charts'],
  },
  automatizacion: {
    file: 'pages/Automation.tsx',
    problem: {
      es: 'Automatizar suena siempre bien, pero no siempre conviene: construir la solución también cuesta horas.',
      en: 'Automation always sounds good, but it does not always pay off: building the solution costs hours too.',
    },
    how: {
      es: 'Partí de mi caso real en EY (de 5 a 3 minutos por reporte, 20 por semana) y lo hice paramétrico. El simulador calcula horas liberadas, ahorro anual y en cuántas semanas se recupera el tiempo invertido. El costo por hora y las horas de construcción son supuestos visibles y editables.',
      en: 'I started from my real EY case (from 5 to 3 minutes per report, 20 per week) and made it parametric. The simulator computes hours freed, yearly saving and how many weeks it takes to recover the time invested. Hourly cost and build hours are visible, editable assumptions.',
    },
    shows: {
      es: 'Que mido el impacto antes de automatizar y separo los datos reales de los supuestos. Con mis cifras el ahorro es modesto, y el simulador lo muestra tal cual.',
      en: 'That I measure impact before automating and separate real data from assumptions. With my figures the saving is modest, and the simulator shows it as it is.',
    },
    tech: ['ROI', 'Payback', 'Process analysis', 'Animation'],
  },
  contrasenas: {
    file: 'pages/Password.tsx',
    problem: {
      es: 'Muchos medidores dan por fuerte una clave como "Lima2024!" solo porque mezcla mayúsculas, números y símbolos.',
      en: 'Many meters rate a password like "Lima2024!" as strong just because it mixes capitals, digits and symbols.',
    },
    how: {
      es: 'Calculo la entropía según longitud y tipos de carácter, y luego la penalizo por lo que un atacante prueba primero: palabras comunes (aunque estén disfrazadas con símbolos), secuencias de teclado, repeticiones y años. El tiempo de descifrado se muestra en tres escenarios de ataque. El generador usa el generador criptográfico del navegador.',
      en: 'I compute entropy from length and character types, then penalise it for what an attacker tries first: common words (even disguised with symbols), keyboard sequences, repeats and years. Crack time is shown for three attack scenarios. The generator uses the browser’s cryptographic random source.',
    },
    shows: {
      es: 'Privacidad por diseño: nada de lo que escribes sale del navegador ni se guarda. Y honestidad técnica: lo presento como una estimación, no como una garantía.',
      en: 'Privacy by design: nothing you type leaves the browser or is stored. And technical honesty: I present it as an estimate, not a guarantee.',
    },
    tech: ['Entropy', 'Pattern detection', 'Web Crypto', 'Privacy by design'],
  },
}

export default function BuildNotes({ k }: { k: keyof typeof notes }) {
  const { t } = useApp()
  const n = notes[k]
  const cols: { icon: string; title: T; text: T }[] = [
    { icon: '🎯', title: { es: 'El problema', en: 'The problem' }, text: n.problem },
    { icon: '🛠️', title: { es: 'Cómo lo construí', en: 'How I built it' }, text: n.how },
    { icon: '💡', title: { es: 'Qué demuestra', en: 'What it shows' }, text: n.shows },
  ]
  return (
    <section className="card notes no-print" aria-label={t({ es: 'Cómo lo construí', en: 'How I built it' })}>
      <div className="notes-head">
        <div>
          <span className="eyebrow">{t({ es: 'Detrás de la demo', en: 'Behind the demo' })}</span>
          <h2>{t({ es: 'El criterio detrás del proyecto', en: 'The thinking behind the project' })}</h2>
        </div>
        <a className="btn btn-ghost btn-sm" href={REPO + n.file} target="_blank" rel="noreferrer">
          {'</>'} {t({ es: 'Ver código', en: 'View code' })} ↗
        </a>
      </div>
      <div className="notes-grid">
        {cols.map((c) => (
          <div key={c.icon}>
            <h3>
              <span aria-hidden="true">{c.icon}</span> {t(c.title)}
            </h3>
            <p>{t(c.text)}</p>
          </div>
        ))}
      </div>
      <div className="chips">
        {n.tech.map((x) => (
          <span className="chip" key={x}>
            {x}
          </span>
        ))}
      </div>
    </section>
  )
}
