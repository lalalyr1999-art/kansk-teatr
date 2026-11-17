import { events } from '../data/events.js';
import { people } from '../data/people.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const H = document.documentElement;
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_G = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const DAYS_F = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const img = n => `/img/${n}.jpg`;
const fmt = e => { const d = new Date(e.date); return { d, day: d.getDate(), time: d.toTimeString().slice(0, 5), mk: `${d.getFullYear()}-${d.getMonth()}` }; };
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const BVI = store.get('bvi') === '1';
const CALM = REDUCED || BVI;              // без движения
const DESKTOP = matchMedia('(min-width: 901px)').matches;
const FINE = matchMedia('(pointer: fine)').matches;
if (CALM) H.classList.add('calm');

$$('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));

/* ---------- плавный скролл ---------- */
let lenis = null;
if (!CALM) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -90 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const lockScroll = on => { document.body.classList.toggle('is-locked', on); lenis && (on ? lenis.stop() : lenis.start()); };

/* ---------- шапка: прячется вниз, появляется вверх ---------- */
const header = $('[data-header]');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  header.classList.toggle('is-stuck', y > 10);
  header.classList.toggle('is-hidden', y > 500 && y > lastY && !document.body.classList.contains('is-locked'));
  lastY = y;
}, { passive: true });

/* ---------- разбивка заголовков на строки ---------- */
$$('[data-split]').forEach(h => {
  h.innerHTML = h.innerHTML.split(/<br\s*\/?>/i).map(l => `<span class="ln"><span>${l.trim()}</span></span>`).join('');
  if (CALM) return;
  gsap.fromTo($$('.ln > span', h), { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .09, scrollTrigger: { trigger: h, start: 'top 88%' } });
});

/* ---------- HERO ---------- */
const heroEvents = events.filter(e => e.hero).slice(0, 3);
const hText = $('[data-hero-text]'), hPh = $('[data-hero-ph]'), hTh = $('[data-hero-thumbs]');
const DUR = 7000;
let cur = 0, timer, heroReady = false;
hPh.innerHTML = heroEvents.map((e, i) => `<img src="${img(e.hero)}" alt="Сцена из спектакля «${e.title}»" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>`).join('');
hTh.innerHTML = heroEvents.map((e, i) => { const f = fmt(e); return `<button class="th" type="button" data-i="${i}" style="--dur:${DUR}ms" aria-label="${e.title}"><img src="${img(e.img)}" alt=""><b>${e.title}</b><span>${f.day} ${MONTHS_G[f.d.getMonth()]} · ${f.time}</span><i></i></button>`; }).join('');

function heroHTML(e, i) {
  const f = fmt(e);
  const [first, ...rest] = e.title.replace(/-/g, '‑').split(' '); // неразрывный дефис
  return `
    <p class="kicker" data-a>${i === 0 ? 'Ближайший спектакль' : 'Скоро на сцене'} · ${e.age}</p>
    <h1><span class="ln"><span>${first}</span></span>${rest.length ? `<span class="ln"><span><em>${rest.join(' ')}</em></span></span>` : ''}</h1>
    <p class="lead" data-a>${e.lead || ''}</p>
    <div class="hero__meta" data-a><span>${f.day} ${MONTHS_G[f.d.getMonth()]}, ${DAYS_F[f.d.getDay()]}</span><span>${f.time}</span><span>${e.hall}</span><span>${e.dur.split(',')[0]}</span></div>
    <div class="ctas" data-a><button class="btn btn--light" type="button" data-buy-id="${e.id}" data-magnet>Купить билет · от ${e.price} ₽</button><a class="btn btn--glass" href="#">О спектакле</a></div>`;
}
function heroIn() {
  if (CALM) { $$('[data-a]', hText).forEach(el => (el.style.opacity = 1)); return; }
  gsap.fromTo($$('h1 .ln > span', hText), { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: .1 });
  gsap.fromTo($$('[data-a]', hText), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .08, delay: .15 });
}
function showHero(i, animate = true) {
  const go = () => {
    cur = i;
    hText.innerHTML = heroHTML(heroEvents[i], i);
    $('[data-hero-count]').textContent = `0${i + 1} / 0${heroEvents.length}`;
    bindMagnets(hText);
    if (!heroReady && !CALM) gsap.set($$('h1 .ln > span', hText), { yPercent: 110 });
    $$('img', hPh).forEach((im, k) => {
      if (k === i) { im.classList.remove('was'); im.classList.add('is-on'); }
      else if (im.classList.contains('is-on')) { im.classList.remove('is-on'); im.classList.add('was'); setTimeout(() => im.classList.remove('was'), 1400); }
    });
    $$('.th', hTh).forEach((t, k) => { t.classList.remove('is-on'); if (k === i && heroReady) { void t.offsetWidth; t.classList.add('is-on'); } });
    if (heroReady) heroIn();
    clearTimeout(timer);
    if (heroReady && !CALM) timer = setTimeout(() => showHero((cur + 1) % heroEvents.length), DUR);
  };
  if (animate && heroReady && !CALM) gsap.to(hText.children, { opacity: 0, y: -14, duration: .35, stagger: .03, ease: 'power2.in', onComplete: go });
  else go();
}
hTh.addEventListener('click', e => { const b = e.target.closest('.th'); if (b && +b.dataset.i !== cur) showHero(+b.dataset.i); });
showHero(0, false);

