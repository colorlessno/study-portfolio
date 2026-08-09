import { useState, useRef } from 'react'
import { createSystemClient } from '../api/client'

const client = createSystemClient('system01')

// ---- 型定義（基本設計書 IF仕様より） ----

type DocumentType = '請求書' | '領収書' | '納品書' | '不明'
type ReviewStatus = '未確認' | '確認済み'
type JobStatus = 'queued' | 'running' | 'completed' | 'partial' | 'failed'

interface BankInfo {
  bank_name: string | null
  branch_name: string | null
  account_type: string | null
  account_number: string | null
}

interface DocumentItem {
  name: string | null
  quantity: number | null
  unit_price: number | null
  amount: number | null
}

interface ExtractResult {
  document_id: number
  file_name: string
  document_type: DocumentType | null
  issue_date: string | null
  supplier_name: string | null
  supplier_address: string | null
  recipient_name: string | null
  items: DocumentItem[]
  subtotal: number | null
  tax_8: number | null
  tax_10: number | null
  total: number | null
  payment_due: string | null
  bank_info: BankInfo | null
  invoice_number: string | null
  confidence_score: number
  requires_review: boolean
  missing_fields: string[]
}

interface JobResult {
  file_name: string
  status: 'success' | 'failed'
  document_id: number | null
  confidence_score?: number
  requires_review?: boolean
  missing_fields?: string[]
  error?: string
  message?: string
}

interface BulkJob {
  job_id: string
  status: JobStatus
  total_files: number
  succeeded: number
  failed: number
  results: JobResult[]
}

interface DocumentSummary {
  document_id: number
  file_name: string
  document_type: DocumentType | null
  issue_date: string | null
  supplier_name: string | null
  total: number | null
  review_status: ReviewStatus
  confidence_score: number
  requires_review: boolean
  created_at: string
}

// ---- 画面種別（基本設計書 セクション15） ----
type Screen =
  | '抽出実行画面'
  | '一括ジョブ確認画面'
  | '抽出結果一覧・訂正画面'
  | '訂正画面'

// ---- スタイル定数 ----
const COLOR = {
  bg: '#f8f8f2',
  panel: '#ffffff',
  border: '#e0e0e0',
  nav: '#1e1e2e',
  primary: '#6c8ebf',
  danger: '#e06c75',
  warn: '#e5c07b',
  ok: '#98c379',
  text: '#1e1e2e',
  muted: '#6c6f85',
}

