import type { T } from '../i18n'

// Fictional company, people and events.
const people: [string, string, string][] = [
  ['Ana Rojas', 'Ventas', 'Ejecutiva comercial'],
  ['Luis Quispe', 'Ventas', 'Jefe de ventas'],
  ['Sofía Vargas', 'Marketing', 'Analista digital'],
  ['Jorge Torres', 'Logística', 'Coordinador'],
  ['Elena Paz', 'RR.HH.', 'Analista de selección'],
  ['Diego Salas', 'TI', 'Soporte técnico'],
  ['Valeria Ríos', 'Finanzas', 'Tesorera'],
  ['Pedro Castro', 'Ventas', 'Ejecutivo comercial'],
  ['Bruno Tapia', 'Finanzas', 'Analista contable'],
  ['Lucía Mendoza', 'Legal', 'Abogada'],
  ['Renato Silva', 'TI', 'Desarrollador'],
  ['Camila Ortiz', 'Marketing', 'Diseñadora'],
  ['Hugo Flores', 'Logística', 'Almacenero'],
  ['Paola Núñez', 'Finanzas', 'Contadora'],
  ['Iván Campos', 'Ventas', 'Ejecutivo comercial'],
  ['Rosa Herrera', 'RR.HH.', 'Jefa de personas'],
  ['Carla Ibáñez', 'TI', 'Administradora de bases de datos'],
  ['Mateo Reyes', 'TI', 'Analista de seguridad'],
  ['Nadia Soto', 'Legal', 'Asistente legal'],
  ['Óscar Vega', 'Gerencia', 'Gerente general'],
  ['Marco Luna', 'Seguridad', 'Vigilante nocturno'],
  ['Tania Cruz', 'Ventas', 'Asistente comercial'],
  ['Felipe Ramos', 'Logística', 'Chofer'],
  ['Gloria Pinto', 'Finanzas', 'Analista de costos'],
]
const ascii = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const user = (n: string) => ascii(n.split(' ')[0][0] + n.split(' ')[1])
const q = (s: string) => `'${s.replace(/'/g, "''")}'`

export function buildSql() {
  let seed = 7
  const r = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
  const pick = <V,>(a: V[]) => a[Math.floor(r() * a.length)]
  const hh = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  const sql: string[] = [
    'CREATE TABLE empleados (id INTEGER PRIMARY KEY, nombre TEXT, usuario TEXT, area TEXT, cargo TEXT);',
    'CREATE TABLE dispositivos (id INTEGER PRIMARY KEY, codigo TEXT, ip TEXT, empleado_id INTEGER);',
    'CREATE TABLE incidentes (id INTEGER PRIMARY KEY, fecha TEXT, servidor TEXT, severidad TEXT, descripcion TEXT);',
    'CREATE TABLE logs (id INTEGER PRIMARY KEY, fecha TEXT, hora TEXT, ip TEXT, servidor TEXT, accion TEXT, bytes INTEGER);',
    'CREATE TABLE accesos (id INTEGER PRIMARY KEY, empleado_id INTEGER, fecha TEXT, hora TEXT, puerta TEXT, tipo TEXT);',
    'CREATE TABLE sesiones (id INTEGER PRIMARY KEY, dispositivo TEXT, usuario TEXT, fecha TEXT, inicio TEXT, fin TEXT);',
  ]
  people.forEach(([n, a, c], i) => {
    const id = i + 1
    sql.push(`INSERT INTO empleados VALUES (${id}, ${q(n)}, ${q(user(n))}, ${q(a)}, ${q(c)});`)
    sql.push(`INSERT INTO dispositivos VALUES (${id}, 'LAP-${String(408 + id).padStart(4, '0')}', '10.0.8.${50 + id * 3}', ${id});`)
  })
  sql.push(
    `INSERT INTO incidentes VALUES (1, '2025-03-03', 'CORREO', 'BAJA', 'Buzón lleno en cuenta de ventas');`,
    `INSERT INTO incidentes VALUES (2, '2025-03-10', 'ERP', 'MEDIA', 'Lentitud durante el cierre contable');`,
    `INSERT INTO incidentes VALUES (3, '2025-03-14', 'DB-CLIENTES', 'CRITICA', 'Descarga masiva no autorizada de 4.2 GB entre la 01:00 y las 03:00');`,
    `INSERT INTO incidentes VALUES (4, '2025-03-18', 'FS-ARCHIVOS', 'BAJA', 'Carpeta compartida sin permisos');`,
  )
  const servers = ['DB-CLIENTES', 'DB-VENTAS', 'FS-ARCHIVOS', 'ERP', 'CORREO']
  const actions = ['LOGIN', 'CONSULTA', 'CONSULTA', 'ACTUALIZACION', 'DESCARGA']
  const logs: string[] = []
  for (let i = 0; i < 170; i++) {
    const day = 3 + Math.floor(r() * 19)
    const emp = 1 + Math.floor(r() * 24)
    if (emp === 9 && day >= 13) continue // Bruno is on leave
    logs.push(`'2025-03-${String(day).padStart(2, '0')}', '${hh(8 + Math.floor(r() * 11), Math.floor(r() * 60))}', '10.0.8.${50 + emp * 3}', '${pick(servers)}', '${pick(actions)}', ${Math.floor(2000 + r() * 4e6)}`)
  }
  logs.push(
    `'2025-03-14', '01:12', '10.0.8.77', 'DB-CLIENTES', 'DESCARGA', 1503238553`,
    `'2025-03-14', '01:47', '10.0.8.77', 'DB-CLIENTES', 'DESCARGA', 1610612736`,
    `'2025-03-14', '02:31', '10.0.8.77', 'DB-CLIENTES', 'DESCARGA', 1395864371`,
  )
  logs.sort()
  logs.forEach((l, i) => sql.push(`INSERT INTO logs VALUES (${i + 1}, ${l});`))

  let aid = 1
  let sid = 1
  for (const day of ['2025-03-12', '2025-03-13', '2025-03-14']) {
    people.forEach(([n], i) => {
      const id = i + 1
      if (id === 21) return // night guard
      if (id === 9 && day !== '2025-03-12') return
      const inH = hh(8, Math.floor(r() * 50))
      const outH = hh(17 + Math.floor(r() * 2), Math.floor(r() * 59))
      sql.push(`INSERT INTO accesos VALUES (${aid++}, ${id}, '${day}', '${inH}', 'Principal', 'ENTRADA');`)
      sql.push(`INSERT INTO accesos VALUES (${aid++}, ${id}, '${day}', '${outH}', 'Principal', 'SALIDA');`)
      sql.push(`INSERT INTO sesiones VALUES (${sid++}, 'LAP-${String(408 + id).padStart(4, '0')}', '${user(n)}', '${day}', '${inH}', '${outH}');`)
    })
    sql.push(`INSERT INTO accesos VALUES (${aid++}, 21, '${day}', '21:55', 'Principal', 'ENTRADA');`)
  }
  sql.push(
    `INSERT INTO accesos VALUES (${aid++}, 21, '2025-03-13', '06:05', 'Principal', 'SALIDA');`,
    `INSERT INTO accesos VALUES (${aid++}, 21, '2025-03-14', '06:05', 'Principal', 'SALIDA');`,
    `INSERT INTO accesos VALUES (${aid++}, 17, '2025-03-14', '00:47', 'Lateral', 'ENTRADA');`,
    `INSERT INTO accesos VALUES (${aid++}, 17, '2025-03-14', '02:52', 'Lateral', 'SALIDA');`,
    `INSERT INTO sesiones VALUES (${sid++}, 'LAP-0417', 'cibanez', '2025-03-14', '00:58', '02:45');`,
  )
  return sql.join('\n')
}

