// Переключатели вариантов: «Подарить / Новости», «Льготы» (где стоят) и подвал (новый / прежний).
import { blockSwitch } from './blocks.js';

export function initMisc({ ScrollTrigger }) {
  const gn = document.querySelector('[data-gnw]');
  if (gn) blockSwitch(gn, 'gift', [
    { k: 'v', t: 'Сертификат вертикальный' },
    { k: 'h', t: 'Сертификат карточкой' }
  ], k => { gn.dataset.gv = k; ScrollTrigger.refresh(); });

  const ft = document.querySelector('.foot');
  if (ft) blockSwitch(ft, 'foot', [{ k: 'all', t: 'Всё в одно' }, { k: 'new', t: 'Сцена над контактами' }, { k: 'sep', t: 'Сцена отдельно' }, { k: 'old', t: 'Прежний' }], k => { ft.classList.toggle('foot--old', k == 'old'); ft.classList.toggle('foot--sep', k == 'sep'); ft.classList.toggle('foot--all', k == 'all'); ScrollTrigger.refresh(); });
}
