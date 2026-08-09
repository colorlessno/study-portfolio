check.onclick = () => {
  const lines = csv.value.trim().split(/\r?\n/);
  const header = lines.shift().split(',');
  const required = ['code', 'name', 'price'];
  const errors = [];
  required.forEach((c) => { if (!header.includes(c)) errors.push(`missing column ${c}`); });
  const rows = lines.map((line, index) => Object.fromEntries(header.map((h, i) => [h, line.split(',')[i] || ''])));
  rows.forEach((r, i) => { if (!r.code || !r.name || Number.isNaN(Number(r.price))) errors.push(`line ${i + 2}: invalid data`); });
  out.textContent = JSON.stringify({ preview: rows.slice(0, 3), success: errors.length === 0 ? rows.length : 0, errors }, null, 2);
};
