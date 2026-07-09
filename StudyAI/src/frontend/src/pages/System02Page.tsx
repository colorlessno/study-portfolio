import { useState, useRef } from 'react'
import { createSystemClient } from '../api/client'

const client = createSystemClient('system02')

// ---- 型定義（基本設計書 IF仕様より） ----

type Severity = 'critical' | 'high' | 'medium' | 'low'
type ReviewType = '契約書' | '規約' | '覚書' | '基本合意書' | 'NDA' | '業務委託契約' | 'その他'
type InputMode = 'ファイル' | 'テキスト'

interface Issue {
  issue_id: number
  severity: Severity
  risk_type: string
  clause_ref: string
  description: string
  suggestion: string | null
  confidence: 'high' | 'medium' | 'low'
}

interface ReviewResult {
  review_id: number
  document_type: string
  recommendation: string
  summary: string
  issues: Issue[]
  created_at: string
}

interface CompareIssue {
  issue_id: number
  change_type: 'added' | 'removed' | 'modified'
  severity: Severity
  clause_ref: string
  description: string
  suggestion: string | null
}

interface CompareResult {
  review_id: number
  compare_summary: string
  doc_a_type: string
  doc_b_type: string
  issues: CompareIssue[]
  created_at: string
}

interface ReviewSummary {
  review_id: number
  review_type: 'single' | 'compare'
  document_type: string
  recommendation: string
  issue_count: number
  created_at: string
}

// ---- 画面種別（基本設計書 セクション10） ----
type Screen = '単一審査画面' | '比較審査画面' | '審査履歴画面'

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

// ---- Severity バッジ ----
function SeverityBadge({ value }: { value: Severity }) {
  const map: Record<Severity, [string, string]> = {
    critical: [COLOR.danger, '致命的'],
    high:     ['#c0392b',   '高'],
    medium:   [COLOR.warn,  '中'],
    low:      [COLOR.ok,    '低'],
  }
  const [color, label] = map[value] ?? ['#aaa', value]
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
      {label}
    </span>
  )
}

// ---- 変更種別バッジ ----
function ChangeTypeBadge({ value }: { value: 'added' | 'removed' | 'modified' }) {
  const map: Record<string, [string, string]> = {
    added:    [COLOR.ok,      '追加'],
    removed:  [COLOR.danger,  '削除'],
    modified: [COLOR.primary, '変更'],
  }
  const [color, label] = map[value] ?? ['#aaa', value]
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem' }}>
      {label}
    </span>
  )
}

// ---- 一次審査結果バッジ ----
function RecommendationBadge({ value }: { value: string }) {
  const isRed = value.includes('修正') || value.includes('問題')
  const isYellow = value.includes('要確認') || value.includes('注意')
  const color = isRed ? COLOR.danger : isYellow ? COLOR.warn : COLOR.ok
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '3px 10px', fontSize: '0.85rem', fontWeight: 'bold' }}>
      {value}
    </span>
  )
}

