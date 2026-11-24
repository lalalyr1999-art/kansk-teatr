// «Люди театра» на главной: варианты блока (Обычный / Стена / Поклон / Кольца) и как открывается артист (окном / страницей).
// Переключатели — для заказчика; выбор в адресе (?b_lyudi=, ?b_open=), замечания — красными точками (review-notes.js).
import '../styles/lyudi-v.css';
import { people } from '../data/people.js';
import { FACE } from '../data/face.js';
import { slug, artistUrl } from '../data/people-util.js';
import { blockSwitch } from './blocks.js';
import { EV, MS, WS, picS, time } from './buy.js';
import { FACADE } from '../data/facade.js';

const sec = document.querySelector('#lyudi'); if (!sec) throw 0;
const $ = s => sec.querySelector(s);
const sur = p => p.name.split(' ').slice(-1)[0];
const P = [...people].sort((a, b) => sur(a).localeCompare(sur(b), 'ru'));
const nm = p => { const w = p.name.split(' '); return { first: w.slice(0, -1).join(' '), last: w.slice(-1)[0] }; };
const src = p => `/img/w/people/${p.f}.webp`;
const face = p => FACE[p.f] || [.5, .37];
const round = p => { const [x, y] = face(p); const oy = Math.max(0, Math.min(1, (y - .375) / .25)) * 100; return `object-position:50% ${oy.toFixed(0)}%;transform-origin:${x * 100}% ${(y * 100).toFixed(0)}%`; };
const rows = (list, pat) => { const out = []; let i = 0, k = 0; while (i < list.length) { const n = pat[k++ % pat.length]; out.push(list.slice(i, i + n)); i += n; } return out; };
const mob = () => innerWidth <= 600;
let variant = 'grid', openMode = 'win';

/* ===== переключатели ===== */
/* ===== Обычный: портреты уже нарисованы v12.js — делаем их кнопками ===== */
const grid = $('[data-people]');
const tagGrid = () => grid.querySelectorAll('.pp').forEach((f, i) => { f.dataset.i = i; f.tabIndex = 0; f.setAttribute('role', 'button'); f.setAttribute('aria-label', P[i].name); });
tagGrid();

/* ===== Стена ===== */
$('[data-a]').innerHTML = P.map((p, i) => { const n = nm(p), [x, y] = face(p); return `<figure class="lA__t" data-i="${i}" tabindex="0" role="button" aria-label="${p.name}"><img src="${src(p)}" alt="" loading="lazy" style="object-position:${x * 100}% ${y * 100 - 12}%"><figcaption><span>${n.first}</span><b>${n.last}</b></figcaption></figure>`; }).join('');

