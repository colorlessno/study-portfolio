import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page">
      <p className="sample-label">web24_next_server_fetch</p>
      <h1>Next.js サーバー側データ取得</h1>
      <Link href="/tasks">サーバー取得一覧を見る</Link>
    </main>
  );
}
