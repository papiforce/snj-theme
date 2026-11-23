# Étalonne les illustrations des cartes de l'accueil.
# - sombre (défaut) : même traitement que la saison, gradient map encre / Hagane / papier mélangé
#   à 35 % de l'image d'origine ;
# - clair (--light) : même ton que la bannière claire, brume à l'encre Hagane sur papier.
# Usage : python3 scripts/grade-cards.py <source> <assets/sortie.webp> [largeur] [--light]
import sys
import numpy as np
from PIL import Image

def hx(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255

DARK = ([(0, hx('#0e1216')), (0.5, hx('#5d7183')), (0.85, hx('#c9ccc8')), (1, hx('#f4efe3'))], 0.35, 1.0)
LIGHT = ([(0, hx('#3a4652')), (0.45, hx('#8796a3')), (0.8, hx('#dcd8cd')), (1, hx('#f4efe3'))], 0.18, 0.8)

def grade(src, dst, width=960, light=False):
    stops, keep, gamma = LIGHT if light else DARK
    im = Image.open(src).convert('RGB')
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    a = np.asarray(im, dtype=np.float32) / 255
    lum = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]) ** gamma
    pos = np.array([p for p, _ in stops]); cols = np.array([c for _, c in stops])
    m = np.stack([np.interp(lum, pos, cols[:, c]) for c in range(3)], -1)
    out = np.clip(m * (1 - keep) + a * keep, 0, 1)
    Image.fromarray((out * 255).astype(np.uint8)).save(dst, 'WEBP', quality=78, method=6)

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if a != '--light']
    grade(args[0], args[1], int(args[2]) if len(args) > 2 else 960, '--light' in sys.argv)
