import { useState } from 'react'
import { createSystemClient } from '../api/client'

const client = createSystemClient('system14')

type Screen = 'upload' | 'dashboard' | 'analysis' | 'agent'

interface JobStatus {
  job_id: string
  status: string
  progress: number
  data_type: string
  source: string
  error_message?: string | null
}

interface VoiceRankingItem {
  rank: number
  group_label: string
  count: number
  sentiment?: string | null
  type?: string | null
  products?: string[]
  representative_text?: string | null
}

interface DashboardCard {
  key: string
  label: string
  value: number | string
  unit?: string | null
}

interface DashboardData {
  cards: DashboardCard[]
  sentiment_summary: Record<string, number>
  top_topics: VoiceRankingItem[]
  recent_jobs: JobStatus[]
}

interface VoiceRankingResponse {
  period: string
  total_data_count: number
  ranking: VoiceRankingItem[]
}

interface SalesScoreItem {
  staff_id?: string | null
  staff_name?: string | null
  overall_score: number
  breakdown: Record<string, number>
  top_questions: { question_type: string; count: number; example?: string | null }[]
}

interface SalesScoreResponse {
  period: string
  scores: SalesScoreItem[]
}

interface WinLossItem {
  rank: number
  reason: string
  result_type: string
  category?: string | null
  count: number
  representative_text?: string | null
}

interface WinLossResponse {
  period: string
  win_loss: WinLossItem[]
}

interface ActionProposalItem {
  priority: string
  issue: string
  evidence_count: number
  recommended_action: string
  target_department: string
}

interface ActionProposalResponse {
  product?: string | null
  proposals: ActionProposalItem[]
}

interface FAQGapItem {
  rank: number
  call_reason: string
  inquiry_count: number
  existing_faq?: string | null
  suggested_faq: {
    question: string
    answer: string
  }
}

interface FAQGapResponse {
  product?: string | null
  faq_gaps: FAQGapItem[]
}

interface AgentAnswer {
  answer_id: number
  question: string
  answer: string
  recommended_actions: string[]
  evidence: {
    total_utterances?: number
    top_group?: VoiceRankingItem | null
    top_sales_score?: SalesScoreItem | null
  }
}

interface AnalysisFilters {
  fromDate: string
  toDate: string
  product: string
  callReason: string
  sentiment: string
  staffId: string
  utteranceType: string
}

const COLOR = {
  panel: '#ffffff',
  border: '#dfe4ea',
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  danger: '#dc2626',
  ok: '#15803d',
  text: '#172033',
  muted: '#64748b',
  bg: '#f6f8fb',
  band: '#eef4ff',
}

const card = (): React.CSSProperties => ({
  background: COLOR.panel,
  border: `1px solid ${COLOR.border}`,
  borderRadius: 8,
  padding: '1rem',
  marginBottom: '1rem',
})

const field = (): React.CSSProperties => ({
  border: `1px solid ${COLOR.border}`,
  borderRadius: 6,
  padding: '0.5rem 0.65rem',
  fontSize: '0.9rem',
  width: '100%',
  boxSizing: 'border-box',
})

const button = (active = true): React.CSSProperties => ({
  background: active ? COLOR.primary : '#cbd5e1',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '0.58rem 1rem',
  cursor: active ? 'pointer' : 'not-allowed',
  minHeight: 36,
})

const tabButton = (active: boolean): React.CSSProperties => ({
  ...button(true),
  background: active ? COLOR.primaryDark : '#e2e8f0',
  color: active ? '#fff' : COLOR.text,
})

const tableCell = (): React.CSSProperties => ({
  padding: 8,
  borderBottom: `1px solid ${COLOR.border}`,
  verticalAlign: 'top',
})

const getErrorMessage = (fallback: string) => fallback

const emptyFilters: AnalysisFilters = {
  fromDate: '',
  toDate: '',
  product: '',
  callReason: '',
  sentiment: '',
  staffId: '',
  utteranceType: '',
}

function cleanValue(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

function compactParams(params: Record<string, string | undefined>) {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined))
}

function buildFilterPayload(filters: AnalysisFilters) {
  return compactParams({
    from_date: cleanValue(filters.fromDate),
    to_date: cleanValue(filters.toDate),
    product: cleanValue(filters.product),
    call_reason: cleanValue(filters.callReason),
    sentiment: cleanValue(filters.sentiment),
    staff_id: cleanValue(filters.staffId),
    type: cleanValue(filters.utteranceType),
  })
}

