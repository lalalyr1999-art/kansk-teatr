// v12 — главная «Афиша прежде всего»: первый экран = ближайшие спектакли, лента дат, карточки, покупка листом.
import { people } from '../data/people.js';
import gsap from 'gsap';
import { $, $$, CALM, initChrome, intro } from './chrome.js';
import { initBuy, EV as ev, M, MS, W, WS, pic, picS, srcset, time } from './buy.js';
const MN = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
initChrome({ overHero: true });

/* ===== 1. первый экран: ближайшие спектакли, лента дат ===== */
const DUR = 7;
const media = $('[data-hmedia]'), ribbon = $('[data-ribbon]'), heroS = $('[data-hero]');
const next = ev.slice(0, 8);
ribbon.style.setProperty('--dur', DUR + 's');
ribbon.innerHTML = next.map((e, i) => { const d = new Date(e.date); return `<button class="rb" type="button" role="tab" data-i="${i}" aria-label="${e.title}, ${d.getDate()} ${M[d.getMonth()]}">
  <span class="rb__d"><b>${d.getDate()}</b><small>${MS[d.getMonth()]} · ${WS[d.getDay()]}</small></span>
  <span class="rb__t">${e.title}</span><span class="rb__m">${time(d)} · ${e.age}</span><i class="rb__p"></i></button>`; }).join('');
