// Общие части всех страниц v12: шапка, меню, подвал, версия для слабовидящих, заставка.
// На странице: <div data-chrome></div> в начале body и <div data-chrome-ft></div> в конце.
import '@fontsource/onest/400.css'; import '@fontsource/onest/500.css'; import '@fontsource/onest/600.css';
import '@fontsource/playfair-display/400.css'; import '@fontsource/playfair-display/400-italic.css'; import '@fontsource/playfair-display/500.css';
import { FACADE } from '../data/facade.js';
import gsap from 'gsap';

export const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
export const BVI = store.get('bvi') === '1';
export const CALM = matchMedia('(prefers-reduced-motion: reduce)').matches || BVI;
const H = document.documentElement;
const home = location.pathname === '/' || /index\.html$/.test(location.pathname) || location.pathname.endsWith('/kansk-teatr/');
const L = h => (home && h.startsWith('/#') ? h.slice(1) : h);

const HEADER = () => `
<div class="bvi" data-bvi hidden>
  <span>Размер шрифта <button type="button" data-fs="16">А</button><button type="button" data-fs="20" style="font-size:1.15rem">А</button><button type="button" data-fs="24" style="font-size:1.35rem">А</button></span>
  <span>Цвет <button type="button" data-th="bw">Ч/Б</button><button type="button" data-th="wb" style="background:#000;color:#fff">Б/Ч</button><button type="button" data-th="blue" style="background:#9DD1FF;color:#063462">Синий</button></span>
  <button type="button" data-bvi-toggle>Обычная версия</button>
</div>
<header class="hd" data-hd>
  <a class="hd__logo" href="/" aria-label="Канский драматический театр — на главную"><img src="/img/logo-cream-s.png" alt="" width="150" height="57"></a>
  <nav class="hd__nav" aria-label="Основное меню"><a href="${L('/#afisha')}">Афиша</a><a href="/spektakli.html">Спектакли</a><a href="${L('/#lyudi')}">Люди театра</a><a href="/teatr.html">О театре</a><a href="/zritelyam.html">Зрителям</a><a href="#kontakty">Контакты</a></nav>
  <div class="hd__r">
    <button class="hd__ib" type="button" data-bvi-toggle aria-label="Версия для слабовидящих"><svg viewBox="0 0 22 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 7s4-6 10-6 10 6 10 6-4 6-10 6S1 7 1 7z"/><circle cx="11" cy="7" r="2.6"/></svg></button>
    <a class="hd__buy" href="${L('/#afisha')}">Билеты</a>
    <button class="hd__burg" type="button" data-menu-open aria-label="Меню" aria-expanded="false"><i></i><i></i></button>
  </div>
</header>
<div class="sheet sheet--menu" data-menu aria-hidden="true">
  <div class="sheet__bg" data-close></div>
  <div class="sheet__p" role="dialog" aria-modal="true" aria-label="Меню">
    <button class="x" type="button" data-close aria-label="Закрыть"></button>
    <nav class="mn"><a href="${L('/#afisha')}" data-close>Афиша и билеты</a><a href="/spektakli.html">Спектакли</a><a href="${L('/#lyudi')}" data-close>Люди театра</a><a href="/teatr.html">О театре · 120 лет</a><a href="/zritelyam.html">Зрителям</a><a href="${L('/#esche')}" data-close>Подарить сертификат</a><a href="#kontakty" data-close>Контакты</a></nav>
    <p class="mn__gov"><a href="/zritelyam.html#svo">Минкультуры России: бесплатное посещение спектаклей участниками СВО и их семьями →</a></p>
    <a class="btn btn--buy" href="tel:+73916122774">Касса: 8 (39161) 2-27-74</a>
  </div>
</div>`;

