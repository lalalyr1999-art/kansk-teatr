// Концепт «Пролёт»: реальные фото театра + карты глубины (Depth Anything V2, tools/depth.py)
// → 2.5D-камера: наезд с параллаксом, покачивание дрона, снег, зерно. Финал — шапка сайта.
import * as THREE from 'three';

const $ = s => document.querySelector(s);
// f — точка, куда летим (uv), z — наезд от/до, s — сила параллакса, d — боковой дрейф
const SHOTS = [
  { id: 'gates',  dur: 3.6, f: [.5, .56], z: [1.0, 2.1], s: .9,  d: [.012, 0],    t: 'Сосновый бор', c: '140 га, сосны до 130 лет — вокруг театра' },
  { id: 'facade', dur: 3.4, f: [.5, .64], z: [1.0, 1.75], s: .55, d: [-.02, .004], t: 'Канский драматический театр', c: 'с 1907 года · 120-й сезон' },
  { id: 'entry',  dur: 2.8, f: [.62, .5], z: [1.05, 1.9], s: .7,  d: [.015, 0],   t: 'Добро пожаловать', c: 'ул. 40 лет Октября, 31' },
  { id: 'hall',   dur: 4.2, f: [.5, .55], z: [1.0, 1.6],  s: .8,  d: [0, .006],   t: 'Зрительный зал', c: 'около 270 мест · сцена' },
];
const XF = .8; // длительность склейки, с
const qs = new URLSearchParams(location.search);

const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const loader = new THREE.TextureLoader();
const load = u => new Promise(r => loader.load(u, t => { t.colorSpace = THREE.NoColorSpace; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; r(t); }));

const U = {
  tA: { value: null }, dA: { value: null }, aA: { value: 1.5 }, pA: { value: new THREE.Vector4() }, xA: { value: new THREE.Vector4() },
  tB: { value: null }, dB: { value: null }, aB: { value: 1.5 }, pB: { value: new THREE.Vector4() }, xB: { value: new THREE.Vector4() },
  mixv: { value: 0 }, view: { value: 1.7 }, time: { value: 0 }, fade: { value: 0 },
};
const frag = `
precision highp float;
varying vec2 vUv;
uniform sampler2D tA,dA,tB,dB; uniform float aA,aB,mixv,view,time,fade;
uniform vec4 pA,xA,pB,xB; // p: focus.xy, zoom, strength; x: drift.xy, t, roll
vec2 cover(vec2 uv,float ia){ vec2 p=uv-.5; if(view>ia) p.y*=ia/view; else p.x*=view/ia; return p+.5; }
vec3 shot(sampler2D T,sampler2D D,float ia,vec4 p,vec4 x){
  vec2 uv=cover(vUv,ia);
  float r=x.w; uv-=.5; uv=mat2(cos(r),-sin(r),sin(r),cos(r))*uv; uv+=.5;
  vec2 q=uv;
  for(int i=0;i<4;i++){ float d=texture2D(D,q).r; float zf=p.z*(1.+p.w*d*x.z); q=p.xy+(uv-p.xy)/zf+x.xy*d*x.z; }
  return texture2D(T,clamp(q,.001,.999)).rgb;
}
float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233))+time*7.)*43758.5453); }
void main(){
  vec3 a=shot(tA,dA,aA,pA,xA), b=shot(tB,dB,aB,pB,xB);
  vec3 c=mix(a,b,mixv);
  c=mix(c,c*vec3(1.02,1.0,.97),.6);             // тёплый грейд
  float v=smoothstep(1.15,.35,length(vUv-.5)*1.25); c*=mix(.62,1.,v);  // виньетка
  c+= (h(vUv*800.)-.5)*.045;                      // зерно
  c*= 1.-fade;
  gl_FragColor=vec4(c,1.);
}`;
const mat = new THREE.ShaderMaterial({ uniforms: U, vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}', fragmentShader: frag });
scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
const resize = () => { renderer.setSize(innerWidth, innerHeight, false); U.view.value = innerWidth / innerHeight; sn.width = innerWidth; sn.height = innerHeight; };

/* снег: три слоя, ближние крупнее и быстрее */
const sn = $('#snow'), sx = sn.getContext('2d');
const flakes = Array.from({ length: 260 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random() }));
let snowOn = 1;
function snow(dt, push) {
  sx.clearRect(0, 0, sn.width, sn.height); if (snowOn <= .01) return;
  sx.fillStyle = `rgba(255,255,255,${.75 * snowOn})`;
  for (const f of flakes) {
    const sp = .25 + f.z * .9;
    f.y += dt * .05 * sp; f.x += dt * (.012 * Math.sin(f.y * 6 + f.z * 9));
    // наезд: снежинки разлетаются от центра
    f.x += (f.x - .5) * dt * push * (.2 + f.z); f.y += (f.y - .5) * dt * push * (.2 + f.z);
    if (f.y > 1.05 || f.x < -.05 || f.x > 1.05 || f.y < -.05) { f.x = .5 + (Math.random() - .5) * .9; f.y = Math.random() * .5 - .05; f.z = Math.random(); }
    sx.beginPath(); sx.arc(f.x * sn.width, f.y * sn.height, .6 + f.z * 2.2, 0, 7); sx.fill();
  }
}

