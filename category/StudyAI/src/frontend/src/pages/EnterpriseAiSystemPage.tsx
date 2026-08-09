import { useEffect, useMemo, useState } from 'react'
import { createSystemClient } from '../api/client'

type Metadata = {
  system_id: string
  title: string
  pattern: string
  default_input: Record<string, unknown>
  state_flow: string[]
  kpi_definitions: string[]
  risk_points: string[]
}

type RunResult = {
  run_id: string
  system_id: string
  title: string
  pattern: string
  state: string
  input: Record<string, unknown>
  result: Record<string, unknown>
  audit_log: Array<Record<string, unknown>>
  kpi_snapshot: Record<string, unknown>
  created_at: string
}

type Props = {
  systemId: string
}

const styles = {
  panel: {
    background: '#fff',
    border: '1px solid #d9e2ec',
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
    minHeight: 220,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: '0.86rem',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    padding: '0.75rem',
    boxSizing: 'border-box',
  },
  button: {
    background: '#0f766e',
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

export default function EnterpriseAiSystemPage({ systemId }: Props) {
  const client = useMemo(() => createSystemClient(systemId), [systemId])
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [inputText, setInputText] = useState('{}')
  const [mode, setMode] = useState<'mock' | 'lmstudio'>('mock')
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
      const res = await client.post<RunResult>('/execute', { input: parsed, mode, operator: 'learner' })
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
        <h1 style={{ margin: '0.2rem 0', color: '#111827' }}>{metadata?.title ?? 'Enterprise AI system'}</h1>
        <p style={{ margin: 0, color: '#475569' }}>{metadata?.pattern}</p>
      </header>

      {error && (
        <div style={{ ...styles.panel, borderColor: '#fca5a5', color: '#991b1b', background: '#fef2f2' }}>
          {error}
        </div>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 460px) 1fr', gap: '1rem', alignItems: 'start' }}>
        <div style={styles.panel}>
          <label style={styles.label}>Input JSON</label>
          <textarea value={inputText} onChange={(event) => setInputText(event.target.value)} style={styles.textarea} />
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as 'mock' | 'lmstudio')}
              style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: '0.6rem' }}
            >
              <option value="mock">mock</option>
              <option value="lmstudio">lmstudio fallback</option>
            </select>
            <button onClick={execute} disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Running...' : 'Execute'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={styles.panel}>
            <label style={styles.label}>State</label>
            <div style={{ fontWeight: 700, color: '#0f766e' }}>{result?.state ?? '-'}</div>
            <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: 4 }}>
              {metadata?.state_flow.join(' -> ')}
            </div>
          </div>
          <div style={styles.panel}>
            <label style={styles.label}>Result</label>
            <pre style={styles.pre}>{JSON.stringify(result?.result ?? {}, null, 2)}</pre>
          </div>
          <div style={styles.panel}>
            <label style={styles.label}>KPI</label>
            <pre style={styles.pre}>{JSON.stringify(result?.kpi_snapshot ?? {}, null, 2)}</pre>
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={styles.panel}>
          <label style={styles.label}>Audit Log</label>
          <pre style={styles.pre}>{JSON.stringify(result?.audit_log ?? [], null, 2)}</pre>
        </div>
        <div style={styles.panel}>
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
        </div>
      </section>
    </div>
  )
}