export const schema: { table: string; cols: string }[] = [
  { table: 'incidentes', cols: 'id, fecha, servidor, severidad, descripcion' },
  { table: 'logs', cols: 'id, fecha, hora, ip, servidor, accion, bytes' },
  { table: 'dispositivos', cols: 'id, codigo, ip, empleado_id' },
  { table: 'empleados', cols: 'id, nombre, usuario, area, cargo' },
  { table: 'accesos', cols: 'id, empleado_id, fecha, hora, puerta, tipo' },
  { table: 'sesiones', cols: 'id, dispositivo, usuario, fecha, inicio, fin' },
]

export type Mission = {
  title: T
  brief: T
  hint: T
  solution: string
  found: T
  check: (cells: string[], rows: number, cols: number) => boolean
}

export const missions: Mission[] = [
  {
    title: { es: 'El reporte', en: 'The report' },
    brief: {
      es: 'Te llaman un viernes: algo grave pasó en Andina Retail. Empieza por la tabla de incidentes y encuentra el de severidad crítica.',
      en: 'You get a call on a Friday: something serious happened at Andina Retail. Start with the incidentes table and find the critical one.',
    },
    hint: { es: 'Filtra con WHERE severidad = \'CRITICA\'.', en: 'Filter with WHERE severidad = \'CRITICA\'.' },
    solution: "SELECT * FROM incidentes WHERE severidad = 'CRITICA';",
    found: {
      es: 'El 14 de marzo, de madrugada, alguien descargó 4.2 GB del servidor DB-CLIENTES.',
      en: 'On March 14, before dawn, someone downloaded 4.2 GB from the DB-CLIENTES server.',
    },
    check: (c, rows) => rows <= 2 && c.includes('CRITICA') && c.includes('DB-CLIENTES'),
  },
  {
    title: { es: 'La huella', en: 'The trace' },
    brief: {
      es: 'Revisa los logs de DB-CLIENTES del 2025-03-14 antes de las 03:00. ¿Desde qué IP se hicieron las descargas?',
      en: 'Check the DB-CLIENTES logs for 2025-03-14 before 03:00. Which IP did the downloads come from?',
    },
    hint: { es: 'Combina condiciones con AND: fecha, servidor y hora < \'03:00\'.', en: 'Combine conditions with AND: fecha, servidor and hora < \'03:00\'.' },
    solution: "SELECT * FROM logs\nWHERE fecha = '2025-03-14' AND servidor = 'DB-CLIENTES' AND hora < '03:00';",
    found: { es: 'Tres descargas enormes, todas desde la IP 10.0.8.77.', en: 'Three huge downloads, all from IP 10.0.8.77.' },
    check: (c, rows) => rows <= 12 && c.includes('10.0.8.77'),
  },
  {
    title: { es: 'El dueño del equipo', en: 'The device owner' },
    brief: {
      es: '¿A qué equipo pertenece la IP 10.0.8.77 y quién lo tiene asignado? Necesitas el nombre de la persona.',
      en: 'Which device has IP 10.0.8.77 and who is it assigned to? You need the person’s name.',
    },
    hint: { es: 'Une dispositivos con empleados: JOIN empleados e ON e.id = d.empleado_id.', en: 'Join dispositivos with empleados: JOIN empleados e ON e.id = d.empleado_id.' },
    solution: "SELECT d.codigo, d.ip, e.nombre, e.area\nFROM dispositivos d\nJOIN empleados e ON e.id = d.empleado_id\nWHERE d.ip = '10.0.8.77';",
    found: {
      es: 'Es la laptop LAP-0417, asignada a Bruno Tapia, de Finanzas. Demasiado fácil…',
      en: 'It is laptop LAP-0417, assigned to Bruno Tapia from Finance. Too easy…',
    },
    check: (c, rows) => rows <= 3 && c.includes('Bruno Tapia') && c.includes('LAP-0417'),
  },
  {
    title: { es: 'La coartada', en: 'The alibi' },
    brief: {
      es: 'Bruno jura que estaba de vacaciones. Comprueba quién ENTRÓ al edificio el 2025-03-14 antes de las 05:00. Muestra los nombres.',
      en: 'Bruno swears he was on holiday. Check who ENTERED the building on 2025-03-14 before 05:00. Show the names.',
    },
    hint: { es: 'Une accesos con empleados y filtra por fecha, hora y tipo = \'ENTRADA\'.', en: 'Join accesos with empleados and filter by fecha, hora and tipo = \'ENTRADA\'.' },
    solution: "SELECT e.nombre, a.hora, a.puerta\nFROM accesos a\nJOIN empleados e ON e.id = a.empleado_id\nWHERE a.fecha = '2025-03-14' AND a.hora < '05:00' AND a.tipo = 'ENTRADA';",
    found: {
      es: 'Bruno no entró. Solo una persona lo hizo: Carla Ibáñez, a las 00:47 y por la puerta lateral.',
      en: 'Bruno did not come in. Only one person did: Carla Ibáñez, at 00:47 through the side door.',
    },
    check: (c, rows) => rows <= 4 && c.includes('Carla Ibáñez') && !c.includes('Bruno Tapia'),
  },
  {
    title: { es: 'La prueba', en: 'The proof' },
    brief: {
      es: 'Estar en el edificio no basta. ¿Qué usuario inició sesión en la laptop LAP-0417 el 2025-03-14?',
      en: 'Being in the building is not enough. Which user logged in to laptop LAP-0417 on 2025-03-14?',
    },
    hint: { es: 'Consulta sesiones filtrando por dispositivo y fecha.', en: 'Query sesiones filtering by dispositivo and fecha.' },
    solution: "SELECT * FROM sesiones\nWHERE dispositivo = 'LAP-0417' AND fecha = '2025-03-14';",
    found: {
      es: 'El usuario "cibanez" usó la laptop de Bruno de 00:58 a 02:45: justo la ventana de las descargas.',
      en: 'User "cibanez" used Bruno’s laptop from 00:58 to 02:45: exactly the download window.',
    },
    check: (c, rows) => rows <= 4 && c.includes('cibanez') && c.includes('00:58'),
  },
  {
    title: { es: 'La acusación', en: 'The accusation' },
    brief: {
      es: 'Cierra el caso: escribe una consulta que devuelva una sola fila y una sola columna con el nombre de la persona responsable.',
      en: 'Close the case: write a query that returns a single row and a single column with the name of the person responsible.',
    },
    hint: { es: 'SELECT nombre FROM empleados WHERE usuario = …', en: 'SELECT nombre FROM empleados WHERE usuario = …' },
    solution: "SELECT nombre FROM empleados WHERE usuario = 'cibanez';",
    found: {
      es: 'Carla Ibáñez, administradora de bases de datos: entró de madrugada, usó un equipo ajeno para no dejar rastro y extrajo la base de clientes.',
      en: 'Carla Ibáñez, database administrator: she came in before dawn, used someone else’s device to cover her tracks and extracted the client database.',
    },
    check: (c, rows, cols) => rows === 1 && cols === 1 && c[0] === 'Carla Ibáñez',
  },
]