const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const io = t => t * t * (3 - 2 * t);
function setShot(k, s, t, tex, i) { // t 0..1 внутри кадра (с запасом под склейку)
  const z = s.z[0] + (s.z[1] - s.z[0]) * ease(Math.min(1, t));
  U['p' + k].value.set(s.f[0], s.f[1], z, s.s);
  U['x' + k].value.set(s.d[0], s.d[1], Math.min(1.2, t), Math.sin(t * 2.4 + i) * .006);
  U['t' + k].value = tex[i].img; U['d' + k].value = tex[i].dep; U['a' + k].value = tex[i].ar;
}

(async () => {
  const tex = await Promise.all(SHOTS.map(async s => { const [img, dep] = await Promise.all([load(`/img/fly/${s.id}.jpg`), load(`/img/fly/${s.id}-d.png`)]); return { img, dep, ar: img.image.width / img.image.height }; }));
  addEventListener('resize', resize); resize();
  const starts = []; let acc = 0; SHOTS.forEach(s => { starts.push(acc); acc += s.dur; });
  const TOTAL = acc; let t0 = performance.now(), last = t0, ended = false, capI = -1;
  const fixed = qs.has('t') ? +qs.get('t') * TOTAL : null;
  const cap = i => { if (i === capI) return; capI = i; const c = $('[data-cap]'); c.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: 'cubic-bezier(.22,.8,.2,1)' }); $('[data-ct]').textContent = SHOTS[i].t; $('[data-cs]').textContent = SHOTS[i].c; };
  function end() { if (ended) return; ended = true; $('[data-top]').classList.add('in'); $('[data-end]').classList.add('in'); $('[data-cap]').style.display = 'none'; $('[data-rec]').style.opacity = 0; $('[data-skip]').remove(); }
  $('[data-skip]').addEventListener('click', () => { t0 = performance.now() - TOTAL * 1000; });
  renderer.setAnimationLoop(now => {
    const T = fixed ?? (now - t0) / 1000, dt = Math.min(.05, (now - last) / 1000); last = now;
    let i = SHOTS.findIndex((s, k) => T < starts[k] + s.dur); if (i < 0) i = SHOTS.length - 1;
    const s = SHOTS[i], lt = (T - starts[i]) / s.dur;
    setShot('A', s, Math.min(lt, 1.6), tex, i);
    const next = SHOTS[i + 1], into = T - (starts[i] + s.dur - XF);
    if (next && into > 0) { setShot('B', next, into / next.dur, tex, i + 1); U.mixv.value = io(Math.min(1, into / XF)); }
    else U.mixv.value = 0;
    cap(U.mixv.value > .5 ? i + 1 : i);
    // вход в здание: короткое затемнение между «вход» и «зал»
    U.fade.value = i === 2 && into > 0 ? Math.sin(Math.min(1, into / XF) * Math.PI) * .85 : 0;
    U.time.value = T;
    snowOn = i < 2 ? 1 : i === 2 ? Math.max(0, 1 - Math.max(0, into) / XF) : 0;
    snow(dt, i === 0 ? 1.1 : .6);
    if (T >= TOTAL - .3 || (fixed !== null && T >= TOTAL)) end();
    renderer.render(scene, cam);
  });
})();
