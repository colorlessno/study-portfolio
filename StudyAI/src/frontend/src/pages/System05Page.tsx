import { useState, useRef } from 'react'
import { createSystemClient } from '../api/client'

const client = createSystemClient('system05')

// ---- 型定義（基本設計書 IF仕様より） ----

interface Patient {
  patient_id: number
  name: string
  kana: string | null
  phone: string
  birth_date: string | null
  gender: string | null
  contraindications: string | null
  visit_count: number
  last_visit_date: string | null
}

interface TreatmentRecord {
  record_id: number
  patient_id: number
  treatment_date: string
  soap_subjective: string
  soap_objective: string
  soap_assessment: string
  soap_plan: string
  next_suggestion: string | null
  created_at: string
}

interface RecordRevision {
  revision_id: number
  record_id: number
  corrected_by: string
  correction_reason: string
  before_soap: string
  after_soap: string
  corrected_at: string
}

interface AppointmentRecord {
  appointment_id: number
  patient_id: number
  patient_name: string
  appointment_datetime: string
  menu: string
  status: 'reserved' | 'completed' | 'cancelled' | 'no_show'
  confirmation_no: string | null
}

interface AvailableSlot {
  datetime: string
  menu: string
  remaining: number
}

interface MonthlyStats {
  year_month: string
  total_visits: number
  total_revenue: number
  new_patients: number
  returning_patients: number
  top_menus: { menu: string; count: number }[]
}

interface BackupLog {
  backup_id: number
  executed_at: string
  result: 'success' | 'failed'
  file_path: string
  file_size_mb: number | null
}

// ---- 画面種別（基本設計書 セクション10） ----
type Screen = '患者一覧画面' | '患者登録・詳細画面' | 'カルテ生成画面' | '予約管理・統計画面' | '院内予約受付画面'
type InputMode = 'メモ' | '音声'

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

