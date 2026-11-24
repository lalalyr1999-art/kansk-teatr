import { events } from '../data/events.js';
import { people } from '../data/people.js';
import { FACADE } from '../data/facade.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initTroupe } from './troupe.js';
import { initMisc } from './blocks2.js';
gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const H = document.documentElement;
const M = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const MN = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const W = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
const BVI = store.get('bvi') === '1';
const CALM = matchMedia('(prefers-reduced-motion: reduce)').matches || BVI;
const pic = n => `/img/b/${n}.jpg`;
const fallback = im => { im.onerror = null; im.src = im.src.replace('/img/b/', '/img/'); };
document.addEventListener('error', e => { if (e.target.tagName === 'IMG' && e.target.src.includes('/img/b/')) fallback(e.target); }, true);
$('[data-year]').textContent = new Date().getFullYear();

let lenis = null;
if (!CALM) { lenis = new Lenis({ duration: 1.15 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); window.__lenis = lenis; }
const go = h => { const el = h === '#' ? null : $(h); if (!el) return; lenis ? lenis.scrollTo(el, { offset: -70 }) : el.scrollIntoView(); };
document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (a && a.getAttribute('href').length > 1) { e.preventDefault(); closeAll(); go(a.getAttribute('href')); } });

/* шапка: прозрачная над лесом, плотная ниже */
const top = $('[data-top]');
if (BVI) top.classList.add('solid');
else ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => top.classList.toggle('solid', s.scroll() > innerHeight * .8) });

/* спектакль за кулисами */
const hero = events.filter(e => e.hero).slice(0, 3), scene = $('[data-scene]');
scene.innerHTML = hero.map((e, i) => `<img src="${pic(e.hero)}" alt="Сцена из спектакля «${e.title}»" style="opacity:${i ? 0 : 1}">`).join('');
$('[data-nexts]').innerHTML = hero.map((e, i) => { const d = new Date(e.date); return `<button type="button" data-go="${i}"><img src="${pic(e.img)}" alt=""><span><b>${e.title}</b><span>${d.getDate()} ${M[d.getMonth()]}, ${d.toTimeString().slice(0, 5)}</span></span></button>`; }).join('');
let cur = 0, timer, opened = CALM;
function show(i, anim = true) {
  cur = i; const e = hero[i], d = new Date(e.date);
  $$('img', scene).forEach((im, k) => im.style.opacity = k === i ? 1 : 0);
  $$('[data-go]').forEach(b => b.classList.toggle('on', +b.dataset.go === i));
  $('[data-when]').textContent = `${d.getDate()} ${M[d.getMonth()]}, ${W[d.getDay()]} · ${d.toTimeString().slice(0, 5)} · ${e.hall} · ${e.age}`;
  const [f, ...r] = e.title.replace(/-/g, '‑').split(' ');
  $('[data-title]').innerHTML = `<span class="ln"><span>${f}</span></span>${r.length ? `<span class="ln"><span><i>${r.join(' ')}</i></span></span>` : ''}`;
  $('[data-lead]').textContent = e.lead;
  const pb = $('[data-price]'); pb.textContent = `Купить билет · от ${e.price} ₽`; pb.dataset.buy = e.id;
  if (anim && !CALM) { gsap.fromTo('[data-title] .ln>span', { yPercent: 105 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .08 }); gsap.fromTo(['[data-when]', '[data-lead]', '.show__acts'], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .06 }); }
  clearTimeout(timer); if (opened && !CALM) timer = setTimeout(() => show((cur + 1) % hero.length), 8000);
}
$('[data-nexts]').addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) show(+b.dataset.go); });
show(0, false);

/* v9: заставка — фасад рисуется линиями, через D секунд сам перелетает в шапку, сосны расступаются.
   D = 2…5 с: ?d=3 (выбор запоминается), ?skip — без заставки. */