// ---- 指摘一覧テーブル ----
function IssuesTable({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) return <div style={{ color: COLOR.ok, fontSize: '0.9rem' }}>指摘事項なし</div>
  const sortOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  const sorted = [...issues].sort((a, b) => sortOrder[a.severity] - sortOrder[b.severity])
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
      <thead>
        <tr style={{ background: '#f0f0f0' }}>
          {['深刻度', 'リスク種別', '条番号', '指摘内容', '修正案', '信頼度'].map(h => (
            <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}`, whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map(issue => (
          <tr key={issue.issue_id}>
            <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
              <SeverityBadge value={issue.severity} />
            </td>
            <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, whiteSpace: 'nowrap' }}>{issue.risk_type}</td>
            <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, whiteSpace: 'nowrap', color: COLOR.primary }}>{issue.clause_ref}</td>
            <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, maxWidth: 280, lineHeight: 1.5 }}>{issue.description}</td>
            <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted, maxWidth: 220, lineHeight: 1.5 }}>
              {issue.suggestion ?? '—'}
            </td>
            <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: issue.confidence === 'low' ? COLOR.warn : COLOR.muted }}>
                {issue.confidence}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function System02Page() {
  const [screen, setScreen] = useState<Screen>('単一審査画面')

  // ---- 単一審査画面（基本設計書 14.1） ----
  const [reviewType, setReviewType] = useState<ReviewType>('契約書')
  const [inputMode, setInputMode] = useState<InputMode>('ファイル')
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourceText, setSourceText] = useState('')
  const [reviewing, setReviewing] = useState(false)
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null)
  const singleFileRef = useRef<HTMLInputElement>(null)

  // ---- 比較審査画面（基本設計書 14.2） ----
  const [fileA, setFileA] = useState<File | null>(null)
  const [fileB, setFileB] = useState<File | null>(null)
  const [perspective, setPerspective] = useState('委託側')
  const [comparing, setComparing] = useState(false)
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null)
  const fileARef = useRef<HTMLInputElement>(null)
  const fileBRef = useRef<HTMLInputElement>(null)

  // ---- 審査履歴画面（基本設計書 14.3） ----
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [histDocType, setHistDocType] = useState('')
  const [histRecommendation, setHistRecommendation] = useState('')
  const [reviewList, setReviewList] = useState<ReviewSummary[]>([])
  const [listLoading, setListLoading] = useState(false)

  // ---- 単一審査実行 ----
  async function handleReview() {
    const hasInput = inputMode === 'ファイル' ? !!sourceFile : !!sourceText.trim()
    if (!hasInput) return
    setReviewing(true)
    setReviewResult(null)
    try {
      if (inputMode === 'ファイル' && sourceFile) {
        const formData = new FormData()
        formData.append('file', sourceFile)
        formData.append('review_type', reviewType)
        const res = await client.post<ReviewResult>('/review', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setReviewResult(res.data)
      } else {
        const res = await client.post<ReviewResult>('/review', {
          text: sourceText,
          review_type: reviewType,
        })
        setReviewResult(res.data)
      }
    } catch { /* 無視 */ } finally {
      setReviewing(false)
    }
  }

  // ---- 比較審査実行 ----
  async function handleCompare() {
    if (!fileA || !fileB) return
    setComparing(true)
    setCompareResult(null)
    try {
      const formData = new FormData()
      formData.append('file_a', fileA)
      formData.append('file_b', fileB)
      formData.append('perspective', perspective)
      const res = await client.post<CompareResult>('/compare', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setCompareResult(res.data)
    } catch { /* 無視 */ } finally {
      setComparing(false)
    }
  }

  // ---- 審査履歴取得 ----
  async function handleLoadHistory() {
    setListLoading(true)
    try {
      const params: Record<string, string> = {}
      if (fromDate) params.from_date = fromDate
      if (toDate) params.to_date = toDate
      if (histDocType) params.document_type = histDocType
      if (histRecommendation) params.recommendation = histRecommendation
      const res = await client.get<{ items: ReviewSummary[] }>('/reviews', { params })
      setReviewList(res.data.items ?? [])
    } catch { /* 無視 */ } finally {
      setListLoading(false)
    }
  }

  // ============================================================
  // 画面レンダリング
  // ============================================================
  return (
    <div style={{ maxWidth: 1040 }}>
      <h2 style={{ color: COLOR.text, marginBottom: 4 }}>System02</h2>
      <p style={{ color: COLOR.muted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        契約書・文書 リスク審査システム
        <span style={{ marginLeft: 10, fontSize: '0.8rem', color: COLOR.warn }}>
          ※ 本システムの出力は一次審査参考情報であり、法的確定判断ではありません
        </span>
      </p>

      {/* 画面タブナビゲーション（基本設計書 セクション10） */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', borderBottom: `2px solid ${COLOR.border}`, paddingBottom: 8 }}>
        {(['単一審査画面', '比較審査画面', '審査履歴画面'] as Screen[]).map(s => (
          <button
            key={s}
            onClick={() => {
              setScreen(s)
              if (s === '審査履歴画面') handleLoadHistory()
            }}
            style={{ ...btn(screen === s ? COLOR.primary : '#ccc'), fontSize: '0.85rem' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ========== 単一審査画面 ========== */}
      {screen === '単一審査画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>単一審査画面</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              {/* 審査種別（基本設計書 14.1 review_type） */}
              <div>
                <span style={lbl()}>審査種別</span>
                <select style={field()} value={reviewType} onChange={e => setReviewType(e.target.value as ReviewType)}>
                  {(['契約書', '規約', '覚書', '基本合意書', 'NDA', '業務委託契約', 'その他'] as ReviewType[]).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* 入力方法（基本設計書 14.1 input_mode） */}
              <div>
                <span style={lbl()}>入力方法</span>
                <div style={{ display: 'flex', gap: 16, paddingTop: 6 }}>
                  {(['ファイル', 'テキスト'] as InputMode[]).map(m => (
                    <label key={m} style={{ cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input
                        type="radio"
                        name="input_mode"
                        value={m}
                        checked={inputMode === m}
                        onChange={() => setInputMode(m)}
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              {/* ファイル選択 or テキスト（基本設計書 14.1 source_file / source_text） */}
              {inputMode === 'ファイル' ? (
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={lbl()}>審査対象ファイル（PDF・docx・txt）</span>
                  <input
                    ref={singleFileRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={e => setSourceFile(e.target.files?.[0] ?? null)}
                    style={field()}
                  />
                </div>
              ) : (
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={lbl()}>審査対象本文</span>
                  <textarea
                    style={{ ...field(), minHeight: 160, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.83rem' }}
                    value={sourceText}
                    onChange={e => setSourceText(e.target.value)}
                    placeholder="契約書本文を貼り付けてください"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleReview}
              disabled={(inputMode === 'ファイル' ? !sourceFile : !sourceText.trim()) || reviewing}
              style={btn(COLOR.primary, (inputMode === 'ファイル' ? !sourceFile : !sourceText.trim()) || reviewing)}
            >
              {reviewing ? '審査実行中（最大90秒）...' : '審査実行'}
            </button>
          </div>

          {/* 審査結果（基本設計書 14.1 summary / recommendation / issues_grid） */}
          {reviewResult && (
            <div style={card()}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                <h4 style={{ margin: 0, color: COLOR.text }}>審査結果</h4>
                <RecommendationBadge value={reviewResult.recommendation} />
                <span style={{ fontSize: '0.82rem', color: COLOR.muted }}>
                  文書種別: {reviewResult.document_type} / 指摘数: {reviewResult.issues.length}
                </span>
              </div>

              {/* 全体要約 */}
              <div style={{ background: '#f8f8f2', borderRadius: 6, padding: '1rem', marginBottom: '1.2rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {reviewResult.summary}
              </div>

              {/* 指摘一覧 */}
              <span style={lbl()}>指摘一覧（severity 降順）</span>
              <IssuesTable issues={reviewResult.issues} />
            </div>
          )}
        </div>
      )}

      {/* ========== 比較審査画面 ========== */}
      {screen === '比較審査画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>比較審査画面</h3>

            {/* 基本設計書 14.2 入力項目 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={lbl()}>比較対象A（現行版・pdf/docx/txt）</span>
                <input
                  ref={fileARef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={e => setFileA(e.target.files?.[0] ?? null)}
                  style={field()}
                />
                {fileA && <div style={{ fontSize: '0.8rem', color: COLOR.ok, marginTop: 4 }}>✓ {fileA.name}</div>}
              </div>
              <div>
                <span style={lbl()}>比較対象B（改訂版・pdf/docx/txt）</span>
                <input
                  ref={fileBRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={e => setFileB(e.target.files?.[0] ?? null)}
                  style={field()}
                />
                {fileB && <div style={{ fontSize: '0.8rem', color: COLOR.ok, marginTop: 4 }}>✓ {fileB.name}</div>}
              </div>
              <div>
                <span style={lbl()}>審査視点（当事者ロール）</span>
                <select style={field()} value={perspective} onChange={e => setPerspective(e.target.value)}>
                  {['委託側', '受託側', '売主側', '買主側', '貸主側', '借主側', '雇用者側', '労働者側', '中立'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleCompare}
              disabled={!fileA || !fileB || comparing}
              style={btn(COLOR.primary, !fileA || !fileB || comparing)}
            >
              {comparing ? '比較審査実行中（最大90秒）...' : '比較実行'}
            </button>
          </div>

          {/* 比較審査結果（基本設計書 14.2 compare_summary / compare_issues_grid） */}
          {compareResult && (
            <div style={card()}>
              <h4 style={{ margin: '0 0 1rem', color: COLOR.text }}>
                比較審査結果
                <span style={{ marginLeft: 10, fontSize: '0.85rem', color: COLOR.muted, fontWeight: 'normal' }}>
                  {compareResult.doc_a_type} → {compareResult.doc_b_type}
                </span>
              </h4>

              {/* 差分要約 */}
              <div style={{ background: '#f8f8f2', borderRadius: 6, padding: '1rem', marginBottom: '1.2rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {compareResult.compare_summary}
              </div>

              {/* 差分指摘一覧 */}
              <span style={lbl()}>差分指摘一覧（{compareResult.issues.length}件）</span>
              {compareResult.issues.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                      {['変更種別', '深刻度', '条番号', '指摘内容', '修正案'].map(h => (
                        <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareResult.issues.map(issue => (
                      <tr key={issue.issue_id}>
                        <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                          <ChangeTypeBadge value={issue.change_type} />
                        </td>
                        <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                          <SeverityBadge value={issue.severity} />
                        </td>
                        <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.primary, whiteSpace: 'nowrap' }}>
                          {issue.clause_ref}
                        </td>
                        <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, maxWidth: 300, lineHeight: 1.5 }}>
                          {issue.description}
                        </td>
                        <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted, maxWidth: 220, lineHeight: 1.5 }}>
                          {issue.suggestion ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ color: COLOR.ok, fontSize: '0.9rem' }}>差分指摘なし</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========== 審査履歴画面 ========== */}
      {screen === '審査履歴画面' && (
        <div>
          {/* 検索条件（基本設計書 14.3） */}
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>審査履歴画面</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
              <div>
                <span style={lbl()}>開始日</span>
                <input type="date" style={field()} value={fromDate} onChange={e => setFromDate(e.target.value)} />
              </div>
              <div>
                <span style={lbl()}>終了日</span>
                <input type="date" style={field()} value={toDate} onChange={e => setToDate(e.target.value)} />
              </div>
              <div>
                <span style={lbl()}>文書種別</span>
                <select style={field()} value={histDocType} onChange={e => setHistDocType(e.target.value)}>
                  <option value="">（すべて）</option>
                  {['契約書', '規約', '覚書', '基本合意書', 'NDA', '業務委託契約', 'その他'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <span style={lbl()}>一次審査結果</span>
                <select style={field()} value={histRecommendation} onChange={e => setHistRecommendation(e.target.value)}>
                  <option value="">（すべて）</option>
                  <option value="要修正">要修正</option>
                  <option value="要確認">要確認</option>
                  <option value="承認可">承認可</option>
                </select>
              </div>
            </div>
            <button onClick={handleLoadHistory} disabled={listLoading} style={btn(COLOR.primary, listLoading)}>
              {listLoading ? '読込中...' : '検索'}
            </button>
          </div>

          {/* 審査一覧（基本設計書 14.3 review_grid） */}
          <div style={card()}>
            {reviewList.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['ID', '審査種別', '文書種別', '一次審査結果', '指摘数', '実行日'].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reviewList.map(r => (
                    <tr key={r.review_id}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{r.review_id}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <span style={{ background: r.review_type === 'compare' ? COLOR.primary : COLOR.muted, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem' }}>
                          {r.review_type === 'compare' ? '比較' : '単一'}
                        </span>
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{r.document_type}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <RecommendationBadge value={r.recommendation} />
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, textAlign: 'center' }}>
                        <span style={{ color: r.issue_count > 5 ? COLOR.danger : r.issue_count > 0 ? COLOR.warn : COLOR.ok, fontWeight: 'bold' }}>
                          {r.issue_count}
                        </span>
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{r.created_at?.slice(0, 10) ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !listLoading && (
                <div style={{ color: COLOR.muted, fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem' }}>
                  該当する審査履歴がありません
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}
