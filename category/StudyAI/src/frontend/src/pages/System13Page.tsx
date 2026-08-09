import { useState, useRef, useEffect } from 'react'
import { createSystemClient } from '../api/client'

const client = createSystemClient('system13')

// ---- 型定義（基本設計書 IF仕様より） ----

type Importance = '高' | '中' | '低'
type CheckStatus = '未確認' | '確認済み' | '要確認'

interface Project {
  project_id: string
  name: string
  status: string
}

interface Source {
  knowledge_name: string
  category: string
  excerpt: string
}

interface AskResponse {
  answer_id: number
  session_id: string
  question: string
  answer: string
  confidence: string
  sources: Source[]
  warning: string | null
  related_info: string[]
  escalation: string | null
}

interface CatchupReport {
  project_id: string
  generated_at: string
  overview: string
  critical_issues: string[]
  landmines: string[]
  key_persons: { name: string; role: string; contact: string }[]
  important_docs: { name: string; location: string }[]
  first_week_tasks: string[]
}

interface ChecklistItem {
  id: number
  title: string
  category: string
  status: CheckStatus
  due_days: number | null
}

interface KnowledgeRecord {
  id: number
  category: string
  title: string
  importance: Importance
  is_landmine: boolean
  registered_by: string
  created_at: string
}

interface DashboardData {
  unanswered_questions: { question: string; created_at: string }[]
  low_progress_members: { user_id: string; name: string; progress_pct: number }[]
  total_knowledge: number
  total_questions: number
  answered_rate: number
}

// ---- 画面種別（基本設計書 セクション10） ----
type Screen =
  | '初期教育 Q&A 画面'
  | 'キャッチアップ・チェックリスト画面'
  | 'ナレッジ登録・管理画面'
  | '管理ダッシュボード画面'

// ---- ナレッジカテゴリ（要件定義書より） ----
const KNOWLEDGE_CATEGORIES = [
  '経緯・背景',
  '設計・アーキテクチャ',
  'ルール・制約',
  '用語・略語集',
  'リスク・地雷情報',
  '関係者情報',
  '現状・課題',
  'ドキュメント所在',
]

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
  userBubble: '#dbeafe',
  aiBubble: '#f1f5f9',
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

// ---- セッションID生成 ----
function newSessionId() {
  return 'sess_' + Math.random().toString(36).slice(2, 10)
}

