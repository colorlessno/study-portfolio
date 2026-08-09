import { articles, tasks, users } from "./data/sampleData";
import type { Article } from "./models/article";
import type { Task } from "./models/task";
import type { User } from "./models/user";

function UserCard({ user }: { user: User }) {
  return (
    <article className="card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>role: {user.role}</p>
      {user.bio && <p>{user.bio}</p>}
    </article>
  );
}

function TaskList({ items }: { items: Task[] }) {
  return (
    <ul className="list">
      {items.map((task) => (
        <li key={task.id}>
          {task.title} <span>{task.status}</span>
        </li>
      ))}
    </ul>
  );
}

function ArticleList({ items }: { items: Article[] }) {
  return (
    <ul className="list">
      {items.map((article) => (
        <li key={article.id}>
          {article.title} <span>{article.published ? "published" : "draft"}</span>
          <p>{article.summary}</p>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <main className="app-shell">
      <p className="sample-label">web10_typescript_model</p>
      <h1>TypeScript型つきデータモデル</h1>

      <section>
        <h2>User</h2>
        <div className="grid">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </section>

      <section>
        <h2>Task</h2>
        <TaskList items={tasks} />
      </section>

      <section>
        <h2>Article</h2>
        <ArticleList items={articles} />
      </section>
    </main>
  );
}
