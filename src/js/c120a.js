// «Нам 120», набор A: 0 исходный спил с метками, 1 растёт при прокрутке, 2 ваше кольцо, 3 отсчёт до юбилея.
export function initSetA(root, { ScrollTrigger, CALM }) {
  const $ = (s, r = root) => r.querySelector(s), $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const cutS = $('[data-cutsec]'), cimg = $('[data-cutimg]'), spil = $('img', cimg);
  const R0 = .015, R1 = .43, Y0 = 1907, Y1 = 2027;
  const rOf = y => R0 + (y - Y0) / (Y1 - Y0) * (R1 - R0), yOf = r => Math.round(Y0 + (r - R0) / (R1 - R0) * (Y1 - Y0));
  const MK = [{ y: 1907, a: -30, t: '1907' }, { y: 1945, a: -60, t: '1945' }, { y: 2025, a: 20, t: 'Сегодня' }, { y: 2027, a: -125, t: '2027' }];
  cimg.insertAdjacentHTML('beforeend', MK.map((m, i) => { const r = rOf(m.y), x = 50 + r * 100 * Math.cos(m.a * Math.PI / 180), y = 50 + r * 100 * Math.sin(m.a * Math.PI / 180); return `<span class="mk" data-mk="${i}" style="left:${x}%;top:${y}%"><i></i><span>${m.t}</span></span>`; }).join(''));
  const lis = $$('[data-yrs] li'), mks = $$('[data-mk]');
  const setY = k => { lis.forEach((l, i) => l.classList.toggle('on', i <= k)); mks.forEach((m, i) => m.classList.toggle('on', i <= k)); };
  let V = 0, active = false;
  /* 0 — исходный: спил доворачивается при прокрутке, метки и годы загораются по очереди */
  const orig = p => { const k = Math.min(3, Math.floor(p * 4.4)); setY(k); const q = Math.min(1, p * 2); spil.style.transform = `rotate(${-25 * (1 - q)}deg) scale(${.85 + .15 * q})`; };
  /* 1 — спил растёт при прокрутке */
  const grow = p => {
    const y = Math.round(Y0 + p * (Y1 - Y0)), r = rOf(y);
    spil.style.clipPath = p >= 1 ? '' : `circle(${Math.max(4, (r + .05) * 100)}% at 50% 50%)`;
    $('[data-cyr]').textContent = y;
    setY(MK.reduce((k, m, i) => (y >= m.y ? i : k), 0));
  };
  const cutST = ScrollTrigger.create({ trigger: cutS, start: 'top top', end: 'bottom bottom', onUpdate: s => active && V == 1 && grow(s.progress) });
  const origST = ScrollTrigger.create({ trigger: cutS, start: 'top 85%', end: 'bottom 60%', onUpdate: s => active && V == 0 && orig(s.progress) });
  /* 2 — ваше кольцо */
  const myc = $('[data-myc]'), out = $('[data-myout]'), tip = $('[data-tip]');
  const ru = (n, a, b, c) => { const m = n % 10, h = n % 100; return m == 1 && h != 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };
  const showY = y => {
    y = Math.max(Y0, Math.min(2026, y)); const age = y - Y0, r = rOf(y), now = 2026 - y;
    myc.setAttribute('r', (r * 100).toFixed(2)); cimg.classList.add('pick');
    tip.textContent = y; tip.style.left = 50 + r * 70.7 + '%'; tip.style.top = 50 - r * 70.7 + '%';
    out.innerHTML = age == 0 ? '1907 — год, когда всё началось.' : `В ${y} году театру было <b>${age} ${ru(age, 'год', 'года', 'лет')}</b>. С тех пор у сосны — ещё ${now} ${ru(now, 'кольцо', 'кольца', 'колец')}, у нас — ${now} ${ru(now, 'сезон', 'сезона', 'сезонов')}.`;
  };
  cimg.addEventListener('pointermove', e => { if (V != 2) return; const b = cimg.getBoundingClientRect(); const r = Math.hypot(e.clientX - b.left - b.width / 2, e.clientY - b.top - b.height / 2) / b.width; if (r <= R1 + .01) showY(yOf(r)); });
  $('[data-my]').addEventListener('submit', e => { e.preventDefault(); const y = +$('input', $('[data-my]')).value; if (y >= Y0 && y <= 2026) showY(y); else out.textContent = 'Введите год от 1907 до 2026.'; });
  /* 3 — отсчёт до юбилея */
  const T = Date.parse('2027-04-05T00:00:00+07:00'), p2 = n => String(n).padStart(2, '0');
  const tick = () => { const d = Math.max(0, T - Date.now()) / 1000; $('[data-cdd]').textContent = Math.floor(d / 86400); $('[data-cdh]').textContent = p2(Math.floor(d % 86400 / 3600)); $('[data-cdm]').textContent = p2(Math.floor(d % 3600 / 60)); $('[data-cds]').textContent = p2(Math.floor(d % 60)); };
  let cdT;
  const setV = v => {
    V = v; active = true; cutS.className = 'cut v' + v;
    spil.style.clipPath = ''; spil.style.transform = ''; cimg.classList.remove('pick'); clearInterval(cdT);
    if (v == 2 || v == 3) setY(3);
    if (v == 3) { tick(); cdT = setInterval(tick, 1000); }
    ScrollTrigger.refresh();
    if (v == 1) grow(CALM ? 1 : cutST.progress);
    if (v == 0) CALM ? (setY(3), spil.style.transform = '') : orig(origST.progress);
  };
  const stop = () => { active = false; clearInterval(cdT); };
  return { setV, stop };
}
