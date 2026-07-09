import { useState } from 'react'
import { createSystemClient } from '../api/client'

const client = createSystemClient('system08')

// ---- 型定義（基本設計書 IF仕様より） ----

type Priority = 'high' | 'medium' | 'low'
type Quadrant = 'do_first' | 'schedule' | 'delegate' | 'eliminate'
type TaskStatus = 'pending' | 'in_progress' | 'done' | 'skipped'

interface TaskRecord {
  task_id: number
  title: string
  description: string | null
  category: string
  priority: Priority
  quadrant: Quadrant
  urgency: number
  importance: number
  dependencies: number[]
  evidence: string | null
  confidence: 'high' | 'medium' | 'low'
  status: TaskStatus
}

interface AnalysisResult {
  analysis_id: number
  theme: string
  background: string | null
  goal: string
  status: string
  search_count: number
  summary: string
  tasks: TaskRecord[]
  created_at: string
}

interface AnalysisSummary {
  analysis_id: number
  theme: string
  status: string
  search_count: number
  task_count: number
  created_at: string
}

// ---- 画面種別（基本設計書 セクション10） ----
type Screen = '分析実行画面' | 'タスク結果画面' | '分析履歴画面'

// ---- スタイル定数 ----
const COLOR = {
  panel: '#ffffff',
  border: '#e0e0e0',
  primary: '#6c8ebf',
  danger: '#e06c75',
  warn: '#e5c07b',
  ok: '#98c379',
  text: '#1e1e2e',
  muted: '#6c6f85',
}

const btn = (color: string, disabled = false): React.CSSProperties => ({
  background: disabled ? '#ccc' : color,
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '0.5rem 1.2rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '0.9rem',
})

const field = (): React.CSSProperties => ({
  border: `1px solid ${COLOR.border}`,
  borderRadius: 4,
  padding: '0.4rem 0.6rem',
  fontSize: '0.9rem',
  width: '100%',
  boxSizing: 'border-box',
})

const lbl = (): React.CSSProperties => ({
  fontSize: '0.85rem',
  color: COLOR.muted,
  display: 'block',
  marginBottom: 4,
})

const card = (): React.CSSProperties => ({
  background: COLOR.panel,
  border: `1px solid ${COLOR.border}`,
  borderRadius: 8,
  padding: '1.5rem',
  marginBottom: '1rem',
})

// ---- 優先度バッジ ----
function PriorityBadge({ value }: { value: Priority }) {
  const map: Record<Priority, [string, string]> = {
    high: [COLOR.danger, '高'],
    medium: [COLOR.warn, '中'],
    low: [COLOR.ok, '低'],
  }
  const [color, label] = map[value] ?? ['#aaa', value]
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: '0.75rem' }}>
      {label}
    </span>
  )
}

// ---- 象限バッジ ----
function QuadrantBadge({ value }: { value: Quadrant }) {
  const map: Record<Quadrant, [string, string]> = {
    do_first:  [COLOR.danger,  '今すぐ'],
    schedule:  [COLOR.primary, '計画'],
    delegate:  [COLOR.warn,    '委任'],
    eliminate: [COLOR.muted,   '削除'],
  }
  const [color, label] = map[value] ?? ['#aaa', value]
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: '0.75rem' }}>
      {label}
    </span>
  )
}

