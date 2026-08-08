import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const studyDbRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const composeFile = path.join(studyDbRoot, 'src', 'apps', 'common', 'docker-compose.yml')
const project = `studydb_validation_${process.pid}`
const composePrefix = ['compose', '-p', project, '-f', composeFile]
const dockerEnvironment = { ...process.env, STUDYDB_PORT: '0' }
const supportedTopics = new Set(['db02', 'db04', 'db05', 'db06'])
const requestedTopics = process.argv.slice(2)

for (const topic of requestedTopics) {
  if (!supportedTopics.has(topic)) {
    throw new Error(`Unknown topic: ${topic}. Choose db02, db04, db05, or db06.`)
  }
}

const shouldValidate = (topic) => requestedTopics.length === 0 || requestedTopics.includes(topic)
const validatedTopics = []

function runDocker(args, options = {}) {
  const result = spawnSync('docker', args, {
    encoding: 'utf8',
    env: dockerEnvironment,
    maxBuffer: 16 * 1024 * 1024,
  })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
  if (!options.allowFailure && result.status !== 0) {
    throw new Error(`docker ${args.join(' ')} failed\n${output}`)
  }
  return { status: result.status, output }
}

function compose(...args) {
  return runDocker([...composePrefix, ...args])
}

function psqlFile(topicDirectory, sqlPath, database = 'studydb') {
  return compose(
    'exec', '-T', 'db',
    'psql', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', database,
    '-f', `/work/${topicDirectory}/${sqlPath}`,
  )
}

function query(sql, database = 'studydb', allowFailure = false) {
  return runDocker([
    ...composePrefix,
    'exec', '-T', 'db',
    'psql', '-v', 'ON_ERROR_STOP=1', '-At', '-U', 'postgres', '-d', database,
    '-c', sql,
  ], { allowFailure })
}

function scalar(sql, database = 'studydb') {
  return query(sql, database).output.trim().split(/\r?\n/)[0]
}

function section(title) {
  console.log(`\n[StudyDB] ${title}`)
}

try {
  section('start isolated PostgreSQL')
  compose('up', '-d', '--wait', '--wait-timeout', '30', 'db')

  if (shouldValidate('db02')) {
    section('db02 schema, CRUD, joins, and constraint rejection')
    psqlFile('db02_sql_crud_schema', 'sql/001_schema.sql')
    psqlFile('db02_sql_crud_schema', 'sql/002_seed.sql')
    psqlFile('db02_sql_crud_schema', 'sql/003_crud_examples.sql')
    psqlFile('db02_sql_crud_schema', 'sql/004_join_examples.sql')
    assert.equal(scalar('SELECT count(*) FROM db02.customers;'), '3')
    assert.equal(scalar('SELECT count(*) FROM db02.order_items;'), '4')
    const duplicate = query(
      "INSERT INTO db02.customers (name, email) VALUES ('Duplicate', 'customer-a@example.test');",
      'studydb',
      true,
    )
    assert.notEqual(duplicate.status, 0, 'duplicate email must be rejected')
    validatedTopics.push('db02')
  }

  if (shouldValidate('db04')) {
    section('db04 commit and rollback state')
    psqlFile('db04_transaction_lock_isolation', 'sql/001_schema.sql')
    psqlFile('db04_transaction_lock_isolation', 'sql/002_seed.sql')
    psqlFile('db04_transaction_lock_isolation', 'sql/003_commit_rollback.sql')
    psqlFile('db04_transaction_lock_isolation', 'sql/006_isolation_observation.sql')
    assert.equal(scalar('SELECT stock FROM db04.products WHERE id = 1;'), '8')
    assert.equal(scalar('SELECT stock FROM db04.products WHERE id = 2;'), '100')
    assert.equal(scalar('SELECT count(*) FROM db04.orders;'), '1')
    validatedTopics.push('db04')
  }

  if (shouldValidate('db05')) {
    section('db05 EXPLAIN before and after indexes')
    psqlFile('db05_index_explain_performance', 'sql/001_schema.sql')
    psqlFile('db05_index_explain_performance', 'sql/002_seed_small.sql')
    psqlFile('db05_index_explain_performance', 'sql/003_seed_large.sql')
    psqlFile('db05_index_explain_performance', 'sql/004_explain_without_index.sql')
    psqlFile('db05_index_explain_performance', 'sql/005_create_indexes.sql')
    psqlFile('db05_index_explain_performance', 'sql/006_explain_with_index.sql')
    psqlFile('db05_index_explain_performance', 'sql/007_ineffective_index_examples.sql')
    assert.equal(scalar('SELECT count(*) FROM db05.orders;'), '20004')
    assert.equal(scalar("SELECT count(*) FROM pg_indexes WHERE schemaname = 'db05' AND indexname LIKE 'idx_%';"), '4')
    validatedTopics.push('db05')
  }

  if (shouldValidate('db06')) {
    section('db06 backup, isolated restore, and migrations')
    psqlFile('db06_backup_restore_migration', 'sql/001_schema.sql')
    psqlFile('db06_backup_restore_migration', 'sql/002_seed.sql')
    psqlFile('db06_backup_restore_migration', 'sql/checks/001_before_migration_check.sql')
    compose(
      'exec', '-T', 'db',
      'pg_dump', '-U', 'postgres', '-d', 'studydb', '--schema=db06', '--file=/tmp/studydb_db06.sql',
    )
    query('DROP DATABASE IF EXISTS studydb_restore;', 'postgres')
    query('CREATE DATABASE studydb_restore;', 'postgres')
    compose(
      'exec', '-T', 'db',
      'psql', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'studydb_restore',
      '-f', '/tmp/studydb_db06.sql',
    )
    psqlFile('db06_backup_restore_migration', 'sql/checks/003_after_restore_check.sql', 'studydb_restore')
    assert.equal(scalar('SELECT count(*) FROM db06.customers;', 'studydb_restore'), '3')
    psqlFile('db06_backup_restore_migration', 'sql/migrations/001_add_customer_email.sql')
    psqlFile('db06_backup_restore_migration', 'sql/migrations/002_add_order_status.sql')
    psqlFile('db06_backup_restore_migration', 'sql/checks/002_after_migration_check.sql')
    assert.equal(scalar("SELECT count(*) FROM db06.customers WHERE email IS NULL;"), '0')
    assert.equal(scalar("SELECT count(*) FROM db06.orders WHERE status = 'created';"), '3')
    validatedTopics.push('db06')
  }

  console.log(`\nStudyDB validation passed: ${validatedTopics.join(', ')}`)
} finally {
  runDocker([...composePrefix, 'down', '--volumes', '--remove-orphans'], { allowFailure: true })
}
