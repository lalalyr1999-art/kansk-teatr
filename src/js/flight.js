// Концепт «Облёт»: линейное здание театра (пропорции — по логотипу), камера облетает фасад,
// входит в двери, летит над рядами к сцене, занавес раскрывается, выезжает шапка.
import * as THREE from 'three';
import gsap from 'gsap';

const $ = s => document.querySelector(s);
const CREAM = 0xECE5D8, PINE = 0x5E6B58, RESIN = 0xD98A4E, BG = 0x0C0D0B;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(BG);
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(BG, 24, 95);
const cam = new THREE.PerspectiveCamera(42, 1, 0.05, 300);
const resize = () => { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
addEventListener('resize', resize); resize();

/* ---------- помощники: линии + «заглушки» (чёрные грани скрывают невидимые линии) ---------- */
class Lines {
  constructor(color, op = 1) { this.p = []; this.mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: op }); }
  seg(a, b) { this.p.push(...a, ...b); return this; }
  poly(pts, close = false) { for (let i = 0; i < pts.length - 1; i++) this.seg(pts[i], pts[i + 1]); if (close) this.seg(pts.at(-1), pts[0]); return this; }
  rect(x0, y0, x1, y1, z) { return this.poly([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], true); }
  win(x, y, w, h, z, cross = true) { this.rect(x - w / 2, y, x + w / 2, y + h, z); this.rect(x - w / 2 + .12, y + .12, x + w / 2 - .12, y + h - .12, z);
    if (cross) { this.seg([x, y + .12, z], [x, y + h - .12, z]); this.seg([x - w / 2 + .12, y + h * .68, z], [x + w / 2 - .12, y + h * .68, z]); } return this; }
  arc(cx, cy, r, a0, a1, z, n = 24) { const pts = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]); } return this.poly(pts); }
  circ(cx, cy, r, z) { return this.arc(cx, cy, r, 0, Math.PI * 2, z, 28); }
  edges(geo, m) { const e = new THREE.EdgesGeometry(geo); e.applyMatrix4(m); const a = e.attributes.position.array; for (let i = 0; i < a.length; i++) this.p.push(a[i]); return this; }
  build() { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3)); return new THREE.LineSegments(g, this.mat); }
}
const occMat = new THREE.MeshBasicMaterial({ color: BG, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
function block(grp, ln, x0, x1, y0, y1, z0, z1) {
  const geo = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), m = new THREE.Matrix4().makeTranslation((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  const mesh = new THREE.Mesh(geo, occMat); mesh.applyMatrix4(m); grp.add(mesh); ln.edges(geo, m);
}

/* ---------- экстерьер ---------- */
const ext = new THREE.Group(); scene.add(ext);
const L = new Lines(CREAM);
// объёмы: крылья, ризалиты, центр, аттик, сценическая коробка
block(ext, L, -16, 16, 0, 7, -14, 0);
block(ext, L, -10, -5.4, 0, 7.6, -1, .8); block(ext, L, 5.4, 10, 0, 7.6, -1, .8);
block(ext, L, -5.2, 5.2, 0, 8.4, -1, 1.4);
block(ext, L, -3, 3, 8.4, 9.3, -.6, 1.2);
block(ext, L, -7, 7, 7, 12, -13.5, -7.5);
// кровля: двускатная, конёк по центру
const roof = (s) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([16.6 * s, 7, .4, 0, 11, .4, 0, 11, -14.4, 16.6 * s, 7, .4, 0, 11, -14.4, 16.6 * s, 7, -14.4], 3));
  ext.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: BG, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }))); };
roof(1); roof(-1);
L.poly([[-16.6, 7, .4], [0, 11, .4], [16.6, 7, .4]]).seg([0, 11, .4], [0, 11, -14.4]).poly([[-16.6, 7, -14.4], [0, 11, -14.4], [16.6, 7, -14.4]])
  .seg([-16.6, 7, .4], [-16.6, 7, -14.4]).seg([16.6, 7, .4], [16.6, 7, -14.4]);
