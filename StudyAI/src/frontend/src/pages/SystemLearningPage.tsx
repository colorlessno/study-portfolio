import { useEffect, useMemo, useState } from 'react'
import { createSystemClient } from '../api/client'

type Metadata = {
  system_id: string
  title: string
  category: string
  default_input: Record<string, unknown>
  observation_hint: string
}

type RunResult = {
  run_id: string
  system_id: string
  title: string
  category: string
  input: Record<string, unknown>
  result: Record<string, unknown>
  observation: string
  created_at: string
}

type Props = {
  systemId: string
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '1rem',
  },
  label: {
    display: 'block',
    fontWeight: 700,
    marginBottom: 6,
    color: '#1f2937',
  },
  textarea: {
    width: '100%',
    minHeight: 180,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: '0.88rem',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    padding: '0.75rem',
  },
  button: {
    background: '#2563eb',
    color: '#fff',
    border: 0,
    borderRadius: 6,
    padding: '0.65rem 1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  pre: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontSize: '0.82rem',
  },
} as const

export default function SystemLearningPage({ systemId }: Props) {
  const client = useMemo(() => createSystemClient(systemId), [systemId])
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [inputText, setInputText] = useState('{}')
  const [result, setResult] = useState<RunResult | null>(null)
  const [runs, setRuns] = useState<RunResult[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    setError('')
    setResult(null)
    client.get<Metadata>('/metadata')
      .then((res) => {
        if (!active) return
        setMetadata(res.data)
        setInputText(JSON.stringify(res.data.default_input, null, 2))
      })
      .catch(() => {
        if (active) setError('metadata の取得に失敗しました。')
      })
    client.get<{ runs: RunResult[] }>('/runs')
      .then((res) => {
        if (active) setRuns(res.data.runs)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [client])

  async function execute() {
    setLoading(true)
    setError('')
    try {
      const parsed = JSON.parse(inputText)
      const res = await client.post<RunResult>('/execute', { input: parsed })
      setResult(res.data)
      const history = await client.get<{ runs: RunResult[] }>('/runs')
      setRuns(history.data.runs)
    } catch (err) {
      setError(err instanceof SyntaxError ? 'JSON の形式を確認してください。' : '実行に失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <header>
        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{systemId}</div>
        <h1 style={{ margin: '0.2rem 0', color: '#111827' }}>{metadata?.title ?? 'AI learning system'}</h1>
        <p style={{ margin: 0, color: '#475569' }}>{metadata?.observation_hint}</p>
      </header>

      {error && (
        <div style={{ ...styles.card, borderColor: '#fca5a5', color: '#991b1b', background: '#fef2f2' }}>
          {error}
        </div>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 420px) 1fr', gap: '1rem', alignItems: 'start' }}>
        <div style={styles.card}>
          <label style={styles.label}>Input JSON</label>
          <textarea value={inputText} onChange={(event) => setInputText(event.target.value)} style={styles.textarea} />
          <button onClick={execute} disabled={loading} style={{ ...styles.button, marginTop: '0.75rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Running...' : 'Execute'}
          </button>
        </div>

        <div style={styles.card}>
          <label style={styles.label}>Result</label>
          <pre style={styles.pre}>{JSON.stringify(result?.result ?? {}, null, 2)}</pre>
        </div>
      </section>

      <section style={styles.card}>
        <label style={styles.label}>Recent Runs</label>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {runs.length === 0 && <div style={{ color: '#64748b' }}>No runs yet.</div>}
          {runs.map((run) => (
            <div key={run.run_id} style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem' }}>
              <div style={{ fontWeight: 700 }}>{run.run_id}</div>
              <div style={{ color: '#64748b', fontSize: '0.82rem' }}>{run.created_at}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

