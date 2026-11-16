import type { T } from '../i18n'

export const profile = {
  name: 'Alejandro Avila Flores',
  email: 'agabo431@gmail.com',
  linkedin: 'https://www.linkedin.com/in/alejandro-avila-flores/',
  github: 'https://github.com/alejoavengerpro',
  roles: [
    { es: 'Data Analytics', en: 'Data Analytics' },
    { es: 'Ciberseguridad', en: 'Cybersecurity' },
    { es: 'Gestión de Riesgos TI', en: 'IT Risk Management' },
    { es: 'Auditoría Forense', en: 'Forensic Audit' },
  ] as T[],
  lead: {
    es: 'Estudiante de Ingeniería de Sistemas de Información (UPC, décimo superior). Convierto datos en decisiones: automatizo procesos, audito información financiera y construyo soluciones con Machine Learning e IA.',
    en: 'Information Systems Engineering student (UPC, top 10% of class). I turn data into decisions: automating processes, auditing financial information and building Machine Learning and AI solutions.',
  } as T,
}

export const stats: { value: number; suffix: string; label: T }[] = [
  { value: 40, suffix: '%', label: { es: 'menos tiempo en reportes contables', en: 'less time on accounting reports' } },
  { value: 10, suffix: '', label: { es: 'clientes internacionales auditados', en: 'international clients audited' } },
  { value: 5, suffix: '', label: { es: 'certificaciones profesionales', en: 'professional certifications' } },
  { value: 10, suffix: '%', label: { es: 'décimo superior de mi promoción', en: 'top 10% of my class' } },
]

export const experience = {
  company: 'Ernst & Young Perú',
  role: { es: 'Data Analyst & Integrity Risk Services — Practicante', en: 'Data Analyst & Integrity Risk Services — Intern' } as T,
  period: { es: 'Dic 2024 – Mar 2025', en: 'Dec 2024 – Mar 2025' } as T,
  bullets: [
    {
      es: '<strong>Reduje en 40% el tiempo</strong> de preparación de reportes contables con flujos automatizados en Alteryx y tablas dinámicas en Excel.',
      en: '<strong>Cut accounting report preparation time by 40%</strong> with automated Alteryx workflows and Excel pivot tables.',
    },
    {
      es: 'Garanticé la integridad de la información financiera de <strong>10 clientes internacionales</strong> cada mes, validando asientos de diario y balances en auditorías para EE.UU. y Perú.',
      en: 'Ensured the integrity of financial information for <strong>10 international clients</strong> every month, cross-validating journal entries and balances in US and Peru audits.',
    },
    {
      es: 'Coordiné con el equipo forense y comuniqué hallazgos <strong>en inglés</strong> a equipos internacionales con plazos ajustados.',
      en: 'Coordinated with the forensic team and reported findings <strong>in English</strong> to international teams under tight deadlines.',
    },
    {
      es: 'Mejoré procesos, reportes y dashboards aplicando buenas prácticas de automatización y <strong>calidad de datos</strong>.',
      en: 'Improved processes, reports and dashboards by applying automation and <strong>data quality</strong> best practices.',
    },
  ] as T[],
}

export const skills: { group: T; items: { name: string; level: number }[] }[] = [
  {
    group: { es: 'Datos & BI', en: 'Data & BI' },
    items: [
      { name: 'Excel', level: 90 },
      { name: 'SQL · PostgreSQL', level: 70 },
      { name: 'Power BI', level: 70 },
      { name: 'Alteryx · ETL', level: 70 },
    ],
  },
  {
    group: { es: 'Programación & IA', en: 'Programming & AI' },
    items: [
      { name: 'Python', level: 70 },
      { name: 'Java', level: 65 },
      { name: 'Scikit-learn · NLP', level: 65 },
      { name: 'FastAPI · Git', level: 60 },
    ],
  },
  {
    group: { es: 'Ciberseguridad & Riesgo', en: 'Cybersecurity & Risk' },
    items: [
      { name: 'ISO/IEC 27001', level: 70 },
      { name: 'IT Risk Management', level: 65 },
      { name: 'Internal Audit', level: 65 },
      { name: 'Information Security', level: 65 },
    ],
  },
  {
    group: { es: 'Automatización', en: 'Automation' },
    items: [
      { name: 'Power Automate', level: 50 },
      { name: 'Power Apps', level: 50 },
      { name: 'Bizagi · Archimate', level: 55 },
    ],
  },
]

