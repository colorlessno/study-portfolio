import { useState } from "react";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { List } from "./components/List";
import { Modal } from "./components/Modal";

const listItems = [
  { id: "html", label: "HTMLで構造を作る" },
  { id: "css", label: "CSSで見た目を整える" },
  { id: "react", label: "Reactで部品化する" },
];

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("ボタンを押すとここに結果が表示されます。");

  return (
    <main className="catalog-shell">
      <p className="sample-label">web08_component_catalog</p>
      <h1>Reactコンポーネントカタログ</h1>

      <section className="section">
        <h2>Button</h2>
        <div className="button-row">
          <Button onClick={() => setMessage("通常ボタンを押しました。")}>通常</Button>
          <Button variant="primary" onClick={() => setMessage("強調ボタンを押しました。")}>強調</Button>
          <Button disabled>無効</Button>
        </div>
        <p className="message">{message}</p>
      </section>

      <section className="grid section">
        <Card title="Card" description="タイトル、本文、操作を持つカードです。">
          <Button variant="primary" onClick={() => setModalOpen(true)}>Modalを開く</Button>
        </Card>
        <Card title="List" description="配列データをmapで一覧表示します。">
          <List items={listItems} />
        </Card>
      </section>

      <Modal open={modalOpen} title="Modal" onClose={() => setModalOpen(false)}>
        <p>open state によって表示と非表示を切り替えます。</p>
      </Modal>
    </main>
  );
}