const intro = $('[data-intro]'), forest = $('[data-forest]'), qs = new URLSearchParams(location.search);
if (qs.has('d')) store.set('kt-d', qs.get('d'));
const D = Math.min(5, Math.max(2, +(qs.get('d') || store.get('kt-d') || 3)));
$$('[data-dsw] a').forEach(a => a.classList.toggle('on', +a.getAttribute("href").slice(4) === D));
if (CALM || qs.has('skip')) { top.classList.remove('pre'); intro.remove(); forest.remove(); opened = true; show(0, false); }
else {
  const svg = $('[data-fsvg]'), NS = 'http://www.w3.org/2000/svg';
  svg.innerHTML = `<defs><clipPath id="cf"><rect width="1378" height="420"/></clipPath><clipPath id="ct"><rect data-ctr y="420" width="0" height="104"/></clipPath></defs>
    <g class="ln">${FACADE.d.map(d => `<path d="${d}" pathLength="1"/>`).join('')}</g>
    <image data-ff href="/img/logo-cream.png" width="1378" height="524" clip-path="url(#cf)" opacity="0"/>
    <image href="/img/logo-cream.png" width="1378" height="524" clip-path="url(#ct)"/>`;
  const paths = $$('.ln path', svg), logo = $('.top .logo');
  top.classList.add('pre'); logo.classList.add('hide');
  lenis?.stop(); H.style.overflow = 'hidden'; scrollTo(0, 0);
  // лес за заставкой, режется на стволы-кулисы
  const N = innerWidth < 700 ? 7 : 14;
  forest.innerHTML = Array.from({ length: N }, () => `<div class="trunk"><img src="/img/forest.jpg" alt=""></div>`).join('');
  const trunks = $$('.trunk', forest), w = innerWidth / N, mid = (N - 1) / 2;
  trunks.forEach((t, i) => { t.firstChild.style.left = (-i * w) + 'px'; });
  gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set('[data-show]', { opacity: 0 }); gsap.set('[data-nexts]', { opacity: 0 });
  const draw = gsap.timeline()
    .to(paths, { strokeDashoffset: 0, duration: D * .5, ease: 'power2.inOut', stagger: { amount: D * .22 } }, .15)
    .to('[data-ff]', { opacity: 1, duration: D * .25, ease: 'power1.out' }, D * .55)
    .to(paths, { opacity: 0, duration: D * .2 }, D * .65)
    .to('[data-ctr]', { attr: { width: 1378 }, duration: D * .3, ease: 'expo.inOut' }, D * .5)
    .from('[data-is]', { opacity: 0, y: 12, duration: .8, ease: 'expo.out' }, D * .6)
    .fromTo('[data-ibar]', { scaleX: 0 }, { scaleX: 1, duration: D, ease: 'none' }, 0);
  let gone = false;
  const enter = () => {
    if (gone) return; gone = true; draw.progress(1).kill();
    ['wheel', 'touchstart', 'keydown'].forEach(t => removeEventListener(t, enter));
    top.classList.remove('pre');
    const a = $('[data-ilogo]').getBoundingClientRect(), b = logo.getBoundingClientRect();
    gsap.timeline({ onComplete: () => { logo.classList.remove('hide'); intro.remove(); forest.remove(); H.style.overflow = ''; lenis?.start(); ScrollTrigger.refresh(); } })
      .to('[data-ilogo]', { x: b.left - a.left, y: b.top - a.top, scale: b.width / a.width, duration: 1.3, ease: 'expo.inOut' }, 0)
      .to(['[data-is]', '.intro__skip', '.intro__bar'], { opacity: 0, duration: .4 }, 0)
      .to(intro, { backgroundColor: 'rgba(12,13,11,0)', duration: .9 }, .2)
      .add(trunks.map((t, i) => { const left = i < mid, steps = left ? i + 1 : N - i, far = Math.abs(i - mid) / mid;
        return gsap.to(t, { xPercent: (left ? -1 : 1) * (steps * 100 + 15), duration: 1.6, ease: 'power3.inOut', delay: (1 - far) * .3 }); }), .35)
      .fromTo('[data-scene] img', { scale: 1.15 }, { scale: 1, duration: 2.4, ease: 'expo.out' }, .35)
      .add(() => { opened = true; show(cur); }, 1.4)
      .to('[data-show]', { opacity: 1, duration: .6 }, 1.4).to('[data-nexts]', { opacity: 1, duration: .6 }, 1.6);
  };
  draw.eventCallback('onComplete', () => setTimeout(enter, 250));
  $('[data-iskip]').addEventListener('click', enter);
  setTimeout(() => ['wheel', 'touchstart', 'keydown'].forEach(t => addEventListener(t, enter, { passive: true })), 600);
}

