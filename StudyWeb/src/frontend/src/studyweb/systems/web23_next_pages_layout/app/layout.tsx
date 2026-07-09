import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "web23 Next App Router",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="site-header">
          <strong>web23_next_pages_layout</strong>
          <nav>
            <Link href="/">Top</Link>
            <Link href="/about">About</Link>
            <Link href="/tasks">Tasks</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">App Router layout / page / Link の確認</footer>
      </body>
    </html>
  );
}
