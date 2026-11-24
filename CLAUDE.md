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
| `src/js/` | Un fichier par script : `layout.js` (barre latérale, thème, pied de page, en-tête des pages de forum ; toutes les pages, module 10), `home.js` (widgets de l'accueil et des pages de forum, index + sous-forums, module 11), `forums.js` (catégories de l'accueil, index, module 12), `stats.js` (statistiques de l'accueil, index, module 13) | PA › Modules › Gestion des codes JavaScript |
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
  toute la hauteur restante de la carte. Staff : avatars seuls, en portrait (tuile `.sg-tile--photo`, photo nette, sans kanji),
  pseudo révélé au survol avec le même zoom que les scénarios ; bouton « Voir le staff et les crédits »
  (`DATA.staffHref`, flèche qui glisse) au-dessus de « Contacter sur Discord ». Annonces et Rumeurs défilent seules
  (8 s) avec un minuteur circulaire `.sg-ctimer` dans le coin supérieur droit de la carte : pause au survol ou au focus
  (icône pause au centre), reprise au temps restant, remise à zéro à chaque changement de diapositive. Scénarios :
  voile dégradé transparent en haut, encre (sombre) ou papier (clair) en bas, pour la lisibilité des noms ;
  `taken: true` pour un scénario pris (grisé, sceau « Pris », non cliquable), les disponibles en premier.
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
  Derniers sujets : sujets de la Corbeille (supprimés) exclus (`DATA.latestHidden`), titre et ligne « dernier
  participant · date » coupés en ellipse, avatar du dernier participant à droite (lu dans `/memberlist`, mis en cache
  `sessionStorage` `snj-avatars`). La bannière est un lien vers `/` (`.sg-banner-link`, ajouté par `layout.js`).
  Peu de kanji (seulement dans les tuiles de scénarios). Annonces, Rumeurs et Saison sont des données provisoires
  (objet `DATA`) à brancher plus tard sur l'API de l'annexe. Pas d'animation de bordure au survol.
  Les `<header>` sont interdits dans nos composants : AwesomeBB les fixe tous en haut de page.
- **Pages des forums** (`home.js`, mode `#sg-home.is-forum`, placement « Sur les sous-forums » du module 11) : sous la
  bannière, Guide du joueur, Saison et Annexe, 4 colonnes chacune — les mêmes cartes que l'accueil —, puis le
  séparateur avec le logo (56px au-dessus et en dessous ; marge native de `.page-header` retirée). Annexe : raccourcis de 44px
  de haut en bas de la carte, l'image prend la hauteur restante (sur l'accueil, les raccourcis remplissent la carte). ≤ 1200px : Guide et
  Saison côte à côte, Annexe dessous ; ≤ 768px : une colonne. Détection : pas de `#index` et adresse en `/fN…`.
- **En-tête des pages de forum** (`layout.js`, fonction `pageHead`, + `55-pagehead.css`) : pattern commun à tous les
  forums, sous le séparateur. Ordre : **fil d'Ariane** (icône maison, chevrons Material Symbols, page courante en gras ;
  la catégorie mène à son onglet de l'accueil `/?onglet=…`), **titre** en Zen Antique avec un filet de 56px à la couleur
  de la catégorie (`--ph` : nation, sumi et gofun pour Gestion) et les **boutons d'action** à l'extrême droite (bouton
  sumi et gofun, pleine largeur sur mobile), puis la **description** (sans boîte, 75ch max). Kanji du forum (`data-kanji`
  de sa `.sg-meta`) en filigrane à 7 %. Retirés : `.page-header` natif, la barre « Plus ! / Marquer tous les sujets
  comme lus » (`.topic-actions`), la barre de liens `.action-bar-top` (au-dessus des sous-forums) et le bouton fixe
  « Poster un nouveau sujet » (`a.btn-fixed`). Les liens et boutons d'origine sont déplacés, pas copiés.