// карнизы и межэтажные тяги
[[-16, -10, .02], [10, 16, .02]].forEach(([a, b, z]) => { L.seg([a, 3.6, z], [b, 3.6, z]).seg([a, 6.6, z], [b, 6.6, z]); });
[[-10, -5.4], [5.4, 10]].forEach(([a, b]) => { L.seg([a, 3.6, .82], [b, 3.6, .82]).seg([a, 7.1, .82], [b, 7.1, .82]); });
L.seg([-5.2, 3.9, 1.42], [5.2, 3.9, 1.42]).seg([-5.2, 7.9, 1.42], [5.2, 7.9, 1.42]);
// окна крыльев (фасад и торцы)
for (const s of [-1, 1]) {
  for (const x of [11.8, 14.3]) { L.win(s * x, .9, 1.1, 2.1, .02); L.win(s * x, 4.2, 1.1, 2, .02); }
  L.win(s * 7.7, .9, 2.2, 2.1, .82); L.win(s * 7.7, 4.4, 2.2, 2.2, .82);
  L.seg([s * 6.2, 0, .82], [s * 6.2, 7.6, .82]).seg([s * 9.2, 0, .82], [s * 9.2, 7.6, .82]);
  for (let z = -2.2; z > -13; z -= 2.6) { const zz = z; const pts = (y, h) => [[s * 16.02, y, zz - .55], [s * 16.02, y, zz + .55], [s * 16.02, y + h, zz + .55], [s * 16.02, y + h, zz - .55]];
    L.poly(pts(.9, 2.1), true).poly(pts(4.2, 2), true); }
}
// центр: пилястры, двери с круглыми окнами, большое окно, арка
for (const x of [-4.6, -2.6, 2.6, 4.6]) L.seg([x, 0, 1.42], [x, 7.9, 1.42]);
for (const x of [-1.3, 0, 1.3]) { L.rect(x - .5, 0, x + .5, 2.5, 1.42); L.circ(x, 3.05, .32, 1.42); }
for (const x of [-3.6, 3.6]) { L.circ(x, 3.0, .4, 1.42); L.win(x, .6, .9, 1.7, 1.42, false); L.win(x, 4.6, .9, 2.4, 1.42); }
L.win(0, 4.4, 4, 2.9, 1.42);
L.arc(0, 8.4, 2.3, 0, Math.PI, 1.22).arc(0, 8.4, 1.8, 0, Math.PI, 1.22).seg([-2.3, 8.4, 1.22], [2.3, 8.4, 1.22]);
for (let i = 1; i < 6; i++) { const a = Math.PI * i / 6; L.seg([1.8 * Math.cos(a), 8.4 + 1.8 * Math.sin(a), 1.22], [0, 8.4, 1.22]); }
ext.add(L.build());
// земля и сосны вокруг
const P = new Lines(PINE, .9);
for (let i = 0; i < 90; i++) {
  const a = Math.random() * Math.PI * 2, r = 22 + Math.random() * 36, x = Math.cos(a) * r, z = Math.sin(a) * r - 6;
  if (z > 8 && Math.abs(x) < 26) continue; // свободная поляна перед фасадом
  const h = 9 + Math.random() * 9, w = 1.4 + Math.random();
  P.seg([x, 0, z], [x, h, z]);
  for (let k = 0; k < 3; k++) { const y = h * (.55 + k * .15), ww = w * (1 - k * .25), t = y + h * .16; P.poly([[x - ww, y, z], [x, t, z], [x + ww, y, z]]).poly([[x, y, z - ww], [x, t, z], [x, y, z + ww]]); }
}
for (let i = -6; i <= 6; i++) P.seg([i * 5, 0, 30], [i * 5, 0, -40]);
for (let j = -8; j <= 6; j++) P.seg([-30, 0, j * 5], [30, 0, j * 5]);
P.mat.opacity = .35;
const pines = P.build(); ext.add(pines);

/* ---------- интерьер: зрительный зал ---------- */
const int = new THREE.Group(); int.visible = false; scene.add(int);
const I = new Lines(CREAM);
I.edges(new THREE.BoxGeometry(16, 9.5, 15), new THREE.Matrix4().makeTranslation(0, 4.75, -6));
I.seg([-8, 4.6, -1], [-8, 4.6, -9.5]).seg([8, 4.6, -1], [8, 4.6, -9.5]).seg([-8, 4.6, -1], [8, 4.6, -1]); // балкон
for (let z = -2; z > -10; z -= 2.2) for (const s of [-1, 1]) I.poly([[s * 8, 1, z], [s * 8, 3.6, z], [s * 8, 3.6, z - 1], [s * 8, 1, z - 1]], true);
// ряды кресел — дуги к сцене
for (let k = 0; k < 11; k++) {
  const r = 3.4 + k * .62, y = .25 + k * .13, cz = -11, amax = Math.min(1.05, Math.asin(Math.min(1, 7.2 / r)));
  const pts = []; for (let i = 0; i <= 30; i++) { const a = -amax + 2 * amax * i / 30; pts.push([r * Math.sin(a), y, cz + r * Math.cos(a)]); }
  I.poly(pts);
  const n = Math.floor(r * amax * 2 / .55); for (let i = 0; i <= n; i++) { const a = -amax + 2 * amax * i / n, x = r * Math.sin(a), z = cz + r * Math.cos(a); I.seg([x, y, z], [x, y + .45, z]); }
}
// сцена и портал
I.rect(-6, 1.1, 6, 1.1, -10).poly([[-6, 1.1, -10], [-6, 1.1, -13.4], [6, 1.1, -13.4], [6, 1.1, -10]]).seg([-6, 0, -10], [-6, 1.1, -10]).seg([6, 0, -10], [6, 1.1, -10]).seg([-6, 0, -10], [6, 0, -10]);
I.rect(-6.8, 0, 6.8, 8.2, -9.9).seg([-5.6, 1.1, -9.9], [-5.6, 6.6, -9.9]).seg([5.6, 1.1, -9.9], [5.6, 6.6, -9.9]).arc(0, 6.6, 5.6, 0, Math.PI, -9.9, 40);
int.add(I.build());
// люстра
const C = new Lines(RESIN); C.mat.opacity = .9;
for (const r of [.7, 1.3, 1.9]) { const pts = []; for (let i = 0; i <= 36; i++) { const a = i / 36 * Math.PI * 2; pts.push([r * Math.cos(a), 8.1 - r * .25, -5.5 + r * Math.sin(a)]); } C.poly(pts); }
for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; C.seg([0, 9.5, -5.5], [1.9 * Math.cos(a), 7.62, -5.5 + 1.9 * Math.sin(a)]); }
int.add(C.build());
// за занавесом — кадр спектакля
const tex = new THREE.TextureLoader().load('/img/romeo-hero.jpg', t => { t.colorSpace = THREE.SRGBColorSpace; });
const photoMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, fog: false });
const photo = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 5.6), photoMat); photo.position.set(0, 3.9, -12.8); int.add(photo);
// занавес — две половины из волнистых линий
const curtain = [];
for (const s of [-1, 1]) {
  const K = new Lines(0xC9B9A0); const g = new THREE.Group();
  for (let i = 0; i < 18; i++) { const x = s * (.15 + i * .3), pts = []; for (let j = 0; j <= 20; j++) { const y = 1.1 + j * 5.5 / 20; pts.push([x + Math.sin(j * .9 + i) * .05, y, -9.6 + Math.sin(i * 1.7) * .12]); } K.poly(pts); }
  K.seg([0, 6.6, -9.6], [s * 5.6, 6.6, -9.6]);
  g.add(K.build()); g.userData.s = s; int.add(g); curtain.push(g);
}

