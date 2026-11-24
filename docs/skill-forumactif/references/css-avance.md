# CSS — Référence AwesomeBB

> Légende : **(vérifié)** = contrôlé sur un forum AwesomeBB en novembre 2026.

## Où écrire le CSS

| Emplacement | Usage |
|---|---|
| PA › Affichage › Images et Couleurs › Couleurs › **Feuille de style CSS** | Tokens et CSS indispensable : le forum doit rester lisible même si une feuille externe ne charge pas |
| PA › Affichage › Images et Couleurs › **Gestion du CSS additionnel** | Jusqu'à 25 feuilles appelées sur des pages choisies ; **nécessite un package** (déc. 2025) |
| Feuille externe liée dans `overall_header` | Gros thèmes : CSS versionné dans un dépôt, servi par un CDN |

### Feuille externe versionnée (vérifié)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/compte/depot@<SHA-du-commit>/dist/theme.min.css">
```

1. Assembler les fichiers CSS (un par composant, préfixés par un numéro d'ordre) dans `dist/`, puis commit et push.
2. **Attendre que l'adresse réponde 200** (jsDelivr met parfois quelques dizaines de secondes), sinon la page
   s'affiche sans CSS.
3. Remplacer le SHA dans `overall_header`, enregistrer, **publier** le template.

Une adresse versionnée ne change jamais : une version ratée n'atteint pas le forum tant qu'on n'a pas changé le lien.

## Tokens

Déclarer ses propres variables, préfixées (ex. `--sg-*`), et un thème clair/sombre par attribut :

```css
:root {
  --x-bg: #0b0a09;
  --x-surface: #110f0d;
  --x-text: #ece5d4;
  --x-text-muted: #b8ad95;
  --x-border: rgba(232, 223, 201, 0.1);
  --x-radius-lg: 14px;
}

[data-theme="light"] {
  --x-bg: #f4efe3;
  --x-surface: #fbf8f1;
  --x-text: #1d1915;
  --x-text-muted: #5d554a;
  --x-border: rgba(29, 25, 21, 0.12);
}
```

### Rebrancher les variables d'AwesomeBB (vérifié)

AwesomeBB utilise ses propres variables. Les faire pointer vers ses tokens rattrape une bonne partie des pages non
retravaillées :

`--t_body_bgcolor`, `--t_body_bgcolordd`, `--t_body_text`, `--t_body_link`, `--t_body_vlink`, `--t_body_alink`,
`--t_body_hlink`, `--t_fontcolor1`, `--t_fontface1`, `--t_fontface2`, `--t_fontface3`, `--t_fontsize1`,
`--t_header_bg`, `--t_header_colorbg`, `--t_h1_header_color`, `--t_tr_color1`, `--t_tr_color2`,
`--t_body_table_width`, `--t_postprofile_position`.

```css
:root {
  --t_body_text: var(--x-text);
  --t_body_link: var(--x-primary);
  --t_fontface1: var(--x-font-body);
}
```

## Pièges d'AwesomeBB (vérifié)

### Transition globale

AwesomeBB applique `* { transition: 0.16s }`. Un texte placé dans un enfant d'un élément dont la couleur s'anime
« saute » pendant l'animation. Couper la transition sur ces enfants :

```css
.mon-onglet__libelle,
.mon-onglet__icone * {
  transition: none;
}
```

Conséquence pratique : après un changement de thème, attendre ~0,5 s avant de mesurer une couleur calculée.

### `<header>` fixés

Tous les `<header>` sont fixés en haut de page. Ne pas en utiliser dans ses composants.

### `<body>` à padding forcé

AwesomeBB force le `padding` du `<body>`. Pour une mise en page personnalisée (ex. barre latérale fixe), décaler les
blocs eux-mêmes, souvent avec `!important` :

```css
#header-banner, #wrap, body > footer, #page-footer {
  box-sizing: border-box;
  width: auto !important;
  max-width: 1200px !important;
  margin-left: var(--contenu-gauche) !important;
  margin-right: var(--contenu-droite) !important;
}
```

### Spécificité par ID

Des règles natives ciblent des ID et gagnent sur les classes. Exemple : `#page-footer a { color: #fff }`.
Pour styler ses liens du pied de page : `#page-footer a.ma-classe { … }`.

