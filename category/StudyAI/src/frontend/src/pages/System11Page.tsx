import { useState } from 'react'
import { createSystemClient } from '../api/client'

const client = createSystemClient('system11')

// ---- 型定義（基本設計書 IF仕様より） ----

type ActionType = 'move' | 'rename' | 'archive'
type ActionState = 'pending' | 'conflict' | 'locked' | 'skipped_by_policy' | 'approved'
type ExecutionItemResult = 'success' | 'failed' | 'locked' | 'conflict' | 'skipped'
type ScanMode = 'preview' | 'execute'

interface PlanAction {
  action_id: number
  action_type: ActionType
  source_path: string
  target_path: string
  reason: string
  confidence: number
  state: ActionState
}

interface Plan {
  plan_id: number
  summary: string
  total_files: number
  actions: PlanAction[]
  created_at: string
}

interface ExecutionResult {
  execution_id: number
  plan_id: number
  success_count: number
  failed_count: number
  skipped_count: number
  conflict_count: number
  executed_at: string
}

interface ExecutionItem {
  item_id: number
  execution_id: number
  action_type: ActionType
  source_path: string
  target_path: string
  result: ExecutionItemResult
  error_reason: string | null
  rollbackable: boolean
}

interface ExecutionSummary {
  execution_id: number
  plan_id: number
  success_count: number
  failed_count: number
  executed_at: string
  rolled_back: boolean
}

interface Settings {
  watch_folders: string[]
  exclude_patterns: string[]
  mode: ScanMode
}

// ---- 画面種別（基本設計書 セクション10） ----
type Screen = '整理案生成画面' | '整理案プレビュー画面' | '実行履歴・設定画面'

// ---- スタイル定数 ----
const COLOR = {
  panel: '#ffffff', border: '#e0e0e0', primary: '#6c8ebf',
  danger: '#e06c75', warn: '#e5c07b', ok: '#98c379', text: '#1e1e2e', muted: '#6c6f85',
}

const btn = (color: string, disabled = false): React.CSSProperties => ({
  background: disabled ? '#ccc' : color, color: '#fff', border: 'none', borderRadius: 6,
  padding: '0.5rem 1.2rem', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.9rem',
})

const field = (): React.CSSProperties => ({
  border: `1px solid ${COLOR.border}`, borderRadius: 4, padding: '0.4rem 0.6rem',
  fontSize: '0.9rem', width: '100%', boxSizing: 'border-box',
})

const lbl = (): React.CSSProperties => ({
  fontSize: '0.85rem', color: COLOR.muted, display: 'block', marginBottom: 4,
})

const card = (): React.CSSProperties => ({
  background: COLOR.panel, border: `1px solid ${COLOR.border}`,
  borderRadius: 8, padding: '1.5rem', marginBottom: '1rem',
})

// ---- action_type バッジ ----
function ActionTypeBadge({ value }: { value: ActionType }) {
  const map: Record<ActionType, [string, string]> = {
    move:    [COLOR.primary, '移動'],
    rename:  [COLOR.warn,    '名前変更'],
    archive: [COLOR.muted,   'アーカイブ'],
  }
  const [color, label] = map[value] ?? ['#aaa', value]
  return <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem' }}>{label}</span>
}

// ---- 状態バッジ ----
function StateBadge({ value }: { value: ActionState | ExecutionItemResult }) {
  const map: Record<string, [string, string]> = {
    pending:           [COLOR.ok,      '実行対象'],
    approved:          [COLOR.ok,      '承認済'],
    conflict:          [COLOR.danger,  '競合'],
    locked:            [COLOR.warn,    'ロック中'],
    skipped_by_policy: [COLOR.muted,   'ポリシー除外'],
    success:           [COLOR.ok,      '成功'],
    failed:            [COLOR.danger,  '失敗'],
    skipped:           [COLOR.muted,   'スキップ'],
  }
  const [color, label] = map[value] ?? ['#aaa', value]
  return <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem' }}>{label}</span>
}

