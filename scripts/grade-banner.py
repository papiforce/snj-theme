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

def grade(src, dst, stops, keep, gamma, grain, width=1600, crop=None):
    im = Image.open(src).convert('RGB')
    if crop:  # (haut, bas) en pixels à retirer, ex. bandes noires
        im = im.crop((0, crop[0], im.width, im.height - crop[1]))
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
    # Clair : brume à l'encre Hagane sur papier (bandes noires du haut/bas retirées)
    grade(light_src, 'assets/banner-light.webp',
          [(0.0, hex2rgb('#1f2830')), (0.5, hex2rgb('#6c7d8c')), (0.85, hex2rgb('#d9d6cc')), (1.0, hex2rgb('#f4efe3'))],
          keep=0.25, gamma=1.0, grain=0.014, width=1600, crop=(22, 27))
    # Sombre : braises domptées, encre et or terni
    grade(dark_src, 'assets/banner-dark.webp',
          [(0.0, hex2rgb('#0a0908')), (0.3, hex2rgb('#2a1d14')), (0.65, hex2rgb('#8a5a2e')), (1.0, hex2rgb('#d9bf7f'))],
          keep=0.4, gamma=1.1, grain=0.016, width=1920)
    print('ok')