const btn = (color: string): React.CSSProperties => ({
  background: color,
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '0.5rem 1.2rem',
  cursor: 'pointer',
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

const label = (): React.CSSProperties => ({
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

// ---- ステータスバッジ ----
function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    queued: '#aaa',
    running: COLOR.primary,
    completed: COLOR.ok,
    partial: COLOR.warn,
    failed: COLOR.danger,
    success: COLOR.ok,
    未確認: COLOR.warn,
    確認済み: COLOR.ok,
  }
  return (
    <span style={{
      background: colorMap[status] ?? '#aaa',
      color: '#fff',
      borderRadius: 4,
      padding: '2px 8px',
      fontSize: '0.78rem',
    }}>
      {status}
    </span>
  )
}

// ---- 要確認バッジ ----
function RequiresReviewBadge({ value }: { value: boolean }) {
  if (!value) return null
  return (
    <span style={{
      background: COLOR.warn,
      color: '#fff',
      borderRadius: 4,
      padding: '2px 8px',
      fontSize: '0.78rem',
    }}>
      要確認
    </span>
  )
}

// ---- 欠落項目バッジ一覧 ----
function MissingFieldBadges({ fields }: { fields: string[] }) {
  if (!fields.length) return <span style={{ color: COLOR.ok, fontSize: '0.85rem' }}>なし</span>
  return (
    <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {fields.map(f => (
        <span key={f} style={{
          background: '#fde8e8',
          color: COLOR.danger,
          borderRadius: 4,
          padding: '2px 6px',
          fontSize: '0.78rem',
        }}>{f}</span>
      ))}
    </span>
  )
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function System01Page() {
  const [screen, setScreen] = useState<Screen>('抽出実行画面')

  // 抽出実行画面
  const [mode, setMode] = useState<'single' | 'bulk'>('single')
  const [singleFile, setSingleFile] = useState<File | null>(null)
  const [bulkFiles, setBulkFiles] = useState<File[]>([])
  const [extractResult, setExtractResult] = useState<ExtractResult | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState<string | null>(null)

  // 一括ジョブ確認画面
  const [bulkJob, setBulkJob] = useState<BulkJob | null>(null)
  const [pollingId, setPollingId] = useState<ReturnType<typeof setInterval> | null>(null)

  // 抽出結果一覧・訂正画面
  const [searchDateFrom, setSearchDateFrom] = useState('')
  const [searchDateTo, setSearchDateTo] = useState('')
  const [searchSupplier, setSearchSupplier] = useState('')
  const [searchMinAmount, setSearchMinAmount] = useState('')
  const [searchMaxAmount, setSearchMaxAmount] = useState('')
  const [searchDocumentType, setSearchDocumentType] = useState('')
  const [searchRequiresReview, setSearchRequiresReview] = useState(false)
  const [documentList, setDocumentList] = useState<DocumentSummary[]>([])
  const [listLoading, setListLoading] = useState(false)
  const [listTotal, setListTotal] = useState(0)

  // 訂正画面
  const [correctTarget, setCorrectTarget] = useState<DocumentSummary | null>(null)
  const [correctForm, setCorrectForm] = useState<Partial<ExtractResult>>({})
  const [correcting, setCorrecting] = useState(false)
  const [correctResult, setCorrectResult] = useState<{
    confidence_score: number
    missing_fields: string[]
    requires_review: boolean
    updated_at: string
  } | null>(null)

  const singleFileRef = useRef<HTMLInputElement>(null)
  const bulkFileRef = useRef<HTMLInputElement>(null)

  // ---- 単票抽出 ----
  async function handleExtract() {
    if (!singleFile) return
    setExtracting(true)
    setExtractError(null)
    setExtractResult(null)
    try {
      const formData = new FormData()
      formData.append('file', singleFile)
      const res = await client.post<ExtractResult>('/extract', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setExtractResult(res.data)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string; error?: string } } }
      setExtractError(
        err.response?.data?.message ?? err.response?.data?.error ?? '抽出に失敗しました'
      )
    } finally {
      setExtracting(false)
    }
  }

  // ---- 一括抽出 ----
  async function handleBulkExtract() {
    if (!bulkFiles.length) return
    setExtracting(true)
    setExtractError(null)
    try {
      const formData = new FormData()
      bulkFiles.forEach(f => formData.append('files', f))
      const res = await client.post<{ job_id: string; total_files: number; status: JobStatus }>(
        '/extract/bulk',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      const job: BulkJob = {
        job_id: res.data.job_id,
        status: res.data.status,
        total_files: res.data.total_files,
        succeeded: 0,
        failed: 0,
        results: [],
      }
      setBulkJob(job)
      setScreen('一括ジョブ確認画面')
      startPolling(res.data.job_id)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      setExtractError(err.response?.data?.message ?? '一括抽出の受付に失敗しました')
    } finally {
      setExtracting(false)
    }
  }

  // ---- ジョブポーリング ----
  function startPolling(jobId: string) {
    if (pollingId) clearInterval(pollingId)
    const id = setInterval(async () => {
      try {
        const res = await client.get<BulkJob>(`/extract/bulk/${jobId}`)
        setBulkJob(res.data)
        if (res.data.status === 'completed' || res.data.status === 'partial' || res.data.status === 'failed') {
          clearInterval(id)
          setPollingId(null)
        }
      } catch { /* 無視 */ }
    }, 3000)
    setPollingId(id)
  }

  // ---- 一覧取得 ----
  async function handleSearch() {
    setListLoading(true)
    try {
      const params: Record<string, string> = {}
      if (searchDateFrom) params.date_from = searchDateFrom
      if (searchDateTo) params.date_to = searchDateTo
      if (searchSupplier) params.supplier = searchSupplier
      if (searchMinAmount) params.min_amount = searchMinAmount
      if (searchMaxAmount) params.max_amount = searchMaxAmount
      if (searchDocumentType) params.document_type = searchDocumentType
      if (searchRequiresReview) params.requires_review = 'true'
      const res = await client.get<{ total: number; items: DocumentSummary[] }>('/documents', { params })
      setDocumentList(res.data.items ?? [])
      setListTotal(res.data.total ?? 0)
    } catch { /* 無視 */ } finally {
      setListLoading(false)
    }
  }

  // ---- CSV出力 ----
  async function handleExportCsv() {
    try {
      const params: Record<string, string> = {}
      if (searchDateFrom) params.date_from = searchDateFrom
      if (searchDateTo) params.date_to = searchDateTo
      if (searchSupplier) params.supplier = searchSupplier
      if (searchMinAmount) params.min_amount = searchMinAmount
      if (searchMaxAmount) params.max_amount = searchMaxAmount
      if (searchDocumentType) params.document_type = searchDocumentType
      const res = await client.get('/documents/export', { params, responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `documents_export.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch { /* 無視 */ }
  }

  // ---- 訂正画面へ遷移 ----
  function handleEditDocument(doc: DocumentSummary) {
    setCorrectTarget(doc)
    setCorrectForm({})
    setCorrectResult(null)
    setScreen('訂正画面')
  }

  // ---- 訂正保存 ----
  async function handleSaveCorrection() {
    if (!correctTarget) return
    setCorrecting(true)
    try {
      const correctedFields = Object.keys(correctForm)
      const res = await client.patch(`/documents/${correctTarget.document_id}/correct`, {
        ...correctForm,
        corrected_fields: correctedFields,
      })
      setCorrectResult(res.data)
    } catch { /* 無視 */ } finally {
      setCorrecting(false)
    }
  }

  // ============================================================
  // 画面レンダリング
  // ============================================================

  return (
    <div style={{ maxWidth: 960 }}>
      <h2 style={{ color: COLOR.text, marginBottom: 4 }}>System01</h2>
      <p style={{ color: COLOR.muted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        請求書・領収書 データ抽出システム
      </p>

      {/* 画面タブナビゲーション（基本設計書 セクション15） */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', borderBottom: `2px solid ${COLOR.border}`, paddingBottom: 8 }}>
        {(['抽出実行画面', '抽出結果一覧・訂正画面'] as Screen[]).map(s => (
          <button
            key={s}
            onClick={() => {
              setScreen(s)
              if (s === '抽出結果一覧・訂正画面') handleSearch()
            }}
            style={{
              ...btn(screen === s ? COLOR.primary : '#ccc'),
              fontSize: '0.85rem',
            }}
          >
            {s}
          </button>
        ))}
        {screen === '一括ジョブ確認画面' && (
          <button style={{ ...btn(COLOR.primary), fontSize: '0.85rem' }}>
            一括ジョブ確認画面
          </button>
        )}
        {screen === '訂正画面' && (
          <button style={{ ...btn(COLOR.primary), fontSize: '0.85rem' }}>
            訂正画面
          </button>
        )}
      </div>

      {/* ========== 抽出実行画面 ========== */}
      {screen === '抽出実行画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>抽出実行画面</h3>

            {/* 実行モード（基本設計書 19.1） */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={label()}>実行モード</span>
              <label style={{ marginRight: 16, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="mode"
                  value="single"
                  checked={mode === 'single'}
                  onChange={() => setMode('single')}
                  style={{ marginRight: 4 }}
                />
                単票
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="mode"
                  value="bulk"
                  checked={mode === 'bulk'}
                  onChange={() => setMode('bulk')}
                  style={{ marginRight: 4 }}
                />
                一括
              </label>
            </div>

            {/* 単票モード */}
            {mode === 'single' && (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={label()}>対象ファイル（PDF・PNG・JPG・JPEG、最大10MB）</span>
                  <input
                    ref={singleFileRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={e => setSingleFile(e.target.files?.[0] ?? null)}
                    style={field()}
                  />
                </div>
                <button
                  onClick={handleExtract}
                  disabled={!singleFile || extracting}
                  style={btn(COLOR.primary)}
                >
                  {extracting ? '抽出中...' : '抽出開始'}
                </button>
              </div>
            )}

            {/* 一括モード */}
            {mode === 'bulk' && (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={label()}>対象ファイル一覧（1〜5件、各最大10MB）</span>
                  <input
                    ref={bulkFileRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    multiple
                    onChange={e => setBulkFiles(Array.from(e.target.files ?? []))}
                    style={field()}
                  />
                  {bulkFiles.length > 0 && (
                    <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem', fontSize: '0.85rem', color: COLOR.muted }}>
                      {bulkFiles.map(f => <li key={f.name}>{f.name}</li>)}
                    </ul>
                  )}
                </div>
                <button
                  onClick={handleBulkExtract}
                  disabled={!bulkFiles.length || extracting}
                  style={btn(COLOR.primary)}
                >
                  {extracting ? '受付中...' : '一括抽出開始'}
                </button>
              </div>
            )}

            {/* エラー表示 */}
            {extractError && (
              <div style={{ marginTop: '1rem', color: COLOR.danger, fontSize: '0.9rem' }}>
                ⚠ {extractError}
              </div>
            )}
          </div>

          {/* 抽出結果（基本設計書 19.1） */}
          {extractResult && (
            <div style={card()}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: COLOR.text }}>抽出結果</h3>
                <RequiresReviewBadge value={extractResult.requires_review} />
                <span style={{ color: COLOR.muted, fontSize: '0.85rem' }}>
                  信頼度スコア: {extractResult.confidence_score.toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {[
                  ['文書種別', extractResult.document_type],
                  ['発行日', extractResult.issue_date],
                  ['発行元（取引先名）', extractResult.supplier_name],
                  ['発行元住所', extractResult.supplier_address],
                  ['宛先', extractResult.recipient_name],
                  ['小計', extractResult.subtotal?.toLocaleString() + ' 円'],
                  ['消費税（8%）', extractResult.tax_8?.toLocaleString() + ' 円'],
                  ['消費税（10%）', extractResult.tax_10?.toLocaleString() + ' 円'],
                  ['合計金額', extractResult.total?.toLocaleString() + ' 円'],
                  ['支払期限', extractResult.payment_due],
                  ['インボイス登録番号', extractResult.invoice_number],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <span style={label()}>{k as string}</span>
                    <span style={{ fontSize: '0.9rem', color: v ? COLOR.text : COLOR.muted }}>
                      {v ?? '（未抽出）'}
                    </span>
                  </div>
                ))}
              </div>

              {/* 振込先情報 */}
              {extractResult.bank_info && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={label()}>振込先情報</span>
                  <div style={{ fontSize: '0.9rem', color: COLOR.text }}>
                    {extractResult.bank_info.bank_name} / {extractResult.bank_info.branch_name} / {extractResult.bank_info.account_type} / {extractResult.bank_info.account_number}
                  </div>
                </div>
              )}

              {/* 明細 */}
              {extractResult.items.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={label()}>品目・サービス名（明細）</span>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#f0f0f0' }}>
                        {['品目・サービス名', '数量', '単価', '金額'].map(h => (
                          <th key={h} style={{ padding: '4px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {extractResult.items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}>{item.name}</td>
                          <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}>{item.quantity}</td>
                          <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}>{item.unit_price?.toLocaleString()}</td>
                          <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}>{item.amount?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 欠落項目 */}
              <div>
                <span style={label()}>欠落項目</span>
                <MissingFieldBadges fields={extractResult.missing_fields} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========== 一括ジョブ確認画面 ========== */}
      {screen === '一括ジョブ確認画面' && bulkJob && (
        <div style={card()}>
          <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>一括ジョブ確認画面</h3>

          {/* 基本設計書 19.2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={label()}>ジョブID</span>
              <span style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{bulkJob.job_id}</span>
            </div>
            <div>
              <span style={label()}>ジョブ状態</span>
              <StatusBadge status={bulkJob.status} />
            </div>
            <div>
              <span style={label()}>総件数</span>
              <span style={{ fontSize: '0.9rem' }}>{bulkJob.total_files}</span>
            </div>
            <div>
              <span style={label()}>成功件数</span>
              <span style={{ fontSize: '0.9rem', color: COLOR.ok }}>{bulkJob.succeeded}</span>
            </div>
            <div>
              <span style={label()}>失敗件数</span>
              <span style={{ fontSize: '0.9rem', color: bulkJob.failed > 0 ? COLOR.danger : COLOR.text }}>{bulkJob.failed}</span>
            </div>
          </div>

          {/* ファイル別結果 */}
          {bulkJob.results.length > 0 && (
            <div>
              <span style={label()}>ファイル別結果</span>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['ファイル名', '状態', '文書ID', 'エラー'].map(h => (
                      <th key={h} style={{ padding: '4px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bulkJob.results.map((r, i) => (
                    <tr key={i}>
                      <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}>{r.file_name}</td>
                      <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}><StatusBadge status={r.status} /></td>
                      <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}>{r.document_id ?? '—'}</td>
                      <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.danger }}>{r.error ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(bulkJob.status === 'completed' || bulkJob.status === 'partial') && (
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => { setScreen('抽出結果一覧・訂正画面'); handleSearch() }}
                style={btn(COLOR.primary)}
              >
                抽出結果一覧・訂正画面へ
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========== 抽出結果一覧・訂正画面 ========== */}
      {screen === '抽出結果一覧・訂正画面' && (
        <div>
          {/* 検索条件（基本設計書 19.3） */}
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>抽出結果一覧・訂正画面</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
              <div>
                <span style={label()}>発行日From</span>
                <input type="date" style={field()} value={searchDateFrom} onChange={e => setSearchDateFrom(e.target.value)} />
              </div>
              <div>
                <span style={label()}>発行日To</span>
                <input type="date" style={field()} value={searchDateTo} onChange={e => setSearchDateTo(e.target.value)} />
              </div>
              <div>
                <span style={label()}>取引先名（部分一致）</span>
                <input type="text" style={field()} value={searchSupplier} onChange={e => setSearchSupplier(e.target.value)} placeholder="取引先名" />
              </div>
              <div>
                <span style={label()}>金額下限</span>
                <input type="number" style={field()} value={searchMinAmount} onChange={e => setSearchMinAmount(e.target.value)} placeholder="0" />
              </div>
              <div>
                <span style={label()}>金額上限</span>
                <input type="number" style={field()} value={searchMaxAmount} onChange={e => setSearchMaxAmount(e.target.value)} placeholder="9999999" />
              </div>
              <div>
                <span style={label()}>文書種別</span>
                <select style={field()} value={searchDocumentType} onChange={e => setSearchDocumentType(e.target.value)}>
                  <option value="">（すべて）</option>
                  <option value="請求書">請求書</option>
                  <option value="領収書">領収書</option>
                  <option value="納品書">納品書</option>
                  <option value="不明">不明</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <label style={{ cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="checkbox"
                  checked={searchRequiresReview}
                  onChange={e => setSearchRequiresReview(e.target.checked)}
                />
                要確認のみ
              </label>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSearch} disabled={listLoading} style={btn(COLOR.primary)}>
                {listLoading ? '検索中...' : '検索'}
              </button>
              <button onClick={handleExportCsv} style={btn('#6c6f85')}>
                CSV出力
              </button>
            </div>
          </div>

          {/* 一覧表（基本設計書 19.3） */}
          {documentList.length > 0 ? (
            <div style={card()}>
              <div style={{ fontSize: '0.85rem', color: COLOR.muted, marginBottom: '0.5rem' }}>
                全{listTotal}件
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['文書ID', 'ファイル名', '文書種別', '発行日', '取引先名', '合計金額', '確認状態', ''].map(h => (
                      <th key={h} style={{ padding: '6px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {documentList.map(doc => (
                    <tr key={doc.document_id}>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{doc.document_id}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{doc.file_name}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{doc.document_type ?? '—'}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{doc.issue_date ?? '—'}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{doc.supplier_name ?? '—'}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>{doc.total?.toLocaleString() ?? '—'}</td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>
                        <StatusBadge status={doc.review_status} />
                      </td>
                      <td style={{ padding: '6px 8px', border: `1px solid ${COLOR.border}` }}>
                        <button
                          onClick={() => handleEditDocument(doc)}
                          style={{ ...btn(COLOR.primary), fontSize: '0.8rem', padding: '2px 10px' }}
                        >
                          訂正
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !listLoading && (
              <div style={{ color: COLOR.muted, textAlign: 'center', padding: '2rem' }}>
                該当するデータがありません
              </div>
            )
          )}
        </div>
      )}

      {/* ========== 訂正画面 ========== */}
      {screen === '訂正画面' && correctTarget && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={() => setScreen('抽出結果一覧・訂正画面')} style={{ ...btn('#aaa'), fontSize: '0.85rem' }}>
              ← 抽出結果一覧・訂正画面に戻る
            </button>
          </div>

          <div style={card()}>
            <h3 style={{ margin: '0 0 0.5rem', color: COLOR.text }}>訂正画面</h3>
            <p style={{ color: COLOR.muted, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              文書ID: {correctTarget.document_id} / {correctTarget.file_name}
            </p>

            {/* 訂正フォーム（基本設計書 19.4） */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={label()}>文書種別</span>
                <select
                  style={field()}
                  value={(correctForm.document_type as string) ?? ''}
                  onChange={e => setCorrectForm(f => ({ ...f, document_type: e.target.value as DocumentType }))}
                >
                  <option value="">（変更しない）</option>
                  <option value="請求書">請求書</option>
                  <option value="領収書">領収書</option>
                  <option value="納品書">納品書</option>
                  <option value="不明">不明</option>
                </select>
              </div>
              <div>
                <span style={label()}>発行日</span>
                <input
                  type="date"
                  style={field()}
                  value={(correctForm.issue_date as string) ?? ''}
                  onChange={e => setCorrectForm(f => ({ ...f, issue_date: e.target.value }))}
                />
              </div>
              <div>
                <span style={label()}>取引先名</span>
                <input
                  type="text"
                  style={field()}
                  value={(correctForm.supplier_name as string) ?? ''}
                  onChange={e => setCorrectForm(f => ({ ...f, supplier_name: e.target.value }))}
                  placeholder="取引先名"
                />
              </div>
              <div>
                <span style={label()}>宛先名</span>
                <input
                  type="text"
                  style={field()}
                  value={(correctForm.recipient_name as string) ?? ''}
                  onChange={e => setCorrectForm(f => ({ ...f, recipient_name: e.target.value }))}
                  placeholder="宛先名"
                />
              </div>
              <div>
                <span style={label()}>小計</span>
                <input
                  type="number"
                  style={field()}
                  value={(correctForm.subtotal as number) ?? ''}
                  onChange={e => setCorrectForm(f => ({ ...f, subtotal: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <span style={label()}>8%税額</span>
                <input
                  type="number"
                  style={field()}
                  value={(correctForm.tax_8 as number) ?? ''}
                  onChange={e => setCorrectForm(f => ({ ...f, tax_8: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <span style={label()}>10%税額</span>
                <input
                  type="number"
                  style={field()}
                  value={(correctForm.tax_10 as number) ?? ''}
                  onChange={e => setCorrectForm(f => ({ ...f, tax_10: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <span style={label()}>合計</span>
                <input
                  type="number"
                  style={field()}
                  value={(correctForm.total as number) ?? ''}
                  onChange={e => setCorrectForm(f => ({ ...f, total: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <span style={label()}>支払期限</span>
                <input
                  type="date"
                  style={field()}
                  value={(correctForm.payment_due as string) ?? ''}
                  onChange={e => setCorrectForm(f => ({ ...f, payment_due: e.target.value }))}
                />
              </div>
            </div>

            {/* 振込先情報（全置換） */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={label()}>振込先情報（変更する場合はすべて入力してください）</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {([
                  ['銀行名', 'bank_name'],
                  ['支店名', 'branch_name'],
                  ['口座種別', 'account_type'],
                  ['口座番号', 'account_number'],
                ] as [string, keyof BankInfo][]).map(([label2, key]) => (
                  <div key={key}>
                    <span style={label()}>{label2}</span>
                    <input
                      type="text"
                      style={field()}
                      value={((correctForm.bank_info as BankInfo)?.[key] as string) ?? ''}
                      onChange={e => setCorrectForm(f => ({
                        ...f,
                        bank_info: { ...(f.bank_info as BankInfo ?? {}), [key]: e.target.value } as BankInfo,
                      }))}
                      placeholder={label2}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 明細一覧（基本設計書 19.4 items_grid — 全削除後再登録） */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={label()}>明細一覧（変更する場合は全行再入力してください）</span>
                <button
                  type="button"
                  onClick={() => setCorrectForm(f => ({
                    ...f,
                    items: [...((f.items as DocumentItem[]) ?? []), { name: '', quantity: null, unit_price: null, amount: null }],
                  }))}
                  style={{ ...btn(COLOR.primary), fontSize: '0.8rem', padding: '2px 10px' }}
                >
                  行追加
                </button>
              </div>
              {((correctForm.items as DocumentItem[]) ?? []).length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                      {['品目・サービス名', '数量', '単価', '金額', ''].map(h => (
                        <th key={h} style={{ padding: '4px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {((correctForm.items as DocumentItem[]) ?? []).map((item, i) => (
                      <tr key={i}>
                        <td style={{ padding: '4px 4px', border: `1px solid ${COLOR.border}` }}>
                          <input type="text" style={{ ...field(), width: '100%' }}
                            value={item.name ?? ''}
                            onChange={e => {
                              const next = [...((correctForm.items as DocumentItem[]) ?? [])]
                              next[i] = { ...next[i], name: e.target.value }
                              setCorrectForm(f => ({ ...f, items: next }))
                            }}
                          />
                        </td>
                        <td style={{ padding: '4px 4px', border: `1px solid ${COLOR.border}` }}>
                          <input type="number" style={{ ...field(), width: '100%' }}
                            value={item.quantity ?? ''}
                            onChange={e => {
                              const next = [...((correctForm.items as DocumentItem[]) ?? [])]
                              next[i] = { ...next[i], quantity: Number(e.target.value) }
                              setCorrectForm(f => ({ ...f, items: next }))
                            }}
                          />
                        </td>
                        <td style={{ padding: '4px 4px', border: `1px solid ${COLOR.border}` }}>
                          <input type="number" style={{ ...field(), width: '100%' }}
                            value={item.unit_price ?? ''}
                            onChange={e => {
                              const next = [...((correctForm.items as DocumentItem[]) ?? [])]
                              next[i] = { ...next[i], unit_price: Number(e.target.value) }
                              setCorrectForm(f => ({ ...f, items: next }))
                            }}
                          />
                        </td>
                        <td style={{ padding: '4px 4px', border: `1px solid ${COLOR.border}` }}>
                          <input type="number" style={{ ...field(), width: '100%' }}
                            value={item.amount ?? ''}
                            onChange={e => {
                              const next = [...((correctForm.items as DocumentItem[]) ?? [])]
                              next[i] = { ...next[i], amount: Number(e.target.value) }
                              setCorrectForm(f => ({ ...f, items: next }))
                            }}
                          />
                        </td>
                        <td style={{ padding: '4px 4px', border: `1px solid ${COLOR.border}`, textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              const next = ((correctForm.items as DocumentItem[]) ?? []).filter((_, idx) => idx !== i)
                              setCorrectForm(f => ({ ...f, items: next }))
                            }}
                            style={{ ...btn(COLOR.danger), fontSize: '0.75rem', padding: '2px 8px' }}
                          >
                            削除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <button
              onClick={handleSaveCorrection}
              disabled={correcting || Object.keys(correctForm).length === 0}
              style={btn(COLOR.ok)}
            >
              {correcting ? '保存中...' : '訂正保存'}
            </button>

            {/* 訂正結果 */}
            {correctResult && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0faf0', borderRadius: 6, border: `1px solid ${COLOR.ok}` }}>
                <div style={{ fontWeight: 'bold', color: COLOR.ok, marginBottom: '0.5rem' }}>訂正が完了しました</div>
                <div style={{ fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div><span style={label()}>信頼度スコア</span>{correctResult.confidence_score.toFixed(2)}</div>
                  <div><span style={label()}>要確認</span><RequiresReviewBadge value={correctResult.requires_review} /></div>
                  <div><span style={label()}>欠落項目</span><MissingFieldBadges fields={correctResult.missing_fields} /></div>
                  <div><span style={label()}>更新日時</span>{correctResult.updated_at}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
