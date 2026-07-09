import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:13026";

function App() {
  const [text, setText] = useState("読み込み中");

  useEffect(() => {
    Promise.all([fetch(`${apiUrl}/health`).then((r) => r.json()), fetch(`${apiUrl}/tasks`).then((r) => r.json())])
      .then(([health, tasks]) => setText(JSON.stringify({ health, tasks }, null, 2)))
      .catch((error: Error) => setText(error.message));
  }, []);

  return (
    <main>
      <p>web26_docker_compose_web_api_db</p>
      <h1>Web + API + DB</h1>
      <pre>{text}</pre>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
