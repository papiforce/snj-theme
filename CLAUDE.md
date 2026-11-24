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
| `src/js/` | Un fichier par script : `layout.js` (barre latérale, thème, pied de page, en-tête, sous-forums, sujets, page de sujet et permissions ; toutes les pages, module 10), `home.js` (widgets de l'accueil et des pages de forum, index + sous-forums, module 11), `forums.js` (catégories de l'accueil, index, module 12), `stats.js` (statistiques de l'accueil, index, module 13) | PA › Modules › Gestion des codes JavaScript |
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
  Sur mobile, le nom passe sur deux lignes sans couper de mot (`word-break: keep-all`, taille réduite) et la nappe de
  brume du thème clair n'a que 16px de marge latérale.
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
  shippō 七宝 (cercles entrelacés) → communauté et liens (staff, votes, partenaires, membres) ; yagasuri 矢絣
  (empennes de flèches) → sujets (cartes de sujets, widget Derniers sujets).
  Derniers sujets : **liste qui défile dans la carte** (plus de carrousel ; fondu en bas tant qu'il reste des sujets),
  motif yagasuri estompé en fond (`.sg-pat--yagasuri`), sujets de la Corbeille (supprimés) exclus (`DATA.latestHidden`),
  titre et ligne « dernier participant · date » coupés en ellipse, avatar du dernier participant à droite. Classes
  **`.sg-ltopic…`** propres au widget : `.sg-topic` / `.sg-topics` sont réservées aux cartes de sujets des pages de forum.
  **Avatars** (widget et Dernier inscrit) : lus dans `/memberlist`, cache `sessionStorage` `snj-avatars` de **10 minutes**
  (`{s, t}`) ; celui du membre connecté vient toujours de `_userdata.avatar` (jamais du cache), pour qu'un avatar
  modifié apparaisse tout de suite. La bannière est un lien vers `/` (`.sg-banner-link`, ajouté par `layout.js`).
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
- **Sous-forums : cartes « ema »** (`layout.js`, fonction `subforums`, + `56-subforums.css`) : pattern **réservé aux
  sous-forums**, partout où ils sont listés ; à ne pas confondre avec les cartes de forum de l'accueil (image en fond,
  panneau, kanji, dangerosité). L'ema 絵馬 (tablette votive) : image en haut découpée en toit (`clip-path`) avec le trou
  du cordon sous le faîte, filet de 3px à la couleur de la catégorie (`--ph`), titre en Zen Antique (pas de mention « Sous-forum »),
  description sur 2 lignes, compteurs en ligne (icônes à la couleur de la catégorie), sous-sous-forums en pastilles,
  dernier message en pied (avatar, sujet complet, auteur coloré, date) ou « Aucun message pour l'instant ».
  Image : `data-image` de la `.sg-meta` du sous-forum, sinon l'`<img>` de sa description ; à défaut, motif **asanoha**
  麻の葉 (feuille de chanvre, réservé à ce repli) à la couleur de la catégorie sur un halo, sans voile sombre. Non lu : pastille « Nouveau » en Asagi. Grille de 2 colonnes, cartes de même proportion (1 colonne
  ≤ 768px), sans titre de section ; sous la grille, le même filet que celui du pied de page (1px `--sg-border`). Toute la carte est cliquable (lien du titre étendu).
- **Sujets : cartes à motif yagasuri** (`layout.js`, fonction `topics`, + `57-topics.css`) : pattern **réservé aux sujets**,
  partout où ils sont listés. Les rouleaux makimono ont été **abandonnés** (à ne pas reproduire). Carte arrondie sans image,
  sur le fond de surface, avec en fond le motif **yagasuri** 矢絣 (empennes de flèches ; une flèche lancée = un message
  posté), **réservé aux sujets**, à la couleur de la catégorie (`--ph`, Ume pour le motif des annonces), net à droite et estompé
  vers la gauche, comme le seigaiha des cartes Gestion. Pastilles de statut (Annonce / Annonce globale en couleur primaire `--sg-primary` / `--sg-primary-fg`, Épinglé,
  Verrouillé), « Nouveau » en Asagi ; **pas d'icône dans le coin supérieur droit** (l'indicateur de participation a été
  retiré). Titre en Zen Antique (2 lignes max), description sur 1 ligne, « par » + auteur coloré, pages du sujet en
  pastilles ; en pied (pointillé) réponses et vues, dernier message (avatar, auteur coloré, date vers le message),
  **toujours au bas de la carte** (`margin-top: auto` ; l'élément qui le précède garde 10px de marge basse).
  Verrouillés : carte atténuée (72 %). Grille de 2 colonnes, **même hauteur pour toutes les cartes** (`grid-auto-rows: 1fr`) ;
  1 colonne ≤ 768px. Soulèvement au survol. **« Poster un nouveau sujet » deux fois** : le bouton d'origine reste à droite
  du titre de la page (en-tête), et un second, qui reprend son adresse, est **au-dessus de la grille, à gauche**
  (`.sg-topics__bar`, style `.sg-action`, pleine largeur sur mobile). À l'extrême droite de cette barre, bouton
  **« Actions »** (icône `more_vert`, trois points verticaux, contour sur fond de surface) qui ouvre un menu (`.sg-menu`,
  `role="menu"`, flèches, Début/Fin, Échap, clic extérieur) : « Nouveaux messages depuis ma dernière visite », « Messages
  sans réponse », « Marquer tous les sujets comme lus », un séparateur, « Suivre les sujets de ce forum » (« Ne plus suivre les sujets de ce forum » si le lien natif est en
  `?unwatch=forum`), « Mes sujets suivis ». Adresses reprises des liens natifs (recherches limitées au forum, sinon
  globales) ; une entrée sans lien natif (visiteur) n'apparaît pas, et le bouton non plus s'il n'en reste aucune.
  AwesomeBB ajoute un filet entre les `<li>` : il est retiré dans `#wrap .sg-menu__list > li`.
  **Deuxième ligne** (`.sg-topics__tools`), sous « Poster un nouveau sujet » : bouton **« Trier »** (`.sg-tool`, contour,
  chevron qui pivote) qui ouvre une fenêtre (`.sg-sort__panel`, `role="dialog"`, Échap, clic extérieur) contenant le
  **formulaire de tri natif déplacé** (`#sort-box form`, POST) : « Trier par » (liste personnalisée, sans saisie),
  « Ordre » (8px entre le libellé et le contrôle ; `<div role="group">`, pas de `<fieldset>`/`<legend>` qui échappe à
  l'espacement) en contrôle segmenté (Décroissant / Croissant, radios natives `sort_order`), bouton « Appliquer » ; puis,
  à sa droite, **« Sauter vers »** : le formulaire natif `jumpbox` déplacé, avec une liste personnalisée à saisie.
  La fenêtre « Trier » ne donne le focus à rien à l'ouverture.
  **Listes déroulantes personnalisées** (`combo()` dans `layout.js`, `.sg-combo`) : jamais le `<select>` natif à
  l'écran ; il reste dans le formulaire, masqué, et reçoit la valeur choisie puis un événement `change` (la jumpbox
  s'envoie alors d'elle-même). Même style que le bouton « Trier » (contour arrondi, fond de surface, chevron qui pivote),
  liste en fenêtre (motif combobox ARIA : flèches, Page préc./suiv., Entrée, Échap — qui ne ferme que la liste —,
  clic extérieur), coche Asagi sur l'entrée choisie. Option `search` : champ qui filtre la liste, sans tenir compte des
  accents, en gardant visibles les parents des résultats (l'arborescence reste lisible) ; toute la surface du champ
  l'ouvre (icône, chevron, marges), un second clic la ferme, et pas d'anneau de focus au clic. Option `tree` (jumpbox) : les
  entrées de valeur `-1` (`|`, `| |`, lignes vides, « Sélectionner un forum » devenu texte d'aide) sont purgées, la
  profondeur est lue dans le nombre de `|` : catégories en intitulés de groupe, forums, sous-forums indentés avec un
  petit filet ; le forum affiché est coché. La barre native sous les sujets (`#wrap > a.mark-buttons` « Surveiller »
  et « Marquer comme lus », `#sort-box`) est masquée : ses liens sont dans « Actions ». AwesomeBB donne 20px de marge
  basse aux `<label>` et stylise les `<input>` : neutralisés sous `#wrap`. Sur mobile, tout passe en pleine largeur,
  l'un sous l'autre. Le bloc natif **« Modérateurs »** est masqué et remplacé par le **séparateur de fin**
  (`.sg-divider--end.sg-divider--topics`, inversé, sans logo) ; `.sg-topics` n'a pas de marge basse. Aucun sujet : encadré pointillé « Aucun sujet pour l'instant ».
  Les blocs natifs `#wrap > .posts` sont masqués. Attention : AwesomeBB stylise les éléments dont la classe contient
  « topic » (`align-items: center`, `white-space: nowrap` sur les titres) : les règles de la carte passent par `#wrap .sg-topic…`.
- **Briques partagées** (`layout.js`, avant `topics()`) : `uiEl` / `uiIco` (création d'éléments et d'icônes),
  `actionsMenu(items, id)` (bouton « Actions » trois points ; `items` = `[adresse ou fonction, icône, libellé]`,
  `null` = séparateur), `combo(select, opts)` (listes personnalisées), `jumpBox(valeurCourante)` (« Sauter vers »),
  `copyLink(texte)` (copie synchrone par champ temporaire + `execCommand`, l'API Clipboard en repli : elle peut rester
  en attente d'une permission) et `toast(message)` (message discret `.sg-toast` en bas d'écran, au-dessus de la barre
  mobile). À réutiliser sur toute nouvelle page plutôt que de les recopier.
- **Page d'un sujet** (`layout.js`, `pageHead` + `topicPage`, + `59-topic.css` ; widgets par `home.js`) :
  **Au-dessus** : Guide du joueur, Saison et Annexe, puis le séparateur avec le logo (même mode `#sg-home.is-forum`
  que les forums ; `home.js` reconnaît `/fN…` et `/tN…`, placement « Sur les sujets » coché sur le module 11).
  **En-tête** : même pattern que les forums (`pageHead` reconnaît `/tN-…` et lit `#topic .topic-header`) ; le sujet
  est le dernier niveau du fil d'Ariane (sans lien, en gras, coupé à 40ch) ; **titre sur une ligne, coupé en ellipse**
  (texte dans `.sg-pagehead__text`, le filet `::after` reste dessous ; titre complet en infobulle) ; **description du
  sujet** dessous : absente de la page, elle est lue dans la liste des sujets du forum (1re page seulement ; cache de
  session `snj-tdesc`) ; une seule action, « Répondre au sujet ». **Retirés** : la cloche des notifications push du
  sujet (`#push-bell`) et « Poster un nouveau sujet ». Sur mobile (forums et sujets) : fil d'Ariane, titre,
  description, puis les boutons (`.sg-pagehead__row` en `display: contents` + `order`).
  Couleur de la catégorie posée sur `#topic` (`#topic.sg-tone-…`). Classe `body.sg-topicpage` (et `sg-topicpage-on`).
  **Barre du sujet** (`.sg-tbar`, `z-index: 5`) : menu « Actions » seul, à droite : Ajouter à mes favoris, Suivre /
  Ne plus suivre ce sujet, Copier le lien du sujet. **Retirés** : Sujet précédent / suivant, Imprimer, Nouveaux
  messages depuis ma dernière visite, Mes sujets suivis.
  **Messages « fumi »** (文, la lettre) : pattern **réservé aux messages**, partout où ils s'affichent (sujets ; à
  reprendre pour l'aperçu, les messages privés, les résultats de recherche par message). Le balisage natif est
  conservé (citation, J'aime, éditeur continuent de fonctionner) : `.post-wrap.sg-post` en grille `248px | 1fr`,
  `.post-body` en `display: contents`, chaque message `isolation: isolate` (l'en-tête natif a un `z-index: 500`).
  Colonne de l'auteur : liseré gauche de 3px et léger halo à la couleur de son groupe (`--author`, lue en JS sur son
  pseudo après `08-groups.css`, relue à chaque changement de thème ; couleur de la catégorie à défaut).
  **Rôle au-dessus du portrait** (`postRoles`) : **bandeau** `.sg-role` (pas une pastille) sur motif **shippō**
  (communauté, staff) à la couleur de l'auteur, filets haut et bas, libellé en Zen Antique ; **Staffeux** ou
  **Modérateur** d'après les groupes du forum (`staffRoles` : `/groups` puis `/g2-staffeux`, `/g9-moderateurs`…,
  cache `snj-roles` de 15 min) avec le **magatama plein** du logo (`MAGATAMA_SVG`) ; sinon le rang Forumactif, sans
  magatama ; le rang natif (« Admin ») est masqué. **Portrait 200 × 400** (56 × 112 sur mobile), cerné à la couleur de
  l'auteur, **sans pastille « en ligne »**. Pseudo en Zen Antique, fiche compacte (libellé / valeur ; le gris `#444444`
  écrit en dur par Forumactif est neutralisé), contacts en icônes rondes (profil, message privé, e-mail, site web).
  Lettre : en-tête (numéro « #n » à la couleur de l'auteur, lien permanent ; date ; boutons citer / modifier /
  supprimer / IP en icônes rondes, sur tous les formats), contenu (1rem, interligne 1,75 ; citations, code et spoilers
  sur fond de surface), **J'aime en cœur** : vide, plein et rouge (`--sg-like`, `#e0475b`) une fois aimé — Forumactif
  passe le bouton de `.fa_like` à `.fa_liked` et affiche le compteur `.rep-nb` ; **« Je n'aime pas » masqué** ;
  signature sous un filet pointillé. ≤ 768px : profil en bandeau au-dessus de la lettre (rôle sur toute la largeur,
  puis portrait | pseudo | contacts ; fiche masquée).
  **Réponse rapide** : carte au même gabarit, intitulé « Répondre » ; l'éditeur natif (SCEditor) est conservé et
  restylé (ses bordures et fonds sont en `!important` dans le CSS de Forumactif : on surcharge en `!important`).
  **Bas de page** (`.sg-tfoot`) : séparateur de fin, « Sauter vers » (`jumpBox`, forum du sujet coché) à gauche,
  outils de modération à droite (`.sg-modtools` : libellé « Modération » + icônes rondes de `.topic-admin`), puis
  les permissions et le fil d'Ariane. Retirés aussi : barre « Plus ! / Partagez », bouton fixe « Répondre au sujet »,
  liste « Outils de modération » (doublon des icônes), lien « Arrêter de surveiller ce sujet » (dans « Actions »).
- **Permissions : laissez-passer « tegata »** (`layout.js`, fonction `perms`, + `58-perms.css`) : pattern **réservé
  aux permissions**, sur toutes les pages où Forumactif affiche le bloc « Permission de ce forum » (pages de forum,
  pages de sujet…) ; le bloc natif est masqué. Le tegata 手形 est le sauf-conduit qu'on présentait aux barrières.
  Intitulé discret « Droits dans ce forum » (petites capitales, icône `verified_user` à la couleur de la catégorie),
  puis une **étiquette aux coins coupés en biseau** (`clip-path`, contour 1px qui suit le biseau : l'élément sert de
  filet, son `::before` décalé de 1px sert de fond ; seul pattern du forum à coins coupés) par droit, en grille
  `auto-fit` (240px min., 1 colonne ≤ 600px) : icône de l'action dans un cercle teinté (`--ph`), libellé court, cachet
  **« Autorisé »** (coche, Asagi) ou **« Non autorisé »** (cadenas ; étiquette estompée, hachurée en biais comme une
  barrière fermée). Lignes natives découpées sur les `<br>` ; « ne pouvez pas » = non autorisé ; libellés et icônes
  des droits connus dans `KNOWN` (créer des sujets, répondre, modérer, modifier, supprimer, voter, joindre des fichiers,
  événements), sinon la phrase native raccourcie ; phrase complète en infobulle. Un droit avec lien (« Modérer ce
  forum ») : toute l'étiquette est le lien, flèche à droite, contour à la couleur de la catégorie au survol.
  **Fil d'Ariane repris dessous** (copie du `.sg-crumbs` de l'en-tête, `.sg-crumbs--end`), quand l'en-tête existe.
  Récapitulatif des patterns : **forum** (accueil) = image en fond + panneau + kanji ; **sous-forum** = ema
  (image en toit) ; **sujet** = motif yagasuri, sans image ; **message** = fumi (profil à liseré + lettre) ;
  **permission** = étiquette tegata aux coins coupés.
- **Catégories de l'accueil** (`forums.js` + `40-zones.css`) : à gauche un sélecteur collant (Gestion, Hi, Mizu, Kaze,
  Kaminari, Tsuchi no Kuni, Shōkoku — « les petits pays », ex-Reste du Sekai) au style des raccourcis de l'Annexe, pastille = badge pour Gestion
  (sumi et gofun) et kanji du pays sinon (火 水 風 雷 土, 他 comme sur l'annexe), couleur de la nation ; onglet actif
  rempli. Libellé des onglets sur le fond de la barre latérale (`--sg-surface`) ; au survol et actif, texte et kanji
  en blanc papier (`--sg-paper-50`), Gestion en `--sg-on-contrast`. Sur mobile (≤ 900px), menu déroulant personnalisé. À droite, les forums de la catégorie en cartes (inspirées de
  l'ancien SnJ) : image en fond avec voile selon le thème, panneau avec kanji en filigrane propre au forum, titre,
  description, bouton du clan (fiche de l'annexe), dangerosité sur 5 (zones RP uniquement), dernier message avec
  avatar, sous-forums à droite (libellé **toujours sur une ligne, coupé en ellipse**, sur tous les formats ; flèche
  toujours visible ; nom complet en infobulle `title`) ; au survol, le libellé d'un sous-forum passe en blanc papier (`--zc-hover`, sumi et
  gofun pour Gestion). **Gestion** : cartes sans image sur motif seigaiha (`plainCard()`), titre, puis description et
  dernier message alignés sur une ligne (`.sg-zcard__row`, en colonne ≤ 900px), puis les sous-forums sur toute la
  largeur en **grille de 2 colonnes, 2 par page**, pagination par **chevrons** centrée (`.sg-zcard__pager` : boutons
  ronds `.sg-zcard__page` précédent / suivant, grisés aux extrémités, page courante « 2 / 3 » entre les deux ; 1 colonne,
  boutons de 44px espacés de 28px ≤ 600px). Catégories sans forum : « Prochainement ».
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
  Dernier inscrit (portrait, sceau 新 qui se tamponne au survol ; pseudo sur toute la largeur, coupé en ellipse ;
  « Bienvenue sur / Sengoku no Jidai. » toujours sur 2 lignes, `white-space: pre-line`), En ce moment (point « en direct » Asagi, jauge
  enregistrés / invisibles / invités, record en discret), « Aperçus récemment » (connectés des 24 h, pseudos en pastilles colorées,
  magatama pleins du logo de SnJ pour le staff, « + N autres » au-delà de 24, shippō ; lien « Voir qui arpente le
  Sekai » vers `/viewonline`, toujours au bas de la carte), Groupes (bannières **nobori** sans hampe : une par groupe,
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
  Ils sont regroupés dans un fichier `/NNNNN.js` mis en cache très longtemps. Il arrive que Forumactif réutilise le même
  nom de fichier après une modification : la page charge alors l'ancienne version. Vérifier après chaque mise à jour
  (le code servi par `fetch('/NNNNN.js', {cache: 'no-store'})` doit contenir la nouveauté) ; sinon, revalider le module
  sans rien changer, ce qui produit un nouveau nom de fichier.
- **Transitions** : AwesomeBB applique `* { transition: 0.16s }`. Un texte placé dans un enfant d'un élément dont la
  couleur s'anime saute pendant l'animation : mettre `transition: none` sur ces enfants (voir `40-zones.css`).
- **Variables CSS** préfixées `--sg-*`. On rebranche les `--t_*` d'AwesomeBB sur nos tokens.
- **CSS hors forum** : servi par jsDelivr depuis ce dépôt, avec une adresse versionnée (SHA de commit ou tag).
  Le CSS indispensable reste dans le CSS principal du forum pour que le forum reste lisible si le CDN tombe.
- **Messages libres** (sans modèle) : doivent rester lisibles et épurés.
- **Migration** : bascule de tout le forum en une fois.
  Alendria (test) : activation des nouveaux membres sur « Aucune activation » (comptes de test sans e-mail de
  confirmation). **Ne pas reporter en production**, qui garde l'activation par l'utilisateur (e-mail).

## Préférences de design de Vinny (apprises de ses retours)

À appliquer d'emblée sur toute nouvelle page, sans attendre qu'il le redemande ; signaler quand un retour contredit
une décision de la refonte.

- **Épuré, sans doublon** : retirer ce qui répète une information ou une action disponible ailleurs (boutons
  « Poster un nouveau sujet » sur un sujet, précédent / suivant, entrées de menu peu utiles, « Je n'aime pas »,
  pastille « en ligne », cloches, barres natives). Une seule action principale par en-tête.
- **Une ligne, en ellipse** pour les titres et libellés (titres de sujet, sous-forums, pseudos), nom complet en infobulle.
- **Pas de look « badge »** pour les éléments d'identité (rôles, statuts importants) : bandeaux avec **motif Edo** et
  **éléments de l'univers** (magatama du logo, kanji, sceaux) plutôt que des pastilles génériques.
- **Cohérence entre pages** : reprendre les mêmes blocs (widgets Guide / Saison / Annexe + séparateur, en-tête,
  fil d'Ariane en bas, séparateur de fin) d'une page à l'autre.
- **Vocabulaire de l'univers** : « shinobi », « Sekai », noms des groupes du forum (« Staffeux » plutôt que le rang
  « Admin »), libellés courts.
- **Icônes Material Symbols** sobres (cœur, chevrons, trois points verticaux), pleines pour un état actif.
- **Mobile** : cibles de 44px, éléments empilés dans un ordre logique (titre, description, puis actions).
- **Couleurs** : tokens de la refonte ; un retour peut demander une couleur hors palette (ex. cœur rouge) : l'appliquer,
  la nommer dans un token dédié, et signaler l'écart à la règle.

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
