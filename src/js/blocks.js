// Переключатель вариантов у каждого блока (для показа клиенту).
// Выбор хранится в адресе (?b_<ключ>=<вариант>), чтобы клиент мог прислать собранную страницу одной ссылкой.
export function blockSwitch(sec, key, opts, onChange, title = 'Вариант блока') {
  const qs = new URLSearchParams(location.search);
  let cur = qs.get('b_' + key) || opts[0].k;
  if (!opts.some(o => o.k == cur)) cur = opts[0].k;
  const bar = document.createElement('div');
  bar.className = 'bv';
  bar.innerHTML = `<span class="bv__t">${title}</span>${opts.map((o, i) => `<button type="button" data-k="${o.k}" title="${o.t}"><i>${i + 1}</i>${o.t}</button>`).join('')}`;
  sec.prepend(bar);
  const set = (k, init) => {
    cur = k; sec.dataset.bv = k;
    bar.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k == k));
    if (!init) { const u = new URL(location); u.searchParams.set('b_' + key, k); history.replaceState(null, '', u); }
    onChange(k, init);
  };
  bar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => set(b.dataset.k)));
  set(cur, true);
  return set;
}