/* ---------- маршрут камеры ---------- */
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const path = new THREE.CatmullRomCurve3([V(40, 15, 26), V(18, 11, 40), V(-14, 9, 38), V(-20, 6, 22), V(-6, 3.6, 14), V(0, 2.1, 6), V(0, 1.6, 2.2), V(0, 3.4, .6), V(0, 4.8, -.2)], false, 'catmullrom', .4);
const look = new THREE.CatmullRomCurve3([V(0, 5, -4), V(0, 5, -3), V(0, 4.5, -2), V(0, 4, 0), V(0, 2.8, 0), V(0, 1.8, -2), V(0, 2.4, -8), V(0, 3.4, -11), V(0, 3.4, -11)], false, 'catmullrom', .4);
const fade = document.createElement('div'); fade.style.cssText = 'position:fixed;inset:0;background:#0C0D0B;pointer-events:none;opacity:0;z-index:2'; document.body.appendChild(fade);
const st = { p: 0, ext: 0 }, cap = $('[data-cap] b');
function place() {
  cam.position.copy(path.getPointAt(st.p)); cam.lookAt(look.getPointAt(st.p));
  const z = cam.position.z, inside = z < 1.0;
  ext.visible = !inside; int.visible = inside;
  const fov = inside ? 56 : 42; if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
  fade.style.opacity = Math.max(0, 1 - Math.abs(z - 1.0) / 1.3);
  scene.fog.near = inside ? 6 : 24; scene.fog.far = inside ? 40 : 95;
  cap.textContent = Math.round(1907 + 120 * Math.min(1, st.p / .92));
}
L.mat.opacity = 0; P.mat.opacity = 0;
let done = false;
const tl = gsap.timeline({ onUpdate: place })
  .to(L.mat, { opacity: 1, duration: 1.4, ease: 'power1.out' }, 0).to(P.mat, { opacity: .5, duration: 2 }, .2)
  .to(st, { p: 1, duration: calm ? .01 : 10, ease: 'power2.inOut' }, .2)
  .add(finale);
function finale() {
  if (done) return; done = true;
  curtain.forEach(g => gsap.to(g.scale, { x: .18, duration: 2.2, ease: 'expo.inOut' }));
  curtain.forEach(g => gsap.to(g.position, { x: g.userData.s * 5.2, duration: 2.2, ease: 'expo.inOut' }));
  gsap.to(photoMat, { opacity: 1, duration: 1.8, delay: .5 });
  gsap.to('[data-cap]', { opacity: 0, duration: .5 });
  gsap.to('[data-skip]', { opacity: 0, duration: .5, onComplete: () => $('[data-skip]').remove() });
  setTimeout(() => { $('[data-top]').classList.add('in'); $('[data-end]').classList.add('in'); }, 900);
}
$('[data-skip]').addEventListener('click', () => { tl.progress(1); place(); finale(); });
place();
renderer.setAnimationLoop(() => { const t = performance.now() / 1000; if (int.visible) curtain.forEach((g, i) => { g.rotation.y = Math.sin(t * .6 + i) * .004; }); renderer.render(scene, cam); });
// отладка: ?t=0…1 — кадр маршрута, ?t=1 — финал
const qt = new URLSearchParams(location.search).get('t');
if (qt !== null) { tl.pause(); st.p = Math.min(1, +qt); L.mat.opacity = 1; P.mat.opacity = .5; place(); if (st.p >= 1) { gsap.globalTimeline.timeScale(50); finale(); } }
