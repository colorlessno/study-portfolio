export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">管理画面UIの基本構成を確認します。</p>
      </div>
      <button className="min-h-10 rounded-md bg-slate-900 px-4 text-sm font-bold text-white" type="button">
        Export
      </button>
    </header>
  );
}
