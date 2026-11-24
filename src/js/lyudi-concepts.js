// Варианты блока «Люди театра»: А — стена, Б — поклон, В — кольца. Все 23 артиста сразу, без ролей.
import '@fontsource/onest/400.css'; import '@fontsource/onest/500.css'; import '@fontsource/onest/600.css';
import '@fontsource/playfair-display/400.css'; import '@fontsource/playfair-display/400-italic.css';
import { people } from '../data/people.js';
import { FACE } from '../data/face.js';
import { artistUrl } from '../data/people-util.js';

const $ = s => document.querySelector(s);
const sur = p => p.name.split(' ').slice(-1)[0];
const P = [...people].sort((a, b) => sur(a).localeCompare(sur(b), 'ru'));
const nm = p => { const w = p.name.split(' '); return { first: w.slice(0, -1).join(' '), last: w.slice(-1)[0] }; };
const src = p => `/img/w/people/${p.f}.webp`;
const face = p => FACE[p.f] || [.5, .37];
// круг из портрета 3:4: сдвиг по вертикали, чтобы лицо было в центре, и лёгкое приближение к лицу
const round = p => { const [x, y] = face(p); const oy = Math.max(0, Math.min(1, (y - .375) / .25)) * 100; return `object-position:50% ${oy.toFixed(0)}%;transform-origin:${x * 100}% ${(y * 100).toFixed(0)}%`; };
// ряды по шаблону ширины экрана
const rows = (list, pat) => { const out = []; let i = 0, k = 0; while (i < list.length) { const n = pat[k++ % pat.length]; out.push(list.slice(i, i + n)); i += n; } return out; };
const mob = () => innerWidth <= 600;

/* А · Стена */
$('[data-a]').innerHTML = P.map(p => { const n = nm(p), [x, y] = face(p); return `<figure class="lA__t"><img src="${src(p)}" alt="${p.name}" loading="lazy" style="object-position:${x * 100}% ${y * 100 - 12}%"><figcaption><span>${n.first}</span><b>${n.last}</b></figcaption></figure>`; }).join('');

/* Б · Поклон */
let ORDER = [];
const bBox = $('[data-b]'), bCap = $('[data-bcap]'), bN = $('[data-bn]');
function drawB() {
  const pat = mob() ? [5, 5, 5, 4, 4] : [8, 8, 7];
  let idx = 0;
  // порядок луча «змейкой»: ряд слева направо, следующий — справа налево
  ORDER = []; rows(P, pat).forEach((r, ri) => { const ids = r.map((_, k) => idx + k); ORDER.push(...(ri % 2 ? ids.reverse() : ids)); idx += r.length; }); idx = 0;
  bBox.innerHTML = rows(P, pat).map((r, ri) => `<div class="lB__row" style="--r:${ri}">${r.map((p, k) => { const i = idx++, c = (k - (r.length - 1) / 2) / ((r.length - 1) / 2 || 1); return `<button type="button" class="lB__f" data-i="${i}" style="--c:${c.toFixed(2)};--d:${(i * .03).toFixed(2)}s" aria-label="${p.name}"><img src="${src(p)}" alt="" loading="lazy" style="${round(p)}"></button>`; }).join('')}</div>`).join('') + '<i class="lB__spot" aria-hidden="true"></i>';
}
bN.innerHTML = P.map((p, i) => `<span data-i="${i}">${p.name}</span>`).join('<i> · </i>');
const hiB = i => { bBox.querySelectorAll('.lB__f').forEach(f => f.classList.toggle('on', +f.dataset.i === i)); bN.querySelectorAll('span').forEach(s => s.classList.toggle('on', +s.dataset.i === i)); bCap.textContent = i == null ? ' ' : P[i].name; bBox.classList.toggle('has', i != null); };
for (const box of [bBox, bN]) {
  box.addEventListener('pointerover', e => { if (mob()) return; const t = e.target.closest('[data-i]'); if (t) hiB(+t.dataset.i); });
  box.addEventListener('pointerleave', () => { if (!mob()) hiB(null); });
  box.addEventListener('click', e => { const t = e.target.closest('[data-i]'); if (t) goArtist(+t.dataset.i); });
}

/* касание: лицо загорается, имя видно — и плавно открывается страница артиста */
let going = false;
bBox.addEventListener('animationend', e => { if (e.animationName === 'bow') e.target.classList.add('done'); });
function goArtist(i) {
  if (going) return; going = true; stopTour(); hiB(i);
  const f = bBox.querySelector(`.lB__f[data-i="${i}"]`); f?.classList.add('tap');
  setTimeout(() => { const im = f?.querySelector('img'); if (im) im.style.viewTransitionName = 'artist'; location.href = artistUrl(P[i]); }, mob() ? 380 : 120);
}
addEventListener('pageshow', () => { going = false; bBox.querySelectorAll('.tap').forEach(f => f.classList.remove('tap')); hiB(null); });

