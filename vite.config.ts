import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Social previews need an absolute image URL. Vercel exposes the production
// domain at build time; locally the path stays relative.
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL
const siteUrl = host ? `https://${host}` : ''

export default defineConfig({
  plugins: [
    react(),
    { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl) },
  ],
})
