let order = { id: 1, status: 'draft', history: ['draft'] };
const allowed = { draft: ['confirmed', 'canceled'], confirmed: ['shipped', 'canceled'], shipped: ['completed'], completed: [], canceled: [] };
function render(message = '') { out.textContent = `${message}\nstatus=${order.status}\nhistory=${order.history.join(' -> ')}`; }
go.onclick = () => {
  const target = next.value;
  if (!allowed[order.status].includes(target)) return render(`業務エラー: ${order.status} -> ${target} は不可`);
  order.status = target; order.history.push(target); render('更新成功');
};
render();
