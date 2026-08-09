import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const catalogPath = path.join(root, 'catalog', 'fields.json')
const allowedKinds = new Set(['document', 'exercise', 'implementation', 'application', 'shared-environment', 'mixed'])
const allowedModes = new Set(['check-only', 'managed-check', 'manual-app'])
const allowedCommands = new Set(['node', 'npm', 'python'])

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
const errors = []
const ids = new Set()
const names = new Set()

if (catalog.schemaVersion !== 1) errors.push('schemaVersion must be 1')
if (!Array.isArray(catalog.fields) || catalog.fields.length === 0) errors.push('fields must be a non-empty array')

for (const field of catalog.fields ?? []) {
  if (!field.id || ids.has(field.id)) errors.push(`duplicate or missing id: ${field.id ?? '(missing)'}`)
  if (!field.name || names.has(field.name)) errors.push(`duplicate or missing name: ${field.name ?? '(missing)'}`)
  ids.add(field.id)
  names.add(field.name)

  if (!allowedKinds.has(field.unitKind)) errors.push(`${field.name}: invalid unitKind`)
  if (!allowedModes.has(field.lifecycle?.mode)) errors.push(`${field.name}: invalid lifecycle mode`)
  if (!Number.isInteger(field.numberedThemes) || field.numberedThemes < 0) errors.push(`${field.name}: invalid numberedThemes`)

  for (const fileKey of ['path', 'entryFile']) {
    const relative = field[fileKey]
    if (typeof relative !== 'string' || path.isAbsolute(relative) || relative.includes('..')) {
      errors.push(`${field.name}: invalid ${fileKey}`)
      continue
    }
    try {
      await stat(path.join(root, relative))
    } catch {
      errors.push(`${field.name}: missing ${fileKey} ${relative}`)
    }
  }

  const check = field.lifecycle?.check
  if (!check || !allowedCommands.has(check.command)) errors.push(`${field.name}: invalid check command`)
  if (!Array.isArray(check?.args) || check.args.some((value) => typeof value !== 'string')) {
    errors.push(`${field.name}: check args must be strings`)
  }
  if (!Number.isInteger(check?.timeoutSeconds) || check.timeoutSeconds < 10 || check.timeoutSeconds > 600) {
    errors.push(`${field.name}: timeoutSeconds must be between 10 and 600`)
  }
  if (field.lifecycle?.mode === 'managed-check' && field.lifecycle.managesCleanup !== true) {
    errors.push(`${field.name}: managed-check must declare managesCleanup`)
  }
  if (field.lifecycle?.mode === 'manual-app' && !field.lifecycle.startGuide) {
    errors.push(`${field.name}: manual-app must declare startGuide`)
  }
  if (field.lifecycle?.startGuide) {
    try {
      await stat(path.join(root, field.lifecycle.startGuide))
    } catch {
      errors.push(`${field.name}: missing startGuide ${field.lifecycle.startGuide}`)
    }
  }
}

const themeTotal = (catalog.fields ?? []).reduce((sum, field) => sum + (field.numberedThemes ?? 0), 0)
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

console.log(`Field catalog passed: ${catalog.fields.length} fields, ${themeTotal} numbered themes`)
