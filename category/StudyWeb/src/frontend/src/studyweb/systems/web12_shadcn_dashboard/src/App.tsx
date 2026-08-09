import { AppSidebar } from "./components/AppSidebar";
import { DataTable } from "./components/DataTable";
import { Header } from "./components/Header";
import { StatCard } from "./components/StatCard";

const stats = [
  { label: "Samples", value: "31", note: "planned web systems" },
  { label: "Completed", value: "12", note: "current UI checkpoint" },
  { label: "Pending", value: "19", note: "API and infra samples" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[240px_1fr]">
      <AppSidebar />
      <div>
        <Header />
        <main className="grid gap-5 p-5">
          <section className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </section>
          <DataTable />
        </main>
      </div>
    </div>
  );
}
