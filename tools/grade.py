"""Цветокоррекция фото под концепты: a=плакат (тонированный монохром), b=журнал (тёплая плёнка), c=кино."""
import sys, os, glob
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

SRC = 'public/img'
NAMES = ['hero-brak','romeo-hero','volshebnik','ledi-hero','brak','romeo','ledi','snezhnaya','g-kru','g-more','g-lesograd','g-zritel','zriteli','zdanie']

def grain(a, amt, seed=1):
    rng = np.random.default_rng(seed)
    n = rng.normal(0, amt, a.shape[:2])[..., None]
    return np.clip(a + n, 0, 255)

def a_poster(im):
    g = np.asarray(im.convert('L'), dtype=np.float32) / 255
    g = np.clip((g - .06) / .9, 0, 1) ** 0.9          # контраст
    dark, light = np.array([30, 34, 30]), np.array([243, 234, 216])
    out = dark + (light - dark) * g[..., None]
    return Image.fromarray(grain(out, 7).astype('uint8'))

def tame(im, k=.75):
    """Приглушить холодные/зелёные оттенки сценического света (оставить тёплые)."""
    h, sat, v = [np.asarray(c, dtype=np.float32) for c in im.convert('HSV').split()]
    cold = ((h > 50) & (h < 215)).astype(np.float32)   # зелёный..синий..фиолетовый
    sat = sat * (1 - k * cold)
    h = np.where(cold > 0, h * .0 + 22, h)                # сдвиг в тёплый
    out = Image.merge('HSV', [Image.fromarray(x.clip(0, 255).astype('uint8')) for x in (h, sat, v)]).convert('RGB')
    return out

def b_film(im):
    im = tame(im, .82)
    im = ImageEnhance.Color(im).enhance(.7)
    a = np.asarray(im, dtype=np.float32)
    a = a * np.array([1.06, 1.0, .88]) + np.array([6, 2, -4])     # тепло
    a = 18 + a * (1 - 18 / 255) * .97                              # приподнятые тени (fade)
    return Image.fromarray(grain(a, 9).clip(0, 255).astype('uint8'))

def c_cine(im):
    im = tame(im, .7)
    im = ImageEnhance.Color(im).enhance(.85)
    a = np.asarray(im, dtype=np.float32) / 255
    a = np.clip((a - .04) * 1.12, 0, 1)
    lum = a.mean(axis=2, keepdims=True)
    a = a + (np.array([.05, .02, -.04]) * lum) + (np.array([-.03, .0, .03]) * (1 - lum))  # тёплый свет / холодная тень
    return Image.fromarray(grain(np.clip(a, 0, 1) * 255, 6).astype('uint8'))

for key, fn in {'a': a_poster, 'b': b_film, 'c': c_cine}.items():
    os.makedirs(f'{SRC}/{key}', exist_ok=True)
    for n in NAMES:
        im = Image.open(f'{SRC}/{n}.jpg').convert('RGB')
        fn(im).save(f'{SRC}/{key}/{n}.jpg', quality=82, optimize=True)
print('ok')
