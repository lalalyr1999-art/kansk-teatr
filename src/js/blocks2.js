// Переключатели вариантов: «Подарить / Новости», «Льготы» (где стоят) и подвал (новый / прежний).
import { blockSwitch } from './blocks.js';

export function initMisc({ ScrollTrigger }) {
  const gn = document.querySelector('[data-gnw]');
  if (gn) blockSwitch(gn, 'gift', [
    { k: 'v', t: 'Сертификат вертикальный' },
    { k: 'h', t: 'Сертификат карточкой' },
    { k: 'news', t: 'Новости театра' }
  ], k => { gn.dataset.gnw = k == 'news' ? 'news' : 'gift'; gn.dataset.gv = k; ScrollTrigger.refresh(); });

  const pk = document.querySelector('#perks'), place = document.querySelector('.place[data-place]'), foot = document.querySelector('.foot');
  if (pk && place && foot) blockSwitch(pk, 'perks', [
    { k: 'end', t: 'Перед подвалом' },
    { k: 'mid', t: 'После «Нам 120»' }
  ], k => { k == 'mid' ? place.before(pk) : foot.before(pk); ScrollTrigger.refresh(); });

  const ft = document.querySelector('.foot');
  if (ft) blockSwitch(ft, 'foot', [{ k: 'new', t: 'Сцена над контактами' }, { k: 'all', t: 'Всё в одно' }, { k: 'sep', t: 'Сцена отдельно' }, { k: 'old', t: 'Прежний' }], k => { ft.classList.toggle('foot--old', k == 'old'); ft.classList.toggle('foot--sep', k == 'sep'); ft.classList.toggle('foot--all', k == 'all'); ScrollTrigger.refresh(); });
}
