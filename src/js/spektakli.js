// Страница «Спектакли»: репертуар; у каждого — фото, текст, ближайшие даты с покупкой.
import { shows } from '../data/shows.js';
import gsap from 'gsap';
import { $, $$, CALM, initChrome } from './chrome.js';
import { initBuy, EV, MS, WS, picS, srcset, time } from './buy.js';

initChrome();
initBuy();
const box = $('[data-rep]');
const row = (s, i) => {
  const ds = EV.filter(e => e.title === s.title), e0 = ds[0] || {};
  const meta = [e0.author || s.author, e0.genre || s.genre, e0.dur, e0.age || s.age].filter(Boolean).join(' · ');
  return `<article class="rp ${i % 2 ? 'rp--r' : ''}" data-kind="${s.kind}">
    <div class="rp__ph"><img src="${picS(s.img)}" srcset="${srcset(s.img)}" sizes="(max-width:860px) 100vw, 56vw" alt="Сцена из спектакля «${s.title}»" loading="${i < 2 ? 'eager' : 'lazy'}">${ds.length ? `<span class="rp__next">Ближайший — ${new Date(ds[0].date).getDate()} ${MS[new Date(ds[0].date).getMonth()]}</span>` : ''}</div>
    <div class="rp__tx">
      <p class="rp__k">${s.kind === 'Детям' ? 'Детям и семьям' : 'Взрослым'}${e0.hall ? ' · ' + e0.hall : ''}</p>
      <h2 class="rp__t">${s.title}</h2>
      <p class="rp__m">${meta}</p>
      <p class="rp__d">${s.text}</p>
      ${ds.length ? `<div class="rp__dates">${ds.map(e => { const d = new Date(e.date); return `<button type="button" class="dt" data-buy="${e.id}"><b>${d.getDate()} ${MS[d.getMonth()]}</b><span>${WS[d.getDay()]}, ${time(d)}</span><small>от ${e.price} ₽</small></button>`; }).join('')}</div>`
        : `<p class="rp__soon">Новые даты появятся в афише скоро. <a href="tel:+73916122774">Узнать в кассе</a></p>`}
    </div></article>`;
};
box.innerHTML = shows.map(row).join('');
$('[data-kind]').addEventListener('click', e => {
  const b = e.target.closest('[data-k]'); if (!b) return;
  $$('[data-k]').forEach(x => x.classList.toggle('on', x === b));
  $$('.rp', box).forEach(r => { r.hidden = b.dataset.k !== 'all' && r.dataset.kind !== b.dataset.k; });
});
if (!CALM) { const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { gsap.to(x.target, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rp', box).forEach(el => { gsap.set(el, { opacity: 0, y: 40 }); io.observe(el); }); }