/* афиша по месяцам */
const months = [...new Set(events.map(e => e.date.slice(0, 7)))].sort();
const tph = $('[data-tph]'), rows = $('[data-rows]');
let list = [], tc = -1;
function tshow(e) {
  const im = new Image(); im.src = pic(e.hero || e.img); im.alt = ''; tph.appendChild(im);
  if (CALM) [...tph.children].slice(0, -1).forEach(n => n.remove());
  else gsap.fromTo(im, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: .7, ease: 'expo.out', onComplete: () => [...tph.children].slice(0, -1).forEach(n => n.remove()) });
  $('[data-tcap]').textContent = `«${e.title}» — ${e.author}`;
}
function month(ym) {
  const m = +ym.slice(5) - 1;
  $('[data-mname]').textContent = M[m];
  $$('[data-m]').forEach(b => b.classList.toggle('on', b.dataset.m === ym));
  list = events.filter(e => e.date.startsWith(ym)).sort((a, b) => a.date.localeCompare(b.date));
  rows.innerHTML = list.length ? list.map((e, i) => { const d = new Date(e.date); return `<a class="row" href="#" data-r="${i}" data-buy="${e.id}">
    <div class="row__d"><b>${d.getDate()}</b><span>${W[d.getDay()]}, ${d.toTimeString().slice(0, 5)}</span></div>
    <div><h3>${e.title}${e.tags.includes('premiere') ? '<span class="tag tag--p">премьера</span>' : ''}</h3><p>${e.author} · ${e.genre} · ${e.hall} · ${e.age}${e.tags.includes('pk') ? '<span class="tag">Пушкинская карта</span>' : ''}</p></div>
    <div class="row__b"><b>от ${e.price} ₽</b><span class="tl">Билеты</span></div></a>`; }).join('') : '<p class="empty">Афиша на этот месяц появится позже.</p>';
  if (list.length) { tc = 0; tshow(list[0]); }
  if (!CALM && list.length) gsap.from('.row', { opacity: 0, y: 20, duration: .6, ease: 'expo.out', stagger: .05 });
  ScrollTrigger.refresh();
}
$('[data-months]').innerHTML = months.map(ym => `<button type="button" data-m="${ym}">${MN[+ym.slice(5) - 1]}</button>`).join('');
$('[data-months]').addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (b) month(b.dataset.m); });
rows.addEventListener('mouseover', ev => { const r = ev.target.closest('[data-r]'); if (r && +r.dataset.r !== tc) { tc = +r.dataset.r; tshow(list[tc]); } });
month(months[0]);

/* галерея: горизонтальная прокрутка с закреплением */
const track = $('[data-gtrack]');
ScrollTrigger.matchMedia({ '(min-width:1051px)': () => { if (CALM) return;
  const dist = () => Math.max(0, track.scrollWidth - (innerWidth - $('.gal__head').offsetWidth));
  gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '[data-gal]', start: 'top top', end: () => '+=' + dist(), pin: '.gal__pin', scrub: .6, invalidateOnRefresh: true,
    onUpdate: s => gsap.set('[data-gprog]', { scaleX: s.progress }) } });
} });

/* труппа: все варианты с переключателем у блока — src/js/troupe.js */
initTroupe({ gsap, ScrollTrigger, CALM });
initMisc({ ScrollTrigger });

