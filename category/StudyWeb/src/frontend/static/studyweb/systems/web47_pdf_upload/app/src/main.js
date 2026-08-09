file.onchange = async () => {
  const f = file.files[0];
  if (!f) return;
  const errors = [];
  if (!f.name.toLowerCase().endsWith('.pdf')) errors.push('extension must be .pdf');
  if (f.type && f.type !== 'application/pdf') errors.push(`unexpected type ${f.type}`);
  if (f.size > 1024 * 1024) errors.push('file too large for this sample');
  out.textContent = JSON.stringify({ name: f.name, size: f.size, type: f.type, errors }, null, 2);
};