// ---- ステータスバッジ ----
function StatusBadge({ status }: { status: CheckStatus }) {
  const colorMap: Record<CheckStatus, string> = {
    '未確認': COLOR.muted,
    '確認済み': COLOR.ok,
    '要確認': COLOR.warn,
  }
  return (
    <span style={{ background: colorMap[status], color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.78rem' }}>
      {status}
    </span>
  )
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function System13Page() {
  const [screen, setScreen] = useState<Screen>('初期教育 Q&A 画面')

  // ---- 共通：プロジェクト一覧（GET /projects） ----
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState('')
  const [userId] = useState('user01')

  // ---- 初期教育 Q&A 画面（基本設計書 14.1） ----
  const [sessionId] = useState(newSessionId)
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ q: string; res: AskResponse }[]>([])
  const chatBottomRef = useRef<HTMLDivElement>(null)

  // ---- キャッチアップ・チェックリスト画面（基本設計書 14.2） ----
  const [role, setRole] = useState('developer')
  const [catchupReport, setCatchupReport] = useState<CatchupReport | null>(null)
  const [catchupLoading, setCatchupLoading] = useState(false)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [checklistLoading, setChecklistLoading] = useState(false)

  // ---- ナレッジ登録・管理画面（基本設計書 14.3） ----
  const [knowledgeTitle, setKnowledgeTitle] = useState('')
  const [knowledgeBody, setKnowledgeBody] = useState('')
  const [knowledgeFile, setKnowledgeFile] = useState<File | null>(null)
  const [knowledgeCategory, setKnowledgeCategory] = useState('')
  const [knowledgeImportance, setKnowledgeImportance] = useState<Importance>('中')
  const [isLandmine, setIsLandmine] = useState(false)
  const [submittingKnowledge, setSubmittingKnowledge] = useState(false)
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeRecord[]>([])
  const [knowledgeLoading, setKnowledgeLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // ---- 管理ダッシュボード画面（基本設計書 14.4） ----
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  // ---- プロジェクト一覧取得 ----
  useEffect(() => {
    client.get<{ items: Project[] }>('/projects')
      .then(res => {
        const items = res.data.items ?? []
        setProjects(items)
        if (items.length > 0 && !projectId) setProjectId(items[0].project_id)
      })
      .catch(() => {})
  }, [])

  // チャット末尾に自動スクロール
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  // ---- 質問送信 ----
  async function handleAsk() {
    if (!question.trim() || !projectId) return
    const q = question.trim()
    setQuestion('')
    setAsking(true)
    try {
      const res = await client.post<AskResponse>('/ask', {
        session_id: sessionId,
        project_id: projectId,
        user_id: userId,
        question: q,
      })
      setChatHistory(h => [...h, { q, res: res.data }])
    } catch { /* 無視 */ } finally {
      setAsking(false)
    }
  }

  // ---- キャッチアップレポート取得 ----
  async function handleCatchupReport() {
    if (!projectId) return
    setCatchupLoading(true)
    setCatchupReport(null)
    try {
      const res = await client.get<CatchupReport>('/catchup-report', {
        params: { project_id: projectId, user_id: userId, role },
      })
      setCatchupReport(res.data)
    } catch { /* 無視 */ } finally {
      setCatchupLoading(false)
    }
  }

  // ---- チェックリスト取得 ----
  async function handleLoadChecklist() {
    setChecklistLoading(true)
    try {
      const res = await client.get<{ items: ChecklistItem[] }>(`/users/${userId}/checklist`, {
        params: { project_id: projectId },
      })
      setChecklist(res.data.items ?? [])
    } catch { /* 無視 */ } finally {
      setChecklistLoading(false)
    }
  }

  // ---- チェック状態更新 ----
  async function handleUpdateCheckItem(itemId: number, status: CheckStatus) {
    try {
      await client.patch(`/users/${userId}/checklist/${itemId}`, { status })
      setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, status } : item))
    } catch { /* 無視 */ }
  }

  // ---- ナレッジ本文登録 ----
  async function handleSubmitKnowledge() {
    if (!knowledgeBody.trim() || !projectId) return
    setSubmittingKnowledge(true)
    try {
      await client.post('/knowledge', {
        project_id: projectId,
        category: knowledgeCategory,
        title: knowledgeTitle,
        content: knowledgeBody,
        importance: knowledgeImportance,
        registered_by: userId,
        is_landmine: isLandmine,
      })
      setKnowledgeTitle('')
      setKnowledgeBody('')
      setIsLandmine(false)
      handleLoadKnowledge()
    } catch { /* 無視 */ } finally {
      setSubmittingKnowledge(false)
    }
  }

  // ---- ナレッジファイル登録 ----
  async function handleSubmitKnowledgeFile() {
    if (!knowledgeFile || !projectId) return
    setSubmittingKnowledge(true)
    try {
      const formData = new FormData()
      formData.append('file', knowledgeFile)
      formData.append('project_id', projectId)
      formData.append('category', knowledgeCategory)
      formData.append('importance', knowledgeImportance)
      formData.append('registered_by', userId)
      formData.append('is_landmine', String(isLandmine))
      await client.post('/knowledge/file', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setKnowledgeFile(null)
      if (fileRef.current) fileRef.current.value = ''
      handleLoadKnowledge()
    } catch { /* 無視 */ } finally {
      setSubmittingKnowledge(false)
    }
  }

  // ---- ナレッジ一覧取得 ----
  async function handleLoadKnowledge() {
    if (!projectId) return
    setKnowledgeLoading(true)
    try {
      const res = await client.get<{ items: KnowledgeRecord[] }>('/knowledge', {
        params: { project_id: projectId },
      })
      setKnowledgeList(res.data.items ?? [])
    } catch { /* 無視 */ } finally {
      setKnowledgeLoading(false)
    }
  }

  // ---- 管理ダッシュボード取得 ----
  async function handleLoadDashboard() {
    setDashboardLoading(true)
    try {
      const res = await client.get<DashboardData>('/admin/dashboard', {
        params: { project_id: projectId },
      })
      setDashboard(res.data)
    } catch { /* 無視 */ } finally {
      setDashboardLoading(false)
    }
  }

  // ============================================================
  // 画面レンダリング
  // ============================================================
  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ color: COLOR.text, marginBottom: 4 }}>System13</h2>
      <p style={{ color: COLOR.muted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        プロジェクト参画者向け 初期教育エージェント
      </p>

      {/* 画面タブナビゲーション（基本設計書 セクション10） */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', borderBottom: `2px solid ${COLOR.border}`, paddingBottom: 8 }}>
        {(['初期教育 Q&A 画面', 'キャッチアップ・チェックリスト画面', 'ナレッジ登録・管理画面', '管理ダッシュボード画面'] as Screen[]).map(s => (
          <button
            key={s}
            onClick={() => {
              setScreen(s)
              if (s === 'ナレッジ登録・管理画面') handleLoadKnowledge()
              if (s === '管理ダッシュボード画面') handleLoadDashboard()
              if (s === 'キャッチアップ・チェックリスト画面') handleLoadChecklist()
            }}
            style={{ ...btn(screen === s ? COLOR.primary : '#ccc'), fontSize: '0.82rem' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ========== 初期教育 Q&A 画面 ========== */}
      {screen === '初期教育 Q&A 画面' && (
        <div>
          {/* プロジェクト・利用者ID（基本設計書 14.1） */}
          <div style={card()}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={lbl()}>プロジェクト</span>
                <select style={field()} value={projectId} onChange={e => setProjectId(e.target.value)}>
                  {projects.length === 0 && <option value="">（読込中...）</option>}
                  {projects.map(p => (
                    <option key={p.project_id} value={p.project_id}>
                      {p.name}（{p.status}）
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span style={lbl()}>利用者ID</span>
                <input type="text" style={field()} value={userId} readOnly />
              </div>
            </div>
          </div>

          {/* チャット履歴 */}
          <div style={{ ...card(), minHeight: 200, maxHeight: 480, overflowY: 'auto' }}>
            {chatHistory.length === 0 && (
              <div style={{ color: COLOR.muted, textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
                質問を入力してください
              </div>
            )}
            {chatHistory.map(({ q, res }) => (
              <div key={res.answer_id} style={{ marginBottom: '1.5rem' }}>
                {/* ユーザー発言 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                  <div style={{
                    background: COLOR.userBubble,
                    borderRadius: '8px 8px 0 8px',
                    padding: '0.6rem 1rem',
                    maxWidth: '70%',
                    fontSize: '0.9rem',
                  }}>
                    {q}
                  </div>
                </div>

                {/* AI回答（基本設計書 14.1 answer / sources_grid / warning） */}
                <div style={{
                  background: COLOR.aiBubble,
                  borderRadius: '8px 8px 8px 0',
                  padding: '0.8rem 1rem',
                  fontSize: '0.9rem',
                }}>
                  {/* 注意事項（warning）*/}
                  {res.warning && (
                    <div style={{
                      background: '#fff8e1',
                      border: `1px solid ${COLOR.warn}`,
                      borderRadius: 4,
                      padding: '0.5rem 0.8rem',
                      marginBottom: '0.8rem',
                      fontSize: '0.85rem',
                      color: '#7a5c00',
                    }}>
                      ⚠ {res.warning}
                    </div>
                  )}

                  {/* 回答本文 */}
                  <div style={{ marginBottom: '0.8rem', lineHeight: 1.6 }}>{res.answer}</div>

                  {/* 参照ナレッジ（sources_grid） */}
                  {res.sources.length > 0 && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <div style={{ fontSize: '0.8rem', color: COLOR.muted, marginBottom: 4 }}>参照ナレッジ</div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ background: '#f0f0f0' }}>
                            {['文書名', 'カテゴリ', '引用箇所'].map(h => (
                              <th key={h} style={{ padding: '3px 6px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {res.sources.map((s, i) => (
                            <tr key={i}>
                              <td style={{ padding: '3px 6px', border: `1px solid ${COLOR.border}` }}>{s.knowledge_name}</td>
                              <td style={{ padding: '3px 6px', border: `1px solid ${COLOR.border}` }}>{s.category}</td>
                              <td style={{ padding: '3px 6px', border: `1px solid ${COLOR.border}`, color: COLOR.muted }}>{s.excerpt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 関連情報 */}
                  {res.related_info.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.8rem', color: COLOR.muted, marginBottom: 4 }}>関連情報</div>
                      {res.related_info.map((info, i) => (
                        <div key={i} style={{ fontSize: '0.83rem', color: COLOR.text, padding: '2px 0' }}>• {info}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* 質問入力（基本設計書 14.1 question / submit_ask） */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <span style={lbl()}>質問文</span>
              <textarea
                style={{ ...field(), resize: 'vertical', minHeight: 60 }}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk() } }}
                placeholder="質問を入力してください（Enterで送信、Shift+Enterで改行）"
              />
            </div>
            <button
              onClick={handleAsk}
              disabled={!question.trim() || !projectId || asking}
              style={{ ...btn(COLOR.primary, !question.trim() || !projectId || asking), whiteSpace: 'nowrap' }}
            >
              {asking ? '回答中...' : '質問送信'}
            </button>
          </div>
        </div>
      )}

      {/* ========== キャッチアップ・チェックリスト画面 ========== */}
      {screen === 'キャッチアップ・チェックリスト画面' && (
        <div>
          {/* キャッチアップレポート（基本設計書 14.2 catchup_report） */}
          <div style={card()}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div>
                <span style={lbl()}>プロジェクト</span>
                <select style={{ ...field(), width: 200 }} value={projectId} onChange={e => setProjectId(e.target.value)}>
                  {projects.map(p => <option key={p.project_id} value={p.project_id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <span style={lbl()}>役割</span>
                <select style={{ ...field(), width: 140 }} value={role} onChange={e => setRole(e.target.value)}>
                  {['developer', 'pm', 'tester'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button onClick={handleCatchupReport} disabled={!projectId || catchupLoading} style={btn(COLOR.danger, !projectId || catchupLoading)}>
                {catchupLoading ? '生成中...' : '緊急キャッチアップレポート取得'}
              </button>
            </div>

            {catchupReport && (
              <div>
                <div style={{ background: '#f8f8f2', borderRadius: 6, padding: '1rem', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  <strong>概要：</strong>{catchupReport.overview}
                </div>

                {catchupReport.landmines.length > 0 && (
                  <div style={{ background: '#fff8e1', border: `1px solid ${COLOR.warn}`, borderRadius: 6, padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 'bold', color: '#7a5c00', marginBottom: 6, fontSize: '0.9rem' }}>⚠ 地雷・リスク情報</div>
                    {catchupReport.landmines.map((m, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: '#7a5c00', padding: '2px 0' }}>• {m}</div>
                    ))}
                  </div>
                )}

                {/* 優先読了項目（priority_topics） */}
                {catchupReport.first_week_tasks.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={lbl()}>優先読了項目（最初の1週間でやるべきこと）</div>
                    {catchupReport.first_week_tasks.map((t, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', padding: '3px 0', display: 'flex', gap: 6 }}>
                        <span style={{ color: COLOR.primary, fontWeight: 'bold' }}>{i + 1}.</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                )}

                {catchupReport.key_persons.length > 0 && (
                  <div>
                    <div style={lbl()}>キーパーソン</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {catchupReport.key_persons.map((p, i) => (
                        <div key={i} style={{ background: '#e8f0fe', borderRadius: 6, padding: '0.4rem 0.8rem', fontSize: '0.83rem', color: COLOR.primary }}>
                          <strong>{p.name}</strong>（{p.role}） — {p.contact}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* チェックリスト（基本設計書 14.2 checklist_grid / check_item_status） */}
          <div style={card()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, color: COLOR.text }}>チェックリスト</h4>
              <button onClick={handleLoadChecklist} disabled={checklistLoading} style={{ ...btn('#6c6f85', checklistLoading), fontSize: '0.85rem' }}>
                {checklistLoading ? '読込中...' : '更新'}
              </button>
            </div>
            {checklist.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['チェック項目', 'カテゴリ', '状態', ''].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {checklist.map(item => (
                    <tr key={item.id}>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{item.title}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{item.category}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>
                        <StatusBadge status={item.status} />
                      </td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>
                        <select
                          style={{ ...field(), width: 110 }}
                          value={item.status}
                          onChange={e => handleUpdateCheckItem(item.id, e.target.value as CheckStatus)}
                        >
                          <option value="未確認">未確認</option>
                          <option value="確認済み">確認済み</option>
                          <option value="要確認">要確認</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: COLOR.muted, fontSize: '0.9rem' }}>チェックリストがありません</div>
            )}
          </div>
        </div>
      )}

      {/* ========== ナレッジ登録・管理画面 ========== */}
      {screen === 'ナレッジ登録・管理画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>ナレッジ登録・管理画面</h3>

            {/* プロジェクト選択 */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={lbl()}>プロジェクト</span>
              <select style={{ ...field(), maxWidth: 300 }} value={projectId} onChange={e => { setProjectId(e.target.value); handleLoadKnowledge() }}>
                {projects.map(p => <option key={p.project_id} value={p.project_id}>{p.name}</option>)}
              </select>
            </div>

            {/* 共通フィールド（基本設計書 14.3） */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={lbl()}>ナレッジタイトル</span>
                <input type="text" style={field()} value={knowledgeTitle} onChange={e => setKnowledgeTitle(e.target.value)} placeholder="任意" />
              </div>
              <div>
                <span style={lbl()}>カテゴリ</span>
                <select style={field()} value={knowledgeCategory} onChange={e => setKnowledgeCategory(e.target.value)}>
                  <option value="">（選択）</option>
                  {KNOWLEDGE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <span style={lbl()}>重要度</span>
                <select style={field()} value={knowledgeImportance} onChange={e => setKnowledgeImportance(e.target.value as Importance)}>
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', paddingTop: 20 }}>
                <label style={{ cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={isLandmine} onChange={e => setIsLandmine(e.target.checked)} />
                  <span style={{ color: isLandmine ? COLOR.danger : COLOR.text }}>地雷情報フラグ ⚠</span>
                </label>
              </div>
            </div>

            {/* ナレッジ本文（基本設計書 14.3 knowledge_body） */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={lbl()}>ナレッジ本文</span>
              <textarea
                style={{ ...field(), minHeight: 100, resize: 'vertical' }}
                value={knowledgeBody}
                onChange={e => setKnowledgeBody(e.target.value)}
                placeholder="ナレッジの内容を記入してください"
              />
            </div>
            <button
              onClick={handleSubmitKnowledge}
              disabled={!knowledgeBody.trim() || !projectId || submittingKnowledge}
              style={{ ...btn(COLOR.primary, !knowledgeBody.trim() || !projectId || submittingKnowledge), marginRight: 8 }}
            >
              {submittingKnowledge ? '登録中...' : '本文で登録'}
            </button>

            {/* ナレッジファイル（基本設計書 14.3 knowledge_file） */}
            <div style={{ borderTop: `1px solid ${COLOR.border}`, marginTop: '1.5rem', paddingTop: '1.5rem' }}>
              <span style={lbl()}>ナレッジファイル（PDF・docx・md・txt）</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,.md,.txt"
                  onChange={e => setKnowledgeFile(e.target.files?.[0] ?? null)}
                  style={{ ...field(), flex: 1 }}
                />
                <button
                  onClick={handleSubmitKnowledgeFile}
                  disabled={!knowledgeFile || !projectId || submittingKnowledge}
                  style={btn(COLOR.primary, !knowledgeFile || !projectId || submittingKnowledge)}
                >
                  ファイルで登録
                </button>
              </div>
            </div>
          </div>

          {/* ナレッジ一覧（基本設計書 14.3 knowledge_grid） */}
          <div style={card()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, color: COLOR.text }}>ナレッジ一覧</h4>
              <button onClick={handleLoadKnowledge} disabled={knowledgeLoading} style={{ ...btn('#6c6f85', knowledgeLoading), fontSize: '0.85rem' }}>
                {knowledgeLoading ? '読込中...' : '更新'}
              </button>
            </div>
            {knowledgeList.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['ID', 'タイトル', 'カテゴリ', '重要度', '地雷', '登録日'].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {knowledgeList.map(k => (
                    <tr key={k.id} style={{ background: k.is_landmine ? '#fff8e1' : undefined }}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{k.id}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{k.title || '（無題）'}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{k.category}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <span style={{ color: k.importance === '高' ? COLOR.danger : k.importance === '中' ? COLOR.warn : COLOR.ok, fontWeight: 'bold' }}>
                          {k.importance}
                        </span>
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, textAlign: 'center' }}>
                        {k.is_landmine ? '⚠' : '—'}
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{k.created_at?.slice(0, 10) ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !knowledgeLoading && <div style={{ color: COLOR.muted, fontSize: '0.9rem' }}>登録済みナレッジがありません</div>
            )}
          </div>
        </div>
      )}

      {/* ========== 管理ダッシュボード画面 ========== */}
      {screen === '管理ダッシュボード画面' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={handleLoadDashboard} disabled={dashboardLoading} style={{ ...btn('#6c6f85', dashboardLoading), fontSize: '0.85rem' }}>
              {dashboardLoading ? '読込中...' : '更新'}
            </button>
          </div>

          {/* 集計カード（基本設計書 14.4 admin_dashboard） */}
          {dashboard && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              {[
                ['総ナレッジ数', dashboard.total_knowledge, COLOR.primary],
                ['総質問数', dashboard.total_questions, COLOR.text],
                ['回答率', `${(dashboard.answered_rate * 100).toFixed(0)}%`, COLOR.ok],
              ].map(([label, value, color]) => (
                <div key={label as string} style={{ ...card(), textAlign: 'center', marginBottom: 0 }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: color as string }}>{value as string}</div>
                  <div style={{ fontSize: '0.85rem', color: COLOR.muted, marginTop: 4 }}>{label as string}</div>
                </div>
              ))}
            </div>
          )}

          {/* 未回答質問（基本設計書 14.4 unanswered_questions） */}
          <div style={card()}>
            <h4 style={{ margin: '0 0 1rem', color: COLOR.text }}>未回答質問（FAQ候補）</h4>
            {dashboard?.unanswered_questions.length ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['質問内容', '発生日'].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dashboard.unanswered_questions.map((q, i) => (
                    <tr key={i}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{q.question}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted }}>{q.created_at?.slice(0, 10) ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: COLOR.muted, fontSize: '0.9rem' }}>データがありません</div>
            )}
          </div>

          {/* 進捗低位者（基本設計書 14.4 low_progress_members） */}
          <div style={card()}>
            <h4 style={{ margin: '0 0 1rem', color: COLOR.text }}>進捗低位者</h4>
            {dashboard?.low_progress_members.length ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['利用者ID', '名前', 'チェックリスト進捗'].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dashboard.low_progress_members.map((m, i) => (
                    <tr key={i}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{m.user_id}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{m.name}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, background: '#f0f0f0', borderRadius: 4, height: 8 }}>
                            <div style={{ width: `${m.progress_pct}%`, background: m.progress_pct < 30 ? COLOR.danger : COLOR.warn, borderRadius: 4, height: 8 }} />
                          </div>
                          <span style={{ fontSize: '0.82rem', color: COLOR.muted, minWidth: 32 }}>{m.progress_pct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: COLOR.muted, fontSize: '0.9rem' }}>データがありません</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
