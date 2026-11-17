# Векторизация фасада из логотипа (public/img/logo-cream.png, строки 0–420) -> src/data/facade.js
# Контуры линий -> SVG-пути для анимации «рисования» в заставке. Надпись остаётся растровой.
import cv2, json, pathlib
root = pathlib.Path(__file__).resolve().parents[1]
im = cv2.imread(str(root / 'public/img/logo-cream.png'), cv2.IMREAD_UNCHANGED)
a = im[:, :, 3].copy(); a[420:] = 0
_, b = cv2.threshold(a, 110, 255, cv2.THRESH_BINARY)
cs, _ = cv2.findContours(b, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
paths = []
for c in cs:
    if cv2.arcLength(c, True) < 14: continue
    p = cv2.approxPolyDP(c, 0.9, True).reshape(-1, 2)
    if len(p) < 2: continue
    d = 'M' + 'L'.join(f'{x} {y}' for x, y in p) + 'Z'
    paths.append((int(p[:, 1].max()), d))
paths.sort(key=lambda t: -t[0])  # снизу вверх: здание «растёт» от земли
h, w = a.shape
out = f'export const FACADE = {{ w: {w}, h: {h}, d: {json.dumps([d for _, d in paths])} }};\n'
(root / 'src/data/facade.js').write_text(out, encoding='utf-8')
print(len(paths), 'paths', round(len(out) / 1024), 'KB')
