import { BarChart3, ClipboardList, Home, Settings } from "lucide-react";

const items = [
  { label: "Overview", active: true, icon: Home },
  { label: "Tasks", active: false, icon: ClipboardList },
  { label: "Reports", active: false, icon: BarChart3 },
  { label: "Settings", active: false, icon: Settings },
];

export function AppSidebar() {
  return (
    <aside className="border-r border-slate-200 bg-white p-4 lg:min-h-screen">
      <p className="mb-6 text-sm font-bold text-slate-500">web12_dashboard</p>
      <nav className="grid gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`flex min-h-10 items-center gap-3 rounded-md px-3 text-left text-sm font-bold ${
                item.active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
              type="button"
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