function heroEntrance() {
  heroReady = true;
  if (CALM) { heroIn(); return; }
  const tl = gsap.timeline();
  tl.to(hPh, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.5, ease: 'expo.inOut' }, 0)
    .fromTo($('img.is-on', hPh), { scale: 1.25 }, { scale: 1, duration: 2.2, ease: 'expo.out', clearProps: 'transform' }, .1)
    .fromTo('.hero__top', { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out' }, .8)
    .fromTo('.th', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .08 }, 1)
    .add(() => showHero(0, false), .35);
}

/* заставка */
const intro = $('[data-intro]');
if (!H.classList.contains('no-intro') && !CALM) {
  lockScroll(true);
  const yEl = $('[data-intro-year]'), yr = { v: 1907 };
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .to('.intro__facade', { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'expo.inOut' })
    .to('.intro__name', { opacity: 1, y: 0, duration: .8 }, '-=.4')
    .to('.intro__year', { opacity: 1, duration: .4 }, '-=.6')
    .to(yr, { v: 2027, duration: 1.3, ease: 'power3.inOut', onUpdate: () => (yEl.textContent = Math.round(yr.v)) }, '-=.4')
    .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '+=.25')
    .add(() => { lockScroll(false); heroEntrance(); try { sessionStorage.setItem('intro', '1'); } catch {} }, '-=.75')
    .set(intro, { display: 'none' });
} else {
  intro.style.display = 'none';
  if (CALM) hPh.style.clipPath = 'none';
  heroEntrance();
}

if (!CALM) {
  gsap.to(hPh, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__text', { y: -60, opacity: .2, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
}

/* ---------- АФИША ---------- */
const months = [...new Map(events.map(e => { const f = fmt(e); return [f.mk, f.d]; })).entries()];
const mBox = $('[data-months]'), list = $('[data-events]'), empty = $('[data-empty]');
let month = months[0][0], filter = 'all';
mBox.innerHTML = '<span class="months__pill" data-pill></span>' + months.map(([k, d], i) => `<button role="tab" type="button" data-m="${k}" aria-selected="${i === 0}">${MONTHS[d.getMonth()]}</button>`).join('');
const pill = $('[data-pill]');
const movePill = () => { const b = $('[aria-selected="true"]', mBox); pill.style.width = b.offsetWidth + 'px'; pill.style.transform = `translateX(${b.offsetLeft}px)`; };
function renderEvents(anim = true) {
  const items = events.filter(e => {
    const f = fmt(e); if (f.mk !== month) return false;
    if (filter === 'all') return true;
    if (filter === 'weekend') return [0, 6].includes(f.d.getDay());
    return e.tags.includes(filter);
  });
  empty.hidden = items.length > 0;
  list.innerHTML = items.map(e => {
    const f = fmt(e);
    const tags = [`<span class="tag">${e.age}</span>`];
    if (e.tags.includes('premiere')) tags.unshift('<span class="tag tag--prem">Премьера</span>');
    if (e.tags.includes('pk')) tags.push('<span class="tag tag--pk">Пушкинская карта</span>');
    if (e.tags.includes('kids')) tags.push('<span class="tag">Для детей</span>');
    return `<li class="ev" data-img="${img(e.hero || e.img)}">
      <div class="ev__d"><b>${String(f.day).padStart(2, '0')}</b><span>${DAYS[f.d.getDay()]} · ${f.time}</span></div>
      <a class="ev__img" href="#"><img src="${img(e.img)}" alt="${e.title}" loading="lazy"></a>
      <div><h3><a href="#">${e.title}</a></h3><p class="ev__g">${e.author} · ${e.genre}</p><div class="tags">${tags.join('')}</div></div>
      <div class="ev__info"><b>${e.hall}</b><br>${e.dur}</div>
      <div class="ev__buy"><p class="ev__p">от ${e.price} ₽</p><button class="btn" type="button" data-buy-id="${e.id}">Купить</button></div>
    </li>`;
  }).join('');
  if (!CALM && anim) gsap.fromTo(list.children, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .06 });
  ScrollTrigger.refresh();
}
mBox.addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (!b) return; month = b.dataset.m; $$('[data-m]', mBox).forEach(x => x.setAttribute('aria-selected', x === b)); movePill(); renderEvents(); });
$('[data-filters]').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; filter = b.dataset.f; $$('.chip').forEach(x => x.classList.toggle('is-on', x === b)); renderEvents(); });
renderEvents(false);
movePill();
document.fonts?.ready.then(movePill);
if (!CALM) ScrollTrigger.batch('.ev', { start: 'top 92%', once: true, onEnter: b => gsap.fromTo(b, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .08 }) });


