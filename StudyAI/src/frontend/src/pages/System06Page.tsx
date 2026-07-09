import { useState, useRef } from 'react'
import { createSystemClient } from '../api/client'

const client = createSystemClient('system06')

// ---- 型定義（基本設計書 IF仕様より） ----

type Channel = 'メール' | 'チャット' | 'フォーム'
type Priority = 'high' | 'medium' | 'low'
type ResponseType = 'auto' | 'escalated' | 'review'
type InquiryStatus = 'open' | 'answered' | 'escalated' | 'closed'

interface Source {
  faq_id: number
  question: string
  excerpt: string
}

interface InquiryResponse {
  inquiry_id: number
  session_id: string
  category: string
  priority: Priority
  confidence: '高' | '中' | '低'
  response_type: ResponseType
  response_text: string | null
  escalated: boolean
  escalation_id: number | null
  next_actions: string[]
  sources: Source[]
}

interface InquiryRecord {
  inquiry_id: number
  channel: Channel
  category: string
  priority: Priority
  status: InquiryStatus
  created_at: string
}

interface StatsSummary {
  total_inquiries: number
  auto_resolved: number
  escalated: number
  avg_satisfaction: number | null
  top_categories: { category: string; count: number }[]
  unanswered_list: { inquiry_id: number; category: string; reason: string; created_at: string }[]
}

// ---- 画面種別（基本設計書 セクション10） ----
type Screen = '問い合わせ受付・回答画面' | '問い合わせ一覧画面' | 'FAQ管理・統計画面'

// ---- FAQ カテゴリ ----
const FAQ_CATEGORIES = ['注文・購入', '配送・返品', '決済・請求', '商品・サービス', 'アカウント', '技術サポート', 'その他']

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
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.78rem' }}>
      優先度: {label}
    </span>
  )
}

