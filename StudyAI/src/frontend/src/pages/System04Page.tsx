import { useState, useRef } from 'react'
import { createSystemClient } from '../api/client'

const client = createSystemClient('system04')

// ---- 型定義（基本設計書 IF仕様より） ----

type Sentiment = 'positive' | 'negative' | 'neutral'

interface SentimentSummary {
  positive: number
  negative: number
  neutral: number
  avg_score: number
}

interface Topic {
  topic_name: string
  count: number
  sentiment: Sentiment
  representative_reviews: string[]
}

interface Improvement {
  priority: 'high' | 'medium' | 'low'
  issue: string
  suggestion: string
}

interface IndividualResult {
  review_id: number
  text: string
  sentiment: Sentiment
  score: number
  topics: string[]
}

interface AnalysisResult {
  analysis_id: number
  product_name: string
  total_reviews: number
  excluded_count: number
  sentiment_summary: SentimentSummary
  topics: Topic[]
  improvements: Improvement[]
  individual_results: IndividualResult[]
  created_at: string
}

interface CompareProduct {
  product_name: string
  avg_score: number
  positive_rate: number
  top_strengths: string[]
  top_weaknesses: string[]
}

interface CompareResult {
  analysis_id: number
  compare_summary: string
  products: CompareProduct[]
  common_issues: string[]
  compare_table: { metric: string; [product: string]: string | number }[]
  created_at: string
}

interface AnalysisSummary {
  analysis_id: number
  product_name: string
  total_reviews: number
  compare_flag: boolean
  created_at: string
}

// ---- 画面種別（基本設計書 セクション10） ----
type Screen = '単一分析画面' | 'ファイル分析画面' | '比較分析画面' | '分析履歴画面'

// ---- サンプル JSON ----
const SAMPLE_REVIEWS_JSON = `[
  {"text": "使いやすくて操作が直感的です", "score": 5, "date": "2025-01-10"},
  {"text": "バッテリーの持ちが短いのが残念", "score": 2, "date": "2025-01-12"},
  {"text": "デザインはとても良いと思います", "score": 4, "date": "2025-01-15"}
]`

const SAMPLE_COMPARE_JSON = `[
  {
    "product_name": "商品A",
    "reviews": [
      {"text": "使いやすい", "score": 5},
      {"text": "値段が高い", "score": 2}
    ]
  },
  {
    "product_name": "商品B",
    "reviews": [
      {"text": "コスパが良い", "score": 4},
      {"text": "耐久性が低い", "score": 2}
    ]
  }
]`

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

// ---- 感情バッジ ----
function SentimentBadge({ value }: { value: Sentiment }) {
  const map: Record<Sentiment, [string, string]> = {
    positive: [COLOR.ok,      'ポジティブ'],
    negative: [COLOR.danger,  'ネガティブ'],
    neutral:  [COLOR.muted,   '中立'],
  }
  const [color, label] = map[value] ?? ['#aaa', value]
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem' }}>
      {label}
    </span>
  )
}

// ---- 優先度バッジ ----
function PriorityBadge({ value }: { value: 'high' | 'medium' | 'low' }) {
  const map: Record<string, [string, string]> = {
    high:   [COLOR.danger, '高'],
    medium: [COLOR.warn,   '中'],
    low:    [COLOR.ok,     '低'],
  }
  const [color, label] = map[value] ?? ['#aaa', value]
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
      {label}
    </span>
  )
}

