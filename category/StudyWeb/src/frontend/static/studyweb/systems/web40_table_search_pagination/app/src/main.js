const data = Array.from({ length: 17 }, (_, i) => ({ id: i + 1, name: `Item ${String.fromCharCode(65 + (i % 26))}${i}`, status: i % 2 ? 'open' : 'closed' }));
let page = 0, asc = true;
function render() {
  const keyword = q.value.toLowerCase();
  let list = data.filter((x) => x.name.toLowerCase().includes(keyword));
  list.sort((a, b) => asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  const size = 5, start = page * size, view = list.slice(start, start + size);
  info.textContent = `${list.length}件 page ${page + 1}`;
  rows.innerHTML = view.length ? view.map((x) => `<tr><td>${x.id}</td><td>${x.name}</td><td>${x.status}</td></tr>`).join('') : '<tr><td colspan="3">データなし</td></tr>';
}
q.oninput = () => { page = 0; render(); };
toggle.onclick = () => { asc = !asc; render(); };
prev.onclick = () => { page = Math.max(0, page - 1); render(); };
next.onclick = () => { page += 1; render(); };
render();
