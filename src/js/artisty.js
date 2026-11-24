// Страница для согласования блока «Люди театра»: варианты блока и как открывается артист. После выбора — перенести на главную.
import { people } from '../data/people.js';
import { FACE } from '../data/face.js';
import { $, initChrome } from './chrome.js';
import { initBuy } from './buy.js';

initChrome();
initBuy();
// «Обычный» вариант — та же сетка, что на главной сейчас
const sur = p => p.name.split(' ').slice(-1)[0];
$('[data-people]').innerHTML = [...people].sort((a, b) => sur(a).localeCompare(sur(b), 'ru')).map(p => { const [x, y] = FACE[p.f] || [.5, .37];
  return `<figure class="pp" role="listitem"><div class="pp__ph" style="--x:${x};--y:${y}"><img src="/img/w/people/${p.f}.webp" alt="${p.name}" loading="lazy"></div><figcaption><strong>${p.name}</strong></figcaption></figure>`; }).join('');
import('./lyudi-v.js');