/* курсор «Билеты» над строками афиши; клик по строке — покупка */
const tCur = $('[data-cur]');
if (FINE && DESKTOP && !CALM) {
  const cx = gsap.quickTo(tCur, 'x', { duration: .45, ease: 'power3' }), cy = gsap.quickTo(tCur, 'y', { duration: .45, ease: 'power3' });
  list.addEventListener('mousemove', e => {
    const row = e.target.closest('.ev'), onCtl = e.target.closest('.btn, a');
    cx(e.clientX); cy(e.clientY);
    tCur.classList.toggle('is-on', !!row && !onCtl);
  });
  list.addEventListener('mouseleave', () => tCur.classList.remove('is-on'));
  list.addEventListener('click', e => {
    const row = e.target.closest('.ev'); if (!row || e.target.closest('.btn, a')) return;
    $('[data-buy-id]', row)?.click();
  });
}

/* ---------- люди театра ---------- */
const pList = $('[data-people]'), pFrame = $('[data-pframe]'), pName = $('[data-pname]'), pRole = $('[data-prole]');
const pImg = p => `/img/people/${p.f}.jpg`;
pList.innerHTML = people.map((p, i) => `<li><button type="button" data-p="${i}"><img src="${pImg(p)}" alt="${p.name}" loading="lazy"><span>${p.name}</span><small>${p.role}</small></button></li>`).join('');
let pCur = -1;
function setPerson(i) {
  if (i === pCur) return; pCur = i;
  const p = people[i];
  $$('button', pList).forEach(b => b.classList.toggle('is-on', +b.dataset.p === i));
  const im = new Image(); im.src = pImg(p); im.alt = p.name;
  pFrame.appendChild(im);
  if (CALM) { [...pFrame.children].slice(0, -1).forEach(n => n.remove()); }
  else gsap.fromTo(im, { clipPath: 'inset(100% 0 0 0)', scale: 1.15 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: .9, ease: 'expo.out', onComplete: () => [...pFrame.children].slice(0, -1).forEach(n => n.remove()) });
  pName.textContent = p.name; pRole.textContent = p.role;
  if (!CALM) gsap.fromTo([pName, pRole], { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'expo.out', stagger: .05 });
}
setPerson(0);
if (DESKTOP) {
  pList.addEventListener('mouseover', e => { const b = e.target.closest('[data-p]'); if (b) setPerson(+b.dataset.p); });
  pList.addEventListener('focusin', e => { const b = e.target.closest('[data-p]'); if (b) setPerson(+b.dataset.p); });
  // подгружаем портреты заранее, чтобы смена была мгновенной
  addEventListener('load', () => people.forEach(p => { const i = new Image(); i.src = pImg(p); }));
}

/* ---------- бегущая строка ---------- */
const track = $('[data-track]');
track.innerHTML += track.innerHTML;
if (!CALM) {
  const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
  let boost = 1;
  lenis?.on('scroll', ({ velocity }) => { boost = 1 + Math.min(Math.abs(velocity) * .08, 3); });
  gsap.ticker.add(() => { boost += (1 - boost) * .05; loop.timeScale(boost); });
}

/* ---------- галерея: горизонтальная прокрутка ---------- */
const gTrack = $('[data-gal-track]');
if (DESKTOP && !CALM) {
  const dist = () => Math.max(0, gTrack.scrollWidth - (innerWidth - gTrack.getBoundingClientRect().left) + 40);
  const tween = gsap.to(gTrack, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: { trigger: '[data-gal]', pin: '.gal__pin', start: 'top top', end: () => '+=' + dist(), scrub: .8, invalidateOnRefresh: true,
      onUpdate: s => gsap.set('[data-gal-prog]', { scaleX: s.progress }) },
  });
  $$('.gf', gTrack).forEach((f, i) => gsap.fromTo(f, { y: i % 2 ? 40 : -30, opacity: .3 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: f, containerAnimation: tween, start: 'left right', end: 'left 55%', scrub: true } }));
}