// ---- ステータスバッジ ----
function StatusBadge({ value }: { value: InquiryStatus }) {
  const map: Record<InquiryStatus, [string, string]> = {
    open: [COLOR.primary, '未対応'],
    answered: [COLOR.ok, '回答済み'],
    escalated: [COLOR.danger, 'エスカレーション'],
    closed: ['#aaa', '完了'],
  }
  const [color, label] = map[value] ?? ['#aaa', value]
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.78rem' }}>
      {label}
    </span>
  )
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function System06Page() {
  const [screen, setScreen] = useState<Screen>('問い合わせ受付・回答画面')

  // ---- 問い合わせ受付・回答画面（基本設計書 14.1） ----
  const [channel, setChannel] = useState<Channel>('フォーム')
  const [customerText, setCustomerText] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<InquiryResponse | null>(null)
  // フィードバック
  const [feedbackResolved, setFeedbackResolved] = useState<boolean | null>(null)
  const [feedbackRating, setFeedbackRating] = useState<number>(3)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackSent, setFeedbackSent] = useState(false)

  // ---- 問い合わせ一覧画面（基本設計書 14.2） ----
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | ''>('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('')
  const [inquiryList, setInquiryList] = useState<InquiryRecord[]>([])
  const [listLoading, setListLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [newStatus, setNewStatus] = useState<Record<number, InquiryStatus>>({})

  // ---- FAQ管理・統計画面（基本設計書 14.3） ----
  const [faqQuestion, setFaqQuestion] = useState('')
  const [faqAnswer, setFaqAnswer] = useState('')
  const [faqCategory, setFaqCategory] = useState('')
  const [faqFile, setFaqFile] = useState<File | null>(null)
  const [faqSubmitting, setFaqSubmitting] = useState(false)
  const [faqImporting, setFaqImporting] = useState(false)
  const [stats, setStats] = useState<StatsSummary | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const faqFileRef = useRef<HTMLInputElement>(null)

  // ---- 問い合わせ送信 ----
  async function handleSubmitInquiry() {
    if (!customerText.trim()) return
    setSubmitting(true)
    setResult(null)
    setFeedbackSent(false)
    setFeedbackResolved(null)
    setFeedbackComment('')
    try {
      const body: Record<string, unknown> = {
        channel,
        customer_text: customerText,
      }
      if (customerId.trim()) body.customer_id = customerId.trim()
      const res = await client.post<InquiryResponse>('/inquiries', body)
      setResult(res.data)
    } catch { /* 無視 */ } finally {
      setSubmitting(false)
    }
  }

  // ---- フィードバック送信 ----
  async function handleFeedback() {
    if (!result || feedbackResolved === null) return
    try {
      await client.post(`/inquiries/${result.inquiry_id}/feedback`, {
        is_resolved: feedbackResolved,
        rating: feedbackRating,
        comment: feedbackComment,
      })
      setFeedbackSent(true)
    } catch { /* 無視 */ }
  }

  // ---- 問い合わせ一覧取得 ----
  async function handleLoadInquiries() {
    setListLoading(true)
    try {
      const params: Record<string, string> = {}
      if (statusFilter) params.status = statusFilter
      if (categoryFilter) params.category = categoryFilter
      if (priorityFilter) params.priority = priorityFilter
      const res = await client.get<{ items: InquiryRecord[] }>('/inquiries', { params })
      setInquiryList(res.data.items ?? [])
    } catch { /* 無視 */ } finally {
      setListLoading(false)
    }
  }

  // ---- ステータス更新 ----
  async function handleUpdateStatus(inquiryId: number) {
    const status = newStatus[inquiryId]
    if (!status) return
    setUpdatingId(inquiryId)
    try {
      await client.patch(`/inquiries/${inquiryId}/status`, { status })
      setInquiryList(prev => prev.map(i => i.inquiry_id === inquiryId ? { ...i, status } : i))
    } catch { /* 無視 */ } finally {
      setUpdatingId(null)
    }
  }

  // ---- FAQ 登録 ----
  async function handleSubmitFaq() {
    if (!faqQuestion.trim() || !faqAnswer.trim()) return
    setFaqSubmitting(true)
    try {
      await client.post('/faq', {
        question: faqQuestion,
        answer: faqAnswer,
        category: faqCategory,
      })
      setFaqQuestion('')
      setFaqAnswer('')
    } catch { /* 無視 */ } finally {
      setFaqSubmitting(false)
    }
  }

  // ---- FAQ 一括取込 ----
  async function handleImportFaq() {
    if (!faqFile) return
    setFaqImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', faqFile)
      await client.post('/faq/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setFaqFile(null)
      if (faqFileRef.current) faqFileRef.current.value = ''
    } catch { /* 無視 */ } finally {
      setFaqImporting(false)
    }
  }

  // ---- 統計取得 ----
  async function handleLoadStats() {
    setStatsLoading(true)
    try {
      const res = await client.get<StatsSummary>('/stats/summary')
      setStats(res.data)
    } catch { /* 無視 */ } finally {
      setStatsLoading(false)
    }
  }

  // ============================================================
  // 画面レンダリング
  // ============================================================
  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ color: COLOR.text, marginBottom: 4 }}>System06</h2>
      <p style={{ color: COLOR.muted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        カスタマーサポート 自動応答＆エスカレーションシステム
      </p>

      {/* 画面タブナビゲーション（基本設計書 セクション10） */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', borderBottom: `2px solid ${COLOR.border}`, paddingBottom: 8 }}>
        {(['問い合わせ受付・回答画面', '問い合わせ一覧画面', 'FAQ管理・統計画面'] as Screen[]).map(s => (
          <button
            key={s}
            onClick={() => {
              setScreen(s)
              if (s === '問い合わせ一覧画面') handleLoadInquiries()
              if (s === 'FAQ管理・統計画面') handleLoadStats()
            }}
            style={{ ...btn(screen === s ? COLOR.primary : '#ccc'), fontSize: '0.82rem' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ========== 問い合わせ受付・回答画面 ========== */}
      {screen === '問い合わせ受付・回答画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>問い合わせ受付・回答画面</h3>

            {/* 基本設計書 14.1 入力項目 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={lbl()}>受付チャネル</span>
                <select style={field()} value={channel} onChange={e => setChannel(e.target.value as Channel)}>
                  {(['メール', 'チャット', 'フォーム'] as Channel[]).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <span style={lbl()}>顧客ID（任意）</span>
                <input
                  type="text"
                  style={field()}
                  value={customerId}
                  onChange={e => setCustomerId(e.target.value)}
                  placeholder="customer_001"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={lbl()}>問い合わせ本文</span>
                <textarea
                  style={{ ...field(), minHeight: 100, resize: 'vertical' }}
                  value={customerText}
                  onChange={e => setCustomerText(e.target.value)}
                  placeholder="お客様の問い合わせ内容を入力してください"
                />
              </div>
            </div>

            <button
              onClick={handleSubmitInquiry}
              disabled={!customerText.trim() || submitting}
              style={btn(COLOR.primary, !customerText.trim() || submitting)}
            >
              {submitting ? '自動回答生成中...' : '送信'}
            </button>
          </div>

          {/* 自動回答結果（基本設計書 14.1 出力項目） */}
          {result && (
            <div style={card()}>
              {/* 分類結果・優先度・エスカレーション（category / priority / escalated） */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span style={{ background: '#e8f0fe', color: COLOR.primary, borderRadius: 4, padding: '2px 8px', fontSize: '0.82rem' }}>
                  分類: {result.category}
                </span>
                <PriorityBadge value={result.priority} />
                <span style={{ background: result.confidence === '高' ? COLOR.ok : result.confidence === '中' ? COLOR.warn : COLOR.danger, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.78rem' }}>
                  信頼度: {result.confidence}
                </span>
                {result.escalated && (
                  <span style={{ background: COLOR.danger, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    🚨 エスカレーション
                  </span>
                )}
                {!result.escalated && (
                  <span style={{ background: COLOR.ok, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.82rem' }}>
                    ✓ 自動回答
                  </span>
                )}
              </div>

              {/* 自動回答本文（response_text） */}
              {result.response_text && (
                <div style={{ background: '#f0f4ff', borderRadius: 6, padding: '1rem', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {result.response_text}
                </div>
              )}

              {/* 根拠 FAQ */}
              {result.sources.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={lbl()}>根拠 FAQ</span>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: '#f0f0f0' }}>
                        {['質問', '抜粋'].map(h => (
                          <th key={h} style={{ padding: '4px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.sources.map((s, i) => (
                        <tr key={i}>
                          <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}>{s.question}</td>
                          <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted }}>{s.excerpt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 次アクション */}
              {result.next_actions.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={lbl()}>次アクション</span>
                  {result.next_actions.map((a, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', color: COLOR.text, padding: '2px 0' }}>• {a}</div>
                  ))}
                </div>
              )}

              {/* フィードバック（feedback_resolved / feedback_rating / feedback_comment） */}
              {!feedbackSent ? (
                <div style={{ borderTop: `1px solid ${COLOR.border}`, paddingTop: '1rem', marginTop: '1rem' }}>
                  <span style={lbl()}>解決可否フィードバック</span>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: '0.8rem' }}>
                    <label style={{ cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="radio" name="resolved" onChange={() => setFeedbackResolved(true)} checked={feedbackResolved === true} />
                      解決した
                    </label>
                    <label style={{ cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="radio" name="resolved" onChange={() => setFeedbackResolved(false)} checked={feedbackResolved === false} />
                      解決しなかった
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '0.8rem' }}>
                    <div>
                      <span style={lbl()}>満足度（1〜5）</span>
                      <input
                        type="number"
                        min={1} max={5}
                        style={{ ...field(), width: 80 }}
                        value={feedbackRating}
                        onChange={e => setFeedbackRating(Number(e.target.value))}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={lbl()}>コメント（任意）</span>
                      <input
                        type="text"
                        style={field()}
                        value={feedbackComment}
                        onChange={e => setFeedbackComment(e.target.value)}
                        placeholder="ご意見をお聞かせください"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleFeedback}
                    disabled={feedbackResolved === null}
                    style={btn(COLOR.ok, feedbackResolved === null)}
                  >
                    フィードバック送信
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: '1rem', color: COLOR.ok, fontSize: '0.88rem' }}>
                  ✓ フィードバックを送信しました
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========== 問い合わせ一覧画面 ========== */}
      {screen === '問い合わせ一覧画面' && (
        <div>
          {/* 検索フィルター（基本設計書 14.2） */}
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>問い合わせ一覧画面</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
              <div>
                <span style={lbl()}>状態</span>
                <select style={field()} value={statusFilter} onChange={e => setStatusFilter(e.target.value as InquiryStatus | '')}>
                  <option value="">（すべて）</option>
                  <option value="open">未対応</option>
                  <option value="answered">回答済み</option>
                  <option value="escalated">エスカレーション</option>
                  <option value="closed">完了</option>
                </select>
              </div>
              <div>
                <span style={lbl()}>分類</span>
                <input type="text" style={field()} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} placeholder="例：注文・購入" />
              </div>
              <div>
                <span style={lbl()}>優先度</span>
                <select style={field()} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as Priority | '')}>
                  <option value="">（すべて）</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>
            </div>
            <button onClick={handleLoadInquiries} disabled={listLoading} style={btn(COLOR.primary, listLoading)}>
              {listLoading ? '読込中...' : '絞り込み'}
            </button>
          </div>

          {/* 問い合わせ一覧（基本設計書 14.2 inquiry_grid / update_status） */}
          <div style={card()}>
            {inquiryList.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['ID', 'チャネル', '分類', '優先度', '状態', '受付日', '状態更新', ''].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inquiryList.map(inq => (
                    <tr key={inq.inquiry_id}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{inq.inquiry_id}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{inq.channel}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{inq.category}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <PriorityBadge value={inq.priority} />
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <StatusBadge value={inq.status} />
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        {inq.created_at?.slice(0, 10) ?? '—'}
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <select
                          style={{ ...field(), width: 120 }}
                          value={newStatus[inq.inquiry_id] ?? inq.status}
                          onChange={e => setNewStatus(prev => ({ ...prev, [inq.inquiry_id]: e.target.value as InquiryStatus }))}
                        >
                          <option value="open">未対応</option>
                          <option value="answered">回答済み</option>
                          <option value="escalated">エスカレーション</option>
                          <option value="closed">完了</option>
                        </select>
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <button
                          onClick={() => handleUpdateStatus(inq.inquiry_id)}
                          disabled={updatingId === inq.inquiry_id}
                          style={{ ...btn(COLOR.primary, updatingId === inq.inquiry_id), fontSize: '0.78rem', padding: '2px 10px' }}
                        >
                          更新
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !listLoading && (
                <div style={{ color: COLOR.muted, fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                  該当する問い合わせがありません
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ========== FAQ管理・統計画面 ========== */}
      {screen === 'FAQ管理・統計画面' && (
        <div>
          {/* FAQ登録（基本設計書 14.3 faq_question / faq_answer / faq_category） */}
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>FAQ管理・統計画面</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={lbl()}>FAQ質問</span>
                <input
                  type="text"
                  style={field()}
                  value={faqQuestion}
                  onChange={e => setFaqQuestion(e.target.value)}
                  placeholder="よくある質問を入力してください"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={lbl()}>FAQ回答</span>
                <textarea
                  style={{ ...field(), minHeight: 80, resize: 'vertical' }}
                  value={faqAnswer}
                  onChange={e => setFaqAnswer(e.target.value)}
                  placeholder="回答内容を入力してください"
                />
              </div>
              <div>
                <span style={lbl()}>FAQカテゴリ</span>
                <select style={field()} value={faqCategory} onChange={e => setFaqCategory(e.target.value)}>
                  <option value="">（選択）</option>
                  {FAQ_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmitFaq}
              disabled={!faqQuestion.trim() || !faqAnswer.trim() || faqSubmitting}
              style={btn(COLOR.primary, !faqQuestion.trim() || !faqAnswer.trim() || faqSubmitting)}
            >
              {faqSubmitting ? '登録中...' : 'FAQ登録'}
            </button>

            {/* FAQ一括取込（faq_file） */}
            <div style={{ borderTop: `1px solid ${COLOR.border}`, marginTop: '1.5rem', paddingTop: '1.5rem' }}>
              <span style={lbl()}>FAQ一括取込ファイル（CSV・xlsx）</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  ref={faqFileRef}
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={e => setFaqFile(e.target.files?.[0] ?? null)}
                  style={{ ...field(), flex: 1 }}
                />
                <button
                  onClick={handleImportFaq}
                  disabled={!faqFile || faqImporting}
                  style={btn(COLOR.warn, !faqFile || faqImporting)}
                >
                  {faqImporting ? '取込中...' : '一括取込'}
                </button>
              </div>
            </div>
          </div>

          {/* サマリ統計（基本設計書 14.3 stats_summary） */}
          <div style={card()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, color: COLOR.text }}>サマリ統計</h4>
              <button onClick={handleLoadStats} disabled={statsLoading} style={{ ...btn('#6c6f85', statsLoading), fontSize: '0.85rem' }}>
                {statsLoading ? '読込中...' : '更新'}
              </button>
            </div>

            {stats && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '1.5rem' }}>
                  {[
                    ['総問い合わせ数', stats.total_inquiries, COLOR.text],
                    ['自動解決', stats.auto_resolved, COLOR.ok],
                    ['エスカレーション', stats.escalated, COLOR.danger],
                    ['平均満足度', stats.avg_satisfaction != null ? stats.avg_satisfaction.toFixed(1) : '—', COLOR.primary],
                  ].map(([label, value, color]) => (
                    <div key={label as string} style={{ textAlign: 'center', padding: '0.8rem', background: '#f8f8f2', borderRadius: 6 }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: color as string }}>{value as string | number}</div>
                      <div style={{ fontSize: '0.82rem', color: COLOR.muted, marginTop: 4 }}>{label as string}</div>
                    </div>
                  ))}
                </div>

                {stats.top_categories.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={lbl()}>カテゴリ別件数</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {stats.top_categories.map((c, i) => (
                        <span key={i} style={{ background: '#e8f0fe', color: COLOR.primary, borderRadius: 4, padding: '3px 10px', fontSize: '0.83rem' }}>
                          {c.category}（{c.count}件）
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 未回答傾向（基本設計書 14.3 unanswered_list） */}
          <div style={card()}>
            <h4 style={{ margin: '0 0 1rem', color: COLOR.text }}>未回答傾向（低評価・根拠不足）</h4>
            {stats?.unanswered_list.length ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['ID', '分類', '理由', '受付日'].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.unanswered_list.map(u => (
                    <tr key={u.inquiry_id}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{u.inquiry_id}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{u.category}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted }}>{u.reason}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{u.created_at?.slice(0, 10) ?? '—'}</td>
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
