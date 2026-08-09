import { useMemo, useState } from "react";
import { FilterButtons } from "./components/FilterButtons";
import { TaskList } from "./components/TaskList";
import type { Filter, Task } from "./types";

const tasks: Task[] = [
  { id: "1", title: "HTMLの構造を確認する", done: true, dueDate: "Day 1" },
  { id: "2", title: "CSS Gridで一覧を並べる", done: false, dueDate: "Day 2" },
  { id: "3", title: "propsで子へデータを渡す", done: false, dueDate: "Day 3" },
  { id: "4", title: "stateで表示条件を切り替える", done: true, dueDate: "Day 3" },
];

export default function App() {
  const [filter, setFilter] = useState<Filter>("all");
  const filteredTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.done);
    }
    if (filter === "done") {
      return tasks.filter((task) => task.done);
    }
    return tasks;
  }, [filter]);

  return (
    <main className="app-shell">
      <p className="sample-label">web09_props_state_list</p>
      <h1>props / state / list 表示</h1>
      <FilterButtons currentFilter={filter} onChange={setFilter} />
      <TaskList tasks={filteredTasks} />
    </main>
  );
}
