const items = [{ id: 1, name: 'Alpha' }, { id: 2, name: 'Beta' }];
function render() {
  const hash = location.hash || '#/items';
  if (hash === '#/items') app.innerHTML = `<h1>一覧</h1>${items.map((i) => `<p><a href="#/items/${i.id}">${i.name}</a> <a href="#/items/${i.id}/edit">編集</a></p>`).join('')}`;
  else if (hash === '#/items/new') app.innerHTML = '<h1>新規作成</h1><p>create form placeholder</p>';
  else {
    const match = hash.match(/^#\/items\/(\d+)(\/edit)?$/);
    const item = match && items.find((v) => v.id === Number(match[1]));
    if (!item) app.innerHTML = '<h1>not found</h1>';
    else app.innerHTML = match[2] ? `<h1>編集 ${item.name}</h1>` : `<h1>詳細 ${item.name}</h1>`;
  }
}
addEventListener('hashchange', render);
render();