/* ===== Поклон ===== */
let ORDER = [];
const bow = $('[data-lyv="bow"]'), bBox = $('[data-b]'), bCap = $('[data-bcap]'), bN = $('[data-bn]'), stage = $('.lB__stage'), beam = $('.lB__beam');
function drawB() {
  const pat = mob() ? [5, 5, 5, 4, 4] : [8, 8, 7];
  let idx = 0; ORDER = [];
  rows(P, pat).forEach((r, ri) => { const ids = r.map((_, k) => idx + k); ORDER.push(...(ri % 2 ? ids.reverse() : ids)); idx += r.length; }); idx = 0;
  bBox.innerHTML = rows(P, pat).map((r, ri) => `<div class="lB__row">${r.map((p, k) => { const i = idx++, c = (k - (r.length - 1) / 2) / ((r.length - 1) / 2 || 1); return `<button type="button" class="lB__f" data-i="${i}" style="--c:${c.toFixed(2)};--d:${(i * .03).toFixed(2)}s" aria-label="${p.name}"><img src="${src(p)}" alt="" loading="lazy" style="${round(p)}"></button>`; }).join('')}</div>`).join('') + '<i class="lB__spot" aria-hidden="true"></i>';
}
bN.innerHTML = P.map((p, i) => `<span data-i="${i}" role="button" tabindex="0">${p.name}</span>`).join('<i> · </i>');
const hiB = i => { bBox.querySelectorAll('.lB__f').forEach(f => f.classList.toggle('on', +f.dataset.i === i)); bN.querySelectorAll('span').forEach(s => s.classList.toggle('on', +s.dataset.i === i)); bCap.textContent = i == null ? ' ' : P[i].name; bBox.classList.toggle('has', i != null); };
for (const box of [bBox, bN]) {
  box.addEventListener('pointerover', e => { return; if (mob()) return; const t = e.target.closest('[data-i]'); if (t) hiB(+t.dataset.i); });
  box.addEventListener('pointerleave', () => { if (!mob()) hiB(null); });
}
bBox.addEventListener('animationend', e => { if (e.animationName === 'bow') e.target.classList.add('done'); });
// телефон: прожектор идёт по лицам «змейкой» в такт листанию
let curI = -2;
function moveSpot(i) {
  const f = bBox.querySelector(`.lB__f[data-i="${i}"]`); if (!f) return;
  const bb = bBox.getBoundingClientRect(), fr = f.getBoundingClientRect(), sr = stage.getBoundingClientRect();
  const cx = fr.left + fr.width / 2, cy = fr.top + fr.height / 2;
  bBox.querySelector('.lB__spot').style.transform = `translate(${cx - bb.left}px, ${cy - bb.top}px)`;
  const x0 = sr.left + sr.width / 2, y0 = sr.top, dx = cx - x0, dy = cy - y0;
  beam.style.height = Math.hypot(dx, dy) + 'px'; beam.style.transform = `translateX(-50%) rotate(${(-Math.atan2(dx, dy) * 180 / Math.PI).toFixed(1)}deg)`;
}
function onScroll() {
  return; // прожектор отключён
  if (variant !== 'bow' || !mob()) return;
  const r = bow.getBoundingClientRect(), dist = bow.offsetHeight - innerHeight;
  const p = Math.max(0, Math.min(1, -r.top / dist)), OPEN = .04;
  const k = p < OPEN ? -1 : Math.min(P.length - 1, Math.floor((p - OPEN) / (1 - OPEN - .04) * P.length)), i = k < 0 ? -1 : ORDER[k];
  if (i === curI) return; curI = i;
  bow.classList.toggle('lit', i >= 0);
  if (i < 0) { hiB(null); return; }
  hiB(i); moveSpot(i);
}
addEventListener('scroll', onScroll, { passive: true });
new IntersectionObserver((es, o) => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); o.disconnect(); } }), { threshold: .15 }).observe(bow);

/* ===== Кольца ===== */
const cBox = $('[data-c]');
function drawC() {
  const pat = mob() ? [4, 3] : [5, 4]; // 5-4-5-4-5 = 23: ровные соты
  let idx = 0;
  cBox.innerHTML = rows(P, pat).map(r => `<div class="lC__row">${r.map(p => { const n = nm(p), i = idx++; return `<figure class="lC__p" data-i="${i}" tabindex="0" role="button" aria-label="${p.name}"><div class="lC__ph"><img src="${src(p)}" alt="" loading="lazy" style="${round(p)}"></div><figcaption><span>${n.first}</span><b>${n.last}</b></figcaption></figure>`; }).join('')}</div>`).join('');
}

let wasMob = null;
function setMode() {
  if (mob() !== wasMob) { wasMob = mob(); drawB(); drawC(); }
  bow.classList.remove('scrolly'); // «Поклон» простой: без прожектора и залипания if (mob()) bow.classList.add('in');
  curI = -2; onScroll();
}
addEventListener('resize', setMode);

/* ===== открыть артиста: окном или страницей ===== */
let going = false;
function go(i, el) {
  if (openMode === 'page') {
    if (going) return; going = true;
    const im = el?.querySelector('img'); if (im) im.style.viewTransitionName = 'artist';
    el?.classList.add('tap');
    setTimeout(() => { location.href = artistUrl(P[i]); }, mob() ? 320 : 100);
  } else openWin(i);
}
addEventListener('pageshow', () => { going = false; sec.querySelectorAll('.tap').forEach(f => f.classList.remove('tap')); });
sec.addEventListener('click', e => { const t = e.target.closest('[data-i]'); if (t && !e.target.closest('.bv')) { if (variant === 'bow') hiB(+t.dataset.i); go(+t.dataset.i, t); } });
sec.addEventListener('keydown', e => { if (e.key !== 'Enter' && e.key !== ' ') return; const t = e.target.closest('[data-i]'); if (t) { e.preventDefault(); go(+t.dataset.i, t); } });