const FOOTER = () => `
<footer class="ft" id="kontakty">
  <div class="ft__top">
    <img class="ft__logo" src="/img/logo-cream-s.png" alt="Канский драматический театр" width="170" height="65" loading="lazy">
    <div class="ft__c"><h4>Касса</h4><a class="ft__big" href="tel:+73916122774">8 (39161) 2-27-74</a><p>вт–вс 10:00–18:00, пт до 17:00<br>обед 13–14, пн — выходной</p></div>
    <div class="ft__c"><h4>Адрес</h4><p>г. Канск, ул. 40 лет Октября, 31<br>рядом с сосновым бором</p><a class="ft__lk" href="https://yandex.ru/maps/?text=%D0%9A%D0%B0%D0%BD%D1%81%D0%BA%2C%20%D1%83%D0%BB.%2040%20%D0%BB%D0%B5%D1%82%20%D0%9E%D0%BA%D1%82%D1%8F%D0%B1%D1%80%D1%8F%2C%2031" target="_blank" rel="noopener">Построить маршрут →</a></div>
    <div class="ft__c"><h4>Приёмная</h4><a class="ft__big" href="tel:+73916120379">8 (39161) 2-03-79</a><p><a href="mailto:teatrkansk@yandex.ru">teatrkansk@yandex.ru</a></p></div>
  </div>
  <div class="ft__soc"><a href="https://vk.ru/dramteatrkansk" target="_blank" rel="noopener">ВКонтакте</a><a href="https://t.me/kanskdrama" target="_blank" rel="noopener">Telegram</a><a href="https://ok.ru/kanskdrama" target="_blank" rel="noopener">Одноклассники</a><a href="https://max.ru/id2450002851_gos" target="_blank" rel="noopener">MAX</a></div>
  <div class="ft__links">
    <nav aria-label="Зрителям"><a href="/zritelyam.html#buy">Как купить билет</a><a href="/zritelyam.html#return">Возврат билетов</a><a href="/zritelyam.html#rules">Правила посещения</a><a href="/zritelyam.html#access">Доступная среда</a><a href="/zritelyam.html#age">Возрастная маркировка</a></nav>
    <nav aria-label="Сведения об организации"><a href="/zritelyam.html#org">Сведения об организации</a><a href="/zritelyam.html#docs">Документы и отчёты</a><a href="/zritelyam.html#docs">Независимая оценка качества</a><a href="/zritelyam.html#docs">Противодействие коррупции</a><a href="/zritelyam.html#docs">Вакансии</a></nav>
    <nav aria-label="Государственные сервисы"><a href="https://pos.gosuslugi.ru/" target="_blank" rel="noopener">Решаем вместе · Госуслуги</a><a href="https://www.gosuslugi.ru/culture" target="_blank" rel="noopener">Пушкинская карта</a><a href="https://www.culture.ru/" target="_blank" rel="noopener">Культура.РФ</a><a href="https://bus.gov.ru/" target="_blank" rel="noopener">bus.gov.ru</a></nav>
  </div>
  <div class="ft__b">
    <span>© 1907–2026 КГБУК «Канский драматический театр». Учредитель — министерство культуры Красноярского края. 0+…18+ по 436-ФЗ. Демо: даты и цены условные.</span>
    <span><a href="/privacy.html">Персональные данные</a> · <a href="/zritelyam.html#offer">Оферта</a></span>
    <span class="ft__cmp">Сравнить: <a href="/v11.html?skip">прошлая главная</a> · <a href="/concept-d.html">концепт «Бор»</a> · <a href="/old.html">первая главная</a></span>
  </div>
</footer>`;