export const certs = [
  { name: 'Python for Everybody Specialization', org: 'University of Michigan', year: 2025 },
  { name: 'Auditor ISO/IEC 27001:2022 – Fundamentals', org: 'Hacker Mentor', year: 2025 },
  { name: 'Cybersecurity Awareness Professional', org: 'CertiProf', year: 2025 },
  { name: 'IBM Cybersecurity Analyst', org: 'IBM', year: 2024 },
  { name: 'Learn SQL Basics for Data Science', org: 'University of California, Davis', year: 2024 },
]

export const education: { name: string; detail: T; period: T }[] = [
  {
    name: 'Universidad Peruana de Ciencias Aplicadas (UPC)',
    detail: { es: 'Ingeniería de Sistemas de Información — 10mo ciclo · Décimo superior', en: 'Information Systems Engineering — 10th term · Top 10%' },
    period: { es: '2022 – Actualidad', en: '2022 – Present' },
  },
  {
    name: 'Instituto de Idiomas PUCP',
    detail: { es: 'Inglés — Nivel avanzado', en: 'English — Advanced level' },
    period: { es: '2011 – 2021', en: '2011 – 2021' },
  },
]

export type Cat = 'data' | 'cyber' | 'game'
export const cats: { key: Cat | 'all'; label: T }[] = [
  { key: 'all', label: { es: 'Todos', en: 'All' } },
  { key: 'data', label: { es: 'Datos', en: 'Data' } },
  { key: 'cyber', label: { es: 'Ciberseguridad', en: 'Cybersecurity' } },
  { key: 'game', label: { es: 'Juegos', en: 'Games' } },
]

export const projects: { to: string; icon: string; color: string; cats: Cat[]; title: T; desc: T; tags: string[] }[] = [
  {
    to: '/lab/amenazas',
    icon: '📡',
    color: 'var(--bad)',
    cats: ['data', 'cyber'],
    title: { es: 'Radar de vulnerabilidades explotadas', en: 'Exploited vulnerabilities radar' },
    desc: {
      es: 'Dashboard con datos reales de CISA: qué fallas están explotando los atacantes hoy, a qué fabricantes golpean y cuáles se usan en ransomware.',
      en: 'Dashboard on real CISA data: which flaws attackers exploit today, which vendors they hit and which are used in ransomware.',
    },
    tags: ['Dashboard', 'Real data', 'Threat intel'],
  },
  {
    to: '/lab/anomalias',
    icon: '🔎',
    color: 'var(--c1)',
    cats: ['data'],
    title: { es: 'Detector de anomalías contables', en: 'Accounting anomaly detector' },
    desc: {
      es: 'Analiza un libro diario con pruebas forenses: ley de Benford, duplicados, asientos fuera de horario y montos bajo el umbral de aprobación.',
      en: 'Analyses a general ledger with forensic tests: Benford’s law, duplicates, off-hours postings and amounts just under the approval threshold.',
    },
    tags: ['Forensic analytics', 'Benford', 'Data Quality'],
  },
  {
    to: '/lab/iso27001',
    icon: '🛡️',
    color: 'var(--c2)',
    cats: ['cyber'],
    title: { es: 'Evaluador ISO 27001', en: 'ISO 27001 assessor' },
    desc: {
      es: 'Evalúa los 93 controles del Anexo A, mide el cumplimiento por dominio y prioriza riesgos en una matriz de calor exportable.',
      en: 'Assess the 93 Annex A controls, measure compliance per domain and prioritise risks on an exportable heat map.',
    },
    tags: ['ISO/IEC 27001:2022', 'GRC', 'Risk matrix'],
  },
  {
    to: '/lab/sql',
    icon: '🕵️',
    color: 'var(--ok)',
    cats: ['game', 'data'],
    title: { es: 'Detective SQL', en: 'SQL Detective' },
    desc: {
      es: 'Alguien robó la base de clientes. Resuelve el caso en 6 misiones escribiendo consultas SQL reales contra una base que corre en tu navegador.',
      en: 'Someone stole the client database. Solve the case in 6 missions by writing real SQL queries against a database running in your browser.',
    },
    tags: ['Game', 'SQL', 'SQLite WASM'],
  },
  {
    to: '/lab/firewall',
    icon: '🧱',
    color: 'var(--warn)',
    cats: ['game', 'cyber'],
    title: { es: 'Firewall Defender', en: 'Firewall Defender' },
    desc: {
      es: 'Juego arcade: eres el firewall. Bloquea ataques, deja pasar el tráfico legítimo y sobrevive a las oleadas DDoS.',
      en: 'Arcade game: you are the firewall. Block attacks, let legitimate traffic through and survive the DDoS waves.',
    },
    tags: ['Game', 'Canvas', 'Arcade'],
  },
  {
    to: '/lab/phishing',
    icon: '🎣',
    color: 'var(--c3)',
    cats: ['game', 'cyber'],
    title: { es: '¿Phishing o legítimo?', en: 'Phishing or legit?' },
    desc: {
      es: 'Un juego contra reloj: analiza correos, detecta las señales de fraude y suma puntos con tu racha. ¿Puedes llegar a rango Analista SOC?',
      en: 'A game against the clock: inspect emails, spot the red flags and build your streak. Can you reach SOC Analyst rank?',
    },
    tags: ['Game', 'Security awareness', 'UX'],
  },
  {
    to: '/lab/peru',
    icon: '🇵🇪',
    color: 'var(--bad)',
    cats: ['data'],
    title: { es: 'Perú en datos', en: 'Peru in data' },
    desc: {
      es: 'Explorador con datos reales del Banco Mundial: conectividad, economía y educación del Perú frente a sus vecinos de la región.',
      en: 'Explorer on real World Bank data: Peru’s connectivity, economy and education compared with its regional neighbours.',
    },
    tags: ['Dashboard', 'Real data', 'World Bank'],
  },
  {
    to: '/lab/automatizacion',
    icon: '⚙️',
    color: 'var(--ok)',
    cats: ['data'],
    title: { es: 'Simulador de automatización', en: 'Automation simulator' },
    desc: {
      es: 'Basado en mi trabajo en EY: compara un proceso manual con uno automatizado y calcula horas liberadas, ahorro y retorno de la inversión.',
      en: 'Based on my work at EY: compare a manual process with an automated one and compute hours freed, savings and payback.',
    },
    tags: ['Process automation', 'ROI', 'Alteryx'],
  },
  {
    to: '/lab/contrasenas',
    icon: '🔑',
    color: 'var(--c2)',
    cats: ['cyber'],
    title: { es: 'Analizador de contraseñas', en: 'Password analyser' },
    desc: {
      es: 'Mide la fortaleza de una contraseña, estima cuánto tardaría en caer y genera alternativas seguras. Nada sale de tu navegador.',
      en: 'Measures password strength, estimates how long it would survive and generates safe alternatives. Nothing leaves your browser.',
    },
    tags: ['Security', 'Entropy', 'Privacy'],
  },
]

