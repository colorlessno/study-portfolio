type Row = {
  id: string;
  name: string;
  status: "active" | "pending" | "done";
  updatedAt: string;
};

const rows: Row[] = [
  { id: "001", name: "HTML structure review", status: "done", updatedAt: "2026-04-28" },
  { id: "002", name: "React component split", status: "active", updatedAt: "2026-04-28" },
  { id: "003", name: "API connection check", status: "pending", updatedAt: "2026-04-29" },
];

export function DataTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-200">
              <td className="px-4 py-3 font-mono">{row.id}</td>
              <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
              <td className="px-4 py-3">{row.status}</td>
              <td className="px-4 py-3 text-slate-500">{row.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
