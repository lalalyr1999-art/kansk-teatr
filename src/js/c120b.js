// «Нам 120», набор B: 1 сквозь кольца, 2 сосна растёт, 3 зал из 120 кресел. Восстановлено из прошлой версии.
// Архивные фото: фонд Канского краеведческого музея (публикации театра «Страницы памяти», 2024).
const A = '/img/arch/';
const EVB = [
  { y: 1907, t: 'Начало', d: '5 апреля в Канске зарегистрировано «Общество любителей драматического искусства, музыки и пения».' },
  { y: 1920, t: 'Государственный театр', d: 'По приглашению ревкома из Иркутска приезжают пять артистов — в Канске появляется профессиональная труппа.' },
  { y: 1937, t: 'Труппа сезона 1937/38', d: 'Коллектив Канского горгостеатра.', img: A + '1937.jpg', arch: 1 },
  { y: 1941, t: 'Война', d: 'Актёры уходили на фронт прямо со сцены.' },
  { y: 1945, t: '«Чужой ребёнок»', d: 'Программа спектакля сезона 1945/46 — первого мирного сезона.', img: A + '1945a.jpg', arch: 1 },
  { y: 1954, t: '35-й год работы', d: 'Программа сезона 1954/55 Канского городского драматического театра.', img: A + '1954.jpg', arch: 1 },
  { y: 1967, t: 'Дед Щукарь', d: 'Старейший артист театра, на сцене с 30-х, — в роли деда Щукаря на праздничной демонстрации.', img: A + '1967.jpg', arch: 1 },
  { y: 1970, t: '50 лет государственному театру', d: 'Юбилейный вечер в зале театра, декабрь 1970-го.', img: A + '1970.jpg', arch: 1 },
  { y: 1993, t: 'Свой дом', d: 'Театр обретает постоянное здание.', img: '/img/zdanie.jpg' },
  { y: 2007, t: 'Сто лет', d: 'Театр отмечает вековой юбилей.' },
  { y: 2025, t: '118 лет', d: 'Зрители подписали полотно пожеланий — и вся труппа вышла с ним на сцену.', img: A + '2025.jpg' },
  { y: 2027, t: '120 лет', d: '5 апреля 2027 — юбилей. 120-й сезон уже идёт.' }
];
const ru = (n, a, b, c) => { const m = n % 10, h = n % 100; return m == 1 && h != 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const sm = (a, b, v) => { const t = cl((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const card = (e, cls = '') => `<article class="ev ${cls}${e.img ? '' : ' ev--t'}">${e.img ? `<div class="ev__ph"><img src="${e.img}" alt="${e.t}" loading="lazy"></div>` : ''}<div class="ev__b"><b>${e.y}</b><strong>${e.t}</strong><p>${e.d}</p>${e.arch ? '<small>Фото: фонд Канского краеведческого музея</small>' : ''}</div></article>`;

export function initSetB(root, { ScrollTrigger, CALM }) {
  const $ = (s, r = root) => r.querySelector(s), $$ = (s, r = root) => [...r.querySelectorAll(s)];
  let V = 0;
  const upd = {}, trg = {};

  /* ---------- 1. Сквозь кольца ---------- */
  {
    const st = $('[data-tun]'), cv = $('canvas', st), ctx = cv.getContext('2d'), yrEl = $('[data-tyr]', st);
    const intro = $('[data-tintro]', st), end = $('[data-tend]', st), cardsEl = $('[data-tcards]', st);
    const evs = EVB.filter(e => e.y > 1907 && e.y < 2027);
    cardsEl.innerHTML = evs.map(e => card(e, 'ev--fly')).join('');
    const cards = $$('.ev', cardsEl);
    const ANG = [-38, 205, 28, 152, -70, 240, 8, 172, -55, 220];
    const K = .12, Y0 = 1907, YS = 2030.6;
    let rnd = 7; const R = () => (rnd = (rnd * 16807) % 2147483647) / 2147483647;
    const ring = {}; for (let y = 1900; y <= 2034; y++) ring[y] = { j: (R() - .5) * .03, c: R(), p1: R() * 6.28, p2: R() * 6.28 };
    let W = 0, Hh = 0, dpr = 1, P = 0;
    const size = () => { if (!st.clientWidth) return; dpr = Math.min(2, devicePixelRatio || 1); W = st.clientWidth; Hh = st.clientHeight; cv.width = W * dpr; cv.height = Hh * dpr; cv.style.width = W + 'px'; cv.style.height = Hh + 'px'; draw(P); };
    const wood = (y, c) => { const age = cl((2027 - y) / 120); const l = 66 - age * 12 + c * 7; return `hsl(${31 - age * 7},${70 + age * 10}%,${l}%)`; };
    function path(cx, cy, r, y) {
      const g = ring[y], N = r < 40 ? 28 : 90; ctx.beginPath();
      for (let i = 0; i <= N; i++) { const a = i / N * 6.2832, k = 1 + .022 * Math.sin(3 * a + g.p1 + y * .05) + .012 * Math.sin(7 * a + g.p2) + g.j; const x = cx + Math.cos(a) * r * k, yy = cy + Math.sin(a) * r * k; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }
      ctx.closePath();
    }
    function draw(p) {
      P = p; if (!W) return;
      const m = Math.min(W, Hh), base = .6 * m, q = cl((p - .05) / .88), Yc = YS - (YS - 1905.6) * q;
      const mob = W < 900, cx = mob ? W / 2 : W * (.5 + .2 * (1 - sm(0, .06, p))), cy = mob ? Hh * (.5 + .12 * (1 - sm(0, .06, p))) : Hh / 2;
      const diag = Math.hypot(W, Hh);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = '#141612'; ctx.fillRect(0, 0, W, Hh);
      const rr = y => base * Math.exp(K * (y - Yc));
      const rb = rr(2027);
      if (rb * 1.06 < diag * 1.3) { path(cx, cy, rb * 1.13, 2030); ctx.fillStyle = '#2b1a10'; ctx.fill(); path(cx, cy, rb * 1.06, 2029); ctx.fillStyle = '#6e3418'; ctx.fill(); }
      for (let y = 2027; y >= Y0; y--) {
        const r = rr(y); if (r > diag * 1.3 && y > Y0) { if (rr(y - 1) > diag * 1.3) continue; }
        if (r < .6) break;
        path(cx, cy, r, y);
        ctx.fillStyle = wood(y, ring[y].c); ctx.fill();
        ctx.lineWidth = Math.max(.6, r * .018); ctx.strokeStyle = 'rgba(110,40,12,.7)'; ctx.stroke();
      }
      evs.forEach(e => { const r = rr(e.y); if (r < 6 || r > diag) return; path(cx, cy, r, e.y); ctx.lineWidth = Math.max(1.2, r * .006); ctx.strokeStyle = 'rgba(255,248,235,.95)'; ctx.stroke(); });
      if (rr(Y0) > 1) { ctx.beginPath(); ctx.arc(cx, cy, Math.max(1.5, rr(Y0) * .35), 0, 6.283); ctx.fillStyle = '#6b3519'; ctx.fill(); }
      const g = ctx.createRadialGradient(W / 2, Hh / 2, m * .3, W / 2, Hh / 2, diag * .62); g.addColorStop(0, 'rgba(12,13,11,0)'); g.addColorStop(1, 'rgba(12,13,11,.55)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
      cards.forEach((c, i) => {
        const e = evs[i], r = rr(e.y), s = r / (m * .3), o = sm(.38, .62, s) * (1 - sm(1.5, 2.4, s)) * sm(.045, .075, p);
        if (o <= .001) { c.style.opacity = 0; c.style.visibility = 'hidden'; return; }
        const a = ANG[i % ANG.length] * Math.PI / 180, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        c.style.visibility = 'visible'; c.style.opacity = o; c.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${Math.min(s, 2.4) * (mob ? .7 : 1)})`;
        c.style.zIndex = Math.round(s * 100);
      });
      yrEl.textContent = Math.round(cl(Yc, 1907, 2027));
      yrEl.style.opacity = sm(.03, .07, p) * (1 - sm(.93, .97, p));
      intro.style.opacity = 1 - sm(.015, .05, p); intro.style.pointerEvents = p < .04 ? '' : 'none';
      end.style.opacity = sm(.93, .98, p);
    }
    upd[1] = p => { size(); draw(p); };
    addEventListener('resize', size);
    trg[1] = ScrollTrigger.create({ trigger: st.parentElement, start: 'top top', end: 'bottom bottom', onUpdate: s => V == 1 && draw(s.progress) });
  }

  /* ---------- 2. Сосна растёт ---------- */
  {
    const st = $('[data-tree]'), w = $('[data-gw]', st), yrEl = $('[data-gyr]', st), intro = $('[data-gintro]', st);
    const L = 3200, TOP = 640, WH = L + TOP;
    w.style.height = WH + 'px';
    const yOf = y => 40 + (y - 1907) / 120 * (L - 80);
    const evs = EVB.filter(e => e.y < 2027);
    const tuft = '<svg class="tr__tuft" viewBox="-30 -30 60 60" aria-hidden="true">' + Array.from({ length: 12 }, (_, k) => `<line x1="0" y1="0" x2="${(26 * Math.cos(k * .5236)).toFixed(1)}" y2="${(26 * Math.sin(k * .5236)).toFixed(1)}"/>`).join('') + '</svg>';
    w.innerHTML = `<div class="tr__trunk" data-trunk></div><div class="tr__tip" data-tip><span>1907</span></div>
      <div class="tr__ground"><span>1907</span></div>
      ${evs.map((e, i) => { const side = i % 2 ? 'l' : 'r'; return `<div class="tr__br tr__br--${side}" style="bottom:${yOf(e.y)}px"><svg viewBox="0 0 200 70" preserveAspectRatio="none"><path pathLength="1" d="M0,68 C60,64 110,40 200,6"/></svg><span class="tr__nd">${tuft}</span>${card(e, 'ev--br')}</div>`; }).join('')}
      <div class="tr__crown" data-crown style="bottom:${L - 30}px"><svg viewBox="0 0 600 300" aria-hidden="true"><g fill="#2c3b2a"><ellipse cx="300" cy="190" rx="250" ry="70"/><ellipse cx="190" cy="150" rx="150" ry="62"/><ellipse cx="420" cy="140" rx="150" ry="60"/><ellipse cx="300" cy="105" rx="170" ry="64"/><ellipse cx="240" cy="70" rx="100" ry="44"/><ellipse cx="370" cy="62" rx="90" ry="40"/></g><g fill="#3d5239" opacity=".9"><ellipse cx="250" cy="120" rx="90" ry="30"/><ellipse cx="380" cy="100" rx="80" ry="26"/><ellipse cx="300" cy="170" rx="140" ry="34"/></g><path d="M300,300 L300,170 M300,210 L230,160 M300,200 L380,150" stroke="#6b3a22" stroke-width="10" fill="none"/></svg><div class="tr__120"><b>120</b><span>лет · 1907–2027</span></div></div>`;
    const trunk = $('[data-trunk]', w), tip = $('[data-tip]', w), crown = $('[data-crown]', w), brs = $$('.tr__br', w), tipY = $('span', tip);
    function draw(p) {
      const vh = st.clientHeight, gp = cl(p / .88), h = Math.max(30, gp * L);
      trunk.style.height = h + 'px'; tip.style.bottom = h + 'px'; tip.style.opacity = gp < .99 ? 1 : 0;
      brs.forEach(b => b.classList.toggle('on', h >= parseFloat(b.style.bottom) + 10));
      crown.classList.toggle('on', gp > .96);
      const ty = cl(h - vh * .55, 0, WH - vh);
      w.style.transform = `translateY(${ty}px)`;
      const y = Math.min(2027, Math.round(1907 + gp * 120));
      yrEl.textContent = y; tipY.textContent = y;
      yrEl.style.opacity = .1 * (1 - sm(.9, .96, p));
      intro.style.opacity = 1 - sm(.02, .07, p);
    }
    upd[2] = draw;
    trg[2] = ScrollTrigger.create({ trigger: st.parentElement, start: 'top top', end: 'bottom bottom', onUpdate: s => V == 2 && draw(s.progress) });
  }

  /* ---------- 3. Зал из 120 кресел ---------- */
  {
    const hall = $('[data-hall]'), svg = $('[data-hseats]', hall), scr = $('[data-hscr]', hall), out = $('[data-hout]', hall);
    const ROWS = [10, 11, 12, 13, 14, 15, 15, 15, 15], CX = 500, CY = -300;
    const seats = []; let yr = 1907;
    ROWS.forEach((n, r) => { const Rr = 440 + r * 52, d = 50 / Rr; for (let i = 0; i < n; i++) { const th = (i - (n - 1) / 2) * d; seats.push({ y: yr++, row: r + 1, n: i + 1, x: CX + Rr * Math.sin(th), yy: CY + Rr * Math.cos(th), rot: -th * 180 / Math.PI }); } });
    const evY = new Map(EVB.map(e => [e.y, e]));
    svg.innerHTML = seats.map((s, i) => `<g class="st${evY.has(s.y) ? ' ev1' : ''}" data-i="${i}" tabindex="0" role="button" aria-label="${s.y}" transform="translate(${s.x.toFixed(1)},${s.yy.toFixed(1)}) rotate(${s.rot.toFixed(1)})"><rect class="st__b" x="-17" y="-2" width="34" height="11" rx="4"/><rect class="st__s" x="-15" y="-14" width="30" height="14" rx="4"/>${evY.has(s.y) ? '<circle cx="0" cy="-7" r="2.6" class="st__d"/>' : ''}</g>`).join('');
    const gs = $$('.st', svg);
    let auto = 0, autoT;
    const show = (i, me) => {
      const s = seats[i], e = evY.get(s.y), age = s.y - 1907 + 1;
      gs.forEach((g, k) => g.classList.toggle('sel', k == i));
      scr.innerHTML = `${e && e.img ? `<div class="scr__ph"><img src="${e.img}" alt="${e.t}"></div>` : `<div class="scr__ph scr__ph--t"><span>${s.y}</span></div>`}
        <div class="scr__b"><b>${s.y}</b><span class="scr__k">${age}-й год театра · ряд ${s.row}, место ${s.n}</span>${me ? `<strong>Ваше место в зале</strong><p>В ${s.y} году театру было ${age - 1} ${ru(age - 1, 'год', 'года', 'лет')}. Приходите — для вас всегда найдётся кресло.</p>` : e ? `<strong>${e.t}</strong><p>${e.d}</p>${e.arch ? '<small>Фото: фонд Канского краеведческого музея</small>' : ''}` : `<p>Ещё один сезон, ещё одно кольцо на сосне. Наведите на кресло с огоньком — там истории.</p>`}</div>`;
    };
    const stop = () => { clearInterval(autoT); autoT = 0; };
    const evIdx = seats.map((s, i) => evY.has(s.y) ? i : -1).filter(i => i >= 0);
    const startAuto = () => { if (autoT || CALM) return; autoT = setInterval(() => { auto = (auto + 1) % evIdx.length; show(evIdx[auto]); }, 3800); };
    show(evIdx[0]);
    gs.forEach((g, i) => { const f = () => { stop(); show(i); }; g.addEventListener('pointerenter', f); g.addEventListener('focus', f); g.addEventListener('click', f); });
    $('[data-hform]', hall).addEventListener('submit', ev => { ev.preventDefault(); const y = +$('input', $('[data-hform]', hall)).value; if (y >= 1907 && y <= 2026) { stop(); const i = y - 1907; gs.forEach(g => g.classList.remove('me')); gs[i].classList.add('me'); show(i, 1); out.textContent = `Ряд ${seats[i].row}, место ${seats[i].n}`; } else out.textContent = 'Введите год от 1907 до 2026'; });
    const fill = p => { const n = Math.round(p * 120); gs.forEach((g, i) => g.classList.toggle('on', i < n)); $('[data-hcnt]', hall).textContent = n; };
    upd[3] = p => { fill(p); startAuto(); };
    upd[3].stop = stop;
    trg[3] = CALM ? null : ScrollTrigger.create({ trigger: svg, start: 'top 85%', end: 'bottom 55%', onUpdate: s => V == 3 && fill(s.progress), onLeave: () => V == 3 && fill(1) });
  }

  const box = root.firstElementChild;
  const setV = v => {
    V = v; box.dataset.v = v;
    if (v != 3) upd[3].stop();
    ScrollTrigger.refresh();
    upd[v](CALM ? 1 : trg[v] ? trg[v].progress : 1);
  };
  const stop = () => { V = 0; upd[3].stop(); };
  return { setV, stop };
}
