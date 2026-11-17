// «Люди театра» — все варианты блока: 1 стволы (исходный), 2 уступами, 3 программка, 4 лента, 5 стена.
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
  host.innerHTML = `<div class="grove" data-tv="1"></div><div class="crew" data-tv="2"></div><div class="cast" data-tv="3"></div><div class="band" data-tv="4"></div><div class="wall" data-tv="5"></div>`;
  const built = {};

  /* 1 — стволы: два ряда, при наведении портрет шире (исходный вариант) */
  const b1 = () => {
    const g = $('[data-tv="1"]', host), half = Math.ceil(people.length / 2);
    const card = p => `<figure class="tr-c" tabindex="0"><img src="${src(p)}" alt="${p.name}" loading="lazy"><figcaption><strong>${p.name}</strong><span>${p.role}</span></figcaption></figure>`;
    g.innerHTML = [people.slice(0, half), people.slice(half)].map(r => `<div class="grove__r">${r.map(card).join('')}</div>`).join('');
  };
  /* 2 — колонки-стволы уступами, плывут при прокрутке */
  let crewT = [];
  const b2 = () => {
    const g = $('[data-tv="2"]', host);
    const n = innerWidth < 700 ? 2 : innerWidth < 1050 ? 4 : innerWidth < 1280 ? 6 : 8;
    crewT.forEach(t => t.scrollTrigger?.kill()); crewT = [];
    const cols = Array.from({ length: n }, () => []); ppl.forEach((p, i) => cols[i % n].push(p));
    const pcard = p => `<figure class="pp" tabindex="0"><div class="pp__ph"><img src="${src(p)}" alt="${p.name}" loading="lazy"></div><figcaption><strong>${p.name}</strong><span>${p.role}</span></figcaption></figure>`;
    g.innerHTML = cols.map(c => `<div class="crew__c">${c.map(pcard).join('')}</div>`).join('');
    if (!CALM) $$('.crew__c', g).forEach((c, i) => { const sp = [30, -24, 46, -16, 38, -30, 22, -40][i % 8];
      crewT.push(gsap.fromTo(c, { y: sp }, { y: -sp, ease: 'none', scrollTrigger: { trigger: g, start: 'top bottom', end: 'bottom top', scrub: true } })); });
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
  /* 4 — лента больших цветных портретов, едет вбок */
  let bandST = null;
  const b4 = () => {
    const box = $('[data-tv="4"]', host);
    box.innerHTML = `<div class="band__pin"><div class="band__track">${ppl.map((p, i) => `<figure class="band__c"><img src="${src(p)}" alt="${p.name}" loading="lazy"><span class="cast__grain"></span><figcaption><span class="band__no">${pad(i)} / ${N}</span><strong>${p.name.replace(' ', '<br>')}</strong></figcaption></figure>`).join('')}</div><div class="band__bar"><i data-bbar></i></div></div>`;
  };
  const pinBand = on => {
    bandST?.kill(); bandST = null; const box = $('[data-tv="4"]', host), tr = $('.band__track', box); if (!tr) return;
    gsap.set(tr, { x: 0 });
    if (!on || CALM || innerWidth < 901) return;
    const dist = () => tr.scrollWidth - innerWidth;
    bandST = gsap.to(tr, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: box, start: 'top top', end: () => '+=' + dist(), pin: $('.band__pin', box), scrub: .6, invalidateOnRefresh: true, onUpdate: s => gsap.set($('[data-bbar]', box), { scaleX: s.progress }) } }).scrollTrigger;
  };
  /* 5 — стена: все сразу, при наведении портрет оживает */
  const b5 = () => {
    $('[data-tv="5"]', host).innerHTML = ppl.map(p => `<figure class="wall__c" tabindex="0"><img src="${src(p)}" alt="${p.name}" loading="lazy"><figcaption><strong>${p.name}</strong><span>${p.role}</span></figcaption></figure>`).join('') + `<div class="wall__x"><b>23</b><span>артиста<br>120-го сезона</span></div>`;
  };
  const B = { 1: b1, 2: b2, 3: b3, 4: b4, 5: b5 };

  blockSwitch(sec, 'troupe', [
    { k: '4', t: 'Лента (цвет)' }, { k: '1', t: 'Стволы-аккордеон' }, { k: '2', t: 'Уступами' }, { k: '3', t: 'Программка' }, { k: '5', t: 'Стена' }
  ], k => {
    if (!built[k]) { B[k](); built[k] = 1; }
    sec.dataset.tv = k;
    pinBand(k == '4');
    ScrollTrigger.refresh();
  });
  addEventListener('resize', () => { if (sec.dataset.tv == '2') b2(); });
}
