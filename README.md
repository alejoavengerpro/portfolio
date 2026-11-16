# Portafolio — Alejandro Avila Flores

Portafolio personal bilingüe (ES/EN) con demos interactivas que corren 100% en el navegador.

| Ruta | Proyecto |
|---|---|
| `/` | Sitio principal: perfil, experiencia, habilidades, certificaciones y contacto |
| `/lab/anomalias` | Detector de anomalías contables (ley de Benford, duplicados, fuera de horario, umbral de aprobación) |
| `/lab/iso27001` | Evaluador ISO/IEC 27001:2022 (93 controles del Anexo A + matriz de riesgos) |
| `/lab/phishing` | Juego "¿Phishing o legítimo?" |

Los datos del detector son sintéticos y las empresas del juego son ficticias.

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