/* подарить театр: живой сертификат */
{
  const cert = $('[data-cert]');
  if (cert) {
    const sum = $('[data-gsum]'), pat = $('[data-gpat]');
    // фон как у настоящих сертификатов театра: узор из цифр номинала
    const fillPat = n => { let h = ''; for (let i = 0; i < 46; i++) h += `<span style="font-size:${[38, 64, 92, 30, 120, 50][i % 6]}px">${n}</span>`; pat.innerHTML = h; };
    fillPat(1000);
    $$('.gift__nom button').forEach(b => b.addEventListener('click', () => {
      $$('.gift__nom button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); });
      sum.textContent = b.dataset.n; cert.dataset.n = b.dataset.n; fillPat(b.dataset.n);
      cert.classList.remove('bump'); void cert.offsetWidth; cert.classList.add('bump');
    }));
    if (!CALM && matchMedia('(hover:hover)').matches) {
      cert.addEventListener('pointermove', e => { const r = cert.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        cert.style.setProperty('--ry', (x - .5) * 12 + 'deg'); cert.style.setProperty('--rx', (.5 - y) * 10 + 'deg'); cert.style.setProperty('--mx', x * 100 + '%'); cert.style.setProperty('--my', y * 100 + '%'); });
      cert.addEventListener('pointerleave', () => { cert.style.setProperty('--ry', '0deg'); cert.style.setProperty('--rx', '0deg'); });
    }
  }
}

/* подвал: театр в бору — фасад прорисовывается линией среди сосен */
{
  const sc = $('[data-fscene]');
  if (sc) {
    const W = 1600, G = 520; let seed = 5; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const pine = (x, h, s, cls) => { // ночной бор: только стволы, уходящие вверх в темноту
      const tw = 2.5 + s * 6 + R() * 3, top = G - h;
      return `<rect class="${cls}" x="${(x - tw / 2).toFixed(1)}" y="${top}" width="${tw.toFixed(1)}" height="${h}"/>`; };
    let far = '', near = '';
    for (let i = 0; i < 46; i++) { const x = R() * W; far += pine(x, 380 + R() * 140, .3, 'pf'); }
    for (let i = 0; i < 16; i++) { const side = i % 2, x = side ? 1250 + R() * 370 : -20 + R() * 370; near += pine(x, 520, 1, 'pn'); }
    sc.innerHTML = `<svg viewBox="0 0 ${W} 520" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs><linearGradient id="ftf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d261b" stop-opacity="0"/><stop offset=".55" stop-color="#1d261b"/></linearGradient><linearGradient id="ftn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2318" stop-opacity="0"/><stop offset=".6" stop-color="#2a2318"/></linearGradient><radialGradient id="fglow" cx="50%" cy="78%" r="45%"><stop offset="0" stop-color="#D98A4E" stop-opacity=".38"/><stop offset="1" stop-color="#D98A4E" stop-opacity="0"/></radialGradient></defs>
      <rect class="fglow" x="0" y="0" width="${W}" height="520" fill="url(#fglow)"/>
      ${far}
      <svg class="ffac" x="430" y="236" width="740" height="234" viewBox="0 0 1378 412">${FACADE.d.map((d, i) => `<path d="${d}" pathLength="1" style="transition-delay:${(i * .012).toFixed(3)}s"/>`).join('')}</svg>
      ${near}
      <line x1="0" y1="${G}" x2="${W}" y2="${G}" class="fground"/>
    </svg>
    <p class="fscene__cap">ул. 40 лет Октября, 31 · рядом с памятником природы «Сосновый бор»</p>`;
    if (CALM) sc.classList.add('drawn');
    else new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { sc.classList.add('drawn'); o.disconnect(); } }), { threshold: .35 }).observe(sc);
  }
}

/* 120: блок унесён на /teatr.html, здесь — строка с отсчётом */
{ const d = $('[data-y120d]'); if (d) d.textContent = Math.max(0, Math.ceil((Date.parse('2027-04-05T00:00:00+07:00') - Date.now()) / 864e5)); }

