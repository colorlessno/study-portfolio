function render(shouldThrow) {
  try {
    if (shouldThrow) throw new Error('render error sample');
    panel.innerHTML = '<p>正常表示</p>';
  } catch (error) {
    panel.innerHTML = `<p>画面の一部でエラーが発生しました。</p><button onclick="location.reload()">再読み込み</button><pre>${error.message}</pre>`;
  }
}
ok.onclick = () => render(false);
boom.onclick = () => render(true);
render(false);