### Masquer le natif seulement si le remplaçant est monté

```css
body.mes-stats-on #index #block-online { display: none; }
```

La classe est posée par le script une fois son composant inséré : si le script échoue, le bloc natif reste visible.

## Couleurs des groupes (vérifié)

Les pseudos portent la couleur du groupe **en dur** :

```html
<span class="group-3 usr_grp_clr" style="color:#B5533F"><strong>Pseudo</strong></span>
```

Pour qu'elle suive le thème clair/sombre, rebrancher chaque teinte du PA sur une variable. Le sélecteur par attribut
fonctionne sur tout le forum (messages, profils, liste des membres, légende) :

```css
[style*="B5533F" i] { color: var(--x-groupe-feu) !important; }

[data-theme="light"] {
  --x-groupe-feu: color-mix(in srgb, #b5533f 85%, #000); /* plus sombre pour rester lisible sur fond clair */
}
```

- Le `i` rend la recherche insensible à la casse (`#B5533F` / `#b5533f`, avec ou sans espace après `color:`).
- La classe `group-N` dépend de l'ID du groupe, différent d'un forum à l'autre (test / production) ; la teinte, elle,
  se recopie à l'identique.
- Les teintes du PA doivent être uniques et ne pas apparaître ailleurs dans un `style` en ligne.
- Badges de groupes (avril 2026) : icône Material Symbols à côté du pseudo, à la couleur du groupe ; vérifier leur
  rendu avec ces règles.

## Icônes (vérifié)

AwesomeBB embarque **Material Symbols Outlined** :

```html
<span class="material-symbols-outlined" aria-hidden="true">home</span>
```

Inutile de charger une autre bibliothèque. Pour un logo absent de la bibliothèque, un SVG en ligne (`fill` ou
`stroke` en `currentColor`) à la même taille que les icônes.

## Recettes utiles

### Grand mot au trait sur toute la largeur

```html
<svg class="mot" viewBox="0 0 1000 140" aria-hidden="true"><text x="0" y="100">Nom du forum</text></svg>
```

```css
.mot { display: block; width: 100%; height: auto; overflow: visible; }
.mot text {
  font-family: var(--x-font-display);
  font-size: 120px;
  fill: transparent;
  stroke: currentColor;
  stroke-width: 1.2px;
  vector-effect: non-scaling-stroke; /* trait fin quelle que soit la taille */
}
```

En JavaScript, ajuster le `viewBox` au texte une fois la police chargée
(`document.fonts.ready.then(…)` puis `text.getBBox()`).

### Motif répété en masque (teinte modifiable)

```css
.carte::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: color-mix(in srgb, var(--x-primary) 14%, transparent);
  -webkit-mask: url("data:image/svg+xml,…") repeat;
  mask: url("data:image/svg+xml,…") repeat;
}
```

### Trame de points sur une image

```css
.carte::after {
  background: radial-gradient(circle at center, rgba(244, 239, 227, 0.13) 0.9px, transparent 1.4px) 0 0 / 5px 5px,
              rgba(10, 9, 8, 0.55);
}
```

### Animations réduites

```css
@media (prefers-reduced-motion: reduce) {
  .mon-composant *, .mon-composant *::before, .mon-composant *::after { animation: none !important; transition: none !important; }
}
```

## Responsive

Repères utilisés avec AwesomeBB : `max-width: 1200px` (grilles à 2 colonnes), `900px` (sélecteurs en menu déroulant),
`768px` (une colonne, barre de navigation en bas d'écran). Tester sur un vrai téléphone ou dans une fenêtre de 390px :
la version mobile de Forumactif (`tpl_mobile`) peut aussi s'appliquer selon les réglages.
