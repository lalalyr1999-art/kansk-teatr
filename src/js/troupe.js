// «Люди театра» — все варианты блока: 5 стена (основной), 3 программка, 1 стволы; все портреты цветные.
import { people } from '../data/people.js';
import { blockSwitch } from './blocks.js';

export function initTroupe({ gsap, ScrollTrigger, CALM }) {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const sec = $('#troupe'); if (!sec) return;
  const sur = p => p.name.split(' ').slice(-1)[0];
  const ppl = [...people].sort((a, b) => sur(a).localeCompare(sur(b), 'ru'));
  const N = ppl.length, pad = i => String(i + 1).padStart(2, '0'), src = p => `/img/people/${p.f}.jpg`;
  const host = $('[data-cast]', sec);
  host.className = 'tv-host';
  host.innerHTML = `<div class="grove" data-tv="1"></div><div class="cast" data-tv="3"></div><div class="wall" data-tv="5"></div>`;
  const built = {};

  /* 1 — стволы: два ряда, при наведении портрет шире (исходный вариант) */
  const b1 = () => {
    const g = $('[data-tv="1"]', host), half = Math.ceil(people.length / 2);
    const card = p => `<figure class="tr-c" tabindex="0"><img src="${src(p)}" alt="${p.name}" loading="lazy"><figcaption><strong>${p.name}</strong><span>${p.role}</span></figcaption></figure>`;
    g.innerHTML = [people.slice(0, half), people.slice(half)].map(r => `<div class="grove__r">${r.map(card).join('')}</div>`).join('');
  };
  /* 3 — программка: плёнка лиц + портрет + список в две колонки */
  const b3 = () => {
    const box = $('[data-tv="3"]', host);
    box.innerHTML = `<div class="cast__strip">${ppl.map((p, i) => `<button class="cast__th" data-i="${i}" aria-label="${p.name}"><img src="${src(p)}" alt="" loading="lazy"></button>`).join('')}</div>
      <div class="cast__stage"><figure class="cast__ph">${ppl.map((p, i) => `<img data-pi="${i}" src="${src(p)}" alt="${p.name}" loading="lazy">`).join('')}<span class="cast__grain"></span></figure><div class="cast__cap"><span class="cast__no" data-cno></span><strong data-cnm></strong><span class="cast__rl" data-crl></span></div></div>
      <div class="cast__list"><ol class="cast__rows">${ppl.map((p, i) => `<li class="cast__row" data-i="${i}" tabindex="0"><span class="cast__i">${pad(i)}</span><span class="cast__nm">${p.name}</span><span class="cast__r">${p.role}</span><img class="cast__mob" src="${src(p)}" alt="" loading="lazy"></li>`).join('')}</ol></div>`;
    const pics = $$('[data-pi]', box), rows = $$('.cast__row', box), ths = $$('.cast__th', box);
    const set = i => { const p = ppl[i]; pics.forEach((im, k) => im.classList.toggle('on', k === i));
      $('[data-cno]', box).textContent = `${pad(i)} / ${N}`; $('[data-cnm]', box).textContent = p.name; $('[data-crl]', box).textContent = p.role;
      rows.forEach((r, k) => r.classList.toggle('on', k === i)); ths.forEach((t, k) => t.classList.toggle('on', k === i)); };
    set(0);
    rows.forEach((r, i) => { r.addEventListener('pointerenter', () => set(i)); r.addEventListener('focus', () => set(i)); });
    ths.forEach((t, i) => { t.addEventListener('pointerenter', () => set(i)); t.addEventListener('click', () => set(i)); });
  };
  /* 5 — стена: все сразу, при наведении портрет оживает */
  const b5 = () => {
    $('[data-tv="5"]', host).innerHTML = ppl.map(p => `<figure class="wall__c" tabindex="0"><img src="${src(p)}" alt="${p.name}" loading="lazy"><figcaption><strong>${p.name}</strong><span>${p.role}</span></figcaption></figure>`).join('') + `<div class="wall__x"><b>23</b><span>артиста<br>120-го сезона</span></div>`;
  };
  const B = { 1: b1, 3: b3, 5: b5 };

  blockSwitch(sec, 'troupe', [
    { k: '5', t: 'Стена' }, { k: '3', t: 'Программка' }, { k: '1', t: 'Стволы-аккордеон' }
  ], k => {
    if (!built[k]) { B[k](); built[k] = 1; }
    sec.dataset.tv = k;
    ScrollTrigger.refresh();
  });
}