let cur = -1, timer;
function show(i, anim = true) {
  if (i === cur) return; cur = i; const e = next[i], d = new Date(e.date);
  const im = new Image(); im.src = pic(e.hero || e.img); im.alt = `Сцена из спектакля «${e.title}»`; im.className = CALM ? '' : 'kb';
  media.appendChild(im);
  const old = $$('img', media).slice(0, -1);
  if (anim && !CALM) gsap.fromTo(im, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.1, ease: 'expo.inOut', onComplete: () => old.forEach(n => n.remove()) });
  else old.forEach(n => n.remove());
  const w = e.title.replace(/-/g, '‑').split(' '), cut = w.length > 2 ? Math.ceil(w.length / 2) : 1;
  $('[data-ht]').innerHTML = `<span class="ln"><span>${w.slice(0, cut).join(' ')}</span></span>${w.length > 1 ? `<span class="ln"><span><i>${w.slice(cut).join(' ')}</i></span></span>` : ''}`;
  $('[data-hm]').innerHTML = `<span class="big">${d.getDate()} ${M[d.getMonth()]}, ${W[d.getDay()]} · ${time(d)}</span><span>${e.hall}</span><span>${e.age}</span>${e.tags.includes('pk') ? '<span class="pkb">Пушкинская карта</span>' : ''}`;
  $('[data-hk]').textContent = i === 0 ? 'Ближайший спектакль' : e.genre;
  const b = $('[data-hbuy]'); b.textContent = `Купить билет · от ${e.price} ₽`; b.dataset.buy = e.id;
  $$('.rb', ribbon).forEach((r, k) => { r.classList.toggle('on', k === i); r.setAttribute('aria-selected', k === i); });
  const on = $$('.rb', ribbon)[i]; if (anim) ribbon.scrollTo({ left: on.offsetLeft - ribbon.offsetLeft - parseFloat(getComputedStyle(ribbon).paddingLeft), behavior: CALM ? 'auto' : 'smooth' });
  if (anim && !CALM) {
    gsap.fromTo('[data-ht] .ln>span', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: .07, delay: .15 });
    gsap.fromTo(['[data-hm]', '.hero__acts', '.hero__k'], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .05, delay: .25 });
  }
  arm();
}
function arm() { clearTimeout(timer); if (!CALM && !heroS.classList.contains('paused')) timer = setTimeout(() => show((cur + 1) % next.length), DUR * 1000); }
ribbon.addEventListener('click', e => { const r = e.target.closest('.rb'); if (r) show(+r.dataset.i); });
// подсказка над лентой дат: её можно листать и нажимать
{
  const A = d => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="${d ? 'M2 8h12M9 3l5 5-5 5' : 'M14 8H2M7 3L2 8l5 5'}"/></svg>`;
  ribbon.insertAdjacentHTML('beforebegin', `<div class="rbh"><span class="rbh__t">Ближайшие даты · ${next.length} спектаклей</span><span class="rbh__s" aria-hidden="true">листайте<i>${A(1)}</i></span><button type="button" class="rbh__b" data-d="-1" aria-label="Предыдущие даты">${A(0)}</button><button type="button" class="rbh__b" data-d="1" aria-label="Следующие даты">${A(1)}</button></div>`);
  const h = ribbon.previousElementSibling, [bp, bn] = $$('.rbh__b', h);
  h.addEventListener('click', e => { const b = e.target.closest('.rbh__b'); if (b) ribbon.scrollBy({ left: ribbon.clientWidth * .7 * +b.dataset.d, behavior: CALM ? 'auto' : 'smooth' }); });
  const upd = () => { const max = ribbon.scrollWidth - ribbon.clientWidth; ribbon.classList.toggle('at-start', ribbon.scrollLeft < 8); ribbon.classList.toggle('at-end', ribbon.scrollLeft > max - 8); bp.disabled = ribbon.scrollLeft < 8; bn.disabled = ribbon.scrollLeft > max - 8; if (ribbon.scrollLeft > 30) h.classList.add('used'); };
  ribbon.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  if (!CALM) setTimeout(() => { if (ribbon.scrollLeft < 8) { ribbon.classList.add('nudge'); setTimeout(() => ribbon.classList.remove('nudge'), 1700); } }, 3500);
}
// пауза, пока палец/мышь на ленте или экран не виден
const pause = p => { heroS.classList.toggle('paused', p); p ? clearTimeout(timer) : arm(); if (!p) { const r = $('.rb.on .rb__p', ribbon); if (r) { r.style.animation = 'none'; void r.offsetWidth; r.style.animation = ''; } } };
ribbon.addEventListener('pointerenter', () => pause(true)); ribbon.addEventListener('pointerleave', () => pause(false));
new IntersectionObserver(([x]) => pause(!x.isIntersecting), { threshold: .3 }).observe(heroS);
// свайп по фото
let sx = null;
media.parentElement.addEventListener('touchstart', e => { if (!e.target.closest('.ribbon')) sx = e.touches[0].clientX; }, { passive: true });
media.parentElement.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) show((cur + (dx < 0 ? 1 : next.length - 1)) % next.length); });
show(0, false);

intro().then(() => { if (CALM) return; arm(); gsap.from('.hero__in > *', { opacity: 0, y: 24, duration: 1.1, ease: 'expo.out', stagger: .08, delay: .1 }); gsap.from('.rb', { opacity: 0, x: 30, duration: .9, ease: 'expo.out', stagger: .05, delay: .4 }); gsap.from(media, { scale: 1.08, duration: 2.2, ease: 'expo.out' }); });

/* ===== 2. афиша: месяцы, фильтры, карточки ===== */
const months = [...new Set(ev.map(e => e.date.slice(0, 7)))];
let mon = months[0], flt = 'all';
const mBox = $('[data-months]'), cards = $('[data-cards]');
mBox.innerHTML = months.map(m => `<button type="button" role="tab" data-m="${m}">${MN[+m.slice(5) - 1]}</button>`).join('');
const card = e => { const d = new Date(e.date), pk = e.tags.includes('pk'), pr = e.tags.includes('premiere');
  return `<article class="card"><a class="card__ph" href="#" data-buy="${e.id}" aria-label="Билеты: ${e.title}, ${d.getDate()} ${M[d.getMonth()]}"><img src="${picS(e.hero || e.img)}" srcset="${srcset(e.hero || e.img)}" sizes="(max-width:700px) 100vw, 34vw" alt="" loading="lazy">
    <span class="card__date"><b>${d.getDate()}</b><span>${MS[d.getMonth()]}<small>${W[d.getDay()]}, ${time(d)}</small></span></span><span class="card__age">${e.age}</span></a>
    <div class="card__b">${pk || pr ? `<div class="card__tags">${pr ? '<span class="tag tag--p">Премьера</span>' : ''}${pk ? '<span class="tag tag--pk">Пушкинская карта</span>' : ''}</div>` : ''}
    <h3>${e.title}</h3><p class="card__m">${e.author} · ${e.genre}<br>${e.hall} · ${e.dur}</p>
    <div class="card__f"><span class="card__pr"><small>от</small> ${e.price} ₽</span><button class="btn btn--buy btn--s" type="button" data-buy="${e.id}">Купить</button></div></div></article>`; };
function render(anim = true) {
  $$('button', mBox).forEach(b => { b.classList.toggle('on', b.dataset.m === mon); b.setAttribute('aria-selected', b.dataset.m === mon); });
  $$('button', $('[data-chips]')).forEach(b => b.classList.toggle('on', b.dataset.f === flt));
  const list = ev.filter(e => e.date.startsWith(mon) && (flt === 'all' || e.tags.includes(flt)));
  cards.innerHTML = list.length ? list.map(card).join('') : '<p class="empty">В этом месяце таких спектаклей нет — посмотрите другой месяц или фильтр.</p>';
  if (anim && !CALM) gsap.from($$('.card', cards), { opacity: 0, y: 24, duration: .7, ease: 'expo.out', stagger: .06 });
}
mBox.addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (b) { mon = b.dataset.m; render(); } });
$('[data-chips]').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (b) { flt = b.dataset.f; render(); } });
render(false);

/* ===== люди театра: точка лица (доли ширины/высоты фото) — лицо в центре круга ===== */
const FACE = {2:[0.46,0.34],3:[0.43,0.43],9:[0.48,0.42],11:[0.49,0.36],13:[0.5,0.36],14:[0.5,0.42],15:[0.5,0.37],16:[0.48,0.36],20:[0.52,0.36],21:[0.56,0.39],22:[0.5,0.36],25:[0.56,0.41],30:[0.52,0.34],32:[0.5,0.36],33:[0.55,0.36],34:[0.52,0.41],35:[0.5,0.36],36:[0.43,0.41],37:[0.55,0.37],38:[0.51,0.37],39:[0.52,0.34],40:[0.5,0.38],45:[0.5,0.37]};
const sur = p => p.name.split(' ').slice(-1)[0];
$('[data-people]').innerHTML = [...people].sort((a, b) => sur(a).localeCompare(sur(b), 'ru')).map(p => `<figure class="pp" role="listitem"><div class="pp__ph" style="--x:${(FACE[p.f]||[.5,.37])[0]};--y:${(FACE[p.f]||[.5,.37])[1]}"><img src="/img/w/people/${p.f}.webp" alt="${p.name}" loading="lazy"></div><figcaption><strong>${p.name}</strong></figcaption></figure>`).join('');

/* ленты: перетаскивание мышью на компьютере */
$$('[data-drag]').forEach(s => { let x0 = 0, l0 = 0, down = false, moved = false;
  s.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; x0 = e.clientX; l0 = s.scrollLeft; });
  addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - x0; if (Math.abs(dx) > 4) { moved = true; s.classList.add('drag'); } s.scrollLeft = l0 - dx; });
  addEventListener('pointerup', () => { if (!down) return; down = false; s.classList.remove('drag'); });
  s.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
});

/* подсказки «листайте»: стрелки у заголовка, полоска прогресса, тень у края, подталкивание при появлении, подпись на телефоне */
const ARR = d => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="${d ? 'M2 8h12M9 3l5 5-5 5' : 'M14 8H2M7 3L2 8l5 5'}"/></svg>`;
$$('[data-drag]').forEach(s => {
  const head = s.parentElement.querySelector('.sec-h');
  head.insertAdjacentHTML('beforeend', `<div class="swc"><span class="swc__hint" aria-hidden="true">Листайте<i>${ARR(1)}</i></span><button type="button" class="swc__b" data-d="-1" aria-label="Назад">${ARR(0)}</button><button type="button" class="swc__b" data-d="1" aria-label="Дальше">${ARR(1)}</button></div>`);
  s.insertAdjacentHTML('afterend', '<div class="swbar" aria-hidden="true"><i></i></div>');
  const ctl = $('.swc', head), bar = $('i', s.nextElementSibling), [bp, bn] = $$('.swc__b', ctl);
  const step = () => Math.max(260, s.clientWidth * .8);
  ctl.addEventListener('click', e => { const b = e.target.closest('.swc__b'); if (b) s.scrollBy({ left: step() * +b.dataset.d, behavior: CALM ? 'auto' : 'smooth' }); });
  const upd = () => {
    const max = s.scrollWidth - s.clientWidth, p = max > 0 ? s.scrollLeft / max : 1, vis = s.clientWidth / s.scrollWidth;
    bar.style.width = vis * 100 + '%'; bar.style.transform = `translateX(${p * (1 / vis - 1) * 100}%)`;
    s.classList.toggle('at-start', s.scrollLeft < 8); s.classList.toggle('at-end', s.scrollLeft > max - 8);
    bp.disabled = s.scrollLeft < 8; bn.disabled = s.scrollLeft > max - 8;
  };
  let touched = false;
  s.addEventListener('scroll', () => { upd(); if (!touched && s.scrollLeft > 30) { touched = true; ctl.classList.add('used'); } }, { passive: true });
  addEventListener('resize', upd); upd(); s.addEventListener('load', upd, true);
  // один раз «подтолкнуть» ленту, когда она появилась на экране
  if (!CALM) new IntersectionObserver(([x], o) => { if (x.isIntersecting && x.intersectionRatio > .5) { o.disconnect(); setTimeout(() => { if (!touched) { s.classList.add('nudge'); setTimeout(() => s.classList.remove('nudge'), 1700); } }, 500); } }, { threshold: [0, .5, 1] }).observe(s);
});

/* 120: дни до юбилея */
$('[data-y120d]').textContent = Math.max(0, Math.ceil((Date.parse('2027-04-05T00:00:00+07:00') - Date.now()) / 864e5));

/* появление блоков */
if (!CALM) { const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { gsap.to(x.target, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }); io.unobserve(x.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.sec-h, .strip, .pgrid, .tile, .nw, .af__head').forEach(el => { gsap.set(el, { opacity: 0, y: 30 }); io.observe(el); }); }

/* ===== нижняя панель покупки (телефон) ===== */
const dock = $('[data-dock]');
let dockE = next[0];
const fillDock = e => { dockE = e; const d = new Date(e.date); $('[data-dimg]').src = picS(e.img); $('[data-dt]').textContent = e.title; $('[data-dd]').textContent = `${d.getDate()} ${M[d.getMonth()]}, ${time(d)} · от ${e.price} ₽`; $('[data-dbuy]').dataset.buy = e.id; };
fillDock(next[0]);
const vis = { hero: true, af: false, ft: false };
const upDock = () => { const on = !vis.hero && !vis.ft; dock.classList.toggle('on', on); dock.setAttribute('aria-hidden', !on); };
new IntersectionObserver(([x]) => { vis.hero = x.isIntersecting; upDock(); }, { threshold: .15 }).observe(heroS);
new IntersectionObserver(([x]) => { vis.ft = x.isIntersecting; upDock(); }).observe($('.ft'));

/* покупка: общий модуль (переход фото → лист), панель снизу показывает выбранный спектакль */
initBuy({ onPick: fillDock });
document.addEventListener('sheet', e => { if (e.detail) dock.classList.remove('on'); else upDock(); });
