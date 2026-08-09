let record = { id: 1, name: 'Original', version: 1 };
let a = null, b = null;
function clone(x) { return JSON.parse(JSON.stringify(x)); }
function save(copy, label) {
  if (!copy) return `${label}: 未読込`;
  if (copy.version !== record.version) return `${label}: 409 conflict current=${record.version} yours=${copy.version}`;
  record = { ...copy, name: `${label} update`, version: record.version + 1 };
  return `${label}: saved version=${record.version}`;
}
function render(message = '') { out.textContent = `${message}\nrecord=${JSON.stringify(record)}\nA=${JSON.stringify(a)}\nB=${JSON.stringify(b)}`; }
loadA.onclick = () => { a = clone(record); render('A loaded'); };
loadB.onclick = () => { b = clone(record); render('B loaded'); };
saveA.onclick = () => render(save(a, 'A'));
saveB.onclick = () => render(save(b, 'B'));
render();