// ---- 予約ステータスバッジ ----
function ApptStatusBadge({ value }: { value: string }) {
  const map: Record<string, [string, string]> = {
    reserved:  [COLOR.primary, '予約済'],
    completed: [COLOR.ok,      '完了'],
    cancelled: [COLOR.muted,   'キャンセル'],
    no_show:   [COLOR.danger,  '無断欠席'],
  }
  const [color, label] = map[value] ?? ['#aaa', value]
  return <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem' }}>{label}</span>
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function System05Page() {
  const [screen, setScreen] = useState<Screen>('患者一覧画面')

  // ---- 患者一覧画面（基本設計書 14.1） ----
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchVisitMin, setSearchVisitMin] = useState('')
  const [patientList, setPatientList] = useState<Patient[]>([])
  const [listLoading, setListLoading] = useState(false)

  // ---- 患者登録・詳細画面（基本設計書 14.2） ----
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [patName, setPatName] = useState('')
  const [patKana, setPatKana] = useState('')
  const [patPhone, setPatPhone] = useState('')
  const [patBirth, setPatBirth] = useState('')
  const [patGender, setPatGender] = useState('')
  const [patContra, setPatContra] = useState('')
  const [savingPatient, setSavingPatient] = useState(false)
  const [recentRecords, setRecentRecords] = useState<TreatmentRecord[]>([])
  const [patAppointments, setPatAppointments] = useState<AppointmentRecord[]>([])

  // ---- カルテ生成画面（基本設計書 14.3） ----
  const [kartePatientId, setKartePatientId] = useState<number | null>(null)
  const [inputMode, setInputMode] = useState<InputMode>('メモ')
  const [recordMemo, setRecordMemo] = useState('')
  const [voiceFile, setVoiceFile] = useState<File | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generatedRecordId, setGeneratedRecordId] = useState<number | null>(null)
  const [soapS, setSoapS] = useState('')
  const [soapO, setSoapO] = useState('')
  const [soapA, setSoapA] = useState('')
  const [soapP, setSoapP] = useState('')
  const [nextSuggestion, setNextSuggestion] = useState<string | null>(null)
  const [correctionReason, setCorrectionReason] = useState('')
  const [correcting, setCorrecting] = useState(false)
  const [correctionDone, setCorrectionDone] = useState(false)
  const [recordHistory, setRecordHistory] = useState<RecordRevision[]>([])
  const voiceFileRef = useRef<HTMLInputElement>(null)

  // ---- 予約管理・統計画面（基本設計書 14.4） ----
  const [apptDate, setApptDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [appointmentGrid, setAppointmentGrid] = useState<AppointmentRecord[]>([])
  const [apptLoading, setApptLoading] = useState(false)
  const [apptStatusUpdate, setApptStatusUpdate] = useState<Record<number, string>>({})
  const [updatingApptId, setUpdatingApptId] = useState<number | null>(null)
  const [statsMonth, setStatsMonth] = useState('')
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [backupRunning, setBackupRunning] = useState(false)
  const [backupHistory, setBackupHistory] = useState<BackupLog[]>([])
  const [backupHistLoading, setBackupHistLoading] = useState(false)

  // ---- 院内予約受付画面（基本設計書 14.5） ----
  const [newOrReturning, setNewOrReturning] = useState<'初回' | '再診'>('再診')
  const [bookingPatientId, setBookingPatientId] = useState('')
  const [verifyBirth, setVerifyBirth] = useState('')
  const [verifyPhone4, setVerifyPhone4] = useState('')
  const [bookingMenu, setBookingMenu] = useState('')
  const [bookingSlots, setBookingSlots] = useState<AvailableSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [bookingConfirming, setBookingConfirming] = useState(false)
  const [bookingNo, setBookingNo] = useState<string | null>(null)
  const [bookingSlotsLoading, setBookingSlotsLoading] = useState(false)

  // ----------------------------------------------------------------
  // 患者一覧検索
  async function handleSearchPatients() {
    setListLoading(true)
    try {
      const params: Record<string, string> = {}
      if (searchName.trim()) params.name = searchName.trim()
      if (searchPhone.trim()) params.phone = searchPhone.trim()
      if (searchVisitMin) params.visit_count_min = searchVisitMin
      const res = await client.get<{ items: Patient[] }>('/patients', { params })
      setPatientList(res.data.items ?? [])
    } catch { } finally { setListLoading(false) }
  }

  // 患者選択 → 詳細画面へ
  async function handleSelectPatient(p: Patient) {
    setPatName(p.name); setPatKana(p.kana ?? ''); setPatPhone(p.phone)
    setPatBirth(p.birth_date ?? ''); setPatGender(p.gender ?? '')
    setPatContra(p.contraindications ?? ''); setSelectedPatientId(p.patient_id)
    // カルテ・予約も取得
    try {
      const [recRes, apptRes] = await Promise.all([
        client.get<{ items: TreatmentRecord[] }>(`/patients/${p.patient_id}/records`),
        client.get<{ items: AppointmentRecord[] }>('/appointments', { params: { patient_id: p.patient_id } }),
      ])
      setRecentRecords(recRes.data.items ?? [])
      setPatAppointments(apptRes.data.items ?? [])
    } catch { }
    setScreen('患者登録・詳細画面')
  }

  // 患者保存
  async function handleSavePatient() {
    if (!patName.trim() || !patPhone.trim()) return
    setSavingPatient(true)
    try {
      const body = { name: patName.trim(), kana: patKana, phone: patPhone.trim(), birth_date: patBirth || null, gender: patGender || null, contraindications: patContra || null }
      if (selectedPatientId) await client.put(`/patients/${selectedPatientId}`, body)
      else await client.post('/patients', body)
    } catch { } finally { setSavingPatient(false) }
  }

  // カルテ生成
  async function handleGenerateRecord() {
    if (!kartePatientId) return
    setGenerating(true); setSoapS(''); setSoapO(''); setSoapA(''); setSoapP(''); setNextSuggestion(null); setCorrectionDone(false)
    try {
      let res
      if (inputMode === '音声' && voiceFile) {
        const formData = new FormData()
        formData.append('file', voiceFile)
        formData.append('patient_id', String(kartePatientId))
        res = await client.post<TreatmentRecord>('/records/generate/voice', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        res = await client.post<TreatmentRecord>('/records/generate', { patient_id: kartePatientId, memo: recordMemo })
      }
      setSoapS(res.data.soap_subjective); setSoapO(res.data.soap_objective)
      setSoapA(res.data.soap_assessment); setSoapP(res.data.soap_plan)
      setNextSuggestion(res.data.next_suggestion ?? null)
      setGeneratedRecordId(res.data.record_id)
    } catch { } finally { setGenerating(false) }
  }

  // カルテ修正
  async function handleCorrectRecord() {
    if (!generatedRecordId || !correctionReason.trim()) return
    setCorrecting(true)
    try {
      await client.patch(`/records/${generatedRecordId}`, {
        soap_subjective: soapS, soap_objective: soapO, soap_assessment: soapA, soap_plan: soapP,
        correction_reason: correctionReason,
      })
      setCorrectionDone(true); setCorrectionReason('')
      const histRes = await client.get<{ items: RecordRevision[] }>(`/records/${generatedRecordId}/history`)
      setRecordHistory(histRes.data.items ?? [])
    } catch { } finally { setCorrecting(false) }
  }

  // 空き枠取得（予約管理）
  async function handleLoadAvailableSlots() {
    setSlotsLoading(true)
    try {
      const params: Record<string, string> = {}
      if (apptDate) params.date = apptDate
      const res = await client.get<{ items: AvailableSlot[] }>('/appointments/available-slots', { params })
      setAvailableSlots(res.data.items ?? [])
    } catch { } finally { setSlotsLoading(false) }
  }

  // 予約一覧取得
  async function handleLoadAppointments() {
    setApptLoading(true)
    try {
      const params: Record<string, string> = {}
      if (apptDate) params.date = apptDate
      const res = await client.get<{ items: AppointmentRecord[] }>('/appointments', { params })
      setAppointmentGrid(res.data.items ?? [])
    } catch { } finally { setApptLoading(false) }
  }

  // 予約ステータス更新
  async function handleUpdateApptStatus(apptId: number) {
    const status = apptStatusUpdate[apptId]
    if (!status) return
    setUpdatingApptId(apptId)
    try {
      await client.patch(`/appointments/${apptId}/status`, { status })
      setAppointmentGrid(prev => prev.map(a => a.appointment_id === apptId ? { ...a, status: status as AppointmentRecord['status'] } : a))
    } catch { } finally { setUpdatingApptId(null) }
  }

  // 月次統計取得
  async function handleLoadStats() {
    if (!statsMonth) return
    setStatsLoading(true)
    try {
      const res = await client.get<MonthlyStats>('/stats/monthly', { params: { year_month: statsMonth } })
      setMonthlyStats(res.data)
    } catch { } finally { setStatsLoading(false) }
  }

  // バックアップ実行
  async function handleRunBackup() {
    setBackupRunning(true)
    try {
      await client.post('/backup/run')
      handleLoadBackupHistory()
    } catch { } finally { setBackupRunning(false) }
  }

  // バックアップ履歴取得
  async function handleLoadBackupHistory() {
    setBackupHistLoading(true)
    try {
      const res = await client.get<{ items: BackupLog[] }>('/backup/history')
      setBackupHistory(res.data.items ?? [])
    } catch { } finally { setBackupHistLoading(false) }
  }

  // 院内予約：空き枠取得
  async function handleLoadBookingSlots() {
    setBookingSlotsLoading(true)
    try {
      const res = await client.get<{ items: AvailableSlot[] }>('/appointments/available-slots', { params: { menu: bookingMenu } })
      setBookingSlots(res.data.items ?? [])
    } catch { } finally { setBookingSlotsLoading(false) }
  }

  // 院内予約：確定
  async function handleBookingConfirm() {
    if (!selectedSlot) return
    setBookingConfirming(true); setBookingNo(null)
    try {
      const body: Record<string, unknown> = { appointment_datetime: selectedSlot, menu: bookingMenu }
      if (newOrReturning === '再診') {
        body.patient_id = Number(bookingPatientId)
        body.verify_birth_date = verifyBirth || null
        body.verify_phone_last4 = verifyPhone4 || null
      }
      const res = await client.post<{ confirmation_no: string }>('/appointments', body)
      setBookingNo(res.data.confirmation_no)
    } catch { } finally { setBookingConfirming(false) }
  }

  // ============================================================
  // 画面レンダリング
  // ============================================================
  return (
    <div style={{ maxWidth: 1040 }}>
      <h2 style={{ color: COLOR.text, marginBottom: 4 }}>System05</h2>
      <p style={{ color: COLOR.muted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        個人経営整体院向け 院内電子カルテシステム
        <span style={{ marginLeft: 10, fontSize: '0.8rem', background: COLOR.warn, color: '#fff', borderRadius: 4, padding: '2px 8px' }}>
          院内専用・ローカル運用
        </span>
      </p>

      {/* 画面タブナビゲーション（基本設計書 セクション10） */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem', borderBottom: `2px solid ${COLOR.border}`, paddingBottom: 8, flexWrap: 'wrap' }}>
        {(['患者一覧画面', '患者登録・詳細画面', 'カルテ生成画面', '予約管理・統計画面', '院内予約受付画面'] as Screen[]).map(s => (
          <button key={s} onClick={() => {
            setScreen(s)
            if (s === '予約管理・統計画面') { handleLoadAppointments(); handleLoadBackupHistory() }
          }}
            style={{ ...btn(screen === s ? COLOR.primary : '#ccc'), fontSize: '0.8rem' }}
          >{s}</button>
        ))}
      </div>

      {/* ========== 患者一覧画面 ========== */}
      {screen === '患者一覧画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>患者一覧画面</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
              <div><span style={lbl()}>氏名</span><input type="text" style={field()} value={searchName} onChange={e => setSearchName(e.target.value)} placeholder="山田 太郎" /></div>
              <div><span style={lbl()}>電話番号</span><input type="text" style={field()} value={searchPhone} onChange={e => setSearchPhone(e.target.value)} placeholder="090-XXXX-XXXX" /></div>
              <div><span style={lbl()}>来院回数（以上）</span><input type="number" style={field()} value={searchVisitMin} onChange={e => setSearchVisitMin(e.target.value)} min={0} placeholder="0" /></div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSearchPatients} disabled={listLoading} style={btn(COLOR.primary, listLoading)}>{listLoading ? '検索中...' : '検索'}</button>
              <button onClick={() => { setSelectedPatientId(null); setPatName(''); setPatKana(''); setPatPhone(''); setPatBirth(''); setPatGender(''); setPatContra(''); setRecentRecords([]); setPatAppointments([]); setScreen('患者登録・詳細画面') }} style={btn(COLOR.ok)}>新規患者登録</button>
            </div>
          </div>
          {patientList.length > 0 && (
            <div style={card()}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead><tr style={{ background: '#f0f0f0' }}>{['患者ID', '氏名', '電話番号', '来院回数', '最終来院日', ''].map(h => (
                  <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                ))}</tr></thead>
                <tbody>{patientList.map(p => (
                  <tr key={p.patient_id}>
                    <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{p.patient_id}</td>
                    <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, fontWeight: 'bold' }}>{p.name}</td>
                    <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{p.phone}</td>
                    <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, textAlign: 'center' }}>{p.visit_count}</td>
                    <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{p.last_visit_date?.slice(0, 10) ?? '—'}</td>
                    <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                      <button onClick={() => handleSelectPatient(p)} style={{ ...btn(COLOR.primary), fontSize: '0.78rem', padding: '2px 10px' }}>詳細</button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========== 患者登録・詳細画面 ========== */}
      {screen === '患者登録・詳細画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>{selectedPatientId ? `患者詳細（ID: ${selectedPatientId}）` : '新規患者登録'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div><span style={lbl()}>氏名 ＊</span><input type="text" style={field()} value={patName} onChange={e => setPatName(e.target.value)} placeholder="山田 太郎" /></div>
              <div><span style={lbl()}>ふりがな</span><input type="text" style={field()} value={patKana} onChange={e => setPatKana(e.target.value)} placeholder="やまだ たろう" /></div>
              <div><span style={lbl()}>電話番号 ＊</span><input type="text" style={field()} value={patPhone} onChange={e => setPatPhone(e.target.value)} placeholder="090-XXXX-XXXX" /></div>
              <div><span style={lbl()}>生年月日</span><input type="date" style={field()} value={patBirth} onChange={e => setPatBirth(e.target.value)} /></div>
              <div><span style={lbl()}>性別</span><select style={field()} value={patGender} onChange={e => setPatGender(e.target.value)}><option value="">（未選択）</option><option value="男性">男性</option><option value="女性">女性</option><option value="その他">その他</option></select></div>
              <div style={{ gridColumn: '1 / -1' }}><span style={lbl()}>禁忌事項</span><textarea style={{ ...field(), minHeight: 70, resize: 'vertical' }} value={patContra} onChange={e => setPatContra(e.target.value)} placeholder="アレルギー、持病、禁忌施術など" /></div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSavePatient} disabled={!patName.trim() || !patPhone.trim() || savingPatient} style={btn(COLOR.primary, !patName.trim() || !patPhone.trim() || savingPatient)}>{savingPatient ? '保存中...' : '保存'}</button>
              {selectedPatientId && (
                <button onClick={() => { setKartePatientId(selectedPatientId); setScreen('カルテ生成画面') }} style={btn(COLOR.ok)}>カルテ生成へ</button>
              )}
            </div>
          </div>

          {/* 直近カルテ（基本設計書 14.2 recent_records） */}
          {recentRecords.length > 0 && (
            <div style={card()}>
              <h4 style={{ margin: '0 0 0.8rem', color: COLOR.text }}>直近カルテ</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead><tr style={{ background: '#f0f0f0' }}>{['施術日', 'S（主訴）', 'P（計画）', '次回提案'].map(h => (
                  <th key={h} style={{ padding: '4px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                ))}</tr></thead>
                <tbody>{recentRecords.slice(0, 5).map(r => (
                  <tr key={r.record_id}>
                    <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, whiteSpace: 'nowrap' }}>{r.treatment_date?.slice(0, 10)}</td>
                    <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, maxWidth: 200, color: COLOR.text }}>{r.soap_subjective}</td>
                    <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, maxWidth: 200, color: COLOR.muted }}>{r.soap_plan}</td>
                    <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.ok, fontSize: '0.78rem' }}>{r.next_suggestion ?? '—'}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          {/* 予約一覧（基本設計書 14.2 appointments_grid） */}
          {patAppointments.length > 0 && (
            <div style={card()}>
              <h4 style={{ margin: '0 0 0.8rem', color: COLOR.text }}>予約一覧</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead><tr style={{ background: '#f0f0f0' }}>{['日時', 'メニュー', 'ステータス', '確認番号'].map(h => (
                  <th key={h} style={{ padding: '4px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                ))}</tr></thead>
                <tbody>{patAppointments.map(a => (
                  <tr key={a.appointment_id}>
                    <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, whiteSpace: 'nowrap' }}>{a.appointment_datetime?.slice(0, 16).replace('T', ' ')}</td>
                    <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}>{a.menu}</td>
                    <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}><ApptStatusBadge value={a.status} /></td>
                    <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted }}>{a.confirmation_no ?? '—'}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========== カルテ生成画面 ========== */}
      {screen === 'カルテ生成画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>カルテ生成画面</h3>

            {/* 患者ID（基本設計書 14.3 patient_id） */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={lbl()}>対象患者ID</span>
              <input type="number" style={{ ...field(), maxWidth: 160 }} value={kartePatientId ?? ''} onChange={e => setKartePatientId(Number(e.target.value))} placeholder="患者IDを入力" />
            </div>

            {/* 入力方法（基本設計書 14.3 input_mode） */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={lbl()}>入力方法</span>
              <div style={{ display: 'flex', gap: 16 }}>
                {(['メモ', '音声'] as InputMode[]).map(m => (
                  <label key={m} style={{ cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input type="radio" name="input_mode" value={m} checked={inputMode === m} onChange={() => setInputMode(m)} />{m}
                  </label>
                ))}
              </div>
            </div>

            {/* 施術メモ or 音声ファイル（基本設計書 14.3 record_memo / voice_file） */}
            {inputMode === 'メモ' ? (
              <div style={{ marginBottom: '1rem' }}>
                <span style={lbl()}>施術メモ</span>
                <textarea style={{ ...field(), minHeight: 100, resize: 'vertical' }} value={recordMemo} onChange={e => setRecordMemo(e.target.value)} placeholder="施術内容・患者の訴え・所見などを自由に記入してください" />
              </div>
            ) : (
              <div style={{ marginBottom: '1rem' }}>
                <span style={lbl()}>音声ファイル（mp3・wav・m4a）</span>
                <input ref={voiceFileRef} type="file" accept=".mp3,.wav,.m4a" onChange={e => setVoiceFile(e.target.files?.[0] ?? null)} style={field()} />
              </div>
            )}

            <button onClick={handleGenerateRecord} disabled={!kartePatientId || (inputMode === 'メモ' ? !recordMemo.trim() : !voiceFile) || generating}
              style={btn(COLOR.primary, !kartePatientId || (inputMode === 'メモ' ? !recordMemo.trim() : !voiceFile) || generating)}>
              {generating ? 'カルテ生成中（最大60秒）...' : 'カルテ生成'}
            </button>
          </div>

          {/* SOAP 出力（基本設計書 14.3 soap_* / correction_reason） */}
          {(soapS || soapO || soapA || soapP) && (
            <div style={card()}>
              <h4 style={{ margin: '0 0 1rem', color: COLOR.ok }}>✓ SOAP 生成完了 — 確認・修正後に保存してください</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {[['S（主観的所見）', soapS, setSoapS], ['O（客観的所見）', soapO, setSoapO], ['A（評価）', soapA, setSoapA], ['P（治療計画）', soapP, setSoapP]].map(([label, value, setter]) => (
                  <div key={label as string}>
                    <span style={{ ...lbl(), color: COLOR.primary, fontWeight: 'bold' }}>{label as string}</span>
                    <textarea style={{ ...field(), minHeight: 80, resize: 'vertical' }} value={value as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
                  </div>
                ))}
              </div>

              {/* 修正理由（基本設計書 14.3 correction_reason） */}
              {generatedRecordId && (
                <div style={{ borderTop: `1px solid ${COLOR.border}`, paddingTop: '1rem' }}>
                  <span style={lbl()}>修正理由（カルテ修正時は必須）</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                    <textarea style={{ ...field(), minHeight: 50, resize: 'vertical', flex: 1 }} value={correctionReason} onChange={e => setCorrectionReason(e.target.value)} placeholder="修正内容の理由を入力してください" />
                    <button onClick={handleCorrectRecord} disabled={!correctionReason.trim() || correcting} style={btn(COLOR.warn, !correctionReason.trim() || correcting)}>{correcting ? '修正中...' : 'カルテ修正保存'}</button>
                  </div>
                  {correctionDone && <div style={{ color: COLOR.ok, fontSize: '0.85rem', marginTop: 6 }}>✓ 修正を保存しました</div>}
                </div>
              )}

              {/* 次回施術提案（基本設計書 14.3 next_suggestion） */}
              {nextSuggestion && (
                <div style={{ marginTop: '1rem', background: '#f0f8ff', borderRadius: 6, padding: '0.8rem' }}>
                  <div style={{ fontWeight: 'bold', color: COLOR.primary, marginBottom: 4, fontSize: '0.88rem' }}>💡 次回施術提案</div>
                  <div style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>{nextSuggestion}</div>
                </div>
              )}

              {/* 訂正履歴（基本設計書 14.3 record_history） */}
              {recordHistory.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <span style={lbl()}>訂正履歴</span>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead><tr style={{ background: '#f0f0f0' }}>{['修正日時', '修正者', '修正理由'].map(h => (
                      <th key={h} style={{ padding: '4px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}</tr></thead>
                    <tbody>{recordHistory.map(r => (
                      <tr key={r.revision_id}>
                        <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, whiteSpace: 'nowrap' }}>{r.corrected_at?.slice(0, 16).replace('T', ' ')}</td>
                        <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}>{r.corrected_by}</td>
                        <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted }}>{r.correction_reason}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========== 予約管理・統計画面 ========== */}
      {screen === '予約管理・統計画面' && (
        <div>
          {/* 空き枠・予約一覧（基本設計書 14.4） */}
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>予約管理・統計画面</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div><span style={lbl()}>予約日</span><input type="date" style={{ ...field(), width: 180 }} value={apptDate} onChange={e => setApptDate(e.target.value)} /></div>
              <button
                onClick={() => { handleLoadAvailableSlots(); handleLoadAppointments() }}
                disabled={slotsLoading || apptLoading}
                style={btn(COLOR.primary, slotsLoading || apptLoading)}
              >
                {slotsLoading || apptLoading ? '検索中...' : '検索'}
              </button>
            </div>

            {/* 空き枠（基本設計書 14.4 available_slots） */}
            {availableSlots.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={lbl()}>空き枠一覧</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {availableSlots.map((s, i) => (
                    <span key={i} style={{ background: '#e8f0fe', color: COLOR.primary, borderRadius: 4, padding: '3px 10px', fontSize: '0.82rem' }}>
                      {s.datetime?.slice(11, 16)} {s.menu}（残{s.remaining}枠）
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 予約一覧（基本設計書 14.4 appointment_grid / appointment_status） */}
            {appointmentGrid.length > 0 && (
              <div>
                <span style={lbl()}>予約一覧</span>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead><tr style={{ background: '#f0f0f0' }}>{['日時', '患者名', 'メニュー', 'ステータス', '確認番号', '状態更新', ''].map(h => (
                    <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                  ))}</tr></thead>
                  <tbody>{appointmentGrid.map(a => (
                    <tr key={a.appointment_id}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, whiteSpace: 'nowrap' }}>{a.appointment_datetime?.slice(0, 16).replace('T', ' ')}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, fontWeight: 'bold' }}>{a.patient_name}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{a.menu}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}><ApptStatusBadge value={a.status} /></td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted, fontSize: '0.78rem' }}>{a.confirmation_no ?? '—'}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <select style={{ ...field(), width: 110, fontSize: '0.78rem', padding: '2px 4px' }} value={apptStatusUpdate[a.appointment_id] ?? a.status} onChange={e => setApptStatusUpdate(prev => ({ ...prev, [a.appointment_id]: e.target.value }))}>
                          <option value="reserved">予約済</option><option value="completed">完了</option><option value="cancelled">キャンセル</option><option value="no_show">無断欠席</option>
                        </select>
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>
                        <button onClick={() => handleUpdateApptStatus(a.appointment_id)} disabled={updatingApptId === a.appointment_id} style={{ ...btn(COLOR.primary, updatingApptId === a.appointment_id), fontSize: '0.75rem', padding: '2px 8px' }}>更新</button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>

          {/* 月次統計（基本設計書 14.4 monthly_stats） */}
          <div style={card()}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div><span style={lbl()}>対象月（YYYY-MM）</span><input type="month" style={{ ...field(), width: 180 }} value={statsMonth} onChange={e => setStatsMonth(e.target.value)} /></div>
              <button onClick={handleLoadStats} disabled={!statsMonth || statsLoading} style={btn(COLOR.primary, !statsMonth || statsLoading)}>{statsLoading ? '集計中...' : '月次統計取得'}</button>
            </div>
            {monthlyStats && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '1rem' }}>
                  {[['総来院数', monthlyStats.total_visits, COLOR.primary], ['売上合計', `¥${monthlyStats.total_revenue.toLocaleString()}`, COLOR.ok], ['新患', monthlyStats.new_patients, COLOR.warn], ['再来院', monthlyStats.returning_patients, COLOR.text]].map(([label, value, color]) => (
                    <div key={label as string} style={{ textAlign: 'center', padding: '0.8rem', background: '#f8f8f2', borderRadius: 6 }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: color as string }}>{value as string | number}</div>
                      <div style={{ fontSize: '0.78rem', color: COLOR.muted, marginTop: 2 }}>{label as string}</div>
                    </div>
                  ))}
                </div>
                {monthlyStats.top_menus.length > 0 && (
                  <div>
                    <span style={lbl()}>人気メニュー</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {monthlyStats.top_menus.map((m, i) => (
                        <span key={i} style={{ background: '#e8f0fe', color: COLOR.primary, borderRadius: 4, padding: '3px 10px', fontSize: '0.82rem' }}>{m.menu}（{m.count}件）</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* バックアップ（基本設計書 14.4 run_backup / backup_history） */}
          <div style={card()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, color: COLOR.text }}>バックアップ</h4>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleRunBackup} disabled={backupRunning} style={btn(COLOR.danger, backupRunning)}>{backupRunning ? 'バックアップ実行中...' : '手動バックアップ実行'}</button>
                <button onClick={handleLoadBackupHistory} disabled={backupHistLoading} style={{ ...btn('#6c6f85', backupHistLoading), fontSize: '0.85rem' }}>{backupHistLoading ? '読込中...' : '履歴更新'}</button>
              </div>
            </div>
            {backupHistory.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead><tr style={{ background: '#f0f0f0' }}>{['実行日時', '結果', 'ファイルサイズ', '保存先'].map(h => (
                  <th key={h} style={{ padding: '4px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                ))}</tr></thead>
                <tbody>{backupHistory.map(b => (
                  <tr key={b.backup_id}>
                    <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, whiteSpace: 'nowrap' }}>{b.executed_at?.slice(0, 16).replace('T', ' ')}</td>
                    <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}><span style={{ background: b.result === 'success' ? COLOR.ok : COLOR.danger, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem' }}>{b.result === 'success' ? '成功' : '失敗'}</span></td>
                    <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}` }}>{b.file_size_mb != null ? `${b.file_size_mb.toFixed(1)} MB` : '—'}</td>
                    <td style={{ padding: '4px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted, fontSize: '0.78rem' }}>{b.file_path}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ========== 院内予約受付画面 ========== */}
      {screen === '院内予約受付画面' && (
        <div>
          <div style={{ ...card(), borderColor: COLOR.primary }}>
            <h3 style={{ margin: '0 0 0.5rem', color: COLOR.primary }}>院内予約受付画面</h3>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: COLOR.muted }}>患者向け端末専用 — この画面では予約登録のみ行えます</p>

            {/* 初回/再診（基本設計書 14.5 new_or_returning） */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={lbl()}>初回 / 再診</span>
              <div style={{ display: 'flex', gap: 12 }}>
                {(['初回', '再診'] as ('初回' | '再診')[]).map(m => (
                  <label key={m} style={{ cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input type="radio" name="new_or_returning" value={m} checked={newOrReturning === m} onChange={() => { setNewOrReturning(m); setBookingNo(null) }} />{m}
                  </label>
                ))}
              </div>
            </div>

            {/* 本人確認（再診時）（基本設計書 14.5 patient_id / verify_birth_date / verify_phone_last4） */}
            {newOrReturning === '再診' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                <div><span style={lbl()}>患者ID</span><input type="text" style={field()} value={bookingPatientId} onChange={e => setBookingPatientId(e.target.value)} placeholder="患者IDを入力" /></div>
                <div><span style={lbl()}>生年月日</span><input type="date" style={field()} value={verifyBirth} onChange={e => setVerifyBirth(e.target.value)} /></div>
                <div><span style={lbl()}>電話番号下4桁</span><input type="text" style={field()} value={verifyPhone4} onChange={e => setVerifyPhone4(e.target.value)} maxLength={4} placeholder="XXXX" /></div>
              </div>
            )}

            {/* 施術メニュー・空き枠（基本設計書 14.5 booking_menu / booking_slot） */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={lbl()}>施術メニュー</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <select style={{ ...field(), maxWidth: 240 }} value={bookingMenu} onChange={e => setBookingMenu(e.target.value)}>
                  <option value="">（選択してください）</option>
                  {['全身整体（60分）', '腰・背中集中（40分）', '首・肩集中（30分）', '全身整体（90分）'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <button onClick={handleLoadBookingSlots} disabled={!bookingMenu || bookingSlotsLoading} style={btn(COLOR.primary, !bookingMenu || bookingSlotsLoading)}>{bookingSlotsLoading ? '確認中...' : '空き枠確認'}</button>
              </div>
            </div>

            {bookingSlots.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={lbl()}>空き枠を選択してください</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                  {bookingSlots.map((s, i) => (
                    <button key={i} onClick={() => setSelectedSlot(s.datetime)} style={{
                      border: `2px solid ${selectedSlot === s.datetime ? COLOR.primary : COLOR.border}`,
                      background: selectedSlot === s.datetime ? '#e8f0fe' : '#fff',
                      borderRadius: 6, padding: '0.5rem', cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem',
                    }}>
                      <div style={{ fontWeight: 'bold', color: COLOR.text }}>{s.datetime?.slice(5, 16).replace('T', ' ')}</div>
                      <div style={{ fontSize: '0.78rem', color: COLOR.muted }}>残{s.remaining}枠</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 予約確定（基本設計書 14.5 booking_confirm / booking_no） */}
            <button onClick={handleBookingConfirm} disabled={!selectedSlot || !bookingMenu || bookingConfirming} style={btn(COLOR.ok, !selectedSlot || !bookingMenu || bookingConfirming)}>
              {bookingConfirming ? '予約確定中...' : '予約確定'}
            </button>

            {bookingNo && (
              <div style={{ marginTop: '1.5rem', background: '#f0f8f0', border: `2px solid ${COLOR.ok}`, borderRadius: 8, padding: '1.2rem', textAlign: 'center' }}>
                <div style={{ color: COLOR.ok, fontWeight: 'bold', fontSize: '1rem', marginBottom: 6 }}>✓ 予約が確定しました</div>
                <div style={{ fontSize: '0.88rem', color: COLOR.muted, marginBottom: 4 }}>予約確認番号</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: COLOR.text, letterSpacing: 4 }}>{bookingNo}</div>
                <div style={{ fontSize: '0.82rem', color: COLOR.muted, marginTop: 8 }}>この番号をお控えください</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
