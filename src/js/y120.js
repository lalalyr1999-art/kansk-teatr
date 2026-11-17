// «Нам 120» — все варианты с переключателем у блока: набор A (c120a), B (c120b), C (c120).
import { blockSwitch } from './blocks.js';
import { initSetA } from './c120a.js';
import { initSetB } from './c120b.js';
import { initSetC } from './c120.js';

export function init120({ gsap, ScrollTrigger, CALM }) {
  const sec = document.querySelector('.y120'); if (!sec) return;
  const box = k => sec.querySelector(`[data-set="${k}"]`);
  const sets = {
    A: initSetA(box('A'), { ScrollTrigger, CALM }),
    B: initSetB(box('B'), { ScrollTrigger, CALM }),
    C: initSetC(box('C'), { gsap, ScrollTrigger, CALM })
  };
  const OPT = [
    { k: 'c1', t: 'Спил из фото', s: 'C', v: 1 },
    { k: 'c2', t: 'Покрути время', s: 'C', v: 2 },
    { k: 'a0', t: 'Исходный спил', s: 'A', v: 0 },
    { k: 'a1', t: 'Растёт', s: 'A', v: 1 },
    { k: 'a2', t: 'Ваше кольцо', s: 'A', v: 2 },
    { k: 'a3', t: 'Отсчёт', s: 'A', v: 3 },
    { k: 'b1', t: 'Сквозь кольца', s: 'B', v: 1 },
    { k: 'b2', t: 'Сосна растёт', s: 'B', v: 2 }
  ];
  blockSwitch(sec, 'y120', OPT, k => {
    const o = OPT.find(x => x.k == k);
    Object.entries(sets).forEach(([n, s]) => n != o.s && s.stop());
    sec.dataset.set = o.s;
    requestAnimationFrame(() => sets[o.s].setV(o.v));
  });
}
