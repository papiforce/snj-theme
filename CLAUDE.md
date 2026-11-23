# snj-theme — Thème du forum Sengoku no Jidai

Thème Forumactif (version **AwesomeBB**) du forum Sengoku no Jidai.
Forum de test : https://alendria.forumactif.com — production : https://sengoku-no-jidai.forumactif.com
Annexe (Next.js + MongoDB sur Vercel) : https://snj-base-de-donnees.vercel.app

Ce dépôt est la **source de vérité** du code du forum. On modifie ici, puis on reporte
dans le panneau d'administration (PA), puis on commit.

## Arborescence

| Dossier | Contenu | Où ça va sur Forumactif |
|---|---|---|
| `src/css/critical.css` | Tokens, thèmes clair/sombre, base | PA › Affichage › Couleurs › CSS principal |
| `src/css/components/` | CSS des composants (barre latérale, catégories, sujets…), préfixés par un numéro d'ordre | Assemblés dans `dist/snj.css` par `node scripts/build.mjs`, servis par jsDelivr |
| `src/templates/` | Templates HTML et extraits à insérer | PA › Affichage › Templates |
| `src/js/` | Un fichier par script : `layout.js` (barre latérale + thème, toutes les pages), `home.js` (widgets de l'accueil, index seulement) | PA › Modules › Gestion des codes JavaScript |
| `docs/` | Décisions, notes de migration | — |

## Décisions

- **Version** : AwesomeBB. Attention : le forum de production est aujourd'hui en **ModernBB** (Blank Theme).
  Le jour de la migration, il faudra passer la production en AwesomeBB, ce qui remet ses templates et son CSS à zéro.
- **Ambiance** : japonaise médiévale sombre.
- **Couleur primaire** : Hagane (acier bleuté) — `#9fb0c3` en sombre, `#3e5266` en clair.
  Toutes les autres couleurs existantes (nations, clans, or de Kaminari `#c9a558`) sont conservées.
- **Accents** (réutilisables partout, jamais une couleur de nation ni proche d'elle) : `--sg-accent-1` **Asagi** 浅葱
  (sarcelle, `#6fb3ae` sombre / `#3d8a87` clair) et `--sg-accent-2` **Ume** 梅 (prune, `#c27390` / `#a8506f`), avec
  leurs variantes `-rgb`. Texte posé sur un accent : `--sg-on-accent`.
  **Sumi et gofun** (encre et blanc de coquille) pour les éléments d'interface sans teinte : `--sg-contrast`
  (`#ece5d4` en sombre, `#1d1915` en clair, variante `-rgb`) et `--sg-on-contrast`. Les couleurs vives trop proches
  du rouge, bleu, jaune, vert, marron, de Hagane ou des accents sont exclues (Wakatake a été écarté). Halos flous aux coins (accent 1 en haut à droite, accent 2 en bas à gauche, inspirés de Themis
  Trials) sur `html::before/::after`, intensité `--sg-glow-strength` (0,6 sombre / 0,5 clair) ; le `<body>` est transparent.
- **Polices** : titres en **Zen Antique**, texte en **Inria Sans** (comme l'annexe). Cinzel abandonnée.
- **Thème** : celui de l'appareil par défaut ; le choix du membre est mémorisé dans le navigateur
  (`localStorage`, clé `snj-theme`, doublé d'un cookie `snj-theme` de secours) et réappliqué à chaque affichage
  de page, retour arrière compris (`pageshow`). Attribut `data-theme` sur `<html>`.
- **Icônes** : **Material Symbols Outlined uniquement**, partout (c'est la bibliothèque native d'AwesomeBB).
  Jamais de Font Awesome ni d'autre bibliothèque. Seule exception : les logos de marque absents de Material Symbols
  (Discord…), en SVG inline repris de Simple Icons (licence CC0), à la même taille que les icônes.
- **Navigation** : barre latérale fixe à gauche avec icônes et infobulle à droite (inspirée de Themis Trials),
  barre fixe en bas d'écran sur mobile. Elle remplace l'en-tête natif d'AwesomeBB.
  Haut : avatar du membre, ou logo SnJ (`assets/snj-logo.webp`) pour les visiteurs.
  Navigation : Accueil, Membres (masqué sur mobile), Discord, Annexe, Carte.
  Bas : Notifications (avec pastille), Panneau d'administration (admins), Déconnexion, thème clair/sombre.
- **Mise en page** : bannière, catégories et pied de page font au plus **1200px** (`--sg-content-max`, barre non comprise) ;
  la barre et le contenu forment un ensemble centré horizontalement (`--sg-shell-left`), coins arrondis.
- **Bannière** : 640px de haut sur ordinateur (220px sur mobile). Clair = brume au clair de lune, sombre = renard dans les braises (`scripts/grade-banner.py`).
  Pas de logo ; wordmark « Sengoku no Jidai » fondu dans l'image (modes de fusion + dégradé).
- **Accueil** (`home.js` + `30-home.css`) : grille « bento » de 12 colonnes, sans titres de zones, cartes variées
  (illustrées, couverture, motifs Edo seigaiha / kikkō / shippō, carrousels, carte Vote pleine, Discord).
  Visiteur : Onboarding (Guide, Annexe, Fiche, Validation, Configuration du profil) → Contexte + Saison → Guide + Annexe
  → Annonces + Rumeurs + Derniers sujets → Scénarios + Staff + Vote/Discord. Membre : pas d'onboarding, Annonces,
  Rumeurs et Derniers sujets en premier. Illustrations : paysages des nations de l'annexe (`assets/land-*.webp`,
  `scripts/grade-cards.py`). Rumeurs : une illustration et la couleur de la nation (`--sg-nation-*`).
  Contexte sans image (trop d'images sinon), sur le même motif kikkō que le Staff.
  Images du Guide et de l'Annexe fournies par Vinny (`assets/card-guide*.webp`, `assets/card-annexe*.webp`).
  Raccourcis de l'Annexe (inspirés de Themis Trials) : pastille sumi et gofun pour l'icône, panneau arrondi
  (`12px 0 0 12px / 50% 0 0 50%`) avec le libellé, sans bordure ; au survol (0,9 s) la couleur remplit tout le
  raccourci. Libellé toujours sur une ligne, taille calculée sur la largeur du raccourci (unités `cqi`). Ils remplissent
  toute la hauteur restante de la carte. Staff : bouton « Voir le staff et les crédits » (`DATA.staffHref`, flèche qui
  glisse) au-dessus de « Contacter sur Discord ». Annonces et Rumeurs défilent seules (8 s). Scénarios : `taken: true` pour un
  scénario pris (grisé, sceau « Pris », non cliquable), les disponibles en premier.
  **Séparateur** réutilisable `.sg-divider` (`05-ornaments.css`), en rupture avec l'ancien séparateur de SnJ (filets,
  losanges, kanji doré — à ne pas reproduire) : une ligne qui forme un triangle pointé vers le bas en son milieu,
  surmontée du logo de SnJ au trait (`assets/snj-logo-outline.svg`, aussi dans `home.js`), en sumi et gofun. Espace
  identique au-dessus et en dessous (`--sg-divider-space`, 56px) : `#sg-home` n'a pas de marge basse et l'entretoise
  native de 3px est masquée. Sur l'accueil, entre les widgets et les catégories, à la place de la barre de liens
  rapides d'AwesomeBB. En clair, Guide, Annexe et Rumeurs utilisent des variantes claires au ton de la bannière (`*-light.webp`, `grade-cards.py --light`) et passent au papier
  et à l'encre (classe `sg-tone`). Seules les cartes Guide, Staff, Vote et Discord se soulèvent au survol.
  **Motifs Edo : un motif = une famille d'information**, uniquement sur les cartes de texte (jamais sur les cartes
  illustrées, les fils ni la carte Discord) : seigaiha 青海波 (vagues) → parcours et aide (onboarding, guides,
  tutoriels) ; kikkō 亀甲 (carapace de tortue) → univers et références durables (contexte, règlement, chronologie) ;
  shippō 七宝 (cercles entrelacés) → communauté et liens (staff, votes, partenaires, membres).
  Peu de kanji (seulement dans les tuiles de scénarios). Annonces, Rumeurs et Saison sont des données provisoires
  (objet `DATA`) à brancher plus tard sur l'API de l'annexe. Pas d'animation de bordure au survol.
  Les `<header>` sont interdits dans nos composants : AwesomeBB les fixe tous en haut de page.
- **Variables CSS** préfixées `--sg-*`. On rebranche les `--t_*` d'AwesomeBB sur nos tokens.
- **CSS hors forum** : servi par jsDelivr depuis ce dépôt, avec une adresse versionnée (SHA de commit ou tag).
  Le CSS indispensable reste dans le CSS principal du forum pour que le forum reste lisible si le CDN tombe.
- **Messages libres** (sans modèle) : doivent rester lisibles et épurés.
- **Migration** : bascule de tout le forum en une fois.

## Publier une nouvelle version du CSS des composants

1. Modifier `src/css/components/*.css`, puis `node scripts/build.mjs`.
2. Commit et push, puis **attendre que jsDelivr serve la nouvelle version** (réponse 200 sur
   `https://cdn.jsdelivr.net/gh/papiforce/snj-theme@<SHA>/dist/snj.min.css`, parfois quelques dizaines de secondes).
   Sinon le forum charge une page sans CSS.
3. Dans `overall_header`, remplacer la version après `snj-theme@` dans le lien jsDelivr par le **SHA complet
   du commit** (ou un tag `vX.Y.Z` créé depuis GitHub), enregistrer et **publier** le template.
   Reporter le même lien dans `src/templates/head-snippet.html`.

Une adresse versionnée ne change jamais : une version ratée n'atteint pas le forum tant qu'on n'a pas changé le lien.

## Règles

- Ne jamais mettre de secret (identifiants MongoDB, tokens) dans ce dépôt : tout ce qui est ici finit public.
- Le code du forum ne fait que **lire** l'API de l'annexe. Toute écriture doit être revérifiée côté serveur
  (les données `_userdata` côté navigateur sont falsifiables).
- Après une mise à jour de Forumactif, retester les scripts sur le forum de test avant la production.
- Templates : après enregistrement dans le PA, penser à **valider/publier** le template.