- **Catégories de l'accueil** (`forums.js` + `40-zones.css`) : à gauche un sélecteur collant (Gestion, Hi, Mizu, Kaze,
  Kaminari, Tsuchi no Kuni, Shōkoku — « les petits pays », ex-Reste du Sekai) au style des raccourcis de l'Annexe, pastille = badge pour Gestion
  (sumi et gofun) et kanji du pays sinon (火 水 風 雷 土, 他 comme sur l'annexe), couleur de la nation ; onglet actif
  rempli. Libellé des onglets sur le fond de la barre latérale (`--sg-surface`) ; au survol et actif, texte et kanji
  en blanc papier (`--sg-paper-50`), Gestion en `--sg-on-contrast`. Sur mobile (≤ 900px), menu déroulant personnalisé. À droite, les forums de la catégorie en cartes (inspirées de
  l'ancien SnJ) : image en fond avec voile selon le thème, panneau avec kanji en filigrane propre au forum, titre,
  description, bouton du clan (fiche de l'annexe), dangerosité sur 5 (zones RP uniquement), dernier message avec
  avatar, sous-forums à droite. Gestion : cartes sans image sur motif seigaiha. Catégories sans forum : « Prochainement ».
  Image des cartes sous un voile et une trame de points (comme l'ancien SnJ). Changement de catégorie : défilement doux
  jusqu'au séparateur **d'abord**, puis affichage des forums de la catégorie (le focus rendu au sélecteur utilise
  `preventScroll` pour ne pas couper le défilement). Sous les catégories, **séparateur de fin** `.sg-divider--end`
  (triangle pointé vers le haut, sans logo, même espace de 56px au-dessus et en dessous) à la place de la barre de liens
  native `.action-bar-bottom` (Sujets actifs du jour, Top 20…, masquée). Onglet actif dans l'adresse (`?onglet=hi-no-kuni`) et mémorisé (`localStorage` `snj-onglet`),
  Gestion par défaut.
  Données d'une carte dans la description du forum (PA), balise invisible `<span class="sg-meta" data-kanji data-image
  data-danger data-clan data-clan-href hidden>` puis le texte. Structure et contenus : `docs/structure-forums.json`
  (repris de la production ; dangerosité provisoire, tirée au hasard). Index : sous-forums affichés (PA › Affichage ›
  Page d'accueil › Structure et hiérarchie). La liste native n'est masquée que si le sélecteur est monté.
- **Statistiques de l'accueil** (`stats.js` + `45-stats.css`) : remplacent le bloc « Qui est en ligne », sous le
  séparateur de fin. Grille bento : Chroniques (messages en compteur animé, shinobis, messages par shinobi, kikkō),
  Dernier inscrit (portrait, sceau 新 qui se tamponne au survol), En ce moment (point « en direct » Asagi, jauge
  enregistrés / invisibles / invités, record en discret), « Aperçus récemment » (connectés des 24 h, pseudos en pastilles colorées,
  magatama pleins du logo de SnJ pour le staff, « + N autres » au-delà de 24, shippō), Groupes (bannières **nobori** sans hampe : une par groupe,
  mon kanji ou icône, nom vertical, effectif, ondulation au survol). Nombre de messages, de membres et dernier inscrit :
  extrait `src/templates/index_body-snippet.html` ajouté au template `index_body` (absents d'AwesomeBB par défaut).
  Connectés des 24 h activés (PA › Affichage › Page d'accueil › Généralités).
  **Groupes** (PA › Utilisateurs & Groupes) : Hi, Mizu, Kaze, Kaminari, Tsuchi no Kuni, **Shōkoku** (小国, petits pays,
  nom choisi pour les personnages hors des cinq grandes nations ; la catégorie de l'accueil porte le même nom, slug
  `shokoku`, l'ancien `reste-du-sekai` reste accepté), Modérateurs, Staffeux. Ordre 1 à 6 pour les pays, 7 et 8 pour
  Modérateurs et Staffeux : un membre du staff qui a un pays prend la couleur de son pays. Teintes du PA rebranchées
  sur les tokens dans `08-groups.css` (Staffeux `#ECE5D4` → sumi et gofun, Modérateurs `#9FB0C3` → Hagane, pays →
  `--sg-nation-*`, assombris en clair). Le PA impose un modérateur par groupe, compté dans la légende : l'effectif
  affiché retire 1 (`CONFIG.legendIncludesModerator`). Il faut donc un compte du staff dédié comme modérateur des
  groupes, qui n'en est pas membre.
- **Pied de page** (`layout.js`, fonction `footer`, + `50-footer.css`, toutes les pages) : les statistiques natives du
  pied de page (doublon du bloc de l'accueil) et la barre native sont masquées. Liens de Forumactif centrés, en
  `--sg-text-muted` séparés par des points médians (sans séparateur sur mobile), **sans Accueil ni Panneau
  d'administration** ; les liens d'origine sont déplacés (le lien Cookies garde son action), y compris les liens de
  crédit que Forumactif fait varier selon la page. Dessous, « Sengoku no Jidai » au trait en Zen Antique sur toute la
  largeur du contenu (SVG ajusté au texte une fois la police chargée), sumi et gofun, estompé vers le bas, qui se
  remplit légèrement au survol. Les liens du pied de page doivent viser `#page-footer a…` (AwesomeBB les force en blanc).
- **Modules JavaScript** : Forumactif les charge dans le `<head>` ; tout script attend `DOMContentLoaded`.
- **Transitions** : AwesomeBB applique `* { transition: 0.16s }`. Un texte placé dans un enfant d'un élément dont la
  couleur s'anime saute pendant l'animation : mettre `transition: none` sur ces enfants (voir `40-zones.css`).
- **Variables CSS** préfixées `--sg-*`. On rebranche les `--t_*` d'AwesomeBB sur nos tokens.
- **CSS hors forum** : servi par jsDelivr depuis ce dépôt, avec une adresse versionnée (SHA de commit ou tag).
  Le CSS indispensable reste dans le CSS principal du forum pour que le forum reste lisible si le CDN tombe.
- **Messages libres** (sans modèle) : doivent rester lisibles et épurés.
- **Migration** : bascule de tout le forum en une fois.
  Alendria (test) : activation des nouveaux membres sur « Aucune activation » (comptes de test sans e-mail de
  confirmation). **Ne pas reporter en production**, qui garde l'activation par l'utilisateur (e-mail).

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