// ---- 信頼度バー ----
function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.min(value * 100, 100)
  const color = pct >= 80 ? COLOR.ok : pct >= 60 ? COLOR.warn : COLOR.danger
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, background: '#f0f0f0', borderRadius: 4, height: 6 }}>
        <div style={{ width: `${pct}%`, background: color, borderRadius: 4, height: 6 }} />
      </div>
      <span style={{ fontSize: '0.75rem', color, minWidth: 30 }}>{pct.toFixed(0)}%</span>
    </div>
  )
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function System11Page() {
  const [screen, setScreen] = useState<Screen>('整理案生成画面')

  // ---- 整理案生成画面（基本設計書 14.1） ----
  const [watchFolders, setWatchFolders] = useState('C:/Users/User/Downloads\nC:/Users/User/Desktop')
  const [excludePatterns, setExcludePatterns] = useState('*.tmp\n*.log\nnode_modules\n.git')
  const [mode, setMode] = useState<ScanMode>('preview')
  const [scanning, setScanning] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)

  // ---- 整理案プレビュー画面（基本設計書 14.2） ----
  const [selectedActionIds, setSelectedActionIds] = useState<Set<number>>(new Set())
  const [executing, setExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)

  // ---- 実行履歴・設定画面（基本設計書 14.3） ----
  const [executions, setExecutions] = useState<ExecutionSummary[]>([])
  const [executionsLoading, setExecutionsLoading] = useState(false)
  const [selectedExecutionId, setSelectedExecutionId] = useState<number | null>(null)
  const [executionItems, setExecutionItems] = useState<ExecutionItem[]>([])
  const [reportText, setReportText] = useState<string | null>(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [rollingBack, setRollingBack] = useState(false)
  const [rollbackDone, setRollbackDone] = useState<Set<number>>(new Set())
  // 設定
  const [settingsWatchFolders, setSettingsWatchFolders] = useState('C:/Users/User/Downloads')
  const [settingsExclude, setSettingsExclude] = useState('*.tmp\n*.log')
  const [settingsMode, setSettingsMode] = useState<ScanMode>('preview')
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)

  // ---- 整理案生成（基本設計書 14.1 submit_scan） ----
  async function handleScan() {
    const folders = watchFolders.split('\n').map(f => f.trim()).filter(Boolean)
    if (!folders.length) return
    setScanning(true)
    setCurrentPlan(null)
    setExecutionResult(null)
    setSelectedActionIds(new Set())
    try {
      const res = await client.post<Plan>('/scan', {
        watch_folders: folders,
        exclude_patterns: excludePatterns.split('\n').map(p => p.trim()).filter(Boolean),
        mode,
      })
      setCurrentPlan(res.data)
      // pending な action をデフォルト全選択
      const pendingIds = new Set(res.data.actions.filter(a => a.state === 'pending').map(a => a.action_id))
      setSelectedActionIds(pendingIds)
      setScreen('整理案プレビュー画面')
    } catch { /* 無視 */ } finally {
      setScanning(false)
    }
  }

  // ---- 実行承認（基本設計書 14.2 approve_plan） ----
  async function handleExecute() {
    if (!currentPlan || selectedActionIds.size === 0) return
    setExecuting(true)
    setExecutionResult(null)
    try {
      const res = await client.post<ExecutionResult>('/execute', {
        plan_id: currentPlan.plan_id,
        approved_action_ids: Array.from(selectedActionIds),
      })
      setExecutionResult(res.data)
    } catch { /* 無視 */ } finally {
      setExecuting(false)
    }
  }

  // ---- 実行履歴取得 ----
  async function handleLoadExecutions() {
    setExecutionsLoading(true)
    try {
      const res = await client.get<{ items: ExecutionSummary[] }>('/executions')
      setExecutions(res.data.items ?? [])
    } catch { /* 無視 */ } finally {
      setExecutionsLoading(false)
    }
  }

  // ---- 実行レポート取得 ----
  async function handleLoadReport(executionId: number) {
    setSelectedExecutionId(executionId)
    setReportLoading(true)
    setReportText(null)
    setExecutionItems([])
    try {
      const [reportRes, itemsRes] = await Promise.all([
        client.get<{ markdown: string; items: ExecutionItem[] }>(`/executions/${executionId}/report`),
        client.get<{ items: ExecutionItem[] }>(`/executions/${executionId}/items`),
      ])
      setReportText(reportRes.data.markdown ?? '')
      setExecutionItems(itemsRes.data.items ?? reportRes.data.items ?? [])
    } catch { /* 無視 */ } finally {
      setReportLoading(false)
    }
  }

  // ---- ロールバック（基本設計書 14.3 rollback） ----
  async function handleRollback(executionId: number) {
    setRollingBack(true)
    try {
      await client.post(`/rollback/${executionId}`)
      setRollbackDone(s => new Set(s).add(executionId))
      handleLoadExecutions()
    } catch { /* 無視 */ } finally {
      setRollingBack(false)
    }
  }

  // ---- 設定保存（基本設計書 14.3 settings_editor） ----
  async function handleSaveSettings() {
    setSettingsSaving(true)
    setSettingsSaved(false)
    try {
      const body: Settings = {
        watch_folders: settingsWatchFolders.split('\n').map(f => f.trim()).filter(Boolean),
        exclude_patterns: settingsExclude.split('\n').map(p => p.trim()).filter(Boolean),
        mode: settingsMode,
      }
      await client.post('/settings', body)
      setSettingsSaved(true)
    } catch { /* 無視 */ } finally {
      setSettingsSaving(false)
    }
  }

  // ============================================================
  // 画面レンダリング
  // ============================================================
  return (
    <div style={{ maxWidth: 1040 }}>
      <h2 style={{ color: COLOR.text, marginBottom: 4 }}>System11</h2>
      <p style={{ color: COLOR.muted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        ローカルPCファイル自動整理エージェント
        <span style={{ marginLeft: 10, fontSize: '0.8rem', background: COLOR.warn, color: '#fff', borderRadius: 4, padding: '2px 8px' }}>
          ⚠ 実ファイル操作 — 実行前に必ずプレビューで確認してください
        </span>
      </p>

      {/* 画面タブナビゲーション（基本設計書 セクション10） */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', borderBottom: `2px solid ${COLOR.border}`, paddingBottom: 8 }}>
        {(['整理案生成画面', '整理案プレビュー画面', '実行履歴・設定画面'] as Screen[]).map(s => (
          <button
            key={s}
            onClick={() => {
              setScreen(s)
              if (s === '実行履歴・設定画面') handleLoadExecutions()
            }}
            style={{ ...btn(screen === s ? COLOR.primary : '#ccc'), fontSize: '0.85rem' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ========== 整理案生成画面 ========== */}
      {screen === '整理案生成画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>整理案生成画面</h3>

            {/* 基本設計書 14.1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={lbl()}>監視フォルダ（1行1フォルダ）＊</span>
                <textarea
                  style={{ ...field(), minHeight: 90, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.83rem' }}
                  value={watchFolders}
                  onChange={e => setWatchFolders(e.target.value)}
                  placeholder={'C:/Users/User/Downloads\nC:/Users/User/Desktop'}
                />
              </div>
              <div>
                <span style={lbl()}>除外パターン（1行1パターン）</span>
                <textarea
                  style={{ ...field(), minHeight: 90, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.83rem' }}
                  value={excludePatterns}
                  onChange={e => setExcludePatterns(e.target.value)}
                  placeholder={'*.tmp\n*.log\nnode_modules'}
                />
              </div>
              <div>
                <span style={lbl()}>実行モード</span>
                <div style={{ display: 'flex', gap: 16, paddingTop: 6 }}>
                  {([['preview', 'プレビューのみ（安全）'], ['execute', '実行モード（ファイル操作あり）']] as [ScanMode, string][]).map(([v, label]) => (
                    <label key={v} style={{ cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="radio" name="mode" value={v} checked={mode === v} onChange={() => setMode(v)} />
                      <span style={{ color: v === 'execute' ? COLOR.danger : COLOR.text }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleScan}
              disabled={!watchFolders.trim() || scanning}
              style={btn(COLOR.primary, !watchFolders.trim() || scanning)}
            >
              {scanning ? '整理案生成中（AI 分析中）...' : '整理案生成'}
            </button>
          </div>

          {/* 整理案要約（基本設計書 14.1 plan_summary） */}
          {currentPlan && (
            <div style={{ ...card(), borderColor: COLOR.ok }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: COLOR.ok, fontWeight: 'bold' }}>✓ 整理案を生成しました</span>
                <span style={{ fontSize: '0.82rem', color: COLOR.muted }}>対象: {currentPlan.total_files}件 / 案: {currentPlan.actions.length}件</span>
              </div>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{currentPlan.summary}</div>
              <button onClick={() => setScreen('整理案プレビュー画面')} style={{ ...btn(COLOR.primary), marginTop: 12, fontSize: '0.85rem' }}>
                プレビュー画面で確認する →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========== 整理案プレビュー画面 ========== */}
      {screen === '整理案プレビュー画面' && (
        <div>
          {currentPlan ? (
            <div>
              {/* 警告バナー */}
              <div style={{ background: '#fff8e1', border: `1px solid ${COLOR.warn}`, borderRadius: 8, padding: '0.8rem 1rem', marginBottom: '1rem', fontSize: '0.88rem', color: '#7a5c00' }}>
                ⚠ 実行前に必ず内容を確認してください。チェックを外した操作は実行されません。完全削除は行いません（移動・名前変更・アーカイブのみ）。
              </div>

              {/* 整理案一覧（基本設計書 14.2 actions_grid / conflict_state） */}
              <div style={card()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: COLOR.text }}>整理案プレビュー画面</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: '0.82rem', color: COLOR.muted, alignSelf: 'center' }}>
                      選択: {selectedActionIds.size} / {currentPlan.actions.filter(a => a.state === 'pending').length}件
                    </span>
                    <button
                      onClick={() => setSelectedActionIds(new Set(currentPlan.actions.filter(a => a.state === 'pending').map(a => a.action_id)))}
                      style={{ ...btn('#6c6f85'), fontSize: '0.78rem', padding: '3px 10px' }}
                    >
                      全選択
                    </button>
                    <button
                      onClick={() => setSelectedActionIds(new Set())}
                      style={{ ...btn('#6c6f85'), fontSize: '0.78rem', padding: '3px 10px' }}
                    >
                      全解除
                    </button>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.81rem' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                      {['選択', '操作', '移動元', '移動先', '理由', '信頼度', '状態'].map(h => (
                        <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentPlan.actions.map(action => {
                      const isExecutable = action.state === 'pending'
                      const isSelected = selectedActionIds.has(action.action_id)
                      return (
                        <tr key={action.action_id} style={{
                          background: action.state === 'conflict' ? '#fff0f0' : action.state === 'locked' ? '#fff8e1' : action.state !== 'pending' ? '#f8f8f2' : undefined,
                          opacity: !isExecutable ? 0.7 : 1,
                        }}>
                          <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={!isExecutable}
                              onChange={e => {
                                const next = new Set(selectedActionIds)
                                if (e.target.checked) next.add(action.action_id)
                                else next.delete(action.action_id)
                                setSelectedActionIds(next)
                              }}
                            />
                          </td>
                          <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                            <ActionTypeBadge value={action.action_type} />
                          </td>
                          <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, fontFamily: 'monospace', fontSize: '0.77rem', maxWidth: 220, wordBreak: 'break-all', color: COLOR.text }}>
                            {action.source_path}
                          </td>
                          <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, fontFamily: 'monospace', fontSize: '0.77rem', maxWidth: 220, wordBreak: 'break-all', color: COLOR.primary }}>
                            {action.target_path}
                          </td>
                          <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted, maxWidth: 180, lineHeight: 1.4 }}>
                            {action.reason}
                          </td>
                          <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, minWidth: 80 }}>
                            <ConfidenceBar value={action.confidence} />
                          </td>
                          <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                            <StateBadge value={action.state} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* 実行承認ボタン・実行結果（基本設計書 14.2 approve_plan / execute_result） */}
              <div style={card()}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: executionResult ? '1rem' : 0 }}>
                  <button
                    onClick={handleExecute}
                    disabled={selectedActionIds.size === 0 || executing}
                    style={btn(COLOR.danger, selectedActionIds.size === 0 || executing)}
                  >
                    {executing ? '実行中...' : `選択した ${selectedActionIds.size} 件を実行（ファイル操作）`}
                  </button>
                  <span style={{ fontSize: '0.82rem', color: COLOR.muted }}>実行は取り消せません。ロールバックは履歴画面から行えます。</span>
                </div>

                {executionResult && (
                  <div style={{ background: '#f8f8f2', borderRadius: 6, padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold', color: COLOR.ok, marginBottom: 8 }}>✓ 実行完了（ID: {executionResult.execution_id}）</div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.88rem' }}>
                      <span style={{ color: COLOR.ok }}>成功: {executionResult.success_count}件</span>
                      <span style={{ color: COLOR.danger }}>失敗: {executionResult.failed_count}件</span>
                      <span style={{ color: COLOR.muted }}>スキップ: {executionResult.skipped_count}件</span>
                      <span style={{ color: COLOR.warn }}>競合: {executionResult.conflict_count}件</span>
                    </div>
                    <button
                      onClick={() => { setScreen('実行履歴・設定画面'); handleLoadExecutions() }}
                      style={{ ...btn('#6c6f85'), fontSize: '0.82rem', marginTop: 10 }}
                    >
                      実行履歴画面で詳細確認・ロールバック →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ ...card(), textAlign: 'center', color: COLOR.muted, padding: '3rem' }}>
              <div style={{ fontSize: '1.1rem', marginBottom: 8 }}>整理案がありません</div>
              <div style={{ fontSize: '0.9rem', marginBottom: 16 }}>「整理案生成画面」で整理案を生成してください</div>
              <button onClick={() => setScreen('整理案生成画面')} style={btn(COLOR.primary)}>整理案生成画面へ</button>
            </div>
          )}
        </div>
      )}

      {/* ========== 実行履歴・設定画面 ========== */}
      {screen === '実行履歴・設定画面' && (
        <div>
          {/* 実行履歴（基本設計書 14.3 executions_grid / rollback） */}
          <div style={card()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: COLOR.text }}>実行履歴・設定画面</h3>
              <button onClick={handleLoadExecutions} disabled={executionsLoading} style={{ ...btn('#6c6f85', executionsLoading), fontSize: '0.85rem' }}>
                {executionsLoading ? '読込中...' : '履歴更新'}
              </button>
            </div>

            {executions.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['実行ID', '実行日時', '成功', '失敗', '状態', 'レポート', 'ロールバック'].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {executions.map(ex => (
                    <tr key={ex.execution_id} style={{ background: selectedExecutionId === ex.execution_id ? '#f0f4ff' : undefined }}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{ex.execution_id}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, whiteSpace: 'nowrap' }}>
                        {ex.executed_at?.slice(0, 16).replace('T', ' ') ?? '—'}
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.ok, fontWeight: 'bold' }}>{ex.success_count}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: ex.failed_count > 0 ? COLOR.danger : COLOR.muted }}>{ex.failed_count}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        {ex.rolled_back
                          ? <span style={{ background: COLOR.muted, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem' }}>ロールバック済</span>
                          : rollbackDone.has(ex.execution_id)
                          ? <span style={{ background: COLOR.muted, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem' }}>ロールバック済</span>
                          : <span style={{ background: COLOR.ok, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem' }}>実行済</span>}
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <button
                          onClick={() => handleLoadReport(ex.execution_id)}
                          disabled={reportLoading}
                          style={{ ...btn(COLOR.primary, reportLoading), fontSize: '0.75rem', padding: '2px 10px' }}
                        >
                          詳細
                        </button>
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <button
                          onClick={() => handleRollback(ex.execution_id)}
                          disabled={rollingBack || ex.rolled_back || rollbackDone.has(ex.execution_id)}
                          style={{ ...btn(COLOR.warn, rollingBack || ex.rolled_back || rollbackDone.has(ex.execution_id)), fontSize: '0.75rem', padding: '2px 10px' }}
                        >
                          {rollingBack ? '処理中...' : 'ロールバック'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !executionsLoading && (
                <div style={{ color: COLOR.muted, fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem' }}>
                  実行履歴がありません
                </div>
              )
            )}
          </div>

          {/* 実行レポート（基本設計書 14.3 execution_report / execution_items_grid） */}
          {selectedExecutionId && (
            <div style={card()}>
              <h4 style={{ margin: '0 0 1rem', color: COLOR.text }}>実行レポート（ID: {selectedExecutionId}）</h4>
              {reportLoading ? (
                <div style={{ color: COLOR.muted, fontSize: '0.9rem' }}>読込中...</div>
              ) : (
                <div>
                  {/* ファイル別結果（execution_items_grid） */}
                  {executionItems.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={lbl()}>ファイル別実行結果（{executionItems.length}件）</span>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ background: '#f0f0f0' }}>
                            {['操作', '元パス', '移動先', '結果', 'ロールバック可', 'エラー'].map(h => (
                              <th key={h} style={{ padding: '4px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {executionItems.map(item => (
                            <tr key={item.item_id}>
                              <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}><ActionTypeBadge value={item.action_type} /></td>
                              <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, fontFamily: 'monospace', fontSize: '0.75rem', maxWidth: 200, wordBreak: 'break-all' }}>{item.source_path}</td>
                              <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, fontFamily: 'monospace', fontSize: '0.75rem', maxWidth: 200, wordBreak: 'break-all', color: COLOR.primary }}>{item.target_path}</td>
                              <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}><StateBadge value={item.result} /></td>
                              <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, textAlign: 'center' }}>
                                {item.rollbackable ? <span style={{ color: COLOR.ok }}>✓</span> : '—'}
                              </td>
                              <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.danger, fontSize: '0.75rem' }}>{item.error_reason ?? '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* レポートテキスト（execution_report） */}
                  {reportText && (
                    <div>
                      <span style={lbl()}>実行レポート（Markdown）</span>
                      <pre style={{
                        background: '#f8f8f2', borderRadius: 6, padding: '1rem',
                        fontSize: '0.8rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word', maxHeight: 300, overflowY: 'auto', color: COLOR.text,
                      }}>
                        {reportText}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 監視設定（基本設計書 14.3 settings_editor） */}
          <div style={card()}>
            <h4 style={{ margin: '0 0 1rem', color: COLOR.text }}>監視設定</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={lbl()}>監視フォルダ（1行1フォルダ）</span>
                <textarea
                  style={{ ...field(), minHeight: 80, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.83rem' }}
                  value={settingsWatchFolders}
                  onChange={e => setSettingsWatchFolders(e.target.value)}
                />
              </div>
              <div>
                <span style={lbl()}>除外パターン（1行1パターン）</span>
                <textarea
                  style={{ ...field(), minHeight: 80, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.83rem' }}
                  value={settingsExclude}
                  onChange={e => setSettingsExclude(e.target.value)}
                />
              </div>
              <div>
                <span style={lbl()}>デフォルト実行モード</span>
                <div style={{ display: 'flex', gap: 16, paddingTop: 6 }}>
                  {([['preview', 'プレビューのみ（推奨）'], ['execute', '実行モード']] as [ScanMode, string][]).map(([v, label]) => (
                    <label key={v} style={{ cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="radio" name="settings_mode" value={v} checked={settingsMode === v} onChange={() => setSettingsMode(v)} />
                      <span style={{ color: v === 'execute' ? COLOR.danger : COLOR.text }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button onClick={handleSaveSettings} disabled={settingsSaving} style={btn(COLOR.primary, settingsSaving)}>
                {settingsSaving ? '保存中...' : '設定保存'}
              </button>
              {settingsSaved && <span style={{ color: COLOR.ok, fontSize: '0.85rem' }}>✓ 保存しました</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
