// Прежняя страница «О театре» (v11): «Нам 120» со всеми вариантами + место.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { init120 } from './y120.js';
gsap.registerPlugin(ScrollTrigger);
let bvi = null; try { bvi = localStorage.getItem('bvi'); } catch {}
const CALM = matchMedia('(prefers-reduced-motion: reduce)').matches || bvi === '1';
if (!CALM) { const lenis = new Lenis({ duration: 1.15 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
init120({ gsap, ScrollTrigger, CALM });
if (!CALM) gsap.fromTo('[data-placeimg]', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '[data-place]', start: 'top bottom', end: 'bottom top', scrub: true } });
