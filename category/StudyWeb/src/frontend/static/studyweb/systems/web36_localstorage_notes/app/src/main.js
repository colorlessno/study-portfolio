const key = 'studyweb.web36.memo';
save.onclick = () => { localStorage.setItem(key, value.value); out.textContent = 'saved'; };
load.onclick = () => { out.textContent = localStorage.getItem(key) || '(empty)'; };
clear.onclick = () => { localStorage.removeItem(key); out.textContent = 'cleared'; };