export const academic: { icon: string; title: T; meta: T; points: T[]; tags: string[] }[] = [
  {
    icon: '❤️',
    title: { es: 'Predicción de riesgo cardiovascular con Machine Learning', en: 'Cardiovascular risk prediction with Machine Learning' },
    meta: { es: 'Business Predictive Analytics · Abr – Jul 2025', en: 'Business Predictive Analytics · Apr – Jul 2025' },
    points: [
      {
        es: 'Regresión Logística en Python, el mejor de los modelos evaluados: <strong>AUC de 0.9958</strong> tras optimizar hiperparámetros con Random Search.',
        en: 'Logistic Regression in Python, the best of the models evaluated: <strong>AUC of 0.9958</strong> after hyperparameter tuning with Random Search.',
      },
      {
        es: 'Limpieza y transformación del dataset (ETL) para entrenamiento y validación.',
        en: 'Dataset cleaning and transformation (ETL) for training and validation.',
      },
    ],
    tags: ['Python', 'Scikit-learn', 'Random Search', 'ETL'],
  },
  {
    icon: '💬',
    title: { es: 'Chatbot de IA para detección temprana de ansiedad y depresión', en: 'AI chatbot for early detection of anxiety and depression' },
    meta: { es: 'Proyecto de tesis (en curso) · Project Manager', en: 'Thesis project (ongoing) · Project Manager' },
    points: [
      {
        es: 'Lidero el desarrollo de un chatbot conversacional con NLP orientado a estudiantes universitarios.',
        en: 'I lead the development of an NLP conversational chatbot aimed at university students.',
      },
      {
        es: '<strong>Validación en 3 fases</strong>: indicadores de rendimiento con usuarios, juicio de 2 psicólogos clínicos y pruebas de aceptación (UAT).',
        en: '<strong>3-phase validation</strong>: performance indicators with users, review by 2 clinical psychologists and user acceptance testing (UAT).',
      },
    ],
    tags: ['FastAPI', 'LLaMA 3.1', 'Groq', 'NLP'],
  },
]

export const stack = ['Python', 'SQL', 'PostgreSQL', 'Power BI', 'Alteryx', 'Excel', 'Scikit-learn', 'FastAPI', 'ISO/IEC 27001', 'Power Automate', 'Java', 'Git', 'React', 'TypeScript']