/* место: параллакс + появление */
if (!CALM) {
  $$('.prk, .post, .facts > div').forEach(el => gsap.from(el, { opacity: 0, y: 30, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
}

/* слои: меню и покупка */
const menu = $('[data-menu]'), buy = $('[data-buy]'), mBtn = $('[data-menu-open]');
let last = null;
const open = l => { last = document.activeElement; l.classList.add('open'); l.setAttribute('aria-hidden', 'false'); lenis?.stop(); document.body.style.overflow = 'hidden'; setTimeout(() => $('.x', l).focus(), 50); if (l === menu) mBtn.setAttribute('aria-expanded', 'true'); };
function closeAll() { [menu, buy].forEach(l => { if (!l.classList.contains('open')) return; l.classList.remove('open'); l.setAttribute('aria-hidden', 'true'); }); mBtn.setAttribute('aria-expanded', 'false'); lenis?.start(); document.body.style.overflow = ''; last?.focus?.(); }
mBtn.addEventListener('click', () => open(menu));
$$('[data-close]').forEach(b => b.addEventListener('click', () => { if (b.tagName !== 'A') closeAll(); }));
addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

const seats = $('[data-seats]'), sum = $('[data-sum]'), pay = $('[data-pay]');
let price = 0;
const upd = () => { const n = $$('i.s', seats).length; sum.textContent = n ? `${n} ${n === 1 ? 'билет' : n < 5 ? 'билета' : 'билетов'} · ${(n * price).toLocaleString('ru')} ₽` : 'Выберите места на схеме'; pay.disabled = !n; };
document.addEventListener('click', e => {
  const b = e.target.closest('[data-buy]'); if (!b || b.closest('[data-buy].layer') ) return;
  e.preventDefault(); e.stopPropagation();
  const ev = events.find(x => x.id === b.dataset.buy); if (!ev) return; const d = new Date(ev.date);
  price = ev.price; $('[data-bt]').textContent = ev.title;
  $('[data-bd]').textContent = `${d.getDate()} ${M[d.getMonth()]}, ${W[d.getDay()]} · ${d.toTimeString().slice(0, 5)} · ${ev.hall} · ${ev.age}`;
  let s = [...ev.id].reduce((a, c) => a + c.charCodeAt(0), 7); const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  seats.innerHTML = Array.from({ length: 200 }, () => `<i class="${rnd() < .36 ? 't' : ''}"></i>`).join('');
  upd(); open(buy);
}, true);
seats.addEventListener('click', e => { const s = e.target.closest('i'); if (s && !s.classList.contains('t')) { s.classList.toggle('s'); upd(); } });
pay.addEventListener('click', () => { sum.textContent = 'Демо: здесь откроется оплата Quick Tickets'; pay.disabled = true; });

/* звуки бора */
const au = $('[data-audio]'), bb = $('[data-birds]');
bb.addEventListener('click', () => { const on = bb.getAttribute('aria-pressed') !== 'true'; bb.setAttribute('aria-pressed', on); bb.classList.toggle('on', on);
  if (on) { au.volume = 0; au.play(); gsap.to(au, { volume: .45, duration: 2 }); } else gsap.to(au, { volume: 0, duration: 1, onComplete: () => au.pause() }); });

/* версия для слабовидящих (ГОСТ Р 52872-2019) */
const bvi = $('[data-bvi]');
function applyBvi() {
  bvi.hidden = !BVI; H.classList.toggle('bvi-on', BVI); H.classList.remove('bvi-bw', 'bvi-wb', 'bvi-blue', 'bvi-noimg');
  if (!BVI) return;
  H.classList.add('bvi-' + (store.get('bvi-th') || 'bw')); H.style.setProperty('--fs', (store.get('bvi-fs') || 20) + 'px');
  if (store.get('bvi-noimg') === '1') H.classList.add('bvi-noimg');
  $('[data-noimg]').textContent = 'Изображения: ' + (store.get('bvi-noimg') === '1' ? 'выкл' : 'вкл');
}
$$('[data-bvi-toggle]').forEach(b => b.addEventListener('click', () => { store.set('bvi', BVI ? '0' : '1'); location.reload(); }));
$$('[data-fs]').forEach(b => b.addEventListener('click', () => { store.set('bvi-fs', b.dataset.fs); applyBvi(); }));
$$('[data-th]').forEach(b => b.addEventListener('click', () => { store.set('bvi-th', b.dataset.th); applyBvi(); }));
$('[data-noimg]').addEventListener('click', () => { store.set('bvi-noimg', store.get('bvi-noimg') === '1' ? '0' : '1'); applyBvi(); });
applyBvi();

addEventListener('load', () => ScrollTrigger.refresh());