/* телефон: занавес и прожектор управляются листанием (наведения на телефоне нет) */
const sec = $('#b'), stage = $('.lB__stage'), beam = $('.lB__beam');
let curI = -2;
function moveSpot(i) {
  const f = bBox.querySelector(`.lB__f[data-i="${i}"]`); if (!f) return;
  const bb = bBox.getBoundingClientRect(), fr = f.getBoundingClientRect(), sr = stage.getBoundingClientRect();
  const cx = fr.left + fr.width / 2, cy = fr.top + fr.height / 2;
  bBox.querySelector('.lB__spot').style.transform = `translate(${cx - bb.left}px, ${cy - bb.top}px)`;
  // луч из-под колосников (верх сцены по центру) к лицу
  const x0 = sr.left + sr.width / 2, y0 = sr.top, dx = cx - x0, dy = cy - y0;
  beam.style.height = Math.hypot(dx, dy) + 'px'; beam.style.transform = `translateX(-50%) rotate(${(-Math.atan2(dx, dy) * 180 / Math.PI).toFixed(1)}deg)`;
}
function stopTour() {}
function onScroll() {
  if (!mob()) return;
  const r = sec.getBoundingClientRect(), dist = sec.offsetHeight - innerHeight;
  const p = Math.max(0, Math.min(1, -r.top / dist)), OPEN = .04;
  const k = p < OPEN ? -1 : Math.min(P.length - 1, Math.floor((p - OPEN) / (1 - OPEN - .04) * P.length)), i = k < 0 ? -1 : ORDER[k];
  if (i === curI) return; curI = i;
  sec.classList.toggle('lit', i >= 0);
  if (i < 0) { hiB(null); return; }
  hiB(i); moveSpot(i);
}
function setMode() { sec.classList.toggle('scrolly', mob()); if (mob()) sec.classList.add('in'); curI = -2; onScroll(); }
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', setMode);

/* карточка артиста: снизу на телефоне, справа на компьютере; листается свайпом/стрелками */
const bio = document.createElement('div'); bio.className = 'bio'; bio.setAttribute('role', 'dialog'); bio.setAttribute('aria-modal', 'true'); bio.setAttribute('aria-label', 'Артист');
bio.innerHTML = `<div class="bio__bg" data-x></div><article class="bio__card"><button type="button" class="bio__x" data-x aria-label="Закрыть">×</button><i class="bio__grab" aria-hidden="true"></i>
  <div class="bio__ph"><img alt=""></div><div class="bio__tx"><p class="bio__k">Артист театра</p><h3 class="bio__n"></h3>
  <p class="bio__r"></p><p class="bio__b">Биография артиста — текст пришлёт театр: где учился, с какого года в труппе, звания и награды.</p>
  <div class="bio__nav"><button type="button" data-step="-1" aria-label="Предыдущий артист">←</button><span class="bio__c"></span><button type="button" data-step="1" aria-label="Следующий артист">→</button></div></div></article>`;
document.body.appendChild(bio);
let bi = 0;
function fill(i) { bi = (i + P.length) % P.length; const p = P[bi], [x, y] = face(p), im = bio.querySelector('img');
  im.src = src(p); im.alt = p.name; im.style.objectPosition = `${x * 100}% ${y * 100 - 10}%`;
  bio.querySelector('.bio__n').textContent = p.name; bio.querySelector('.bio__r').innerHTML = p.role ? `<span>В репертуаре</span>${p.role}` : '';
  bio.querySelector('.bio__c').textContent = `${bi + 1} / ${P.length}`; hiB(bi); }
function openBio(i) { fill(i); bio.classList.add('on'); document.documentElement.style.overflow = 'hidden'; bio.querySelector('.bio__x').focus({ preventScroll: true }); }
function closeBio() { bio.classList.remove('on'); document.documentElement.style.overflow = ''; bio.querySelector('.bio__card').style.transform = ''; hiB(null); }
bio.addEventListener('click', e => { if (e.target.closest('[data-x]')) closeBio(); const st = e.target.closest('[data-step]'); if (st) fill(bi + +st.dataset.step); });
addEventListener('keydown', e => { if (!bio.classList.contains('on')) return; if (e.key === 'Escape') closeBio(); if (e.key === 'ArrowRight') fill(bi + 1); if (e.key === 'ArrowLeft') fill(bi - 1); });
// свайп: влево/вправо — соседний артист, вниз — закрыть
{ const card = bio.querySelector('.bio__card'); let x0, y0, dy = 0;
  card.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dy = 0; card.style.transition = 'none'; }, { passive: true });
  card.addEventListener('touchmove', e => { dy = Math.max(0, e.touches[0].clientY - y0); if (dy > Math.abs(e.touches[0].clientX - x0) && mob()) card.style.transform = `translateY(${dy}px)`; }, { passive: true });
  card.addEventListener('touchend', e => { card.style.transition = ''; const dx = e.changedTouches[0].clientX - x0;
    if (dy > 110 && mob()) return closeBio(); card.style.transform = '';
    if (Math.abs(dx) > 60 && Math.abs(dx) > dy) fill(bi + (dx < 0 ? 1 : -1)); });
}

/* В · Кольца */
const cBox = $('[data-c]');
function drawC() {
  const pat = mob() ? [4, 3] : [7, 6];
  cBox.innerHTML = rows(P, pat).map(r => `<div class="lC__row">${r.map(p => { const n = nm(p); return `<figure class="lC__p"><div class="lC__ph"><img src="${src(p)}" alt="${p.name}" loading="lazy" style="${round(p)}"></div><figcaption><span>${n.first}</span><b>${n.last}</b></figcaption></figure>`; }).join('')}</div>`).join('');
}

let wasMob = null;
const draw = () => { if (mob() === wasMob) return; wasMob = mob(); drawB(); drawC(); };
draw(); addEventListener('resize', draw); setMode();

/* появление: лица «выходят на поклон» */
new IntersectionObserver((es, o) => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); o.disconnect(); } }), { threshold: .15 }).observe($('#b'));