/* окно артиста: по центру на компьютере, снизу почти во весь экран на телефоне; адрес ?a=… можно отправить ссылкой */
const win = document.createElement('div'); win.className = 'aw'; win.setAttribute('role', 'dialog'); win.setAttribute('aria-modal', 'true'); win.setAttribute('aria-labelledby', 'aw-n');
win.innerHTML = `<div class="aw__bg" data-x></div><article class="aw__card"><i class="aw__grab" aria-hidden="true"></i><button type="button" class="aw__x" data-x aria-label="Закрыть">×</button>
  <div class="aw__ph"><img alt=""></div>
  <div class="aw__tx"><p class="aw__k">Артист театра</p><h2 class="aw__n" id="aw-n"></h2><div class="aw__roles"></div>
    <h3 class="aw__h">Биография</h3><p class="aw__bio">Текст биографии пришлёт театр: где учился, с какого года в труппе, звания, награды, любимые роли.</p>
    <h3 class="aw__h">Ближайшие спектакли театра</h3><div class="aw__ev"></div>
    <div class="aw__nav"><button type="button" data-step="-1"><small>← Предыдущий</small><span></span></button><a class="aw__page" href="#">Страница артиста</a><button type="button" data-step="1"><small>Следующий →</small><span></span></button></div>
  </div></article>`;
document.body.appendChild(win);
let wi = 0, lastFocus = null;
function fillWin(i) {
  wi = (i + P.length) % P.length; const p = P[wi], [x, y] = face(p), im = win.querySelector('.aw__ph img'), w = p.name.split(' ');
  im.src = src(p); im.alt = p.name; im.style.objectPosition = `${x * 100}% ${y * 100 - 8}%`;
  win.querySelector('.aw__n').innerHTML = `${w.slice(0, -1).join(' ')} <i>${w.slice(-1)[0]}</i>`;
  const roles = (p.role || '').split(/;\s*/).filter(Boolean).map(r => r.split(' — '));
  win.querySelector('.aw__roles').innerHTML = roles.length ? `<h3 class="aw__h">Роли</h3><ul>${roles.map(([r, s]) => `<li><b>${r}</b>${s ? `<span>${s}</span>` : ''}</li>`).join('')}</ul>` : '';
  win.querySelector('.aw__ev').innerHTML = EV.slice(0, 3).map(e => { const d = new Date(e.date); return `<button type="button" class="aw__e" data-buy="${e.id}"><img src="${picS(e.img)}" alt="" loading="lazy"><span><b>${d.getDate()} ${MS[d.getMonth()]}</b> ${WS[d.getDay()]}, ${time(d)}</span><em>${e.title}</em><i>Билеты от ${e.price} ₽</i></button>`; }).join('');
  const [pb, nb] = win.querySelectorAll('[data-step]');
  pb.querySelector('span').textContent = P[(wi - 1 + P.length) % P.length].name; nb.querySelector('span').textContent = P[(wi + 1) % P.length].name;
  win.querySelector('.aw__page').href = artistUrl(p);
  win.querySelector('.aw__card').scrollTop = 0;
  const u = new URL(location); u.searchParams.set('a', slug(p)); history.replaceState(null, '', u);
}
function openWin(i) { lastFocus = document.activeElement; fillWin(i); win.classList.add('on'); document.documentElement.style.overflow = 'hidden'; setTimeout(() => win.querySelector('.aw__x').focus({ preventScroll: true }), 50); }
function closeWin() {
  win.classList.remove('on'); document.documentElement.style.overflow = ''; win.querySelector('.aw__card').style.transform = '';
  const u = new URL(location); u.searchParams.delete('a'); history.replaceState(null, '', u); lastFocus?.focus?.({ preventScroll: true });
}
win.addEventListener('click', e => { if (e.target.closest('[data-x]')) closeWin(); const st = e.target.closest('[data-step]'); if (st) fillWin(wi + +st.dataset.step); });
addEventListener('keydown', e => { if (!win.classList.contains('on') || document.querySelector('.sheet.on, .sheet.open')) return; if (e.key === 'Escape') closeWin(); if (e.key === 'ArrowRight') fillWin(wi + 1); if (e.key === 'ArrowLeft') fillWin(wi - 1); });
{ // свайп: вбок — соседний артист, вниз (с верха окна) — закрыть
  const card = win.querySelector('.aw__card'); let x0, y0, dy = 0, top0 = 0;
  card.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dy = 0; top0 = card.scrollTop; card.style.transition = 'none'; }, { passive: true });
  card.addEventListener('touchmove', e => { dy = e.touches[0].clientY - y0; if (top0 <= 0 && dy > 0 && dy > Math.abs(e.touches[0].clientX - x0) && mob()) card.style.transform = `translateY(${dy}px)`; }, { passive: true });
  card.addEventListener('touchend', e => { card.style.transition = ''; const dx = e.changedTouches[0].clientX - x0;
    if (top0 <= 0 && dy > 110 && mob()) return closeWin(); card.style.transform = '';
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) fillWin(wi + (dx < 0 ? 1 : -1)); });
}
// ссылка с ?a=… открывает окно сразу
{ const a = new URLSearchParams(location.search).get('a'), i = P.findIndex(p => slug(p) === a); if (i >= 0) setTimeout(() => openWin(i), 300); }

