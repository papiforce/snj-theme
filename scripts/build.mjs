// Assemble src/css/components/*.css (ordre alphabétique) dans dist/snj.css.
// jsDelivr sert automatiquement la version minifiée sous dist/snj.min.css.
// Usage : node scripts/build.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'src/css/components';
const files = readdirSync(dir).filter((f) => f.endsWith('.css')).sort();
const banner = '/* snj-theme — généré par scripts/build.mjs, ne pas modifier à la main */\n';
const css = banner + files.map((f) => `/* --- ${f} --- */\n` + readFileSync(join(dir, f), 'utf8')).join('\n');

mkdirSync('dist', { recursive: true });
writeFileSync('dist/snj.css', css);
console.log(`dist/snj.css — ${files.length} fichier(s), ${css.length} caractères`);
