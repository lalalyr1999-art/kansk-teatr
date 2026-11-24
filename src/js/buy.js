// Покупка билета (все страницы): лист с сеансами и схемой зала.
// 6 — переход: фото спектакля из карточки/первого экрана «разворачивается» в шапку листа.
import { events } from '../data/events.js';
import gsap from 'gsap';
import { $, $$, CALM, openSheet } from './chrome.js';

export const M = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
export const MS = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
export const W = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
export const WS = ['вс','пн','вт','ср','чт','пт','сб'];
export const pic = n => `/img/w/b/${n}.webp`;
export const picS = n => `/img/w/bs/${n}.webp`;
export const srcset = n => `${picS(n)} 760w, ${pic(n)} 1600w`;
export const time = d => d.toTimeString().slice(0, 5);
export const EV = [...events].sort((a, b) => a.date.localeCompare(b.date));
export const byId = id => EV.find(e => e.id === id);

const SHEET = `<div class="sheet sheet--buy" data-buysheet aria-hidden="true">
  <div class="sheet__bg" data-close></div>
  <div class="sheet__p" role="dialog" aria-modal="true" aria-labelledby="bt">
    <button class="x" type="button" data-close aria-label="Закрыть"></button>
    <div class="bh"><img data-bimg alt=""><div class="bh__tx"><p class="bh__d" data-bd></p><h3 id="bt" data-bt></h3></div></div>
    <div class="bsess" data-bsess></div>
    <div class="hall"><div class="hall__sc">Сцена</div><div class="hall__seats" data-seats></div>
      <div class="legend"><span><i></i>свободно</span><span><i class="s"></i>ваш выбор</span><span><i class="t"></i>занято</span></div></div>
    <div class="bbar"><span data-sum>Выберите места на схеме</span><button class="btn btn--buy" type="button" data-pay disabled>К оплате</button></div>
    <p class="bnote">Демонстрация. Здесь будет схема зала и оплата Quick Tickets — прямо на сайте театра.</p>
  </div>
</div>`;

export function initBuy({ onPick } = {}) {
  document.body.insertAdjacentHTML('beforeend', SHEET);
  const buy = $('[data-buysheet]'), seats = $('[data-seats]'), sum = $('[data-sum]'), pay = $('[data-pay]'), bimg = $('[data-bimg]');
  let price = 0;
  bimg.src = picS(EV[0].hero || EV[0].img); // чтобы не было пустой картинки до первого открытия
  const plural = n => n === 1 ? 'билет' : n > 1 && n < 5 ? 'билета' : 'билетов';
  const upd = () => { const n = $$('i.s', seats).length; sum.textContent = n ? `${n} ${plural(n)} · ${(n * price).toLocaleString('ru')} ₽` : 'Выберите места на схеме'; pay.disabled = !n; };
  const fill = e => {
    const d = new Date(e.date); price = e.price;
    bimg.src = picS(e.hero || e.img); bimg.alt = ''; $('[data-bt]').textContent = e.title;
    $('[data-bd]').textContent = `${e.hall} · ${e.age} · ${e.dur}`;
    $('[data-bsess]').innerHTML = EV.filter(x => x.title === e.title).map(x => { const q = new Date(x.date); return `<button type="button" data-s="${x.id}" class="${x.id === e.id ? 'on' : ''}"><b>${q.getDate()} ${MS[q.getMonth()]}, ${WS[q.getDay()]}</b>${time(q)} · от ${x.price} ₽</button>`; }).join('');
    let s = [...e.id].reduce((a, c) => a + c.charCodeAt(0), 7); const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    seats.innerHTML = Array.from({ length: 10 }, (_, r) => `<div class="hall__row"><em>${r + 1}</em><div>${Array.from({ length: 16 }, (_, k) => `<i class="${rnd() < .3 + r * .015 ? 't' : ''}" role="button" tabindex="-1" aria-label="Ряд ${r + 1}, место ${k + 1}"></i>`).join('')}</div><em>${r + 1}</em></div>`).join('');
    upd(); onPick?.(e);
  };

  // переход: клон фото летит из источника в шапку листа
  const morph = src => {
    if (CALM || !src) return;
    const from = src.getBoundingClientRect(); if (!from.width) return;
    const p = $('.sheet__p', buy);
    p.style.transition = 'none'; buy.classList.add('open'); const to = bimg.getBoundingClientRect(); buy.classList.remove('open'); void p.offsetWidth; p.style.transition = '';
    const cl = document.createElement('img'); cl.src = src.currentSrc || src.src; cl.className = 'morph';
    const r0 = getComputedStyle(src.closest('.card__ph, .kf, .hero__media, .rp__ph') || src).borderRadius;
    Object.assign(cl.style, { left: from.left + 'px', top: from.top + 'px', width: from.width + 'px', height: from.height + 'px', borderRadius: r0 });
    document.body.appendChild(cl); bimg.style.opacity = 0;
    setTimeout(() => { if (!cl.isConnected) return; gsap.killTweensOf(cl); bimg.style.opacity = ''; cl.remove(); }, 900); // страховка на слабых устройствах
    gsap.to(cl, { left: to.left, top: to.top, width: to.width, height: to.height, borderRadius: getComputedStyle(bimg).borderRadius, duration: .6, ease: 'expo.inOut',
      onComplete: () => { bimg.style.opacity = ''; gsap.to(cl, { opacity: 0, duration: .2, onComplete: () => cl.remove() }); } });
  };

  document.addEventListener('click', x => {
    const b = x.target.closest('[data-buy]'); if (!b) return;
    x.preventDefault(); const e = byId(b.dataset.buy); if (!e) return;
    fill(e);
    const src = b.closest('.card, .rp')?.querySelector('img') || (b.closest('[data-hero]') ? $('[data-hmedia] img:last-child') : null);
    morph(src); openSheet(buy);
  });
  $('[data-bsess]').addEventListener('click', x => { const b = x.target.closest('[data-s]'); if (b) fill(byId(b.dataset.s)); });
  seats.addEventListener('click', x => { const s = x.target.closest('i'); if (s && !s.classList.contains('t')) { s.classList.toggle('s'); upd(); } });
  pay.addEventListener('click', () => { sum.textContent = 'Демо: здесь откроется оплата Quick Tickets'; pay.disabled = true; });
}
