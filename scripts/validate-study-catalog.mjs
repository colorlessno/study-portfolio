import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const catalogPath = path.join(root, 'catalog', 'study-areas.json')
const allowedKinds = new Set(['document', 'exercise', 'implementation', 'application', 'shared-environment', 'mixed'])
const allowedModes = new Set(['check-only', 'managed-check', 'manual-app'])
const allowedCommands = new Set(['node', 'npm', 'python'])

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
const errors = []
const ids = new Set()
const names = new Set()

if (catalog.schemaVersion !== 1) errors.push('schemaVersion must be 1')
if (!Array.isArray(catalog.areas) || catalog.areas.length === 0) errors.push('areas must be a non-empty array')

for (const area of catalog.areas ?? []) {
  if (!area.id || ids.has(area.id)) errors.push(`duplicate or missing id: ${area.id ?? '(missing)'}`)
  if (!area.name || names.has(area.name)) errors.push(`duplicate or missing name: ${area.name ?? '(missing)'}`)
  ids.add(area.id)
  names.add(area.name)

  if (!allowedKinds.has(area.unitKind)) errors.push(`${area.name}: invalid unitKind`)
  if (!allowedModes.has(area.lifecycle?.mode)) errors.push(`${area.name}: invalid lifecycle mode`)
  if (!Number.isInteger(area.numberedThemes) || area.numberedThemes < 0) errors.push(`${area.name}: invalid numberedThemes`)

  for (const field of ['path', 'entryFile']) {
    const relative = area[field]
    if (typeof relative !== 'string' || path.isAbsolute(relative) || relative.includes('..')) {
      errors.push(`${area.name}: invalid ${field}`)
      continue
    }
    try {
      await stat(path.join(root, relative))
    } catch {
      errors.push(`${area.name}: missing ${field} ${relative}`)
    }
  }

  const check = area.lifecycle?.check
  if (!check || !allowedCommands.has(check.command)) errors.push(`${area.name}: invalid check command`)
  if (!Array.isArray(check?.args) || check.args.some((value) => typeof value !== 'string')) {
    errors.push(`${area.name}: check args must be strings`)
  }
  if (!Number.isInteger(check?.timeoutSeconds) || check.timeoutSeconds < 10 || check.timeoutSeconds > 600) {
    errors.push(`${area.name}: timeoutSeconds must be between 10 and 600`)
  }
  if (area.lifecycle?.mode === 'managed-check' && area.lifecycle.managesCleanup !== true) {
    errors.push(`${area.name}: managed-check must declare managesCleanup`)
  }
  if (area.lifecycle?.mode === 'manual-app' && !area.lifecycle.startGuide) {
    errors.push(`${area.name}: manual-app must declare startGuide`)
  }
  if (area.lifecycle?.startGuide) {
    try {
      await stat(path.join(root, area.lifecycle.startGuide))
    } catch {
      errors.push(`${area.name}: missing startGuide ${area.lifecycle.startGuide}`)
    }
  }
}

const themeTotal = (catalog.areas ?? []).reduce((sum, area) => sum + (area.numberedThemes ?? 0), 0)
if (themeTotal !== catalog.numberedThemeCount || themeTotal !== 163) {
  errors.push(`numbered theme count must be 163, actual ${themeTotal}`)
}

const categoryDirectories = (await readdir(path.join(root, 'category'), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('Study'))
  .map((entry) => entry.name)
  .sort()
const catalogNames = [...names].sort()
if (JSON.stringify(categoryDirectories) !== JSON.stringify(catalogNames)) {
  errors.push(`category/catalog mismatch: directories=${categoryDirectories.join(',')} catalog=${catalogNames.join(',')}`)
}

if (errors.length > 0) {
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Study area catalog passed: ${catalog.areas.length} areas, ${themeTotal} numbered themes`)
