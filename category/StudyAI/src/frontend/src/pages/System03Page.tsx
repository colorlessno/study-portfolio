import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import { createSystemClient } from '../api/client'

const client = createSystemClient('system03')

// ---- 型定義（基本設計書 IF仕様より） ----

type Confidence = '高' | '中' | '低'

interface Source {
  document_name: string
  section: string
  excerpt: string
}

interface AskResponse {
  answer_id: number
  session_id: string
  question: string
  answer: string
  confidence: Confidence
  sources: Source[]
  related_questions: string[]
  warning?: string
}

interface DocumentRecord {
  document_id: number
  file_name: string
  category: string
  version: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface PopularQuestion {
  question: string
  count: number
  avg_rating: number | null
}

interface UnansweredQuestion {
  question: string
  reason: string
  created_at: string
}

// ---- 画面種別（基本設計書 セクション10） ----
type Screen = 'Q&A 画面' | '文書管理画面' | '分析画面'

// ---- カテゴリ一覧（要件定義書 ドキュメントカテゴリより） ----
const CATEGORIES = [
  '要件・仕様',
  '設計',
  'テスト',
  '議事録',
  '運用手順',
  'プロジェクトルール',
  '環境構築',
  'その他',
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

// ---- 信頼度バッジ ----
function ConfidenceBadge({ value }: { value: Confidence }) {
  const colorMap: Record<Confidence, string> = { 高: COLOR.ok, 中: COLOR.warn, 低: COLOR.danger }
  return (
    <span style={{ background: colorMap[value], color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.78rem' }}>
      信頼度: {value}
    </span>
  )
}

// ---- セッションID生成 ----
function newSessionId() {
  return 'sess_' + Math.random().toString(36).slice(2, 10)
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function System03Page() {
  const [screen, setScreen] = useState<Screen>('Q&A 画面')

  // ---- Q&A 画面（基本設計書 14.1） ----
  const [projectId, setProjectId] = useState('project_001')
  const [sessionId] = useState(newSessionId)
  const [question, setQuestion] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [asking, setAsking] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ q: string; res: AskResponse }[]>([])
  const [feedbackTargetId, setFeedbackTargetId] = useState<number | null>(null)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackSent, setFeedbackSent] = useState<Set<number>>(new Set())
  const chatBottomRef = useRef<HTMLDivElement>(null)

  // ---- 文書管理画面（基本設計書 14.2） ----
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docProjectId, setDocProjectId] = useState('project_001')
  const [docCategory, setDocCategory] = useState('')
  const [docVersion, setDocVersion] = useState('')
  const [docAccessRoles, setDocAccessRoles] = useState<string[]>(['admin', 'member'])
  const [docUploading, setDocUploading] = useState(false)
  const [docUploadResult, setDocUploadResult] = useState<{ document_id: number; chunk_count: number; status: string } | null>(null)
  const [documentList, setDocumentList] = useState<DocumentRecord[]>([])
  const [docListLoading, setDocListLoading] = useState(false)
  const docFileRef = useRef<HTMLInputElement>(null)

  // ---- 分析画面（基本設計書 14.3） ----
  const [popularQuestions, setPopularQuestions] = useState<PopularQuestion[]>([])
  const [unansweredQuestions, setUnansweredQuestions] = useState<UnansweredQuestion[]>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  // チャット末尾に自動スクロール
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  // ---- 質問送信 ----
  async function handleAsk() {
    if (!question.trim()) return
    const q = question.trim()
    setQuestion('')
    setAsking(true)
    try {
      const res = await client.post<AskResponse>('/ask', {
        session_id: sessionId,
        project_id: projectId,
        user_id: 'user01',
        question: q,
        ...(categoryFilter.length > 0 ? { category_filter: categoryFilter } : {}),
      })
      setChatHistory(h => [...h, { q, res: res.data }])
      setFeedbackTargetId(res.data.answer_id)
    } catch (err) {
      // 失敗を無視せず、質問を入力欄に戻してエラーを表示する
      setQuestion(q)
      const detail = axios.isAxiosError(err)
        ? `${err.response?.status ?? ''} ${JSON.stringify(err.response?.data ?? err.message)}`
        : String(err)
      window.alert(`質問の送信に失敗しました: ${detail}`)
    } finally {
      setAsking(false)
    }
  }

  // ---- フィードバック送信 ----
  async function handleFeedback(answerId: number, isHelpful: boolean) {
    try {
      await client.post('/ask/feedback', {
        answer_id: answerId,
        is_helpful: isHelpful,
        comment: feedbackComment,
      })
      setFeedbackSent(s => new Set(s).add(answerId))
      setFeedbackComment('')
      setFeedbackTargetId(null)
    } catch { /* 無視 */ }
  }

  // ---- 文書登録 ----
  async function handleDocumentUpload() {
    if (!docFile || !docCategory || !docProjectId) return
    setDocUploading(true)
    setDocUploadResult(null)
    try {
      const formData = new FormData()
      formData.append('file', docFile)
      formData.append('category', docCategory)
      formData.append('version', docVersion)
      formData.append('access_roles', JSON.stringify(docAccessRoles))
      const res = await client.post<{ document_id: number; chunk_count: number; status: string }>(
        '/documents',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setDocUploadResult(res.data)
      setDocFile(null)
      if (docFileRef.current) docFileRef.current.value = ''
      handleLoadDocuments()
    } catch { /* 無視 */ } finally {
      setDocUploading(false)
    }
  }

  // ---- 文書一覧取得 ----
  async function handleLoadDocuments() {
    setDocListLoading(true)
    try {
      const res = await client.get<{ items: DocumentRecord[] }>('/documents')
      setDocumentList(res.data.items ?? [])
    } catch { /* 無視 */ } finally {
      setDocListLoading(false)
    }
  }

  // ---- 文書更新（再ベクトル化） ----
  async function handleReindex(documentId: number) {
    try {
      await client.put(`/documents/${documentId}`)
      handleLoadDocuments()
    } catch { /* 無視 */ }
  }

  // ---- 文書無効化 ----
  async function handleDisable(documentId: number) {
    try {
      await client.delete(`/documents/${documentId}`)
      handleLoadDocuments()
    } catch { /* 無視 */ }
  }

  // ---- 分析データ取得 ----
  async function handleLoadAnalytics() {
    setAnalyticsLoading(true)
    try {
      const [popular, unanswered] = await Promise.all([
        client.get<{ items: PopularQuestion[] }>('/analytics/popular-questions'),
        client.get<{ items: UnansweredQuestion[] }>('/analytics/unanswered-questions'),
      ])
      setPopularQuestions(popular.data.items ?? [])
      setUnansweredQuestions(unanswered.data.items ?? [])
    } catch { /* 無視 */ } finally {
      setAnalyticsLoading(false)
    }
  }

  // ============================================================
  // 画面レンダリング
  // ============================================================
  return (
    <div style={{ maxWidth: 960 }}>
      <h2 style={{ color: COLOR.text, marginBottom: 4 }}>System03</h2>
      <p style={{ color: COLOR.muted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        プロジェクト文書 自然言語Q&Aシステム
      </p>

      {/* 画面タブナビゲーション（基本設計書 セクション10） */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', borderBottom: `2px solid ${COLOR.border}`, paddingBottom: 8 }}>
        {(['Q&A 画面', '文書管理画面', '分析画面'] as Screen[]).map(s => (
          <button
            key={s}
            onClick={() => {
              setScreen(s)
              if (s === '文書管理画面') handleLoadDocuments()
              if (s === '分析画面') handleLoadAnalytics()
            }}
            style={{ ...btn(screen === s ? COLOR.primary : '#ccc'), fontSize: '0.85rem' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ========== Q&A 画面 ========== */}
      {screen === 'Q&A 画面' && (
        <div>
          {/* プロジェクト・カテゴリ絞込（基本設計書 14.1） */}
          <div style={card()}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
              <div>
                <span style={lbl()}>プロジェクト</span>
                <input
                  type="text"
                  style={field()}
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  placeholder="project_001"
                />
              </div>
              <div>
                <span style={lbl()}>カテゴリ絞込（複数選択可）</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {CATEGORIES.map(cat => (
                    <label key={cat} style={{ cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <input
                        type="checkbox"
                        checked={categoryFilter.includes(cat)}
                        onChange={e => {
                          if (e.target.checked) setCategoryFilter(f => [...f, cat])
                          else setCategoryFilter(f => f.filter(c => c !== cat))
                        }}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* チャット履歴表示 */}
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
                    color: COLOR.text,
                  }}>
                    {q}
                  </div>
                </div>

                {/* AI回答 */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{
                    background: COLOR.aiBubble,
                    borderRadius: '8px 8px 8px 0',
                    padding: '0.8rem 1rem',
                    flex: 1,
                    fontSize: '0.9rem',
                    color: COLOR.text,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <ConfidenceBadge value={res.confidence} />
                      {res.warning && (
                        <span style={{ color: COLOR.warn, fontSize: '0.8rem' }}>⚠ {res.warning}</span>
                      )}
                    </div>

                    {/* 回答本文 */}
                    <div style={{ marginBottom: '0.8rem', lineHeight: 1.6 }}>{res.answer}</div>

                    {/* 参照根拠一覧（基本設計書 14.1 sources_grid） */}
                    {res.sources.length > 0 && (
                      <div style={{ marginBottom: '0.8rem' }}>
                        <div style={{ fontSize: '0.8rem', color: COLOR.muted, marginBottom: 4 }}>参照根拠</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                          <thead>
                            <tr style={{ background: '#f0f0f0' }}>
                              {['文書名', 'セクション', '引用箇所'].map(h => (
                                <th key={h} style={{ padding: '3px 6px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {res.sources.map((s, i) => (
                              <tr key={i}>
                                <td style={{ padding: '3px 6px', border: `1px solid ${COLOR.border}` }}>{s.document_name}</td>
                                <td style={{ padding: '3px 6px', border: `1px solid ${COLOR.border}` }}>{s.section}</td>
                                <td style={{ padding: '3px 6px', border: `1px solid ${COLOR.border}`, color: COLOR.muted }}>{s.excerpt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* 関連質問 */}
                    {res.related_questions.length > 0 && (
                      <div style={{ marginBottom: '0.8rem' }}>
                        <div style={{ fontSize: '0.8rem', color: COLOR.muted, marginBottom: 4 }}>関連質問</div>
                        {res.related_questions.map((rq, i) => (
                          <button
                            key={i}
                            onClick={() => setQuestion(rq)}
                            style={{
                              display: 'block',
                              background: 'none',
                              border: `1px solid ${COLOR.primary}`,
                              borderRadius: 4,
                              color: COLOR.primary,
                              cursor: 'pointer',
                              fontSize: '0.82rem',
                              padding: '3px 8px',
                              marginBottom: 4,
                              textAlign: 'left',
                            }}
                          >
                            {rq}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* 回答評価（基本設計書 14.1 rating / feedback_comment） */}
                    {!feedbackSent.has(res.answer_id) ? (
                      <div style={{ borderTop: `1px solid ${COLOR.border}`, paddingTop: 8, marginTop: 8 }}>
                        <div style={{ fontSize: '0.8rem', color: COLOR.muted, marginBottom: 4 }}>回答評価</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <label style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input
                              type="radio"
                              name={`rating_${res.answer_id}`}
                              style={{ marginRight: 4 }}
                              onChange={() => setFeedbackTargetId(res.answer_id)}
                              checked={false}
                            />
                            役に立った
                          </label>
                          <label style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input
                              type="radio"
                              name={`rating_${res.answer_id}`}
                              style={{ marginRight: 4 }}
                              onChange={() => setFeedbackTargetId(res.answer_id)}
                              checked={false}
                            />
                            役に立たなかった
                          </label>
                          {feedbackTargetId === res.answer_id && (
                            <>
                              <input
                                type="text"
                                style={{ ...field(), flex: 1, minWidth: 160 }}
                                value={feedbackComment}
                                onChange={e => setFeedbackComment(e.target.value)}
                                placeholder="コメント（任意）"
                              />
                              <button
                                onClick={() => handleFeedback(res.answer_id, true)}
                                style={{ ...btn(COLOR.ok), fontSize: '0.8rem', padding: '3px 10px' }}
                              >
                                送信
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: COLOR.ok, marginTop: 8 }}>✓ フィードバック送信済み</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* 質問入力エリア（基本設計書 14.1） */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <span style={lbl()}>質問文</span>
              <textarea
                style={{ ...field(), resize: 'vertical', minHeight: 60 }}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk() }
                }}
                placeholder="質問を入力してください（Enterで送信、Shift+Enterで改行）"
              />
            </div>
            <button
              onClick={handleAsk}
              disabled={!question.trim() || asking}
              style={{ ...btn(COLOR.primary, !question.trim() || asking), whiteSpace: 'nowrap' }}
            >
              {asking ? '回答中...' : '質問送信'}
            </button>
          </div>
        </div>
      )}

      {/* ========== 文書管理画面 ========== */}
      {screen === '文書管理画面' && (
        <div>
          {/* 文書登録フォーム（基本設計書 14.2） */}
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>文書管理画面</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={lbl()}>登録ファイル（PDF・docx・md・txt）</span>
                <input
                  ref={docFileRef}
                  type="file"
                  accept=".pdf,.docx,.md,.txt"
                  onChange={e => setDocFile(e.target.files?.[0] ?? null)}
                  style={field()}
                />
              </div>
              <div>
                <span style={lbl()}>プロジェクト</span>
                <input
                  type="text"
                  style={field()}
                  value={docProjectId}
                  onChange={e => setDocProjectId(e.target.value)}
                  placeholder="project_001"
                />
              </div>
              <div>
                <span style={lbl()}>カテゴリ</span>
                <select
                  style={field()}
                  value={docCategory}
                  onChange={e => setDocCategory(e.target.value)}
                >
                  <option value="">（選択してください）</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <span style={lbl()}>版数</span>
                <input
                  type="text"
                  style={field()}
                  value={docVersion}
                  onChange={e => setDocVersion(e.target.value)}
                  placeholder="v1.0"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={lbl()}>閲覧権限（ロール配列）</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['admin', 'member', 'viewer'].map(role => (
                    <label key={role} style={{ cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <input
                        type="checkbox"
                        checked={docAccessRoles.includes(role)}
                        onChange={e => {
                          if (e.target.checked) setDocAccessRoles(r => [...r, role])
                          else setDocAccessRoles(r => r.filter(x => x !== role))
                        }}
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleDocumentUpload}
              disabled={!docFile || !docCategory || !docProjectId || docUploading}
              style={btn(COLOR.primary, !docFile || !docCategory || !docProjectId || docUploading)}
            >
              {docUploading ? '登録中...' : '登録'}
            </button>

            {docUploadResult && (
              <div style={{ marginTop: '1rem', color: COLOR.ok, fontSize: '0.9rem' }}>
                ✓ 登録完了 — 文書ID: {docUploadResult.document_id} / チャンク数: {docUploadResult.chunk_count} / ステータス: {docUploadResult.status}
              </div>
            )}
          </div>

          {/* 文書一覧（基本設計書 14.2 document_grid） */}
          <div style={card()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, color: COLOR.text }}>文書一覧</h4>
              <button onClick={handleLoadDocuments} style={{ ...btn('#6c6f85'), fontSize: '0.85rem' }}>
                {docListLoading ? '読込中...' : '更新'}
              </button>
            </div>

            {documentList.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['文書ID', 'ファイル名', 'カテゴリ', '版数', '状態', '', ''].map(h => (
                      <th key={h} style={{ padding: '6px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {documentList.map(doc => (
                    <tr key={doc.document_id}>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{doc.document_id}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{doc.file_name}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{doc.category}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{doc.version ?? '—'}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>
                        <span style={{
                          background: doc.is_active ? COLOR.ok : '#aaa',
                          color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.78rem',
                        }}>
                          {doc.is_active ? '有効' : '無効'}
                        </span>
                      </td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>
                        <button
                          onClick={() => handleReindex(doc.document_id)}
                          disabled={!doc.is_active}
                          style={{ ...btn(COLOR.primary, !doc.is_active), fontSize: '0.8rem', padding: '2px 10px' }}
                        >
                          更新
                        </button>
                      </td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>
                        <button
                          onClick={() => handleDisable(doc.document_id)}
                          disabled={!doc.is_active}
                          style={{ ...btn(COLOR.danger, !doc.is_active), fontSize: '0.8rem', padding: '2px 10px' }}
                        >
                          無効化
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !docListLoading && (
                <div style={{ color: COLOR.muted, textAlign: 'center', padding: '1.5rem', fontSize: '0.9rem' }}>
                  登録済み文書がありません
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ========== 分析画面 ========== */}
      {screen === '分析画面' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={handleLoadAnalytics} style={{ ...btn('#6c6f85'), fontSize: '0.85rem' }}>
              {analyticsLoading ? '読込中...' : '更新'}
            </button>
          </div>

          {/* 人気質問一覧（基本設計書 14.3 popular_questions_grid） */}
          <div style={card()}>
            <h4 style={{ margin: '0 0 1rem', color: COLOR.text }}>人気質問一覧</h4>
            {popularQuestions.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['質問', '件数', '平均評価'].map(h => (
                      <th key={h} style={{ padding: '6px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {popularQuestions.map((q, i) => (
                    <tr key={i}>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{q.question}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{q.count}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{q.avg_rating != null ? q.avg_rating.toFixed(1) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: COLOR.muted, fontSize: '0.9rem' }}>データがありません</div>
            )}
          </div>

          {/* 未回答一覧（基本設計書 14.3 unanswered_questions_grid） */}
          <div style={card()}>
            <h4 style={{ margin: '0 0 1rem', color: COLOR.text }}>未回答一覧</h4>
            {unansweredQuestions.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['質問', '理由', '発生日'].map(h => (
                      <th key={h} style={{ padding: '6px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {unansweredQuestions.map((q, i) => (
                    <tr key={i}>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{q.question}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted }}>{q.reason}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{q.created_at?.slice(0, 10) ?? '—'}</td>
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
