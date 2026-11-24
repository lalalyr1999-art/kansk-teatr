// Страница артиста: artist.html?a=<slug>. Портрет, роли, биография, афиша, вся труппа «поклоном».
import { people } from '../data/people.js';
import { FACE } from '../data/face.js';
import { slug, artistUrl } from '../data/people-util.js';
import { $, initChrome } from './chrome.js';
import { initBuy, EV, MS, WS, picS, time } from './buy.js';

initChrome();
// вернуться туда, откуда пришли (страница согласования или главная)
try { const r = document.referrer && new URL(document.referrer); if (r && r.origin === location.origin && !/artist\.html/.test(r.pathname)) sessionStorage.setItem('ar-back', r.pathname + r.search + '#lyudi'); const b = sessionStorage.getItem('ar-back'); if (b) $('.ar__back').href = b; } catch {}
const sur = p => p.name.split(' ').slice(-1)[0];
const P = [...people].sort((a, b) => sur(a).localeCompare(sur(b), 'ru'));
const want = new URLSearchParams(location.search).get('a');
let i = Math.max(0, P.findIndex(p => slug(p) === want));
const p = P[i], [fx, fy] = FACE[p.f] || [.5, .37];
const w = p.name.split(' ');

document.title = `${p.name} — Канский драматический театр`;
$('meta[name="description"]').content = `${p.name}, артист Канского драматического театра: роли, биография, ближайшие спектакли.`;
const img = $('[data-aimg]'); img.src = `/img/w/people/${p.f}.webp`; img.alt = p.name; img.style.objectPosition = `${fx * 100}% ${fy * 100 - 8}%`;
$('[data-aname]').innerHTML = `${w.slice(0, -1).join(' ')} <i>${w.slice(-1)[0]}</i>`;

// роли: «Роль — «Спектакль»», несколько через «;»  (со старого сайта — уточнить у театра)
const roles = (p.role || '').split(/;\s*/).filter(Boolean).map(r => { const [role, show] = r.split(' — '); return { role, show }; });
$('[data-aroles]').innerHTML = roles.length ? `<h2 class="ar__h">Роли</h2><ul>${roles.map(r => `<li><b>${r.role}</b>${r.show ? `<span>${r.show}</span>` : ''}</li>`).join('')}</ul>` : '';
$('[data-abio]').textContent = 'Текст биографии пришлёт театр: где учился, с какого года в труппе, звания, награды, любимые роли.';

// афиша: спектакли с участием артиста (когда театр пришлёт составы); пока — ближайшие спектакли театра
const mine = EV.filter(e => (e.cast || []).includes(p.name));
const list = (mine.length ? mine : EV).slice(0, 3);
if (!mine.length) $('#arn-h').textContent = 'Ближайшие спектакли театра';
$('[data-anext]').innerHTML = list.map(e => { const d = new Date(e.date); return `<button type="button" class="arx" data-buy="${e.id}"><img src="${picS(e.img)}" alt="" loading="lazy"><span class="arx__d"><b>${d.getDate()} ${MS[d.getMonth()]}</b> ${WS[d.getDay()]}, ${time(d)}</span><span class="arx__t">${e.title}</span><span class="arx__b">Билеты от ${e.price} ₽</span></button>`; }).join('');
initBuy();

// вся труппа: соседи и лица «поклоном»
const prev = P[(i - 1 + P.length) % P.length], next = P[(i + 1) % P.length];
$('[data-apn]').innerHTML = `<a href="${artistUrl(prev)}"><small>← Предыдущий</small>${prev.name}</a><a href="${artistUrl(next)}"><small>Следующий →</small>${next.name}</a>`;
$('[data-afaces]').innerHTML = P.map((q, k) => { const [x, y] = FACE[q.f] || [.5, .37]; const oy = Math.max(0, Math.min(1, (y - .375) / .25)) * 100;
  return `<a href="${artistUrl(q)}" class="${k === i ? 'on' : ''}" aria-label="${q.name}" title="${q.name}"${k === i ? ' aria-current="page"' : ''}><img src="/img/w/people/${q.f}.webp" alt="" loading="lazy" style="object-position:50% ${oy.toFixed(0)}%"></a>`; }).join('');
// свайп по странице на телефоне — соседний артист
{ let x0, y0; const m = $('.ar');
  m.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  m.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 2) location.href = artistUrl(dx < 0 ? next : prev); });
}
