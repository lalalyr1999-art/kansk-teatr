// Страница «О театре»: спил с кольцами, отсчёт до юбилея, «найдите своё кольцо».
import gsap from 'gsap';
import { $, $$, CALM, initChrome } from './chrome.js';

initChrome();
const Y0 = 1907, Y1 = 2027, R0 = .015, R1 = .43;
const rOf = y => R0 + (y - Y0) / (Y1 - Y0) * (R1 - R0), yOf = r => Math.round(Y0 + (r - R0) / (R1 - R0) * (Y1 - Y0));
const ru = (n, a, b, c) => { const m = n % 10, h = n % 100; return m == 1 && h != 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };

/* отсчёт */
const T = Date.parse('2027-04-05T00:00:00+07:00'), p2 = n => String(n).padStart(2, '0');
const tick = () => { const s = Math.max(0, T - Date.now()) / 1000; $('[data-cd="d"]').textContent = Math.floor(s / 86400); $('[data-cd="h"]').textContent = p2(Math.floor(s % 86400 / 3600)); $('[data-cd="m"]').textContent = p2(Math.floor(s % 3600 / 60)); };
tick(); setInterval(tick, 15000);

/* своё кольцо: по году или наведением на спил */
const disc = $('[data-disc]'), ring = $('[data-ring]'), yr = $('[data-yr]'), out = $('[data-ringout]');
const showY = y => {
  y = Math.max(Y0, Math.min(2026, y)); const age = y - Y0, now = 2026 - y;
  ring.setAttribute('r', (rOf(y) * 100).toFixed(2)); disc.classList.add('pick'); yr.textContent = y;
  document.dispatchEvent(new CustomEvent('ring-year', { detail: y })); // сосна растёт и поворачивается вместе с ползунком
  out.innerHTML = age == 0 ? '1907 — год, когда всё началось.' : `В ${y} году театру было <b>${age} ${ru(age, 'год', 'года', 'лет')}</b>. С тех пор у сосны — ещё ${now} ${ru(now, 'кольцо', 'кольца', 'колец')}, у нас — ${now} ${ru(now, 'сезон', 'сезона', 'сезонов')}.`;
};
const sl = $('[data-ringsl]');
const atPt = e => { const b = disc.getBoundingClientRect(); const r = Math.hypot(e.clientX - b.left - b.width / 2, e.clientY - b.top - b.height / 2) / b.width; if (r <= R1 + .01) { const y = yOf(r); showY(y); sl.value = y; } };
// мышь — наведением; телефон — касанием и движением пальца вбок (вертикально страница листается), плюс ползунок
disc.addEventListener('pointermove', atPt);
disc.addEventListener('pointerdown', atPt);
sl.addEventListener('input', () => { showY(+sl.value); $('#ry').value = sl.value; });
$('[data-ringf]').addEventListener('submit', e => { e.preventDefault(); const y = +$('#ry').value; if (y >= Y0 && y <= 2026) { showY(y); sl.value = y; } else out.textContent = 'Введите год от 1907 до 2026.'; });

/* появление */
if (!CALM) {
  gsap.from('.th__img', { scale: 1.1, duration: 2.4, ease: 'expo.out' });
  gsap.from('.th__in > *', { opacity: 0, y: 24, duration: 1.1, ease: 'expo.out', stagger: .08, delay: .2 });
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { gsap.to(x.target, { opacity: 1, y: 0, rotate: 0, duration: 1.2, ease: 'expo.out' }); io.unobserve(x.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.y12__tx, .tl li, .facts12 > div, .way__tx, .way__img, .more .tile').forEach(el => { gsap.set(el, { opacity: 0, y: 30 }); io.observe(el); });
  gsap.set('.y12__disc', { opacity: 0, rotate: -30 }); io.observe($('.y12__disc'));
}

import('./sosna.js');