let menuOpen = null;
export function initChrome({ overHero = false } = {}) {
  const top = $('[data-chrome]'); if (top) top.outerHTML = HEADER();
  const ft = $('[data-chrome-ft]'); if (ft) ft.outerHTML = FOOTER();
  const hd = $('[data-hd]');
  if (!overHero) hd.classList.add('solid', 'fixed-solid');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY; if (!hd.classList.contains('fixed-solid')) hd.classList.toggle('solid', y > 40 || BVI);
    hd.classList.toggle('up', y > innerHeight && y > lastY + 4 && !$('.sheet.open')); if (y < lastY - 4) hd.classList.remove('up');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // листы (меню; покупка регистрируется в buy.js через openSheet)
  const menu = $('[data-menu]'), mBtn = $('[data-menu-open]');
  mBtn.addEventListener('click', () => openSheet(menu));
  document.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeSheets(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeSheets(); });
  menuOpen = mBtn;

  // версия для слабовидящих
  const bvi = $('[data-bvi]');
  const apply = () => {
    bvi.hidden = !BVI; H.classList.toggle('bvi-on', BVI); H.classList.remove('bvi-bw', 'bvi-wb', 'bvi-blue'); if (!BVI) return;
    H.classList.add('bvi-' + (store.get('bvi-th') || 'bw')); H.style.setProperty('--fs', (store.get('bvi-fs') || 20) + 'px');
  };
  $$('[data-bvi-toggle]').forEach(b => b.addEventListener('click', () => { store.set('bvi', BVI ? '0' : '1'); location.reload(); }));
  $$('[data-fs]').forEach(b => b.addEventListener('click', () => { store.set('bvi-fs', b.dataset.fs); apply(); }));
  $$('[data-th]').forEach(b => b.addEventListener('click', () => { store.set('bvi-th', b.dataset.th); apply(); }));
  apply();
}

let last = null;
export function openSheet(l) {
  last = document.activeElement; l.classList.add('open'); l.setAttribute('aria-hidden', 'false'); H.style.overflow = 'hidden';
  document.dispatchEvent(new CustomEvent('sheet', { detail: true }));
  setTimeout(() => $('.x', l)?.focus({ preventScroll: true }), 60);
  if (l.matches('[data-menu]')) menuOpen?.setAttribute('aria-expanded', 'true');
}
export function closeSheets() {
  $$('.sheet.open').forEach(l => { l.classList.remove('open'); l.setAttribute('aria-hidden', 'true'); });
  menuOpen?.setAttribute('aria-expanded', 'false'); H.style.overflow = '';
  document.dispatchEvent(new CustomEvent('sheet', { detail: false }));
  last?.focus?.({ preventScroll: true });
}

/* 8 — короткая заставка: фасад из логотипа рисуется линиями (~1,2 с) и улетает на место логотипа в шапке.
   Раз за сессию; ?skip — без неё. */
export function intro() {
  let seen = null; try { seen = sessionStorage.getItem('kt-intro'); } catch {}
  if (CALM || seen || new URLSearchParams(location.search).has('skip')) return Promise.resolve();
  try { sessionStorage.setItem('kt-intro', '1'); } catch {}
  const logo = $('.hd__logo'); logo.style.opacity = 0;
  const box = document.createElement('div'); box.className = 'intro2'; box.setAttribute('aria-hidden', 'true');
  box.innerHTML = `<svg viewBox="0 0 ${FACADE.w} ${FACADE.h}"><g>${FACADE.d.map(d => `<path d="${d}" pathLength="1"/>`).join('')}</g><image href="/img/logo-cream.png" width="${FACADE.w}" height="${FACADE.h}" opacity="0"/></svg>`;
  document.body.appendChild(box); H.style.overflow = 'hidden';
  const svg = $('svg', box), paths = $$('path', box), img = $('image', box);
  gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
  return new Promise(res => {
    let fin = false;
    const done = () => { if (fin) return; fin = true; gsap.killTweensOf([svg, box, img, ...paths]); logo.style.opacity = ''; box.remove(); H.style.overflow = ''; res(); };
    setTimeout(done, 2500); // страховка: заставка никогда не держит афишу дольше 2,5 с
    const fly = () => {
      const a = svg.getBoundingClientRect(), b = logo.getBoundingClientRect();
      gsap.timeline({ onComplete: done })
        .to(svg, { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: b.width / a.width, duration: .8, ease: 'expo.inOut' }, 0)
        .to(box, { backgroundColor: 'rgba(11,12,10,0)', duration: .6, ease: 'power1.out' }, .25);
    };
    gsap.timeline({ onComplete: fly })
      .to(paths, { strokeDashoffset: 0, duration: .8, ease: 'power2.inOut', stagger: { amount: .3 } })
      .to(img, { attr: { opacity: 1 }, duration: .35 }, .75)
      .to(paths, { opacity: 0, duration: .3 }, .85);
    box.addEventListener('click', done);
  });
}
