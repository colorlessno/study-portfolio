import { FormClient } from "./FormClient";

export default function HomePage() {
  return (
    <main className="page">
      <p className="sample-label">web25_next_form_action</p>
      <h1>Next.js フォーム送信</h1>
      <FormClient />
      <p>Server Action は `app/actions.ts` に定義しています。</p>
    </main>
  );
}