// ---- 分析結果パネル（単一・ファイル共通） ----
function AnalysisResultPanel({ result }: { result: AnalysisResult }) {
  const [showIndividual, setShowIndividual] = useState(false)
  const total = result.sentiment_summary.positive + result.sentiment_summary.negative + result.sentiment_summary.neutral || 1

  return (
    <div>
      {/* 感情サマリ（基本設計書 14.1 sentiment_summary） */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '1.2rem' }}>
        {[
          ['ポジティブ', result.sentiment_summary.positive, COLOR.ok],
          ['ネガティブ', result.sentiment_summary.negative, COLOR.danger],
          ['中立', result.sentiment_summary.neutral, COLOR.muted],
          ['平均スコア', result.sentiment_summary.avg_score.toFixed(1), COLOR.primary],
        ].map(([label, value, color]) => (
          <div key={label as string} style={{ textAlign: 'center', padding: '0.8rem', background: '#f8f8f2', borderRadius: 6 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color as string }}>{value as string | number}</div>
            <div style={{ fontSize: '0.78rem', color: COLOR.muted, marginTop: 2 }}>{label as string}</div>
          </div>
        ))}
      </div>

      {/* 感情比率バー */}
      <div style={{ marginBottom: '1.2rem', borderRadius: 4, overflow: 'hidden', height: 12, display: 'flex' }}>
        <div style={{ width: `${(result.sentiment_summary.positive / total) * 100}%`, background: COLOR.ok }} />
        <div style={{ width: `${(result.sentiment_summary.neutral / total) * 100}%`, background: COLOR.muted }} />
        <div style={{ width: `${(result.sentiment_summary.negative / total) * 100}%`, background: COLOR.danger }} />
      </div>

      {/* トピック一覧（基本設計書 14.1 topics_grid） */}
      <div style={{ marginBottom: '1.2rem' }}>
        <span style={lbl()}>トピック一覧（{result.topics.length}件）</span>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              {['トピック', '感情傾向', '件数', '代表レビュー'].map(h => (
                <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.topics.map((topic, i) => (
              <tr key={i}>
                <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, fontWeight: 'bold' }}>{topic.topic_name}</td>
                <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                  <SentimentBadge value={topic.sentiment} />
                </td>
                <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, textAlign: 'center' }}>{topic.count}</td>
                <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted, maxWidth: 300 }}>
                  {topic.representative_reviews.slice(0, 2).join(' / ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 改善提案（基本設計書 14.1 insights_panel） */}
      {result.improvements.length > 0 && (
        <div style={{ marginBottom: '1.2rem' }}>
          <span style={lbl()}>改善提案</span>
          {result.improvements.map((imp, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '0.6rem 0', borderBottom: `1px solid ${COLOR.border}` }}>
              <PriorityBadge value={imp.priority} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: COLOR.text, marginBottom: 2 }}>{imp.issue}</div>
                <div style={{ fontSize: '0.83rem', color: COLOR.muted }}>{imp.suggestion}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 個別結果（基本設計書 14.1 individual_results_grid） */}
      <div>
        <button
          onClick={() => setShowIndividual(s => !s)}
          style={{ ...btn('#6c6f85'), fontSize: '0.82rem', padding: '4px 12px', marginBottom: 8 }}
        >
          {showIndividual ? '個別結果を閉じる' : `個別結果を表示（${result.individual_results.length}件）`}
        </button>
        {showIndividual && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                {['レビュー本文', '感情', 'スコア', 'トピック'].map(h => (
                  <th key={h} style={{ padding: '4px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.individual_results.map(r => (
                <tr key={r.review_id}>
                  <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, maxWidth: 300, lineHeight: 1.4 }}>{r.text}</td>
                  <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}>
                    <SentimentBadge value={r.sentiment} />
                  </td>
                  <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, textAlign: 'center' }}>
                    <span style={{ color: r.score >= 4 ? COLOR.ok : r.score <= 2 ? COLOR.danger : COLOR.warn }}>
                      {r.score}
                    </span>
                  </td>
                  <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted, fontSize: '0.76rem' }}>
                    {r.topics.join(', ') || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function System04Page() {
  const [screen, setScreen] = useState<Screen>('単一分析画面')

  // ---- 単一分析画面（基本設計書 14.1） ----
  const [productName, setProductName] = useState('')
  const [reviewsJson, setReviewsJson] = useState(SAMPLE_REVIEWS_JSON)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [jsonError, setJsonError] = useState<string | null>(null)

  // ---- ファイル分析画面（基本設計書 14.2） ----
  const [reviewFile, setReviewFile] = useState<File | null>(null)
  const [fileProductName, setFileProductName] = useState('')
  const [fileAnalyzing, setFileAnalyzing] = useState(false)
  const [fileResult, setFileResult] = useState<AnalysisResult | null>(null)
  const [invalidRows, setInvalidRows] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // ---- 比較分析画面（基本設計書 14.3） ----
  const [productsJson, setProductsJson] = useState(SAMPLE_COMPARE_JSON)
  const [comparing, setComparing] = useState(false)
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null)
  const [compareJsonError, setCompareJsonError] = useState<string | null>(null)

  // ---- 分析履歴画面（基本設計書 14.4） ----
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [analysisList, setAnalysisList] = useState<AnalysisSummary[]>([])
  const [listLoading, setListLoading] = useState(false)

  // ---- 単一分析実行 ----
  async function handleAnalyze() {
    if (!productName.trim()) return
    setJsonError(null)
    let reviews
    try { reviews = JSON.parse(reviewsJson) } catch {
      setJsonError('JSON フォーマットが不正です')
      return
    }
    setAnalyzing(true)
    setAnalysisResult(null)
    try {
      const res = await client.post<AnalysisResult>('/analyze', { product_name: productName, reviews })
      setAnalysisResult(res.data)
    } catch { /* 無視 */ } finally {
      setAnalyzing(false)
    }
  }

  // ---- ファイル分析実行 ----
  async function handleFileAnalyze() {
    if (!reviewFile) return
    setFileAnalyzing(true)
    setFileResult(null)
    setInvalidRows(null)
    try {
      const formData = new FormData()
      formData.append('file', reviewFile)
      if (fileProductName.trim()) formData.append('product_name', fileProductName.trim())
      const res = await client.post<{ result: AnalysisResult; invalid_count: number }>(
        '/analyze/file',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setFileResult(res.data.result)
      setInvalidRows(res.data.invalid_count)
    } catch { /* 無視 */ } finally {
      setFileAnalyzing(false)
    }
  }

  // ---- 比較分析実行 ----
  async function handleCompare() {
    setCompareJsonError(null)
    let products
    try { products = JSON.parse(productsJson) } catch {
      setCompareJsonError('JSON フォーマットが不正です')
      return
    }
    setComparing(true)
    setCompareResult(null)
    try {
      const res = await client.post<CompareResult>('/compare', { products })
      setCompareResult(res.data)
    } catch { /* 無視 */ } finally {
      setComparing(false)
    }
  }

  // ---- 分析履歴取得 ----
  async function handleLoadHistory() {
    setListLoading(true)
    try {
      const params: Record<string, string> = {}
      if (fromDate) params.from_date = fromDate
      if (toDate) params.to_date = toDate
      if (productFilter.trim()) params.product_name = productFilter.trim()
      const res = await client.get<{ items: AnalysisSummary[] }>('/analyses', { params })
      setAnalysisList(res.data.items ?? [])
    } catch { /* 無視 */ } finally {
      setListLoading(false)
    }
  }

  // ============================================================
  // 画面レンダリング
  // ============================================================
  return (
    <div style={{ maxWidth: 1040 }}>
      <h2 style={{ color: COLOR.text, marginBottom: 4 }}>System04</h2>
      <p style={{ color: COLOR.muted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        商品・サービス レビュー分析＆インサイト抽出システム
      </p>

      {/* 画面タブナビゲーション（基本設計書 セクション10） */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', borderBottom: `2px solid ${COLOR.border}`, paddingBottom: 8 }}>
        {(['単一分析画面', 'ファイル分析画面', '比較分析画面', '分析履歴画面'] as Screen[]).map(s => (
          <button
            key={s}
            onClick={() => {
              setScreen(s)
              if (s === '分析履歴画面') handleLoadHistory()
            }}
            style={{ ...btn(screen === s ? COLOR.primary : '#ccc'), fontSize: '0.82rem' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ========== 単一分析画面 ========== */}
      {screen === '単一分析画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>単一分析画面</h3>

            {/* 基本設計書 14.1 入力項目 */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={lbl()}>商品名 ＊</span>
              <input
                type="text"
                style={{ ...field(), maxWidth: 360 }}
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="例：ワイヤレスイヤホン Pro X"
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <span style={lbl()}>レビュー入力（JSON配列）</span>
              <textarea
                style={{ ...field(), minHeight: 140, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.83rem' }}
                value={reviewsJson}
                onChange={e => setReviewsJson(e.target.value)}
              />
              {jsonError && <div style={{ color: COLOR.danger, fontSize: '0.82rem', marginTop: 4 }}>⚠ {jsonError}</div>}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!productName.trim() || !reviewsJson.trim() || analyzing}
              style={btn(COLOR.primary, !productName.trim() || !reviewsJson.trim() || analyzing)}
            >
              {analyzing ? '分析実行中...' : '分析開始'}
            </button>
          </div>

          {/* 単一分析結果 */}
          {analysisResult && (
            <div style={card()}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                <h4 style={{ margin: 0, color: COLOR.text }}>{analysisResult.product_name}</h4>
                <span style={{ fontSize: '0.82rem', color: COLOR.muted }}>
                  総レビュー数: {analysisResult.total_reviews}件
                  {analysisResult.excluded_count > 0 && ` / 除外: ${analysisResult.excluded_count}件`}
                </span>
              </div>
              <AnalysisResultPanel result={analysisResult} />
            </div>
          )}
        </div>
      )}

      {/* ========== ファイル分析画面 ========== */}
      {screen === 'ファイル分析画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>ファイル分析画面</h3>

            {/* 基本設計書 14.2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={lbl()}>レビューファイル（CSV・JSON）＊</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.json"
                  onChange={e => setReviewFile(e.target.files?.[0] ?? null)}
                  style={field()}
                />
              </div>
              <div>
                <span style={lbl()}>商品名（任意。ファイルに含まれる場合は省略可）</span>
                <input
                  type="text"
                  style={field()}
                  value={fileProductName}
                  onChange={e => setFileProductName(e.target.value)}
                  placeholder="例：商品A"
                />
              </div>
            </div>

            <button
              onClick={handleFileAnalyze}
              disabled={!reviewFile || fileAnalyzing}
              style={btn(COLOR.primary, !reviewFile || fileAnalyzing)}
            >
              {fileAnalyzing ? 'ファイル分析中...' : 'ファイル分析開始'}
            </button>

            {/* 取込失敗件数（基本設計書 14.2 invalid_rows） */}
            {invalidRows !== null && invalidRows > 0 && (
              <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: COLOR.warn }}>
                ⚠ 取込失敗件数: {invalidRows}件（空・重複などで除外）
              </div>
            )}
            {invalidRows === 0 && (
              <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: COLOR.ok }}>
                ✓ すべて正常に取込完了
              </div>
            )}
          </div>

          {/* ファイル分析結果 */}
          {fileResult && (
            <div style={card()}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: '1.2rem' }}>
                <h4 style={{ margin: 0, color: COLOR.text }}>{fileResult.product_name}</h4>
                <span style={{ fontSize: '0.82rem', color: COLOR.muted }}>
                  総レビュー数: {fileResult.total_reviews}件
                </span>
              </div>
              <AnalysisResultPanel result={fileResult} />
            </div>
          )}
        </div>
      )}

      {/* ========== 比較分析画面 ========== */}
      {screen === '比較分析画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>比較分析画面</h3>

            {/* 基本設計書 14.3 products_json */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={lbl()}>比較対象入力（JSON配列 — 各要素に product_name と reviews）</span>
              <textarea
                style={{ ...field(), minHeight: 160, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.83rem' }}
                value={productsJson}
                onChange={e => setProductsJson(e.target.value)}
              />
              {compareJsonError && <div style={{ color: COLOR.danger, fontSize: '0.82rem', marginTop: 4 }}>⚠ {compareJsonError}</div>}
            </div>

            <button
              onClick={handleCompare}
              disabled={!productsJson.trim() || comparing}
              style={btn(COLOR.primary, !productsJson.trim() || comparing)}
            >
              {comparing ? '比較分析実行中...' : '比較開始'}
            </button>
          </div>

          {/* 比較結果（基本設計書 14.3 compare_table / strengths_panel / weaknesses_panel） */}
          {compareResult && (
            <div style={card()}>
              <h4 style={{ margin: '0 0 1rem', color: COLOR.text }}>比較分析結果</h4>

              {/* 差分要約 */}
              <div style={{ background: '#f8f8f2', borderRadius: 6, padding: '1rem', marginBottom: '1.2rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {compareResult.compare_summary}
              </div>

              {/* 比較表（compare_table） */}
              {compareResult.compare_table && compareResult.compare_table.length > 0 && (
                <div style={{ marginBottom: '1.2rem' }}>
                  <span style={lbl()}>比較表</span>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                      <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                          {Object.keys(compareResult.compare_table[0]).map(k => (
                            <th key={k} style={{ padding: '5px 10px', textAlign: 'left', border: `1px solid ${COLOR.border}`, whiteSpace: 'nowrap' }}>
                              {k}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {compareResult.compare_table.map((row, i) => (
                          <tr key={i}>
                            {Object.values(row).map((val, j) => (
                              <td key={j} style={{ padding: '5px 10px', border: `1px solid ${COLOR.border}`, fontWeight: j === 0 ? 'bold' : 'normal' }}>
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 商品別 強み・弱み（strengths_panel / weaknesses_panel） */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareResult.products.length}, 1fr)`, gap: '0.8rem', marginBottom: '1.2rem' }}>
                {compareResult.products.map(p => (
                  <div key={p.product_name} style={{ border: `1px solid ${COLOR.border}`, borderRadius: 8, padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold', color: COLOR.text, marginBottom: 8 }}>{p.product_name}</div>
                    <div style={{ fontSize: '0.82rem', color: COLOR.muted, marginBottom: 4 }}>
                      平均スコア: <strong style={{ color: COLOR.primary }}>{p.avg_score.toFixed(1)}</strong>
                      {' '}/ ポジティブ率: <strong style={{ color: COLOR.ok }}>{(p.positive_rate * 100).toFixed(0)}%</strong>
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <div style={{ fontSize: '0.8rem', color: COLOR.ok, fontWeight: 'bold', marginBottom: 3 }}>強み</div>
                      {p.top_strengths.map((s, i) => (
                        <div key={i} style={{ fontSize: '0.82rem', color: COLOR.text }}>• {s}</div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: COLOR.danger, fontWeight: 'bold', marginBottom: 3 }}>弱み</div>
                      {p.top_weaknesses.map((w, i) => (
                        <div key={i} style={{ fontSize: '0.82rem', color: COLOR.text }}>• {w}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 共通課題 */}
              {compareResult.common_issues.length > 0 && (
                <div>
                  <span style={lbl()}>共通課題</span>
                  {compareResult.common_issues.map((issue, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', color: COLOR.warn, padding: '2px 0' }}>• {issue}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========== 分析履歴画面 ========== */}
      {screen === '分析履歴画面' && (
        <div>
          {/* 検索条件（基本設計書 14.4） */}
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>分析履歴画面</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '0.8rem', marginBottom: '1rem' }}>
              <div>
                <span style={lbl()}>開始日</span>
                <input type="date" style={field()} value={fromDate} onChange={e => setFromDate(e.target.value)} />
              </div>
              <div>
                <span style={lbl()}>終了日</span>
                <input type="date" style={field()} value={toDate} onChange={e => setToDate(e.target.value)} />
              </div>
              <div>
                <span style={lbl()}>商品名（部分一致）</span>
                <input
                  type="text"
                  style={field()}
                  value={productFilter}
                  onChange={e => setProductFilter(e.target.value)}
                  placeholder="商品名を入力"
                />
              </div>
            </div>
            <button onClick={handleLoadHistory} disabled={listLoading} style={btn(COLOR.primary, listLoading)}>
              {listLoading ? '読込中...' : '検索'}
            </button>
          </div>

          {/* 分析一覧（基本設計書 14.4 analysis_grid） */}
          <div style={card()}>
            {analysisList.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['ID', '商品名', '総レビュー数', '種別', '実行日'].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analysisList.map(a => (
                    <tr key={a.analysis_id}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{a.analysis_id}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, fontWeight: 'bold' }}>{a.product_name}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, textAlign: 'center' }}>{a.total_reviews}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <span style={{
                          background: a.compare_flag ? COLOR.primary : COLOR.muted,
                          color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem',
                        }}>
                          {a.compare_flag ? '比較' : '単一'}
                        </span>
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{a.created_at?.slice(0, 10) ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !listLoading && (
                <div style={{ color: COLOR.muted, fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem' }}>
                  該当する分析履歴がありません
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}
