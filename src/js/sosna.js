// Сосна у спила: 60 кадров на 1907…2026 (кадр на 2 года) — в каждом своя высота и свой поворот.
// Ползунок года задаёт положение; между соседними кадрами — плавное перетекание (два слоя), без щелчков.
const box = document.querySelector('.y12__pine');
if (box) {
  const N = 60, Y0 = 1907, Y1 = 2026, src = i => `/img/w/sosna/${String(i).padStart(3, '0')}.webp`;
  box.innerHTML = '<img alt="" data-a><img alt="" data-b>';
  const A = box.querySelector('[data-a]'), B = box.querySelector('[data-b]');
  const cache = [];
  const sl = document.querySelector('[data-ringsl]');
  let pos = ((+sl?.value || 1966) - Y0) / (Y1 - Y0) * (N - 1), target = pos, raf = 0, loaded = false;
  // нарисовать дробное положение: нижний кадр полностью, верхний — с прозрачностью по дробной части
  const draw = () => {
    const i = Math.floor(pos), j = Math.min(N - 1, i + 1), t = pos - i;
    const sa = src(i), sb = src(j);
    if (A.dataset.i != i) { A.src = sa; A.dataset.i = i; }
    if (B.dataset.i != j) { B.src = sb; B.dataset.i = j; }
    B.style.opacity = t.toFixed(3);
    box.style.setProperty('--g', Math.pow(pos / (N - 1), 1.3).toFixed(4)); // чем старше — тем ниже: ствол уходит за край, видна крона
  };
  // мягкая догонялка: сосна «докручивается» к выбранному году, а не перескакивает
  const tick = () => {
    const d = target - pos;
    if (Math.abs(d) < .01) { pos = target; draw(); raf = 0; return; }
    pos += d * .16 + Math.sign(d) * Math.min(Math.abs(d), .02);
    draw(); raf = requestAnimationFrame(tick);
  };
  document.addEventListener('ring-year', e => { target = Math.max(0, Math.min(N - 1, (e.detail - Y0) / (Y1 - Y0) * (N - 1))); if (!raf) raf = requestAnimationFrame(tick); });
  draw();
  // подгрузить все кадры заранее, когда блок близко к экрану
  new IntersectionObserver(([x], o) => { if (!x.isIntersecting || loaded) return; loaded = true; o.disconnect();
    for (let i = 0; i < N; i++) { const im = new Image(); im.decoding = 'async'; im.src = src(i); cache[i] = im; } }, { rootMargin: '800px 0px' }).observe(box);
}
