# Étalonne les images de bannière aux couleurs du thème (gradient map + grain).
# Usage : python3 scripts/grade-banner.py <image-clair> <image-sombre>
# Produit assets/banner-light.webp et assets/banner-dark.webp (1600 px de large).
import sys
import numpy as np
from PIL import Image, ImageFilter

def hex2rgb(h):
    h = h.lstrip('#'); return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255

def gradient_map(lum, stops):
    # stops: list of (pos, rgb)
    out = np.zeros(lum.shape + (3,), dtype=np.float32)
    pos = np.array([p for p, _ in stops]); cols = np.array([c for _, c in stops])
    for ch in range(3):
        out[..., ch] = np.interp(lum, pos, cols[:, ch])
    return out

def grade(src, dst, stops, keep, gamma, grain, width=1600):
    im = Image.open(src).convert('RGB')
    h = round(im.height * width / im.width)
    im = im.resize((width, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
    a = np.asarray(im, dtype=np.float32) / 255
    lum = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]) ** gamma
    mapped = gradient_map(lum, stops)
    out = mapped * (1 - keep) + a * keep
    rng = np.random.default_rng(7)
    out += (rng.standard_normal(out.shape[:2])[..., None] * grain)
    out = np.clip(out, 0, 1)
    Image.fromarray((out * 255).astype(np.uint8)).save(dst, 'WEBP', quality=82, method=6)

if __name__ == '__main__':
    light_src, dark_src = sys.argv[1], sys.argv[2]
    # Clair : estampe encre Hagane sur papier
    grade(light_src, 'assets/banner-light.webp',
          [(0.0, hex2rgb('#26313d')), (0.45, hex2rgb('#5d7183')), (0.8, hex2rgb('#c9c2ad')), (1.0, hex2rgb('#f4efe3'))],
          keep=0.18, gamma=0.95, grain=0.018)
    # Sombre : encre et or terni
    grade(dark_src, 'assets/banner-dark.webp',
          [(0.0, hex2rgb('#0a0908')), (0.35, hex2rgb('#2a2119')), (0.7, hex2rgb('#7a6438')), (1.0, hex2rgb('#d9bf7f'))],
          keep=0.15, gamma=1.15, grain=0.02)
    print('ok')
