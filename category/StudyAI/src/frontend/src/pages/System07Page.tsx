import { useState, useRef, useEffect } from 'react'
import { createSystemClient } from '../api/client'

const client = createSystemClient('system07')

// ---- 型定義（基本設計書 IF仕様より） ----

type SearchMode = 'keyword' | 'vector' | 'hybrid'
type Importance = '高' | '中' | '低'

interface AutoTags {
  category: string
  sub_category: string
  document_type: string
  importance: Importance
  tags: string[]
  summary: string
}

interface DocumentRecord {
  document_id: number
  file_name: string
  category: string
  importance: Importance
  registered_at: string
  registered_by: string
  summary: string
  tags: string[]
  is_active: boolean
}

interface SimilarDocument {
  document_id: number
  file_name: string
  similarity_score: number
  summary: string
  tags: string[]
  registered_at: string
  registered_by: string
}

interface Tag {
  id: number
  name: string
  use_count: number
  is_active: boolean
}

interface AccessStat {
  document_id: number
  file_name: string
  view_count: number
  search_hit_count: number
}

interface UnusedDocument {
  document_id: number
  file_name: string
  category: string
  last_accessed_at: string | null
  registered_at: string
}

// ---- 画面種別（基本設計書 セクション10） ----
type Screen = '文書登録画面' | '文書一覧・詳細画面' | 'タグ管理・統計画面'

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

