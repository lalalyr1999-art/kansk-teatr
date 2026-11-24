# После `vite build --base=/kansk-teatr/`: дописывает базу к абсолютным путям в строках JS/HTML (их Vite не трогает).
import os, re, sys
BASE = sys.argv[2] if len(sys.argv) > 2 else '/kansk-teatr/'
root = sys.argv[1] if len(sys.argv) > 1 else 'dist'
pat = re.compile(r'''(["'`(])/(img/|zritelyam\.html|privacy\.html|teatr\.html|teatr-v11\.html|spektakli\.html|artist\.html|artisty\.html|lyudi-concepts\.html|v11\.html|mobile\.html|old\.html|concept-(?!\(\[)|\?|#|birds\.mp3|favicon\.svg|review-notes\.js|404\.html)''')
home = re.compile(r'''(href=["'])/(["'])''')
n = 0
for d, _, fs in os.walk(root):
    for f in fs:
        if not f.endswith(('.html', '.js', '.css')): continue
        p = os.path.join(d, f); s = open(p, encoding='utf-8').read()
        t = pat.sub(lambda m: m.group(1) + BASE + m.group(2), s)
        t = home.sub(lambda m: m.group(1) + BASE + m.group(2), t)
        if t != s: open(p, 'w', encoding='utf-8').write(t); n += 1
print('fixed files:', n)