// ---- ステータスバッジ ----
function StatusBadge({ value }: { value: TaskStatus }) {
  const map: Record<TaskStatus, [string, string]> = {
    pending:     [COLOR.muted,   '未着手'],
    in_progress: [COLOR.primary, '進行中'],
    done:        [COLOR.ok,      '完了'],
    skipped:     ['#aaa',        'スキップ'],
  }
  const [color, label] = map[value] ?? ['#aaa', value]
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: '0.75rem' }}>
      {label}
    </span>
  )
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function System08Page() {
  const [screen, setScreen] = useState<Screen>('分析実行画面')

  // ---- 分析実行画面（基本設計書 14.1） ----
  const [theme, setTheme] = useState('')
  const [background, setBackground] = useState('')
  const [goal, setGoal] = useState('')
  const [constraints, setConstraints] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  // ---- タスク結果画面（基本設計書 14.2） ----
  const [viewingResult, setViewingResult] = useState<AnalysisResult | null>(null)
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null)
  const [taskStatusOverride, setTaskStatusOverride] = useState<Record<number, TaskStatus>>({})
  const [exporting, setExporting] = useState(false)

  // ---- 分析履歴画面（基本設計書 14.3） ----
  const [analysisList, setAnalysisList] = useState<AnalysisSummary[]>([])
  const [listLoading, setListLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  // ---- 分析実行 ----
  async function handleAnalyze() {
    if (!theme.trim() || !goal.trim()) return
    setAnalyzing(true)
    try {
      const body: Record<string, unknown> = { theme: theme.trim(), goal: goal.trim() }
      if (background.trim()) body.background = background.trim()
      if (constraints.trim()) body.constraints = constraints.trim()
      const res = await client.post<AnalysisResult>('/analyze', body)
      setTaskStatusOverride({})
      // 結果画面へ切替
      setViewingResult(res.data)
      setScreen('タスク結果画面')
    } catch { /* 無視 */ } finally {
      setAnalyzing(false)
    }
  }

  // ---- タスク状態更新 ----
  async function handleUpdateTaskStatus(analysisId: number, taskId: number, status: TaskStatus) {
    setUpdatingTaskId(taskId)
    try {
      await client.patch(`/analyses/${analysisId}/tasks/${taskId}`, { status })
      setTaskStatusOverride(prev => ({ ...prev, [taskId]: status }))
    } catch { /* 無視 */ } finally {
      setUpdatingTaskId(null)
    }
  }

  // ---- エクスポート ----
  async function handleExport(analysisId: number, format: 'markdown' | 'csv') {
    setExporting(true)
    try {
      const res = await client.get(`/analyses/${analysisId}/export`, {
        params: { format },
        responseType: 'blob',
      })
      const ext = format === 'markdown' ? 'md' : 'csv'
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `analysis_${analysisId}.${ext}`
      a.click()
      URL.revokeObjectURL(url)
    } catch { /* 無視 */ } finally {
      setExporting(false)
    }
  }

  // ---- 分析履歴取得 ----
  async function handleLoadHistory() {
    setListLoading(true)
    try {
      const res = await client.get<{ items: AnalysisSummary[] }>('/analyses')
      setAnalysisList(res.data.items ?? [])
    } catch { /* 無視 */ } finally {
      setListLoading(false)
    }
  }

  // ---- 履歴から詳細取得 ----
  async function handleOpenAnalysis(analysisId: number) {
    setDetailLoading(true)
    try {
      const res = await client.get<AnalysisResult>(`/analyses/${analysisId}`)
      setViewingResult(res.data)
      setTaskStatusOverride({})
      setScreen('タスク結果画面')
    } catch { /* 無視 */ } finally {
      setDetailLoading(false)
    }
  }

  // ---- タスク結果パネル共通レンダリング ----
  function renderTaskResult(result: AnalysisResult) {
    const quadrantOrder: Quadrant[] = ['do_first', 'schedule', 'delegate', 'eliminate']
    const byQuadrant = quadrantOrder.map(q => ({
      q,
      tasks: result.tasks.filter(t => t.quadrant === q),
    })).filter(g => g.tasks.length > 0)

    const quadrantLabel: Record<Quadrant, string> = {
      do_first:  '🔴 今すぐやる（緊急×重要）',
      schedule:  '🔵 計画する（重要×非緊急）',
      delegate:  '🟡 委任する（緊急×非重要）',
      eliminate: '⚫ 削除する（非緊急×非重要）',
    }

    return (
      <div>
        {/* 分析要約（analysis_summary） */}
        <div style={{ background: '#f0f4ff', borderRadius: 8, padding: '1rem', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
          <div style={{ fontWeight: 'bold', color: COLOR.primary, marginBottom: 4 }}>分析要約</div>
          {result.summary}
        </div>

        {/* エクスポートボタン（export_markdown / export_csv） */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.82rem', color: COLOR.muted, alignSelf: 'center' }}>検索回数: {result.search_count}</span>
          <button
            onClick={() => handleExport(result.analysis_id, 'markdown')}
            disabled={exporting}
            style={{ ...btn('#6c6f85', exporting), fontSize: '0.82rem', padding: '4px 12px' }}
          >
            Markdown出力
          </button>
          <button
            onClick={() => handleExport(result.analysis_id, 'csv')}
            disabled={exporting}
            style={{ ...btn('#6c6f85', exporting), fontSize: '0.82rem', padding: '4px 12px' }}
          >
            CSV出力
          </button>
        </div>

        {/* タスク一覧（tasks_grid）— 象限ごとにグループ化 */}
        {byQuadrant.map(({ q, tasks }) => (
          <div key={q} style={{ marginBottom: '1.2rem' }}>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: COLOR.text, marginBottom: 8 }}>
              <QuadrantBadge value={q} /> <span style={{ marginLeft: 6 }}>{quadrantLabel[q]}</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  {['タスク名', 'カテゴリ', '優先度', '状態', '依存', '根拠', '状態更新', ''].map(h => (
                    <th key={h} style={{ padding: '4px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  const currentStatus = taskStatusOverride[task.task_id] ?? task.status
                  return (
                    <tr key={task.task_id} style={{ opacity: currentStatus === 'done' || currentStatus === 'skipped' ? 0.6 : 1 }}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, fontWeight: 'bold', maxWidth: 200 }}>
                        {task.title}
                        {task.confidence === 'low' && (
                          <span style={{ marginLeft: 4, fontSize: '0.72rem', color: COLOR.warn }}>（推測）</span>
                        )}
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{task.category}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <PriorityBadge value={task.priority} />
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <StatusBadge value={currentStatus} />
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted, fontSize: '0.78rem' }}>
                        {task.dependencies.length > 0
                          ? task.dependencies.map(d => `#${d}`).join(', ')
                          : '—'}
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted, fontSize: '0.78rem', maxWidth: 200 }}>
                        {task.evidence ?? '—'}
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <select
                          style={{ ...field(), width: 90, fontSize: '0.78rem', padding: '2px 4px' }}
                          value={currentStatus}
                          onChange={e => setTaskStatusOverride(prev => ({ ...prev, [task.task_id]: e.target.value as TaskStatus }))}
                        >
                          <option value="pending">未着手</option>
                          <option value="in_progress">進行中</option>
                          <option value="done">完了</option>
                          <option value="skipped">スキップ</option>
                        </select>
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <button
                          onClick={() => handleUpdateTaskStatus(result.analysis_id, task.task_id, taskStatusOverride[task.task_id] ?? task.status)}
                          disabled={updatingTaskId === task.task_id}
                          style={{ ...btn(COLOR.primary, updatingTaskId === task.task_id), fontSize: '0.75rem', padding: '2px 8px' }}
                        >
                          更新
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    )
  }

  // ============================================================
  // 画面レンダリング
  // ============================================================
  return (
    <div style={{ maxWidth: 1040 }}>
      <h2 style={{ color: COLOR.text, marginBottom: 4 }}>System08</h2>
      <p style={{ color: COLOR.muted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        未体験作業 タスク洗い出し＆優先順位付けエージェント
      </p>

      {/* 画面タブナビゲーション（基本設計書 セクション10） */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', borderBottom: `2px solid ${COLOR.border}`, paddingBottom: 8 }}>
        {(['分析実行画面', 'タスク結果画面', '分析履歴画面'] as Screen[]).map(s => (
          <button
            key={s}
            onClick={() => {
              setScreen(s)
              if (s === '分析履歴画面') handleLoadHistory()
            }}
            style={{ ...btn(screen === s ? COLOR.primary : '#ccc'), fontSize: '0.85rem' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ========== 分析実行画面 ========== */}
      {screen === '分析実行画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>分析実行画面</h3>

            {/* 基本設計書 14.1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={lbl()}>テーマ ＊</span>
                <input
                  type="text"
                  style={field()}
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  placeholder="例：Dockerを初めて運用するときに必要な作業"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={lbl()}>目的 ＊</span>
                <textarea
                  style={{ ...field(), minHeight: 70, resize: 'vertical' }}
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  placeholder="例：本番リリース前に漏れなくタスクを洗い出し、優先順位をつけたい"
                />
              </div>
              <div>
                <span style={lbl()}>背景（任意）</span>
                <textarea
                  style={{ ...field(), minHeight: 60, resize: 'vertical' }}
                  value={background}
                  onChange={e => setBackground(e.target.value)}
                  placeholder="例：社内初のコンテナ化プロジェクト、インフラ担当が1名"
                />
              </div>
              <div>
                <span style={lbl()}>制約条件（任意）</span>
                <textarea
                  style={{ ...field(), minHeight: 60, resize: 'vertical' }}
                  value={constraints}
                  onChange={e => setConstraints(e.target.value)}
                  placeholder="例：予算なし、1週間以内に完了必要"
                />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!theme.trim() || !goal.trim() || analyzing}
              style={btn(COLOR.primary, !theme.trim() || !goal.trim() || analyzing)}
            >
              {analyzing ? 'Web検索・タスク洗い出し中（最大5分）...' : '分析開始'}
            </button>
          </div>
        </div>
      )}

      {/* ========== タスク結果画面 ========== */}
      {screen === 'タスク結果画面' && (
        <div>
          {viewingResult ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: COLOR.text }}>タスク結果画面</h3>
                <span style={{ fontSize: '0.85rem', color: COLOR.muted }}>— {viewingResult.theme}</span>
              </div>
              {renderTaskResult(viewingResult)}
            </div>
          ) : (
            <div style={{ ...card(), textAlign: 'center', color: COLOR.muted, padding: '3rem' }}>
              <div style={{ fontSize: '1.1rem', marginBottom: 8 }}>分析結果がありません</div>
              <div style={{ fontSize: '0.9rem' }}>「分析実行画面」から分析を開始するか、「分析履歴画面」から過去の分析を選択してください</div>
            </div>
          )}
        </div>
      )}

      {/* ========== 分析履歴画面 ========== */}
      {screen === '分析履歴画面' && (
        <div>
          <div style={card()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: COLOR.text }}>分析履歴画面</h3>
              <button onClick={handleLoadHistory} disabled={listLoading} style={{ ...btn('#6c6f85', listLoading), fontSize: '0.85rem' }}>
                {listLoading ? '読込中...' : '更新'}
              </button>
            </div>

            {/* 分析履歴（基本設計書 14.3 analysis_grid / open_analysis） */}
            {analysisList.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['ID', 'テーマ', '状態', '検索回数', 'タスク数', '実行日', ''].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analysisList.map(a => (
                    <tr key={a.analysis_id}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{a.analysis_id}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, maxWidth: 280 }}>{a.theme}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <span style={{
                          background: a.status === 'completed' ? COLOR.ok : a.status === 'failed' ? COLOR.danger : COLOR.warn,
                          color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.78rem',
                        }}>
                          {a.status}
                        </span>
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{a.search_count}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{a.task_count}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{a.created_at?.slice(0, 10) ?? '—'}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <button
                          onClick={() => handleOpenAnalysis(a.analysis_id)}
                          disabled={detailLoading}
                          style={{ ...btn(COLOR.primary, detailLoading), fontSize: '0.78rem', padding: '2px 10px' }}
                        >
                          詳細表示
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !listLoading && (
                <div style={{ color: COLOR.muted, fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem' }}>
                  分析履歴がありません
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}
