// Refreshes the data snapshots used by the dashboards.
// Run: node scripts/update-data.mjs
import { writeFile } from 'node:fs/promises'

const get = async (url) => {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.json()
}

// 1) CISA Known Exploited Vulnerabilities catalog
const kev = await get('https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json')
if (!Array.isArray(kev.vulnerabilities) || kev.vulnerabilities.length < 1000) throw new Error('Unexpected KEV payload')
await writeFile(
  'src/data/kev.json',
  JSON.stringify({
    version: kev.catalogVersion,
    items: kev.vulnerabilities.map((x) => [
      x.cveID,
      x.vendorProject.trim(),
      x.product.trim(),
      x.vulnerabilityName.trim(),
      x.dateAdded,
      x.knownRansomwareCampaignUse === 'Known' ? 1 : 0,
      (x.cwes ?? [])[0] ?? '',
    ]),
  }),
)
console.log('KEV', kev.catalogVersion, kev.vulnerabilities.length)

// 2) World Bank indicators for Peru and its neighbours
const countries = ['PER', 'CHL', 'COL', 'MEX', 'BRA', 'ARG', 'ECU', 'BOL']
const indicators = ['IT.NET.USER.ZS', 'IT.NET.BBND.P2', 'IT.CEL.SETS.P2', 'IT.NET.SECR.P6', 'NY.GDP.PCAP.CD', 'SL.UEM.TOTL.ZS', 'FP.CPI.TOTL.ZG', 'SE.TER.ENRR']
try {
  const series = {}
  let updated = ''
  for (const ind of indicators) {
    const [meta, rows] = await get(`https://api.worldbank.org/v2/country/${countries.join(';')}/indicator/${ind}?format=json&per_page=2000&date=2005:2030`)
    if (!Array.isArray(rows)) throw new Error(`No data for ${ind}`)
    updated = meta.lastupdated ?? updated
    series[ind] = {}
    for (const r of rows) {
      if (r.value === null) continue
      ;(series[ind][r.countryiso3code] ??= {})[r.date] = Math.round(r.value * 100) / 100
    }
    console.log(ind, Object.keys(series[ind].PER ?? {}).length, 'years for PER')
  }
  await writeFile('src/data/peru.json', JSON.stringify({ updated, series }))
} catch (e) {
  // Keep the previous snapshot if the World Bank API is unavailable.
  console.warn('World Bank update skipped:', e.message)
}