function buildVoiceRankingParams(filters: AnalysisFilters) {
  return compactParams({
    from_date: cleanValue(filters.fromDate),
    to_date: cleanValue(filters.toDate),
    product: cleanValue(filters.product),
    call_reason: cleanValue(filters.callReason),
    sentiment: cleanValue(filters.sentiment),
    type: cleanValue(filters.utteranceType),
  })
}

function buildSalesScoreParams(filters: AnalysisFilters) {
  return compactParams({
    from_date: cleanValue(filters.fromDate),
    to_date: cleanValue(filters.toDate),
    staff_id: cleanValue(filters.staffId),
  })
}

function buildDateRangeParams(filters: AnalysisFilters) {
  return compactParams({
    from_date: cleanValue(filters.fromDate),
    to_date: cleanValue(filters.toDate),
  })
}

function buildProductParams(filters: AnalysisFilters) {
  return compactParams({
    product: cleanValue(filters.product),
  })
}

function buildActionProposalParams(filters: AnalysisFilters) {
  return compactParams({
    from_date: cleanValue(filters.fromDate),
    to_date: cleanValue(filters.toDate),
    product: cleanValue(filters.product),
  })
}

export default function System14Page() {
  const [screen, setScreen] = useState<Screen>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [dataType, setDataType] = useState('chat')
  const [source, setSource] = useState('chat_support')
  const [metadata, setMetadata] = useState(
    '{"product":"商品A","staff_id":"staff_001","staff_name":"中村","call_reason":"配送確認"}',
  )
  const [job, setJob] = useState<JobStatus | null>(null)
  const [message, setMessage] = useState('')
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [voiceRanking, setVoiceRanking] = useState<VoiceRankingResponse | null>(null)
  const [salesScore, setSalesScore] = useState<SalesScoreResponse | null>(null)
  const [winLoss, setWinLoss] = useState<WinLossResponse | null>(null)
  const [actionProposals, setActionProposals] = useState<ActionProposalResponse | null>(null)
  const [faqGaps, setFaqGaps] = useState<FAQGapResponse | null>(null)
  const [analysisMessage, setAnalysisMessage] = useState('')
  const [filters, setFilters] = useState<AnalysisFilters>(emptyFilters)
  const [question, setQuestion] = useState('ネガティブな声が多いトピックと次のアクションを教えて')
  const [answer, setAnswer] = useState<AgentAnswer | null>(null)
  const [answerMessage, setAnswerMessage] = useState('')
  const [workflowName, setWorkflowName] = useState('製品改善向け週次レポート')
  const [workflowTrigger, setWorkflowTrigger] = useState('weekly')
  const [workflowOutputType, setWorkflowOutputType] = useState('voice_ranking')
  const [workflowDeliveryMethod, setWorkflowDeliveryMethod] = useState('dashboard')
  const [workflowEndpoint, setWorkflowEndpoint] = useState('')
  const [workflowRecipients, setWorkflowRecipients] = useState('')
  const [workflowResult, setWorkflowResult] = useState('')

  async function upload() {
    if (!file) return
    setMessage('アップロード中...')
    const form = new FormData()
    form.append('file', file)
    form.append('data_type', dataType)
    form.append('source', source)
    if (metadata.trim()) {
      form.append('metadata', metadata)
    }
    try {
      const res = await fetch('/api/system14/data/upload', {
        method: 'POST',
        headers: {
          'X-User-Id': 'user01',
          'X-User-Roles': 'admin',
        },
        body: form,
      })
      if (!res.ok) {
        throw new Error(`upload failed: ${res.status}`)
      }
      const data = await res.json()
      setJob(data)
      setMessage(`ジョブを受け付けました: ${data.job_id}`)
    } catch {
      setMessage(getErrorMessage('アップロードに失敗しました'))
    }
  }

  async function pollJob() {
    if (!job) return
    const res = await client.get<JobStatus>(`/jobs/${job.job_id}`)
    setJob(res.data)
  }

  async function loadDashboard() {
    const res = await client.get<DashboardData>('/dashboard')
    setDashboard(res.data)
  }

  async function loadAnalysis() {
    setAnalysisMessage('分析結果を更新中...')
    try {
      const [rankingRes, salesRes, winLossRes, actionRes, faqRes] = await Promise.all([
        client.get<VoiceRankingResponse>('/insights/voice-ranking', { params: buildVoiceRankingParams(filters) }),
        client.get<SalesScoreResponse>('/insights/sales-score', { params: buildSalesScoreParams(filters) }),
        client.get<WinLossResponse>('/insights/win-loss', { params: buildDateRangeParams(filters) }),
        client.get<ActionProposalResponse>('/agent/action-proposals', { params: buildActionProposalParams(filters) }),
        client.get<FAQGapResponse>('/agent/faq-gaps', { params: buildProductParams(filters) }),
      ])
      setVoiceRanking(rankingRes.data)
      setSalesScore(salesRes.data)
      setWinLoss(winLossRes.data)
      setActionProposals(actionRes.data)
      setFaqGaps(faqRes.data)
      setAnalysisMessage('')
    } catch {
      setAnalysisMessage(getErrorMessage('分析結果の取得に失敗しました'))
    }
  }

  function updateFilter(key: keyof AnalysisFilters, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setFilters(emptyFilters)
  }

  async function askAgent() {
    setAnswer(null)
    setAnswerMessage('回答生成中...')
    try {
      const res = await client.post<AgentAnswer>('/agent/chat', {
        session_id: 'frontend',
        question,
        filters: buildFilterPayload(filters),
      })
      setAnswer(res.data)
      setAnswerMessage('')
    } catch {
      setAnswerMessage(getErrorMessage('回答取得に失敗しました'))
    }
  }

  async function createWorkflow() {
    setWorkflowResult('保存中...')
    try {
      const recipients = workflowRecipients
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
      const res = await client.post('/workflows', {
        name: workflowName,
        trigger: workflowTrigger,
        data_sources: ['chat_support', 'callcenter'],
        analysis_steps: ['sentiment', 'topic_extraction', 'grouping', 'ranking'],
        output_type: workflowOutputType,
        filters: buildFilterPayload(filters),
        delivery: {
          method: workflowDeliveryMethod,
          endpoint: workflowEndpoint.trim() || undefined,
          recipients,
        },
      })
      const delivery = res.data.delivery_result
      const deliveryMessage = delivery
        ? ` / 配信=${delivery.status}${delivery.error_message ? ` (${delivery.error_message})` : ''}`
        : ''
      setWorkflowResult(`workflow_id=${res.data.workflow_id} を保存しました${deliveryMessage}`)
    } catch {
      setWorkflowResult(getErrorMessage('ワークフロー保存に失敗しました'))
    }
  }

  return (
    <div style={{ maxWidth: 1120 }}>
      <h2 style={{ color: COLOR.text, marginBottom: 4 }}>System14</h2>
      <p style={{ color: COLOR.muted, marginBottom: '1.2rem' }}>
        顧客接点データ 全量分析＆インサイト配信エージェント
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
        {[
          ['upload', 'データ取込'],
          ['dashboard', 'ダッシュボード'],
          ['analysis', '分析'],
          ['agent', 'エージェント'],
        ].map(([key, label]) => (
          <button
            key={key}
            data-testid={`tab-${key}`}
            onClick={() => setScreen(key as Screen)}
            style={tabButton(screen === key)}
          >
            {label}
          </button>
        ))}
      </div>

      {screen === 'upload' && (
        <section style={card()}>
          <h3 style={{ marginTop: 0 }}>データ取込</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label>取込種別</label>
              <select data-testid="data-type" style={field()} value={dataType} onChange={e => setDataType(e.target.value)}>
                <option value="chat">chat</option>
                <option value="email">email</option>
                <option value="call_log">call_log</option>
                <option value="audio">audio</option>
                <option value="video">video</option>
              </select>
            </div>
            <div>
              <label>データソース</label>
              <input data-testid="source" style={field()} value={source} onChange={e => setSource(e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>取込ファイル</label>
            <input data-testid="file-input" style={field()} type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>metadata JSON</label>
            <textarea
              data-testid="metadata"
              style={{ ...field(), minHeight: 90, fontFamily: 'monospace' }}
              value={metadata}
              onChange={e => setMetadata(e.target.value)}
            />
          </div>
          <button data-testid="upload-button" style={button(Boolean(file))} disabled={!file} onClick={upload}>
            取込開始
          </button>
          {message && <p data-testid="upload-message" style={{ color: COLOR.muted }}>{message}</p>}
          {job && (
            <div data-testid="job-status" style={{ background: COLOR.bg, borderRadius: 8, padding: '1rem', marginTop: '1rem' }}>
              <div>job_id: {job.job_id}</div>
              <div>status: {job.status}</div>
              <div>progress: {job.progress}%</div>
              {job.error_message && <div style={{ color: COLOR.danger }}>{job.error_message}</div>}
              <button data-testid="poll-job" style={{ ...button(true), marginTop: 8 }} onClick={pollJob}>状態更新</button>
            </div>
          )}
        </section>
      )}

      {screen === 'dashboard' && (
        <section>
          <div style={card()}>
            <button data-testid="load-dashboard" style={button(true)} onClick={loadDashboard}>ダッシュボード更新</button>
          </div>
          {dashboard && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.8rem' }}>
                {dashboard.cards.map(item => (
                  <div key={item.key} style={card()}>
                    <div style={{ color: COLOR.muted, fontSize: '0.82rem' }}>{item.label}</div>
                    <div data-testid={`dashboard-card-${item.key}`} style={{ color: COLOR.text, fontSize: '1.8rem', fontWeight: 'bold' }}>
                      {item.value}{item.unit ?? ''}
                    </div>
                  </div>
                ))}
              </div>
              <div style={card()}>
                <h3 style={{ marginTop: 0 }}>顧客の声ランキング</h3>
                <RankingTable items={dashboard.top_topics} />
              </div>
              <div style={card()}>
                <h3 style={{ marginTop: 0 }}>直近ジョブ</h3>
                {dashboard.recent_jobs.map(item => (
                  <div key={item.job_id} style={{ padding: '0.4rem 0', borderBottom: `1px solid ${COLOR.border}` }}>
                    {item.job_id} / {item.status} / {item.progress}%
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {screen === 'analysis' && (
        <section>
          <div style={card()}>
            <h3 style={{ marginTop: 0 }}>分析フィルタ</h3>
            <AnalysisFilterPanel filters={filters} onChange={updateFilter} onClear={clearFilters} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: '1rem' }}>
              <button data-testid="load-analysis" style={button(true)} onClick={loadAnalysis}>分析結果更新</button>
              <button data-testid="clear-analysis-filters" style={{ ...button(true), background: '#475569' }} onClick={clearFilters}>
                フィルタをクリア
              </button>
            </div>
            {analysisMessage && <p data-testid="analysis-message" style={{ color: COLOR.muted }}>{analysisMessage}</p>}
          </div>
          {voiceRanking && (
            <div style={card()}>
              <h3 style={{ marginTop: 0 }}>顧客の声ランキング</h3>
              <p style={{ color: COLOR.muted }}>total_data_count: {voiceRanking.total_data_count}</p>
              <RankingTable items={voiceRanking.ranking} />
            </div>
          )}
          {salesScore && (
            <div style={card()}>
              <h3 style={{ marginTop: 0 }}>営業スコア</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.8rem' }}>
                {salesScore.scores.map((item, index) => (
                  <div key={`${item.staff_id ?? 'staff'}-${index}`} style={{ background: COLOR.bg, borderRadius: 8, padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{item.staff_name ?? item.staff_id ?? '担当者未設定'}</div>
                    <div data-testid="sales-score" style={{ fontSize: '1.6rem', color: COLOR.primary, fontWeight: 'bold' }}>{item.overall_score}点</div>
                    <div style={{ color: COLOR.muted, fontSize: '0.84rem' }}>
                      傾聴比率: {item.breakdown.listening_ratio ?? '-'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {winLoss && (
            <div style={card()}>
              <h3 style={{ marginTop: 0 }}>勝敗要因</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                <thead>
                  <tr>{['順位', '要因', '結果', '件数', '代表発言'].map(h => <th key={h} style={{ ...tableCell(), textAlign: 'left' }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {winLoss.win_loss.map(item => (
                    <tr key={`${item.rank}-${item.reason}`}>
                      <td style={tableCell()}>{item.rank}</td>
                      <td style={tableCell()}>{item.reason}</td>
                      <td style={tableCell()}>{item.result_type}</td>
                      <td style={tableCell()}>{item.count}</td>
                      <td style={{ ...tableCell(), color: COLOR.muted }}>{item.representative_text ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {actionProposals && (
            <div style={card()}>
              <h3 style={{ marginTop: 0 }}>改善提案</h3>
              {actionProposals.proposals.length === 0 ? (
                <EmptyText>該当する改善提案はありません。</EmptyText>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.8rem' }}>
                  {actionProposals.proposals.map(item => (
                    <div key={`${item.priority}-${item.issue}-${item.target_department}`} data-testid="action-proposal" style={{ background: COLOR.bg, borderRadius: 8, padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                        <strong>{item.issue}</strong>
                        <span style={{ color: item.priority === '高' ? COLOR.danger : COLOR.primary, fontWeight: 'bold' }}>{item.priority}</span>
                      </div>
                      <div style={{ color: COLOR.muted, fontSize: '0.84rem', marginBottom: 8 }}>
                        {item.target_department} / 根拠 {item.evidence_count} 件
                      </div>
                      <div style={{ color: COLOR.text, lineHeight: 1.6 }}>{item.recommended_action}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {faqGaps && (
            <div style={card()}>
              <h3 style={{ marginTop: 0 }}>FAQ不足候補</h3>
              {faqGaps.faq_gaps.length === 0 ? (
                <EmptyText>該当する FAQ 不足候補はありません。</EmptyText>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', minWidth: 760 }}>
                    <thead>
                      <tr>{['順位', '問い合わせ', '件数', 'FAQ案', '回答案'].map(h => <th key={h} style={{ ...tableCell(), textAlign: 'left' }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {faqGaps.faq_gaps.map(item => (
                        <tr key={`${item.rank}-${item.call_reason}`}>
                          <td style={tableCell()}>{item.rank}</td>
                          <td style={{ ...tableCell(), fontWeight: 'bold' }}>{item.call_reason}</td>
                          <td style={tableCell()}>{item.inquiry_count}</td>
                          <td style={tableCell()}>{item.suggested_faq.question}</td>
                          <td style={{ ...tableCell(), color: COLOR.muted }}>{item.suggested_faq.answer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {screen === 'agent' && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div style={card()}>
            <h3 style={{ marginTop: 0 }}>分析AIチャット</h3>
            <AnalysisFilterPanel filters={filters} onChange={updateFilter} onClear={clearFilters} compact />
            <textarea
              data-testid="agent-question"
              style={{ ...field(), minHeight: 100, marginTop: '1rem' }}
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
            <button data-testid="ask-agent" style={{ ...button(Boolean(question.trim())), marginTop: 8 }} disabled={!question.trim()} onClick={askAgent}>
              質問する
            </button>
            {answerMessage && <p style={{ color: COLOR.muted }}>{answerMessage}</p>}
            {answer && (
              <div data-testid="agent-answer" style={{ background: COLOR.band, borderRadius: 8, padding: '1rem', marginTop: '1rem' }}>
                <p style={{ lineHeight: 1.7, color: COLOR.text }}>{answer.answer}</p>
                {answer.recommended_actions.length > 0 && (
                  <ul style={{ color: COLOR.text, paddingLeft: '1.2rem' }}>
                    {answer.recommended_actions.map(action => <li key={action}>{action}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div style={card()}>
            <h3 style={{ marginTop: 0 }}>ワークフロー設定</h3>
            <input data-testid="workflow-name" style={field()} value={workflowName} onChange={e => setWorkflowName(e.target.value)} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.8rem', marginTop: '0.8rem' }}>
              <div>
                <label>実行タイミング</label>
                <select data-testid="workflow-trigger" style={field()} value={workflowTrigger} onChange={e => setWorkflowTrigger(e.target.value)}>
                  <option value="manual">manual</option>
                  <option value="realtime">realtime</option>
                  <option value="daily">daily</option>
                  <option value="weekly">weekly</option>
                </select>
              </div>
              <div>
                <label>出力</label>
                <select data-testid="workflow-output-type" style={field()} value={workflowOutputType} onChange={e => setWorkflowOutputType(e.target.value)}>
                  <option value="voice_ranking">voice_ranking</option>
                  <option value="sales_score">sales_score</option>
                  <option value="win_loss">win_loss</option>
                  <option value="action_proposals">action_proposals</option>
                  <option value="faq_gaps">faq_gaps</option>
                  <option value="dashboard">dashboard</option>
                </select>
              </div>
              <div>
                <label>配信方法</label>
                <select data-testid="workflow-delivery-method" style={field()} value={workflowDeliveryMethod} onChange={e => setWorkflowDeliveryMethod(e.target.value)}>
                  <option value="dashboard">dashboard</option>
                  <option value="webhook">webhook</option>
                  <option value="email">email</option>
                  <option value="crm">crm</option>
                </select>
              </div>
            </div>
            {(workflowDeliveryMethod === 'webhook' || workflowDeliveryMethod === 'crm') && (
              <div style={{ marginTop: '0.8rem' }}>
                <label>endpoint</label>
                <input data-testid="workflow-endpoint" style={field()} value={workflowEndpoint} onChange={e => setWorkflowEndpoint(e.target.value)} placeholder="https://example.com/webhook" />
              </div>
            )}
            {workflowDeliveryMethod === 'email' && (
              <div style={{ marginTop: '0.8rem' }}>
                <label>recipients</label>
                <input data-testid="workflow-recipients" style={field()} value={workflowRecipients} onChange={e => setWorkflowRecipients(e.target.value)} placeholder="team@example.com, manager@example.com" />
              </div>
            )}
            <button data-testid="save-workflow" style={{ ...button(Boolean(workflowName.trim())), marginTop: 8 }} disabled={!workflowName.trim()} onClick={createWorkflow}>
              保存
            </button>
            {workflowResult && <p data-testid="workflow-result" style={{ color: COLOR.muted }}>{workflowResult}</p>}
          </div>
        </section>
      )}
    </div>
  )
}

function AnalysisFilterPanel({
  filters,
  onChange,
  onClear,
  compact = false,
}: {
  filters: AnalysisFilters
  onChange: (key: keyof AnalysisFilters, value: string) => void
  onClear: () => void
  compact?: boolean
}) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(auto-fit, minmax(150px, 1fr))' : 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.8rem' }}>
        <div>
          <label>開始日</label>
          <input data-testid="filter-from-date" type="date" style={field()} value={filters.fromDate} onChange={e => onChange('fromDate', e.target.value)} />
        </div>
        <div>
          <label>終了日</label>
          <input data-testid="filter-to-date" type="date" style={field()} value={filters.toDate} onChange={e => onChange('toDate', e.target.value)} />
        </div>
        <div>
          <label>商品</label>
          <input data-testid="filter-product" style={field()} value={filters.product} onChange={e => onChange('product', e.target.value)} placeholder="商品A" />
        </div>
        <div>
          <label>コール理由</label>
          <input data-testid="filter-call-reason" style={field()} value={filters.callReason} onChange={e => onChange('callReason', e.target.value)} placeholder="配送確認" />
        </div>
        <div>
          <label>感情</label>
          <select data-testid="filter-sentiment" style={field()} value={filters.sentiment} onChange={e => onChange('sentiment', e.target.value)}>
            <option value="">すべて</option>
            <option value="positive">positive</option>
            <option value="neutral">neutral</option>
            <option value="negative">negative</option>
          </select>
        </div>
        <div>
          <label>担当者ID</label>
          <input data-testid="filter-staff-id" style={field()} value={filters.staffId} onChange={e => onChange('staffId', e.target.value)} placeholder="staff_001" />
        </div>
        <div>
          <label>発言種別</label>
          <select data-testid="filter-utterance-type" style={field()} value={filters.utteranceType} onChange={e => onChange('utteranceType', e.target.value)}>
            <option value="">すべて</option>
            <option value="質問">質問</option>
            <option value="要望">要望</option>
            <option value="クレーム">クレーム</option>
            <option value="称賛">称賛</option>
            <option value="その他">その他</option>
          </select>
        </div>
      </div>
      {compact && (
        <button data-testid="clear-agent-filters" style={{ ...button(true), background: '#475569', marginTop: '0.8rem' }} onClick={onClear}>
          フィルタをクリア
        </button>
      )}
    </div>
  )
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p style={{ color: COLOR.muted, marginBottom: 0 }}>{children}</p>
}

function RankingTable({ items }: { items: VoiceRankingItem[] }) {
  return (
    <table data-testid="ranking-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
      <thead>
        <tr>{['順位', 'グループ', '件数', '感情', '種別', '代表発言'].map(h => <th key={h} style={{ ...tableCell(), textAlign: 'left' }}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={`${item.rank}-${item.group_label}`}>
            <td style={tableCell()}>{item.rank}</td>
            <td style={{ ...tableCell(), fontWeight: 'bold' }}>{item.group_label}</td>
            <td style={tableCell()}>{item.count}</td>
            <td style={tableCell()}>{item.sentiment ?? '-'}</td>
            <td style={tableCell()}>{item.type ?? '-'}</td>
            <td style={{ ...tableCell(), color: COLOR.muted }}>{item.representative_text ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
