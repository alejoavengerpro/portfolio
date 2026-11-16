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

export const projects: { to: string; icon: string; color: string; title: T; desc: T; tags: string[] }[] = [
  {
    to: '/lab/anomalias',
    icon: '🔎',
    color: 'var(--c1)',
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
    title: { es: 'Evaluador ISO 27001', en: 'ISO 27001 assessor' },
    desc: {
      es: 'Evalúa los 93 controles del Anexo A, mide el cumplimiento por dominio y prioriza riesgos en una matriz de calor exportable.',
      en: 'Assess the 93 Annex A controls, measure compliance per domain and prioritise risks on an exportable heat map.',
    },
    tags: ['ISO/IEC 27001:2022', 'GRC', 'Risk matrix'],
  },
  {
    to: '/lab/phishing',
    icon: '🎣',
    color: 'var(--c3)',
    title: { es: '¿Phishing o legítimo?', en: 'Phishing or legit?' },
    desc: {
      es: 'Un juego contra reloj: analiza correos, detecta las señales de fraude y suma puntos con tu racha. ¿Puedes llegar a rango Analista SOC?',
      en: 'A game against the clock: inspect emails, spot the red flags and build your streak. Can you reach SOC Analyst rank?',
    },
    tags: ['Game', 'Security awareness', 'UX'],
  },
]
