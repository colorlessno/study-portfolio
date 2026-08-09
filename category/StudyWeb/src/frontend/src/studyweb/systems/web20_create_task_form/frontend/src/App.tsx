import { FormEvent, useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:13020";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function loadTasks() {
    const response = await fetch(`${apiUrl}/tasks`);
    setTasks(await response.json());
  }

  useEffect(() => {
    loadTasks().catch((caught: Error) => setError(caught.message));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("タイトルを入力してください。");
      return;
    }

    const response = await fetch(`${apiUrl}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim() }),
    });

    if (!response.ok) {
      setError(`保存に失敗しました: HTTP ${response.status}`);
      return;
    }

    setTitle("");
    await loadTasks();
  }

  return (
    <main className="app-shell">
      <p className="sample-label">web20_create_task_form</p>
      <h1>画面からPOSTしてDB保存</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">タスクタイトル</label>
        <div className="form-row">
          <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <button type="submit">作成</button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </main>
  );
}