/* ---------- кольца юбилея ---------- */
const svg = $('[data-rings]');
const N = 24, R0 = 18, STEP = 7.2;
const ringR = k => R0 + k * STEP;
const ringPts = (k, a) => { const r = ringR(k), seed = k * 1.7, t = a * Math.PI / 180;
  void seed; // ровные окружности — современная геометрия вместо «рисованных» колец
  return [r * Math.cos(t), r * Math.sin(t)]; };
const marks = [{ k: 1, t: '1907' }, { k: 8, t: '1945' }, { k: 20, t: 'сегодня' }, { k: 24, t: '2027' }];
let paths = '';
for (let k = 1; k <= N; k++) {
  const pts = []; for (let a = -90; a <= 270; a += 6) pts.push(ringPts(k, a).map(v => v.toFixed(1)).join(' '));
  paths += `<path d="M${pts.join('L')}" class="${k % 6 === 0 ? 'y' : ''}" data-k="${k}" style="--l:${Math.round(2 * Math.PI * ringR(k) * 1.1)}"/>`;
}
const ANG = [-90, -62, -38, -14];
paths += marks.map(({ k, t }, i) => { const [x, y] = ringPts(k, ANG[i]); return `<circle class="dot" data-mark="${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4"/><text data-mark="${i}" x="${(x + 8).toFixed(1)}" y="${(y - 6).toFixed(1)}">${t}</text>`; }).join('');
svg.innerHTML = paths;
const rPaths = $$('path', svg), countEl = $('[data-count]'), miles = $$('[data-miles] li');
function setRings(p) {
  p = .12 + p * .88; // не начинаем с пустого экрана
  const shown = p * N;
  rPaths.forEach((pa, i) => { const f = Math.min(1, Math.max(0, shown - i)); pa.style.strokeDashoffset = (1 - f) * parseFloat(pa.style.getPropertyValue('--l')); });
  countEl.textContent = Math.round(p * 120);
  let active = -1; marks.forEach((m, i) => { if (shown >= m.k - .2) active = i; });
  miles.forEach((li, i) => li.classList.toggle('on', i <= active));
  $$('[data-mark]', svg).forEach(el => el.classList.toggle('on', +el.dataset.mark <= active));
  rPaths.forEach(pa => pa.classList.toggle('hl', active >= 0 && +pa.dataset.k === marks[active].k));
}
if (CALM) setRings(1);
else {
  setRings(0);
  const st = { p: 0 };
  if (DESKTOP) gsap.to(st, { p: 1, ease: 'none', onUpdate: () => setRings(st.p), scrollTrigger: { trigger: '[data-rings-sec]', pin: true, start: 'top top', end: '+=1200', scrub: .6 } });
  else gsap.to(st, { p: 1, duration: 3.2, ease: 'power2.inOut', onUpdate: () => setRings(st.p), scrollTrigger: { trigger: '.rings__art', start: 'top 75%' } });
}

/* ---------- параллакс, счётчики, появление ---------- */
if (!CALM) {
  $$('[data-par]').forEach(el => gsap.fromTo($('img', el), { yPercent: -+el.dataset.par }, { yPercent: +el.dataset.par, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }));
  $$('[data-num]').forEach(el => { const o = { v: 0 }; gsap.to(o, { v: +el.dataset.num, duration: 2, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v)), scrollTrigger: { trigger: el, start: 'top 90%' } }); });
  $$('[data-stagger]').forEach(g => gsap.fromTo(g.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: g, start: 'top 85%' } }));
  $$('.bor__card, .lgoty__box').forEach(el => gsap.fromTo(el, { clipPath: 'inset(12% 8% 12% 8% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));
  $$('.lead, .kicker', document.querySelector('main')).forEach(el => { if (el.closest('.hero')) return; gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }); });
  $$('[data-edge-l]').forEach(l => gsap.fromTo(l, { yPercent: +l.dataset.edgeL }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '[data-edge]', start: 'top bottom', end: 'bottom bottom', scrub: true } }));
  gsap.fromTo('.footer__claim', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 85%' } });
}

/* магнитные кнопки */
function bindMagnets(root = document) {
  if (!FINE || CALM) return;
  $$('[data-magnet]', root).forEach(b => {
    if (b._mg) return; b._mg = 1;
    const x = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .25); y((e.clientY - r.top - r.height / 2) * .35); });
    b.addEventListener('mouseleave', () => { x(0); y(0); });
  });
}
bindMagnets();

