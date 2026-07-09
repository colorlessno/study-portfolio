type Task = {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
};

async function fetchTasks(): Promise<Task[]> {
  return [
    { id: "1", title: "Server Componentで取得する", status: "done" },
    { id: "2", title: "初期HTMLにデータを含める", status: "doing" },
    { id: "3", title: "Client fetchとの違いをREADMEで確認", status: "todo" },
  ];
}

export default async function TasksPage() {
  const tasks = await fetchTasks();

  return (
    <main className="page">
      <p className="sample-label">web24_next_server_fetch</p>
      <h1>Server Component 一覧</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} <span>{task.status}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