// подсказка под заголовком: что будет по нажатию (зависит от варианта и способа открытия)
function updHint() {
  const what = openMode === 'page' ? 'откроется страница артиста' : 'откроется карточка артиста';
  const lead = '';
  const badge = '';
  document.querySelectorAll('[data-lyhint]').forEach(h => { h.hidden = variant === 'bow'; h.innerHTML = `${badge}${lead}Нажмите на фото — ${what}: роли, биография и&nbsp;ближайшие спектакли с&nbsp;покупкой билета.`; });
}
addEventListener('resize', () => updHint());
/* задник «Поклона»: контур фасада театра из логотипа */
{ const f = $('.lB__facade'); if (f) { f.setAttribute('viewBox', `0 0 ${FACADE.w} ${FACADE.h}`); f.setAttribute('preserveAspectRatio', 'xMidYMax meet'); f.innerHTML = FACADE.d.map(d => `<path d="${d}"/>`).join(''); } }
/* сцена «Поклона»: рампа и пылинки в луче */
{ const lamps = $('.lB__lamps'); if (lamps) lamps.innerHTML = Array.from({ length: 13 }, (_, i) => `<i style="--k:${i}"></i>`).join('');
  const cv = $('.lB__dust'), ctx = cv && cv.getContext('2d');
  if (ctx && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let W = 0, H = 0, run = false, raf = 0; const dpr = Math.min(2, devicePixelRatio || 1);
    const pts = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), r: .5 + Math.random() * 1.4, vx: (Math.random() - .5) * .00012, vy: -.00006 - Math.random() * .00012, ph: Math.random() * 6.28 }));
    const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const frame = t => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx * 16; p.y += p.vy * 16; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); } if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        const inBeam = Math.max(0, 1 - Math.abs(p.x - .5) / (.12 + p.y * .32)); // ярче в конусе света сверху по центру
        const a = (.08 + inBeam * .5) * (.6 + .4 * Math.sin(t / 900 + p.ph));
        ctx.fillStyle = `rgba(255,228,190,${a.toFixed(3)})`; ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, 6.283); ctx.fill();
      }
      if (run) raf = requestAnimationFrame(frame);
    };
    new IntersectionObserver(([x]) => { const on = x.isIntersecting && variant === 'bow'; if (on && !run) { run = true; size(); raf = requestAnimationFrame(frame); } else if (!on) { run = false; cancelAnimationFrame(raf); } }).observe(cv);
    addEventListener('resize', () => run && size());
  }
}
let ready = false;
const lyo = document.createElement('div'); lyo.className = 'lyo';
blockSwitch(sec, 'lyudi', [{ k: 'grid', t: 'Обычный' }, { k: 'wall', t: 'Стена' }, { k: 'rings', t: 'Кольца' }] /* «Поклон» убран по решению Антона 24.11 */, k => { variant = k; if (ready) { setMode(); updHint(); } });
sec.querySelector('.bv').after(lyo);
blockSwitch(lyo, 'open', [{ k: 'win', t: 'Окном' }, { k: 'page', t: 'Отдельной страницей' }], k => { openMode = k; updHint(); }, 'Артист открывается');

ready = true;
setMode(); updHint();