// ---- 重要度バッジ ----
function ImportanceBadge({ value }: { value: Importance }) {
  const colorMap: Record<Importance, string> = { 高: COLOR.danger, 中: COLOR.warn, 低: COLOR.ok }
  return (
    <span style={{ background: colorMap[value] ?? '#aaa', color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.78rem' }}>
      {value}
    </span>
  )
}

// ---- タグチップ ----
function TagChips({ tags }: { tags: string[] }) {
  return (
    <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {tags.map(t => (
        <span key={t} style={{ background: '#e8f0fe', color: COLOR.primary, borderRadius: 4, padding: '2px 6px', fontSize: '0.78rem' }}>
          {t}
        </span>
      ))}
    </span>
  )
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function System07Page() {
  const [screen, setScreen] = useState<Screen>('文書登録画面')

  // ---- 文書登録画面（基本設計書 14.1） ----
  const [docFile, setDocFile] = useState<File | null>(null)
  const [registeredBy, setRegisteredBy] = useState('user01')
  const [accessRoles, setAccessRoles] = useState<string[]>(['admin', 'member'])
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ document_id: number; auto_tags: AutoTags } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // ---- 文書一覧・詳細画面（基本設計書 14.2） ----
  const [keyword, setKeyword] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterTags, setFilterTags] = useState('')
  const [filterDocumentType, setFilterDocumentType] = useState('')
  const [filterImportance, setFilterImportance] = useState('')
  const [searchMode, setSearchMode] = useState<SearchMode>('hybrid')
  const [documentList, setDocumentList] = useState<DocumentRecord[]>([])
  const [listLoading, setListLoading] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null)
  const [similarDocuments, setSimilarDocuments] = useState<SimilarDocument[]>([])
  const [similarLoading, setSimilarLoading] = useState(false)

  // タグ編集（文書詳細から）
  const [editingTags, setEditingTags] = useState('')
  const [editingCategory, setEditingCategory] = useState('')
  const [tagUpdateResult, setTagUpdateResult] = useState<string | null>(null)

  // ---- タグ管理・統計画面（基本設計書 14.3） ----
  const [tagList, setTagList] = useState<Tag[]>([])
  const [mergeFrom, setMergeFrom] = useState('')
  const [mergeTo, setMergeTo] = useState('')
  const [merging, setMerging] = useState(false)
  const [accessStats, setAccessStats] = useState<AccessStat[]>([])
  const [unusedDocuments, setUnusedDocuments] = useState<UnusedDocument[]>([])
  const [statsLoading, setStatsLoading] = useState(false)

  // ---- 文書登録 ----
  async function handleUpload() {
    if (!docFile || !registeredBy) return
    setUploading(true)
    setUploadResult(null)
    try {
      const formData = new FormData()
      formData.append('file', docFile)
      formData.append('registered_by', registeredBy)
      formData.append('access_roles', JSON.stringify(accessRoles))
      const res = await client.post<{ document_id: number; auto_tags: AutoTags }>(
        '/documents',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setUploadResult(res.data)
      setDocFile(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch { /* 無視 */ } finally {
      setUploading(false)
    }
  }

  // ---- 文書一覧取得 ----
  async function handleSearch() {
    setListLoading(true)
    setSelectedDoc(null)
    setSimilarDocuments([])
    try {
      const params: Record<string, string> = { search_mode: searchMode }
      if (keyword) params.keyword = keyword
      if (filterCategory) params.category = filterCategory
      if (filterTags) params.tags = filterTags
      if (filterDocumentType) params.document_type = filterDocumentType
      if (filterImportance) params.importance = filterImportance
      const res = await client.get<{ items: DocumentRecord[] }>('/documents', { params })
      setDocumentList(res.data.items ?? [])
    } catch { /* 無視 */ } finally {
      setListLoading(false)
    }
  }

  // ---- 文書詳細選択 → 類似文書取得 ----
  async function handleSelectDoc(doc: DocumentRecord) {
    setSelectedDoc(doc)
    setEditingTags(doc.tags.join(', '))
    setEditingCategory(doc.category)
    setTagUpdateResult(null)
    setSimilarLoading(true)
    setSimilarDocuments([])
    try {
      const res = await client.get<{ similar_documents: SimilarDocument[] }>(
        `/documents/${doc.document_id}/similar`
      )
      setSimilarDocuments(res.data.similar_documents ?? [])
    } catch { /* 無視 */ } finally {
      setSimilarLoading(false)
    }
  }

  // ---- タグ更新 ----
  async function handleUpdateTags() {
    if (!selectedDoc) return
    try {
      const tags = editingTags.split(',').map(t => t.trim()).filter(Boolean)
      await client.put(`/documents/${selectedDoc.document_id}/tags`, {
        tags,
        category: editingCategory,
      })
      setTagUpdateResult('更新しました')
      handleSearch()
    } catch { /* 無視 */ }
  }

  // ---- タグ管理・統計データ取得 ----
  async function handleLoadTagStats() {
    setStatsLoading(true)
    try {
      const [tagsRes, statsRes, unusedRes] = await Promise.all([
        client.get<{ items: Tag[] }>('/tags'),
        client.get<{ items: AccessStat[] }>('/stats/access'),
        client.get<{ items: UnusedDocument[] }>('/stats/unused-documents'),
      ])
      setTagList(tagsRes.data.items ?? [])
      setAccessStats(statsRes.data.items ?? [])
      setUnusedDocuments(unusedRes.data.items ?? [])
    } catch { /* 無視 */ } finally {
      setStatsLoading(false)
    }
  }

  // ---- タグ統合 ----
  async function handleMergeTags() {
    if (!mergeFrom || !mergeTo) return
    setMerging(true)
    try {
      await client.post('/tags/merge', {
        source_tags: [mergeFrom],
        target_tag: mergeTo,
      })
      setMergeFrom('')
      setMergeTo('')
      handleLoadTagStats()
    } catch { /* 無視 */ } finally {
      setMerging(false)
    }
  }

  useEffect(() => {
    if (screen === 'タグ管理・統計画面') handleLoadTagStats()
    if (screen === '文書一覧・詳細画面') handleSearch()
  }, [screen])

  // ============================================================
  // 画面レンダリング
  // ============================================================
  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ color: COLOR.text, marginBottom: 4 }}>System07</h2>
      <p style={{ color: COLOR.muted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        プロジェクト内ドキュメント 自動タグ付け＆類似ドキュメント推薦システム
      </p>

      {/* 画面タブナビゲーション（基本設計書 セクション10） */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', borderBottom: `2px solid ${COLOR.border}`, paddingBottom: 8 }}>
        {(['文書登録画面', '文書一覧・詳細画面', 'タグ管理・統計画面'] as Screen[]).map(s => (
          <button
            key={s}
            onClick={() => setScreen(s)}
            style={{ ...btn(screen === s ? COLOR.primary : '#ccc'), fontSize: '0.85rem' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ========== 文書登録画面 ========== */}
      {screen === '文書登録画面' && (
        <div>
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>文書登録画面</h3>

            {/* 基本設計書 14.1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={lbl()}>文書ファイル（PDF・docx・txt・md・xlsx）</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.md,.xlsx"
                  onChange={e => setDocFile(e.target.files?.[0] ?? null)}
                  style={field()}
                />
              </div>
              <div>
                <span style={lbl()}>登録者</span>
                <input
                  type="text"
                  style={field()}
                  value={registeredBy}
                  onChange={e => setRegisteredBy(e.target.value)}
                  placeholder="ユーザーID"
                />
              </div>
              <div>
                <span style={lbl()}>閲覧権限（複数選択）</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['admin', 'member', 'viewer'].map(role => (
                    <label key={role} style={{ cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <input
                        type="checkbox"
                        checked={accessRoles.includes(role)}
                        onChange={e => {
                          if (e.target.checked) setAccessRoles(r => [...r, role])
                          else setAccessRoles(r => r.filter(x => x !== role))
                        }}
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!docFile || !registeredBy || uploading}
              style={btn(COLOR.primary, !docFile || !registeredBy || uploading)}
            >
              {uploading ? '登録中（自動タグ付け実行中）...' : '登録'}
            </button>
          </div>

          {/* 自動タグ結果・要約（基本設計書 14.1 auto_tags / summary） */}
          {uploadResult && (
            <div style={card()}>
              <h4 style={{ margin: '0 0 1rem', color: COLOR.ok }}>✓ 登録完了 — 文書ID: {uploadResult.document_id}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={lbl()}>カテゴリ</span>
                  <span style={{ fontSize: '0.9rem' }}>{uploadResult.auto_tags.category}</span>
                </div>
                <div>
                  <span style={lbl()}>サブカテゴリ</span>
                  <span style={{ fontSize: '0.9rem' }}>{uploadResult.auto_tags.sub_category}</span>
                </div>
                <div>
                  <span style={lbl()}>ドキュメント種別</span>
                  <span style={{ fontSize: '0.9rem' }}>{uploadResult.auto_tags.document_type}</span>
                </div>
                <div>
                  <span style={lbl()}>重要度</span>
                  <ImportanceBadge value={uploadResult.auto_tags.importance} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <span style={lbl()}>自動タグ結果</span>
                <TagChips tags={uploadResult.auto_tags.tags} />
              </div>
              <div>
                <span style={lbl()}>要約</span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: COLOR.text, lineHeight: 1.6 }}>
                  {uploadResult.auto_tags.summary}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========== 文書一覧・詳細画面 ========== */}
      {screen === '文書一覧・詳細画面' && (
        <div>
          {/* 検索条件（基本設計書 14.2） */}
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>文書一覧・詳細画面</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={lbl()}>キーワード</span>
                <input type="text" style={field()} value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="キーワード検索" />
              </div>
              <div>
                <span style={lbl()}>カテゴリ</span>
                <select style={field()} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="">（すべて）</option>
                  {['技術', '設計', '進捗管理', 'テスト', '運用', '顧客調整', 'その他'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <span style={lbl()}>タグ（カンマ区切り）</span>
                <input type="text" style={field()} value={filterTags} onChange={e => setFilterTags(e.target.value)} placeholder="API設計,DB設計" />
              </div>
              <div>
                <span style={lbl()}>文書種別</span>
                <input type="text" style={field()} value={filterDocumentType} onChange={e => setFilterDocumentType(e.target.value)} placeholder="仕様書" />
              </div>
              <div>
                <span style={lbl()}>重要度</span>
                <select style={field()} value={filterImportance} onChange={e => setFilterImportance(e.target.value)}>
                  <option value="">（すべて）</option>
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>
              </div>
              <div>
                <span style={lbl()}>検索モード</span>
                <div style={{ display: 'flex', gap: 12, paddingTop: 6 }}>
                  {(['keyword', 'vector', 'hybrid'] as SearchMode[]).map(m => (
                    <label key={m} style={{ cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <input type="radio" name="search_mode" value={m} checked={searchMode === m} onChange={() => setSearchMode(m)} />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleSearch} disabled={listLoading} style={btn(COLOR.primary, listLoading)}>
              {listLoading ? '検索中...' : '検索'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selectedDoc ? '1fr 1fr' : '1fr', gap: '1rem' }}>
            {/* 文書一覧（基本設計書 14.2 document_grid） */}
            <div style={card()}>
              <h4 style={{ margin: '0 0 1rem', color: COLOR.text }}>文書一覧</h4>
              {documentList.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                      {['文書ID', 'ファイル名', 'カテゴリ', '重要度', '登録日', ''].map(h => (
                        <th key={h} style={{ padding: '5px 6px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {documentList.map(doc => (
                      <tr key={doc.document_id} style={{ background: selectedDoc?.document_id === doc.document_id ? '#f0f4ff' : undefined }}>
                        <td style={{ padding: '5px 6px', border: `1px solid ${COLOR.border}` }}>{doc.document_id}</td>
                        <td style={{ padding: '5px 6px', border: `1px solid ${COLOR.border}` }}>{doc.file_name}</td>
                        <td style={{ padding: '5px 6px', border: `1px solid ${COLOR.border}` }}>{doc.category}</td>
                        <td style={{ padding: '5px 6px', border: `1px solid ${COLOR.border}` }}>
                          <ImportanceBadge value={doc.importance} />
                        </td>
                        <td style={{ padding: '5px 6px', border: `1px solid ${COLOR.border}` }}>{doc.registered_at?.slice(0, 10) ?? '—'}</td>
                        <td style={{ padding: '5px 6px', border: `1px solid ${COLOR.border}` }}>
                          <button
                            onClick={() => handleSelectDoc(doc)}
                            style={{ ...btn(COLOR.primary), fontSize: '0.78rem', padding: '2px 8px' }}
                          >
                            詳細
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                !listLoading && <div style={{ color: COLOR.muted, fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>該当する文書がありません</div>
              )}
            </div>

            {/* 文書詳細 + 類似文書一覧（基本設計書 14.2 similar_documents） */}
            {selectedDoc && (
              <div>
                <div style={card()}>
                  <h4 style={{ margin: '0 0 0.8rem', color: COLOR.text }}>詳細 — {selectedDoc.file_name}</h4>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <span style={lbl()}>要約</span>
                    <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6 }}>{selectedDoc.summary || '—'}</p>
                  </div>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <span style={lbl()}>タグ</span>
                    <TagChips tags={selectedDoc.tags ?? []} />
                  </div>

                  {/* タグ編集（基本設計書 14.3 tags_editor） */}
                  <div style={{ borderTop: `1px solid ${COLOR.border}`, paddingTop: '0.8rem', marginTop: '0.8rem' }}>
                    <span style={lbl()}>タグ編集（PUT /documents/:document_id/tags）</span>
                    <input
                      type="text"
                      style={{ ...field(), marginBottom: 6 }}
                      value={editingTags}
                      onChange={e => setEditingTags(e.target.value)}
                      placeholder="タグをカンマ区切りで入力"
                    />
                    <input
                      type="text"
                      style={{ ...field(), marginBottom: 8 }}
                      value={editingCategory}
                      onChange={e => setEditingCategory(e.target.value)}
                      placeholder="カテゴリ"
                    />
                    <button onClick={handleUpdateTags} style={btn(COLOR.primary)}>タグ更新</button>
                    {tagUpdateResult && <span style={{ marginLeft: 10, color: COLOR.ok, fontSize: '0.85rem' }}>✓ {tagUpdateResult}</span>}
                  </div>
                </div>

                {/* 類似文書一覧 */}
                <div style={card()}>
                  <h4 style={{ margin: '0 0 0.8rem', color: COLOR.text }}>類似文書一覧</h4>
                  {similarLoading ? (
                    <div style={{ color: COLOR.muted, fontSize: '0.9rem' }}>検索中...</div>
                  ) : similarDocuments.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                          {['ファイル名', '類似度', '要約', 'タグ'].map(h => (
                            <th key={h} style={{ padding: '5px 6px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {similarDocuments.map(s => (
                          <tr key={s.document_id}>
                            <td style={{ padding: '5px 6px', border: `1px solid ${COLOR.border}` }}>{s.file_name}</td>
                            <td style={{ padding: '5px 6px', border: `1px solid ${COLOR.border}` }}>
                              <span style={{ color: s.similarity_score >= 0.8 ? COLOR.ok : COLOR.muted }}>
                                {s.similarity_score.toFixed(2)}
                              </span>
                            </td>
                            <td style={{ padding: '5px 6px', border: `1px solid ${COLOR.border}`, color: COLOR.muted }}>{s.summary}</td>
                            <td style={{ padding: '5px 6px', border: `1px solid ${COLOR.border}` }}><TagChips tags={s.tags ?? []} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ color: COLOR.muted, fontSize: '0.9rem' }}>類似文書が見つかりません</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== タグ管理・統計画面 ========== */}
      {screen === 'タグ管理・統計画面' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={handleLoadTagStats} style={{ ...btn('#6c6f85'), fontSize: '0.85rem' }}>
              {statsLoading ? '読込中...' : '更新'}
            </button>
          </div>

          {/* タグ統合（基本設計書 14.3 merge_from / merge_to） */}
          <div style={card()}>
            <h3 style={{ margin: '0 0 1rem', color: COLOR.text }}>タグ管理・統計画面</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.8rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div>
                <span style={lbl()}>統合元タグ</span>
                <select style={field()} value={mergeFrom} onChange={e => setMergeFrom(e.target.value)}>
                  <option value="">（選択）</option>
                  {tagList.filter(t => t.is_active).map(t => (
                    <option key={t.id} value={t.name}>{t.name}（{t.use_count}件）</option>
                  ))}
                </select>
              </div>
              <div>
                <span style={lbl()}>統合先タグ</span>
                <select style={field()} value={mergeTo} onChange={e => setMergeTo(e.target.value)}>
                  <option value="">（選択）</option>
                  {tagList.filter(t => t.is_active && t.name !== mergeFrom).map(t => (
                    <option key={t.id} value={t.name}>{t.name}（{t.use_count}件）</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleMergeTags}
                disabled={!mergeFrom || !mergeTo || merging}
                style={btn(COLOR.warn, !mergeFrom || !mergeTo || merging)}
              >
                {merging ? '統合中...' : 'タグ統合'}
              </button>
            </div>

            {/* タグ一覧 */}
            {tagList.length > 0 && (
              <div>
                <span style={lbl()}>タグ一覧（使用頻度順）</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {tagList.map(t => (
                    <span key={t.id} style={{
                      background: t.is_active ? '#e8f0fe' : '#f0f0f0',
                      color: t.is_active ? COLOR.primary : '#aaa',
                      borderRadius: 4, padding: '3px 8px', fontSize: '0.82rem',
                    }}>
                      {t.name}（{t.use_count}）
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* アクセス統計（基本設計書 14.3 access_stats_grid） */}
          <div style={card()}>
            <h4 style={{ margin: '0 0 1rem', color: COLOR.text }}>アクセス統計</h4>
            {accessStats.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['文書ID', 'ファイル名', '閲覧数', '検索ヒット数'].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {accessStats.map(s => (
                    <tr key={s.document_id}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{s.document_id}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{s.file_name}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{s.view_count}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{s.search_hit_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: COLOR.muted, fontSize: '0.9rem' }}>データがありません</div>
            )}
          </div>

          {/* 未活用文書一覧（基本設計書 14.3 unused_documents_grid） */}
          <div style={card()}>
            <h4 style={{ margin: '0 0 1rem', color: COLOR.text }}>未活用文書一覧</h4>
            {unusedDocuments.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['文書ID', 'ファイル名', 'カテゴリ', '最終アクセス日', '登録日'].map(h => (
                      <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: `1px solid ${COLOR.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {unusedDocuments.map(d => (
                    <tr key={d.document_id}>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{d.document_id}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{d.file_name}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{d.category}</td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, color: COLOR.muted }}>
                        {d.last_accessed_at?.slice(0, 10) ?? '未アクセス'}
                      </td>
                      <td style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}` }}>{d.registered_at?.slice(0, 10) ?? '—'}</td>
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
