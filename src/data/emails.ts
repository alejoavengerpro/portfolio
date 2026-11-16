import type { T } from '../i18n'

export type Mail = {
  from: string
  addr: string
  subject: T
  body: T
  link?: string
  attach?: string
  phish: boolean
  clues: T[]
}

// All companies and domains are fictional.
export const mails: Mail[] = [
  {
    from: 'Banco Andino',
    addr: 'seguridad@banco-andino-verificacion.co',
    subject: { es: 'URGENTE: su cuenta será suspendida en 24 horas', en: 'URGENT: your account will be suspended in 24 hours' },
    body: {
      es: 'Estimado cliente:\n\nDetectamos actividad inusual. Si no verifica su identidad hoy, su cuenta será bloqueada de forma permanente.',
      en: 'Dear customer,\n\nWe detected unusual activity. If you do not verify your identity today, your account will be permanently blocked.',
    },
    link: 'http://banco-andino-verificacion.co/login',
    phish: true,
    clues: [
      { es: 'El dominio no es el oficial del banco (banco-andino-verificacion.co).', en: 'The domain is not the bank’s official one (banco-andino-verificacion.co).' },
      { es: 'Urgencia y amenaza de bloqueo para que actúes sin pensar.', en: 'Urgency and a blocking threat to make you act without thinking.' },
      { es: 'Saludo genérico y enlace http sin cifrado.', en: 'Generic greeting and an unencrypted http link.' },
    ],
  },
  {
    from: 'Recursos Humanos',
    addr: 'rrhh@miempresa.com',
    subject: { es: 'Calendario de feriados 2026', en: '2026 public holiday calendar' },
    body: {
      es: 'Hola equipo:\n\nYa está publicado en la intranet el calendario de feriados del próximo año. Cualquier duda, escríbannos o pasen por la oficina.',
      en: 'Hi team,\n\nNext year’s public holiday calendar is now published on the intranet. Any questions, write to us or drop by the office.',
    },
    phish: false,
    clues: [
      { es: 'Viene del dominio interno de la empresa.', en: 'It comes from the company’s internal domain.' },
      { es: 'No pide datos, pagos ni clics urgentes.', en: 'It asks for no data, payments or urgent clicks.' },
    ],
  },
  {
    from: 'PaqueteYa Envíos',
    addr: 'aduanas@paqueteya-envios.info',
    subject: { es: 'Su paquete está retenido: pague S/ 3.50', en: 'Your parcel is on hold: pay S/ 3.50' },
    body: {
      es: 'No pudimos entregar su paquete. Para liberarlo, pague la tasa de aduana de S/ 3.50 con su tarjeta en el siguiente enlace antes de 48 horas.',
      en: 'We could not deliver your parcel. To release it, pay the S/ 3.50 customs fee with your card at the following link within 48 hours.',
    },
    link: 'https://paqueteya-envios.info/pago',
    phish: true,
    clues: [
      { es: 'Un monto pequeño es el anzuelo: lo que buscan son los datos de tu tarjeta.', en: 'A small amount is the bait: what they want is your card details.' },
      { es: 'No menciona número de seguimiento ni remitente.', en: 'No tracking number or sender is mentioned.' },
      { es: 'Dominio .info ajeno a la empresa real.', en: 'An .info domain unrelated to the real company.' },
    ],
  },
  {
    from: 'NubeDrive',
    addr: 'no-reply@nubedrive.com',
    subject: { es: 'Carla Méndez compartió "Presupuesto Q3" contigo', en: 'Carla Méndez shared "Q3 Budget" with you' },
    body: {
      es: 'Carla Méndez (carla.mendez@miempresa.com) te invitó a editar el archivo "Presupuesto Q3", tal como acordaron en la reunión de hoy.',
      en: 'Carla Méndez (carla.mendez@miempresa.com) invited you to edit the file "Q3 Budget", as agreed in today’s meeting.',
    },
    link: 'https://nubedrive.com/d/presupuesto-q3',
    phish: false,
    clues: [
      { es: 'El enlace apunta al dominio real del servicio.', en: 'The link points to the service’s real domain.' },
      { es: 'Es un archivo esperado, de una compañera conocida.', en: 'It is an expected file from a known colleague.' },
    ],
  },
  {
    from: 'Gerente General',
    addr: 'gerencia.miempresa@correo-rapido.net',
    subject: { es: 'Favor rápido (confidencial)', en: 'Quick favour (confidential)' },
    body: {
      es: 'Estoy en una reunión y no puedo hablar. Necesito que compres 5 tarjetas de regalo de S/ 500 y me envíes los códigos por este correo. Te lo reembolso hoy. No lo comentes con nadie.',
      en: 'I am in a meeting and cannot talk. I need you to buy 5 gift cards of S/ 500 and send me the codes by email. I will reimburse you today. Do not mention this to anyone.',
    },
    phish: true,
    clues: [
      { es: 'Fraude del CEO: un "jefe" pide tarjetas de regalo desde un correo externo.', en: 'CEO fraud: a "boss" asks for gift cards from an external address.' },
      { es: 'Pide secreto y evita cualquier verificación por llamada.', en: 'It demands secrecy and avoids any verification by phone.' },
    ],
  },
  {
    from: 'Soporte TI',
    addr: 'soporte@miempresa-it.support',
    subject: { es: 'Tu contraseña vence hoy', en: 'Your password expires today' },
    body: {
      es: 'Tu contraseña corporativa vence en 2 horas. Para conservarla, confirma tu usuario y contraseña actual en el portal.',
      en: 'Your corporate password expires in 2 hours. To keep it, confirm your username and current password on the portal.',
    },
    link: 'http://miempresa-it.support/renovar',
    phish: true,
    clues: [
      { es: 'TI nunca pide tu contraseña actual por correo.', en: 'IT never asks for your current password by email.' },
      { es: 'Dominio parecido, pero no es el de la empresa.', en: 'A lookalike domain, not the company’s.' },
      { es: 'Plazo de 2 horas para presionarte.', en: 'A 2-hour deadline to pressure you.' },
    ],
  },
  {
    from: 'StreamMax',
    addr: 'recibos@streammax.com',
    subject: { es: 'Recibo de tu suscripción mensual', en: 'Receipt for your monthly subscription' },
    body: {
      es: 'Gracias por tu pago de S/ 24.90 del plan Estándar. No necesitas hacer nada. Puedes ver tus recibos en la app, en Cuenta > Facturación.',
      en: 'Thanks for your S/ 24.90 payment for the Standard plan. No action is needed. You can view receipts in the app under Account > Billing.',
    },
    phish: false,
    clues: [
      { es: 'Informa y no solicita ninguna acción.', en: 'It informs and requests no action.' },
      { es: 'Te dirige a la app en lugar de a un enlace.', en: 'It points you to the app rather than a link.' },
    ],
  },
  {
    from: 'Distribuidora Solís',
    addr: 'facturas@solis-distrib.biz',
    subject: { es: 'Factura vencida — último aviso', en: 'Overdue invoice — final notice' },
    body: {
      es: 'Adjuntamos la factura pendiente. Si no se paga hoy, iniciaremos acciones legales. Abra el archivo para ver el detalle.',
      en: 'Attached is the outstanding invoice. If it is not paid today, we will take legal action. Open the file to see the details.',
    },
    attach: 'Factura_8841.pdf.exe',
    phish: true,
    clues: [
      { es: 'El adjunto termina en .exe: es un programa, no un PDF.', en: 'The attachment ends in .exe: it is a program, not a PDF.' },
      { es: 'Proveedor desconocido y amenaza legal inmediata.', en: 'Unknown supplier and an immediate legal threat.' },
    ],
  },
  {
    from: 'NubeDrive Seguridad',
    addr: 'seguridad@nubedrive.com',
    subject: { es: 'Nuevo inicio de sesión en tu cuenta', en: 'New sign-in to your account' },
    body: {
      es: 'Se inició sesión desde un dispositivo nuevo en Lima, Perú. Si fuiste tú, no hagas nada. Si no, abre la app y cambia tu contraseña desde Ajustes > Seguridad.',
      en: 'There was a sign-in from a new device in Lima, Peru. If it was you, do nothing. If not, open the app and change your password under Settings > Security.',
    },
    phish: false,
    clues: [
      { es: 'Dominio oficial y sin enlaces para "verificar".', en: 'Official domain and no "verify" links.' },
      { es: 'Te deja la opción de no hacer nada.', en: 'It gives you the option to do nothing.' },
    ],
  },
  {
    from: 'Premios Online',
    addr: 'ganador@premios-gratis-hoy.xyz',
    subject: { es: '¡¡Felicidades!! Ganaste un smartphone', en: 'Congratulations!! You won a smartphone' },
    body: {
      es: 'Fuiste seleccionado entre 10,000 usuarios. Responde esta breve encuesta y paga solo S/ 5 de envío para reclamar tu premio. ¡Quedan 3 unidades!',
      en: 'You were selected among 10,000 users. Answer this short survey and pay only S/ 5 shipping to claim your prize. Only 3 left!',
    },
    link: 'http://premios-gratis-hoy.xyz/reclamar',
    phish: true,
    clues: [
      { es: 'Nadie gana un sorteo en el que no participó.', en: 'Nobody wins a draw they never entered.' },
      { es: 'Escasez falsa ("quedan 3") y pago de envío.', en: 'Fake scarcity ("only 3 left") and a shipping fee.' },
    ],
  },
  {
    from: 'Diego Paredes',
    addr: 'diego.paredes@miempresa.com',
    subject: { es: 'Invitación: revisión de sprint, jueves 10:00', en: 'Invitation: sprint review, Thursday 10:00' },
    body: {
      es: 'Hola, agendé la revisión de sprint para el jueves a las 10:00 en la sala 3. La agenda es la misma de siempre. Avísame si no puedes asistir.',
      en: 'Hi, I scheduled the sprint review for Thursday at 10:00 in room 3. Same agenda as always. Let me know if you cannot make it.',
    },
    phish: false,
    clues: [
      { es: 'Compañero conocido, dominio interno, contexto habitual.', en: 'Known colleague, internal domain, usual context.' },
      { es: 'Sin enlaces ni adjuntos.', en: 'No links or attachments.' },
    ],
  },
  {
    from: 'Agencia Tributaria Nacional',
    addr: 'devoluciones@atn-reembolsos.com',
    subject: { es: 'Tiene una devolución de impuestos de S/ 1,280', en: 'You have a tax refund of S/ 1,280' },
    body: {
      es: 'Tras revisar su declaración, le corresponde una devolución. Ingrese el número de su tarjeta y el código de seguridad para recibir el depósito.',
      en: 'After reviewing your return, you are entitled to a refund. Enter your card number and security code to receive the deposit.',
    },
    link: 'https://atn-reembolsos.com/devolucion',
    phish: true,
    clues: [
      { es: 'Para depositarte nadie necesita el código de seguridad de tu tarjeta.', en: 'Nobody needs your card security code to pay you.' },
      { es: 'Una entidad pública usaría su dominio oficial, no un .com genérico.', en: 'A public body would use its official domain, not a generic .com.' },
    ],
  },
]
