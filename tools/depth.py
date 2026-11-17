# Карты глубины для концепта «Облёт» (2.5D-параллакс из реальных фото).
# Запуск: python_embeded/python.exe -I tools/depth.py <папка_фото> <public/img/fly>
# Для каждого кадра: <id>.jpg (2048px) + <id>-d.png (глубина, светлое = близко).
import sys, pathlib, torch
from PIL import Image, ImageFilter
from transformers import pipeline
src, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
SHOTS = {'gates': '05534', 'facade': '05476', 'entry': '05491', 'doors': '05471', 'hall': '05387'}
pipe = pipeline('depth-estimation', model='depth-anything/Depth-Anything-V2-Base-hf', device=0 if torch.cuda.is_available() else -1)
for name, n in SHOTS.items():
    im = Image.open(src / f'{n}.jpg').convert('RGB')
    im.thumbnail((2048, 2048)); im.save(out / f'{name}.jpg', quality=86)
    d = pipe(im.resize((im.width // 2 * 2 // 2, im.height // 2)))['depth'].resize(im.size, Image.BICUBIC)
    d = d.filter(ImageFilter.GaussianBlur(2)).resize((1024, round(1024 * im.height / im.width)), Image.BICUBIC)
    d.save(out / f'{name}-d.png'); print(name, im.size)