/* ---------- шторка и покупка ---------- */
let lastFocus;
function openLayer(el) { lastFocus = document.activeElement; el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); lockScroll(true); setTimeout(() => $('.drawer__x', el)?.focus(), 60); }
function closeLayer(el) { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); lockScroll(false); lastFocus?.focus(); }
const drawer = $('[data-drawer]'), buy = $('[data-buy]'), drBtn = $('[data-drawer-open]');
$$('.drawer__cols a', drawer).forEach((a, i) => a.style.setProperty('--i', i));
drBtn.addEventListener('click', () => { openLayer(drawer); drBtn.setAttribute('aria-expanded', 'true'); });
$$('[data-drawer-close]').forEach(b => b.addEventListener('click', () => { closeLayer(drawer); drBtn.setAttribute('aria-expanded', 'false'); }));
$$('a', drawer).forEach(a => a.addEventListener('click', () => closeLayer(drawer)));
$$('[data-buy-close]').forEach(b => b.addEventListener('click', () => closeLayer(buy)));
addEventListener('keydown', e => { if (e.key === 'Escape') [drawer, buy].forEach(l => l.classList.contains('is-open') && closeLayer(l)); });

const seats = $('[data-seats]'), sum = $('[data-buy-sum]'), pay = $('[data-buy-pay]');
let price = 0;
const updSum = () => { const n = $$('i.s', seats).length; sum.textContent = n ? `${n} ${n === 1 ? 'билет' : n < 5 ? 'билета' : 'билетов'} · ${(n * price).toLocaleString('ru')} ₽` : 'Выберите места на схеме'; pay.disabled = !n; pay.textContent = 'К оплате'; };
document.addEventListener('click', e => {
  const b = e.target.closest('[data-buy-id]'); if (!b) return;
  const ev = events.find(x => x.id === b.dataset.buyId), f = fmt(ev);
  price = ev.price;
  $('[data-buy-title]').textContent = ev.title;
  $('[data-buy-date]').textContent = `${f.day} ${MONTHS_G[f.d.getMonth()]}, ${DAYS_F[f.d.getDay()]} · ${f.time} · ${ev.hall}`;
  let r = 7; const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  seats.innerHTML = Array.from({ length: 200 }, (_, i) => `<i style="--i:${i}" class="${rnd() < .36 ? 't' : ''}" ${rnd() < .36 ? '' : ''}></i>`).join('');
  updSum();
  openLayer(buy);
});
seats.addEventListener('click', e => { const s = e.target.closest('i'); if (s && !s.classList.contains('t')) { s.classList.toggle('s'); updSum(); } });
pay.addEventListener('click', () => { pay.textContent = 'Демо: тут откроется оплата ✓'; });

$('[data-up]').addEventListener('click', () => (lenis ? lenis.scrollTo(0, { duration: 1.8 }) : scrollTo({ top: 0, behavior: 'smooth' })));

/* ---------- версия для слабовидящих (ГОСТ Р 52872-2019) ---------- */
const bvi = $('[data-bvi]');
function applyBvi(on) {
  bvi.hidden = !on; H.classList.toggle('bvi-on', on);
  H.classList.remove('bvi-bw', 'bvi-wb', 'bvi-blue', 'bvi-noimg'); H.style.removeProperty('--fs-base');
  if (on) {
    H.classList.add('bvi-' + (store.get('bvi-theme') || 'bw'));
    H.style.setProperty('--fs-base', (store.get('bvi-fs') || 20) + 'px');
    if (store.get('bvi-noimg') === '1') H.classList.add('bvi-noimg');
  }
}
// вкл/выкл — с перезагрузкой: анимации и закрепления пересобираются под режим
$$('[data-bvi-toggle]').forEach(b => b.addEventListener('click', () => { store.set('bvi', BVI ? '0' : '1'); location.reload(); }));
$$('[data-fs]').forEach(b => b.addEventListener('click', () => { store.set('bvi-fs', b.dataset.fs); applyBvi(true); }));
$$('[data-theme]').forEach(b => b.addEventListener('click', () => { store.set('bvi-theme', b.dataset.theme); applyBvi(true); }));
const noimg = $('[data-noimg]');
noimg.textContent = 'Изображения: ' + (store.get('bvi-noimg') === '1' ? 'выкл' : 'вкл');
noimg.addEventListener('click', () => { const v = store.get('bvi-noimg') === '1' ? '0' : '1'; store.set('bvi-noimg', v); noimg.textContent = 'Изображения: ' + (v === '1' ? 'выкл' : 'вкл'); applyBvi(true); });
if (BVI) applyBvi(true);

addEventListener('load', () => ScrollTrigger.refresh());
