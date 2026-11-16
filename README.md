# Portafolio — Alejandro Avila Flores

Portafolio personal bilingüe (ES/EN) con demos interactivas que corren 100% en el navegador.

| Ruta | Proyecto |
|---|---|
| `/` | Sitio principal: perfil, experiencia, habilidades, certificaciones y contacto |
| `/lab/anomalias` | Detector de anomalías contables (ley de Benford, duplicados, fuera de horario, umbral de aprobación) |
| `/lab/iso27001` | Evaluador ISO/IEC 27001:2022 (93 controles del Anexo A + matriz de riesgos) |
| `/lab/phishing` | Juego "¿Phishing o legítimo?" |
| `/lab/amenazas` | Dashboard con datos reales del catálogo KEV de CISA (vulnerabilidades explotadas activamente) |
| `/lab/sql` | Detective SQL: caso en 6 misiones con SQLite en el navegador |
| `/lab/firewall` | Firewall Defender: juego arcade en canvas |
| `/lab/peru` | Perú en datos: indicadores del Banco Mundial frente a países vecinos |
| `/lab/automatizacion` | Simulador de automatización: tiempo, ahorro y retorno |
| `/lab/contrasenas` | Analizador y generador de contraseñas (todo en el navegador) |

Los datos del detector de anomalías son sintéticos; las empresas y personas de los juegos son ficticias. El dashboard usa una copia del catálogo público de CISA guardada en `src/data/kev.json` (la fecha de corte se muestra en la página).

## Datos y actualización automática

`scripts/update-data.mjs` descarga el catálogo KEV de CISA y los indicadores del Banco Mundial y los guarda en `src/data/`. El flujo `.github/workflows/update-data.yml` lo ejecuta cada lunes y sube los cambios; Vercel vuelve a desplegar solo.

## CV descargable

Sube tu CV como `public/cv.pdf`. El botón "Descargar CV" aparece automáticamente cuando ese archivo existe.

## Desarrollo

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

## Despliegue en Vercel

Importa el repositorio en vercel.com. Vercel detecta Vite automáticamente (build: `npm run build`, salida: `dist`). `vercel.json` ya incluye la regla para que las rutas funcionen al recargar.

Stack: React 18 · TypeScript · Vite · React Router. Sin backend ni claves.
