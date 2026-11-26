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
| `src/js/` | Un fichier par script : `layout.js` (barre latérale, thème, pied de page, en-tête, sous-forums, sujets, page de sujet, page d'écriture et permissions ; toutes les pages, module 10), `home.js` (widgets de l'accueil et des pages de forum, index + sous-forums, module 11), `forums.js` (catégories de l'accueil, index, module 12), `stats.js` (statistiques de l'accueil, index, module 13) | PA › Modules › Gestion des codes JavaScript |
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
  Haut : avatar du membre, ou logo SnJ (`assets/snj-logo.webp`) pour les visiteurs. **Menu du compte** au **clic** sur l'avatar (pas au
  survol ; `accountMenu`, l'avatar devient un `<button>` dans `.sg-sb-account`, infobulle « Mon compte » au survol,
  masquée menu ouvert) : pseudo en Zen Antique, Mon profil (`/uN`), Paramètres du profil
  (`/profile?mode=editprofile&page_profil=informations`), Panneau d'administration (admins, lien natif), puis sous un
  filet Déconnexion (lien natif, avec son `tid`). Second clic, clic à côté, Échap ou focus qui sort le ferment. Sur
  mobile il s'ouvre au-dessus de la barre du bas (`position: fixed`, la barre défilant horizontalement le couperait).
  Navigation : Accueil, Membres (masqué sur mobile), Discord, Annexe, Carte (masquée sur mobile pour les visiteurs).
  Visiteurs : Connexion et Inscription (Inscription masquée sur mobile) en bas.
  Bas : Notifications (avec pastille), thème clair/sombre (administration et déconnexion sont dans le menu du compte).
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
  Verrouillé) ; **Verrouillé s'ajoute à côté du type** (annonce, note) : Forumactif garde alors la classe du type
  (`folder_announce`…) et le verrou ne se lit que dans l'infobulle de `.posts-icon` (« Ce sujet est verrouillé… »), « Nouveau » en Asagi ; **pas d'icône dans le coin supérieur droit** (l'indicateur de participation a été
  retiré). Titre en Zen Antique (2 lignes max), description sur 1 ligne, « par » + auteur coloré, pages du sujet en
  pastilles ; en pied (pointillé) réponses et vues, dernier message (avatar, auteur coloré, date vers le message),
  **toujours au bas de la carte** (`margin-top: auto` ; l'élément qui le précède garde 10px de marge basse).
  Verrouillés : carte atténuée (72 %), **sauf les annonces** (et annonces globales) verrouillées, qui restent à pleine opacité (demande de Vinny). Grille de 2 colonnes, **même hauteur pour toutes les cartes** (`grid-auto-rows: 1fr`) ;
  1 colonne ≤ 768px. Soulèvement au survol. **« Poster un nouveau sujet » deux fois** : le bouton d'origine reste à droite
  du titre de la page (en-tête) — **sauf si le forum n'a pas de sous-forum** (la barre est alors juste sous le titre :
  le bouton de l'en-tête est retiré, demande de Vinny) —, et un second, qui reprend son adresse, est **au-dessus de la grille, à gauche**
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
  `actionsMenu(items, id, opts)` (menu déroulant ; `items` = `[adresse ou fonction, icône, libellé]`, `null` =
  séparateur, `{ pref, icon, label(actif) }` = interrupteur `.sg-switch` qui enregistre une préférence et laisse le menu
  ouvert ; une 4e valeur `'danger'` marque une entrée destructive ; `opts` = `{ label, icon, iconFirst, iconOnly, lead,
  toggleCls, cls }` (`lead` : icône avant le libellé en plus de `icon` après, allure de liste déroulante) : « Actions » par défaut, `sg-menu--start` (menu ouvert
  vers la droite), `sg-menu--icon` (bouton rond sans contour, trois points des messages)), `combo(select, opts)` (listes personnalisées), `jumpBox(valeurCourante)` (« Sauter vers »),
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
  session `snj-tdesc`) ; une seule action, « Répondre au sujet ». Sujet verrouillé : Forumactif met à la place un lien
  « Sujet verrouillé » vers la réponse ; il devient une **étiquette sans interaction** (`span.sg-action--status`, ni
  survol ni clic, demande de Vinny), son adresse gardée en `data-reply-href` pour le bouton « Répondre au sujet » du bas
  (staff). **Retirés** : la cloche des notifications push du
  sujet (`#push-bell`) et « Poster un nouveau sujet ». Sur mobile (forums et sujets) : fil d'Ariane, titre,
  description, puis les boutons (`.sg-pagehead__row` en `display: contents` + `order`).
  Couleur de la catégorie posée sur `#topic` (`#topic.sg-tone-…`). Classe `body.sg-topicpage` (et `sg-topicpage-on`).
  **Barre du sujet** (`.sg-tbar`, `z-index: 5`) : **« Préférences »** à l'extrême gauche (icône `tune`, même bouton
  que « Actions ») avec deux interrupteurs (piste sumi et gofun, Asagi une fois activé, pastille qui glisse avec un
  léger rebond) : « Position du profil (défaut / inversé) » et « Densité (défaut / compact) ». **Compact**
  (`html[data-density="compact"]`) : 16px entre les messages (48px par défaut), plus d'écart entre le profil et la
  lettre, les deux zones **réunies sur un même fond** (`--sg-surface` sur `.post-wrap`, une seule carte arrondie) ; la
  colonne du profil prend 16px de marge intérieure (côté de la lettre exclu ; sur mobile `16px 16px 0`). Gardées comme le thème (`localStorage` + cookie, `snj-profile` = `right`|`default`,
  `snj-density` = `compact`|`default`), réappliquées au chargement, au retour arrière et d'un onglet à l'autre ;
  attributs `data-profile="right"` et `data-density="compact"` sur `<html>`. Profil inversé = profil à droite de la
  lettre (sur ordinateur ; sur mobile le profil reste au-dessus). « Actions » à droite : Ajouter à mes favoris, Suivre /
  Ne plus suivre ce sujet, Copier le lien du sujet. **Retirés** : Sujet précédent / suivant, Imprimer, Nouveaux
  messages depuis ma dernière visite, Mes sujets suivis.
  **Messages « fumi »** (文, la lettre) : pattern **réservé aux messages**, partout où ils s'affichent (sujets ; à
  reprendre pour l'aperçu, les messages privés, les résultats de recherche par message). Le balisage natif est
  conservé et déplacé (citation, J'aime, éditeur continuent de fonctionner) : `.post-wrap.sg-post` en grille
  `248px | 1fr` **avec 16px d'écart**, sans fond ni bordure, **48px entre deux messages** ; l'en-tête et le contenu sont déplacés dans une carte
  `.sg-post__letter` (fond de surface, arrondie, **sans bordure** ; **pas de séparation** entre l'en-tête et le
  contenu : ni filet ni l'ombre qu'AwesomeBB pose sur `.post`) ; `.post-body` en `display: contents`, chaque message `isolation: isolate`.
  **Empilement** : Forumactif donne `z-index: 500` à la fois à `.post-header` et à `.post` ; le corps, placé après,
  recouvrait le menu trois points et captait ses clics (menu visible mais inactif). L'en-tête est donc à `z-index: 2`,
  le corps à `1` ; la carte de la lettre n'a pas d'`overflow: hidden` (le menu peut en déborder) et un message dont un
  menu est ouvert passe au premier plan (`.sg-post:has(.sg-menu.is-open)`, `z-index: 10`). Tout menu se referme au
  retour arrière (`pageshow` avec `persisted`). Toujours vérifier un menu par `elementFromPoint`, pas seulement à l'œil.
  **Colonne de l'auteur**, sans liseré, **collante** (`position: sticky`, 24px du haut ; statique sur mobile) : le
  **rôle** (`postRoles`) en haut, hors de la carte : **bandeau** `.sg-role` (pas une pastille) **plein à la couleur de
  l'auteur** (`--author`, lue en JS sur son pseudo après `08-groups.css`, relue à chaque changement de thème), arrondi
  10px, motif **shippō**, texte et magatama dans la couleur du fond (`--sg-surface` : sombre en thème sombre, clair en
  thème clair), libellé en Zen Antique ; **Staffeux** ou **Modérateur** d'après les groupes du forum, et dans ce cas **à la couleur du groupe**, comme les
  bannières « Les groupes » de l'accueil, quel que soit le thème ou le pays (`roleBand()`, `.sg-role--g-staff` : sumi
  et gofun, texte `--sg-on-contrast` ; `.sg-role--g-mod` : Hagane, texte `--sg-surface`) (`staffRoles` : `/groups` puis `/g2-staffeux`,
  `/g9-moderateurs`…, cache `snj-roles` de 15 min) avec le **magatama plein** du logo (`MAGATAMA_SVG`) **de la couleur
  du texte** ; sinon le rang Forumactif, sans magatama ; le rang natif (« Admin ») est masqué. Dessous, la **carte du
  profil** `.sg-post__card`, **sans fond ni bordure** (padding `0 16px`) : **portrait 200 × 400** (56 × 112
  sur mobile) **sans cadre** ni pastille « en ligne », pseudo en Zen Antique **sans l'infobulle de profil** de
  Forumactif (tooltipster détruit, lien remplacé par un clone), une **simple ligne** (`hr.sg-post__rule`, 60 % de la
  largeur, centrée, 1px `--sg-border` ; masquée sur mobile ; le séparateur avec logo a été écarté ici), puis la fiche
  réduite `.sg-post__facts` (icônes de la couleur du texte, chaque information **sur 2 lignes au plus, en ellipse**,
  texte complet en infobulle) :
  « **Inscrit depuis** N jours / semaines / mois / ans » (`memberSince` : < 1 semaine en jours, < 1 mois en semaines,
  < 1 an en mois, puis en années ; pluriels gérés ; date complète en infobulle) et la **localisation** avec l'icône
  `location_on`. **Retirés** : Messages, Âge, les icônes de contact (profil, MP, e-mail, site web).
  **Lettre** : en-tête (padding `10px 8px 0 16px`) avec la **date de publication** (`schedule`) et, si Forumactif
  l'écrit, la **date de dernière modification** (`edit_note`, « Modifié le … », mention complète en infobulle) ; la
  mention native « Dernière édition par X le …, édité N fois » (souvent en **texte brut** après des `<br>`, parfois
  dans une balise) est extraite du contenu par `editedInfo`, enveloppée si besoin, et replacée **au bas de la lettre**
  (`.sg-post__edited`, 14px, `--sg-text-muted`, juste après `.post-content`, qui en `flex: 1` la pousse en bas).
  Forumactif ne compte pas toutes les modifications : une modification faite pendant que le message est le dernier du
  sujet n'est pas enregistrée (moteur phpBB) ; on ne peut afficher que ce qu'il écrit. Contenu en padding
  `16px 16px 20px`. **Arrivée par un lien de message** (`#3`) : `scroll-margin-top: 24px` sur l'en-tête et
  `alignPostHash()` cale le haut du message (rôle, et profil sur mobile, visibles) à 24px, refait au chargement
  complet tant que le lecteur n'a pas défilé (molette, toucher, clavier, clic). **Plus de numéro « #n »**. À droite, **J'aime** (cœur : vide, plein
  et rouge `--sg-like` `#e0475b` une fois aimé, compteur `.rep-nb` ; le `.fa_like_div` natif est déplacé, le pied
  devenu vide est masqué ; « Je n'aime pas » masqué) puis le bouton **trois points** (`more_vert`, rond, sans contour,
  `sg-menu--icon`) : Citer ce message, Modifier le message, Supprimer le message, Voir l'adresse IP (Signaler le
  message s'il existe), séparateur, Copier le lien du message (remplace le lien permanent « #n ») ; les boutons natifs
  `.post-buttons` sont masqués et une entrée sans lien natif n'apparaît pas. Contenu (1rem, interligne 1,75 ;
  citations, code et spoilers sur fond de surface), signature sous un filet pointillé.
  ≤ 768px : profil au-dessus de la lettre (rôle sur toute la largeur, puis carte portrait | pseudo et fiche),
  « Préférences » et « Actions » côte à côte, cœur et trois points en cibles de 44px. Forumactif **minifie** le code
  des modules : pour vérifier une version servie, chercher un nom de fonction, pas une chaîne avec des espaces.
  **Réponse rapide remplacée** par un bouton **« Répondre au sujet »** (`.sg-treply`, style `.sg-action`, icône
  `reply`) **centré** sous le dernier message, qui reprend l'adresse du bouton de l'en-tête (`mode=reply`) ; le bloc
  natif `.quick-reply` est masqué (`#topic:has(.sg-treply) .quick-reply`). Pas de bouton sans lien de réponse (sujet
  verrouillé, visiteur). Le style de l'éditeur SCEditor reste dans `59-topic.css` pour la page de réponse.
  **Sujets similaires** (`similarTopics`) : **sous « Répondre au sujet »**, plus de bloc repliable (`#ptrafic_open` /
  `#ptrafic_close` masqués) ; intitulé discret « Sujets similaires » (petites capitales, icône `library_books`, comme
  les permissions), puis les **cartes de sujet** (même pattern yagasuri, `topicCard(row)` partagée avec les pages de
  forum) en grille de 2 colonnes. Forumactif ne donne que les titres : chaque carte est lue dans la liste de son forum
  (page du sujet → dernier forum du fil d'Ariane → ligne `.posts-section` de la 1re page), cache `sessionStorage`
  `snj-similar` de 5 min ; carte provisoire au titre seul en attendant (ou si le sujet n'est pas en 1re page). **Aucun sujet
  similaire** : Forumactif garde son bloc (titre + boîte vide) ; `#ptrafic_open` et `#ptrafic_close` sont alors masqués. Chaque
  carte prend la couleur de la catégorie de **son** forum (`.sg-topic.sg-tone-…`).
  **Bas de page** (`.sg-tfoot`) : séparateur de fin, « Sauter vers » (`jumpBox`, forum du sujet coché) à gauche,
  à droite la liste déroulante **« Modération »** (`actionsMenu` avec `lead: 'gavel'`, chevron qui pivote, bouton au
  style `.sg-tool` des listes personnalisées, `#sg-mod-menu`) qui remplace les icônes natives de `.topic-admin`
  (masquées) : Verrouiller / Déverrouiller le sujet, Déplacer le sujet, Diviser le sujet, Fusionner avec un autre
  sujet, puis sous un filet « Supprimer » en Ume (`.sg-menu__item--danger`, icône `delete`). « Mettre à la
  corbeille » est retiré (demande de Vinny : `MOD.trash = null`). Libellés et icônes choisis d'après le mode du lien natif (`MOD`), adresses natives ; un
  outil inconnu garde son titre et son icône natifs. Puis les permissions et le fil d'Ariane. Retirés aussi : barre « Plus ! / Partagez », bouton fixe « Répondre au sujet »,
  liste « Outils de modération » (doublon des icônes), lien « Arrêter de surveiller ce sujet » (dans « Actions »).
- **Page d'écriture d'un message : écritoire « suzuri »** 硯 (la pierre à encre) (`layout.js`, fonction `writePage`,
  + `60-write.css`, adresse `/post` : répondre, citer, nouveau sujet, modifier). Pattern **réservé à l'écriture**, qui
  prolonge les messages « fumi » : on écrit dans la même lettre que celle qui sera publiée. **Le bloc de l'éditeur
  (`#postingbox`) n'est jamais déplacé** : l'iframe de SCEditor se rechargerait et l'éditeur casserait ; c'est le
  formulaire qui devient la grille (`form.sg-writeform`, `248px | 1fr`, sans écart de rangée : les marges espacent,
  l'auteur s'étend sur `grid-row: 1 / span 40`), et la préférence « Position du profil (inversé) » s'y applique.
  **Haut** : séparateur avec le logo (sans les widgets : la page reste concentrée sur l'écriture ; logo au trait en
  masque CSS depuis `assets/snj-logo-outline.svg`), puis l'en-tête au pattern des forums : fil d'Ariane lu sur la page
  du sujet ou du forum (`/t3-` ou `/f4-` : **sans le tiret, `/t3` renvoie une 404**), liens d'origine repris tels quels
  (icône maison), le verbe en dernier niveau ; **titre = le verbe** (« Répondre au sujet », « Nouveau sujet »,
  « Modifier le message ») ; description « Dans « <sujet ou forum> » » en texte simple (pas de lien : le fil d'Ariane y mène déjà) ; couleur de la catégorie (`--ph`).
  **Colonne de l'auteur** (collante, masquée sur mobile) : rôle (`.sg-role`, d'après `staffRoles`), portrait 200 × 400
  (`_userdata.avatar`), pseudo. **Lettre** (fond de surface, arrondie, sans bordure ni l'ombre qu'AwesomeBB pose sur `.block-content`) : sur une ligne (`.sg-write__titlerow`), le champ du titre
  (« Titre du message (facultatif) » / « Titre du sujet ») au style des listes personnalisées (`.sg-write__field` :
  contour arrondi, fond de surface, 46px ; Forumactif impose `border-radius: 0 !important` et un fond transparent à
  `.input-subtle`, d'où nos `!important`) et à sa droite la **couleur du titre** (liste personnalisée avec pastilles,
  option `swatch` de `combo()`, 180px ; sa liste fait la largeur du bouton et s'aligne à droite, sinon elle déborde
  de la page ; dessous sur mobile). **Cinq couleurs** (`TITLE_COLORS`), enregistrées sous les
  codes natifs de Forumactif et affichées avec nos tokens (`--sg-title-*`, `08-groups.css`) : Défaut (`''`, couleur
  du texte), Rouge (`#FF0000` → Hi), Orange (`#FF9933` → **Kaki** 柿 `#d98a4e` / `#b5602a`, **hors palette**, demandé
  par Vinny), Vert (`#006600` → Kaze), Hagane (`#0000FF` → primaire) ; une couleur ancienne hors liste est gardée. Le
  titre se colore à l'écriture ; sur les cartes de sujets et l'en-tête du sujet, `titleToneOf()` lit le code natif et
  pose `.sg-tcolor--hi|kaki|kaze|hagane` (non vérifié sur un vrai sujet coloré). Description du sujet au même style.
  Éditeur sans bordures ; la **barre d'outils est posée sur la lettre**, hors du fond : seule la zone de saisie
  (textarea et iframe) a le fond `--sg-surface-2` et l'arrondi de 12px, en `padding: 16px !important` (16px aussi
  dans l'iframe du mode visuel). **Toutes les icônes sur une seule ligne** (boutons de 32px, flex sans retour à la
  ligne, défilement horizontal sur petit écran ; filet retiré après le dernier groupe visible, `.sg-tb-last`).
  **Survol** d'une icône en sumi et gofun plein (actif : teinte légère), **état gardé tant que sa fenêtre est
  ouverte** (`.sg-tb--open`, posé sur le bouton qui l'a ouverte, retiré à la fermeture) et
  **libellé en infobulle** au survol et au focus (`toolbarTips()` : une seule infobulle `.sg-tbtip` en position fixe,
  posée sur la page, car la barre défile et couperait une infobulle CSS ; libellés natifs, `TB_LABELS` pour les plus
  longs). **Fenêtres des outils** (spoiler, héberger une image, insérer une image, lien, enrichir un lien, vidéo
  YouTube, format des titres, couleur) au design system (`editorPopups()` : SCEditor les recrée à chaque ouverture,
  un `MutationObserver` les marque `.sg-pop`) ; Forumactif coupait tout ce qui sortait de `#textarea_content`
  (passé en `overflow: visible`) ; chaque fenêtre est **replacée** après SCEditor (valeurs en `!important`, et à
  chaque changement de taille) : sous son bouton pour Servimg (posée sur la page, elle recouvrait la barre ;
  gardée et seulement masquée entre deux ouvertures), décalée vers la gauche si elle dépasse la lettre ; fond de surface, contour, ombre, libellés en petit, champs arrondis
  sur `--sg-surface-2`, bouton « Insérer » sumi et gofun ; la fenêtre de Servimg est une page extérieure (cadre
  seulement). Titres : « Grand titre » / « Titre » / « Sous-titre » en Zen Antique (`HEADER_LABELS`, balises h2 à h4
  inchangées). **Couleur** : fenêtre reconstruite en **pastilles seules** (nom en infobulle), **8 par ligne**, en deux groupes :
  **« Sengoku no Jidai »** d'abord (`TEXT_COLORS` : Hagane, Sumi et gofun, Asagi, Ume, Kaki, les six pays), puis
  **« Défaut »** (couleurs de base de Forumactif, lues dans la fenêtre native) ; un clic insère `[color=#CODE]…[/color]`
  (`insertText` de SCEditor) avec le code « sombre » pour celles de la refonte, que `08-groups.css` remplace à l'affichage par le token
  (la couleur suit le thème ; Asagi, Ume et Kaki y ont été ajoutés). **Densité compacte** : le profil et la lettre
  partagent le même fond (`form.sg-writeform` sur `--sg-surface`, sans écart, profil en marge intérieure de 16px).
  **Mode bloqué en texte (BBCode)**, celui qu'utilise Vinny : `lockEditorMode()` rebascule un éditeur ouvert en
  mode visuel (`toggleSourceMode()` de l'instance SCEditor). **Barre d'outils** (`editorToolbar()`) : retirés (`TB_REMOVE`) tableau, taille,
  police, supprimer le formatage, plus/moins de boutons, défilements horizontal et vertical, aléatoire, Twemoji, date,
  heure, coller sans formatage, **basculer le mode d'édition** (mode bloqué en texte, voir plus haut) ; les
  groupes vides sont masqués. Icônes d'origine remplacées par des Material Symbols (`TB_ICONS` ; YouTube en SVG de
  Simple Icons) ; SCEditor rejette le texte hors champ (`text-indent: -9999px`), annulé sur nos icônes. Le panneau
  de smileys et l'aide « Le HTML est désactivé… » sont masqués. **Mode visuel** de
  l'éditeur : la zone d'écriture est une iframe que le CSS de la page n'atteint pas : `editorFrameTheme()` y injecte
  la couleur du texte, la police et surtout le **même `color-scheme` que la page** (sinon le navigateur peint un fond
  blanc opaque derrière l'iframe), relu 260ms après un changement de thème (transition d'AwesomeBB).
  **Réglages** au pied de la lettre : les cases natives (bloc « Options », masqué) deviennent des **interrupteurs**
  `.sg-opt` (la case reste dans le formulaire, masquée ; `.sg-switch` partagé avec « Préférences ») aux libellés courts
  (« Désactiver le BBCode », « Désactiver les smileys », « M'avertir des réponses », « Ajouter ma signature ») ; le
  **type du sujet** en contrôle segmenté `.sg-seg` (Normal, Épinglé, Annonce, Annonce globale ; deux par ligne sur
  mobile) ; la **couleur du titre** en liste personnalisée (`combo`). **Boutons** à droite sous un filet :
  « Prévisualiser » (contour, `visibility`) puis le bouton natif d'envoi, libellé « Envoyer », « Publier le sujet » ou
  « Enregistrer » (plein) ; sur mobile en pleine largeur, « Envoyer » au-dessus. **Retirés** (demande de Vinny) : la
  **raison de la modification** (`edit_reason`), les blocs **Calendrier** (`#calendar-block`) et **Outils SEO**
  (`#seo-block`). **Autres blocs** du formulaire (règles du forum, sondage, pièces jointes…) en **panneaux
  repliables** `.sg-panel` (fond de surface, sans contour ; titre en Zen Antique, chevron ; fermés, sauf les
  règles) ; leurs listes passent en `combo`, leurs champs au contour arrondi. **Sondage** (`pollPanel()`) :
  **aucun contrôle natif à l'écran**, les champs d'origine restent dans le formulaire sous leurs noms : Question
  (champ de l'écritoire sur `--sg-surface-2`) ; **Choix** en liste numérotée de champs (`.sg-poll__choices` : Entrée
  passe au suivant ou en crée un, retrait d'une ligne au ✕ en Ume, deux au minimum, « Ajouter un choix » jusqu'au
  maximum lu dans la consigne) qui remplit le textarea `poll_option_text` masqué (une ligne par choix) ; **Durée**
  en compteur − / valeur / + avec l'unité (« sans fin », « jour », « jours » ; flèches haut et bas) qui remplit
  `poll_length` masqué ; les quatre réglages (Choix multiple, Annulation du vote, Liste des participants, Votants de
  chaque choix ; « Quand le sondage est terminé » → « À la fin ») en **contrôles segmentés** `.sg-seg` (radios
  natives déplacées et masquées), grille de 2 colonnes (1 sur mobile). **Modification d'un sondage existant** :
  Forumactif ne donne pas de textarea mais un champ par choix (`poll_option_text[N]`) avec son bouton « Supprimer »
  (`del_poll_option[N]`, envoi du formulaire) et « Ajouter ce choix » (`add_poll_option_text` + `add_poll_option`) :
  ces champs sont repris dans la même liste (✕ et + cliquent les boutons natifs, masqués ; la page se recharge,
  consigne « Ajouter ou retirer un choix recharge la page ») ; le reste du bloc natif est **gardé masqué** (jamais
  vidé : tout champ continue d'être envoyé — vider le bloc faisait disparaître les choix et bloquait la
  modification).
  **Aperçu** (`#preview`) : carte « Aperçu » sur fond de surface, sans contour ni ombre (celles d'AwesomeBB sur
  `.block-header` et `.block-content` sont retirées). **Revue du sujet** : « Derniers messages du sujet » **repliés par défaut** :
  le titre est un bouton (`.sg-review__toggle`, sans contour ; au survol, fond `--sg-surface-2` et chevron qui fait
  un pas dans le sens de l'ouverture) avec le **nombre de messages**
  en pastille Asagi, « Afficher » / « Masquer » et un chevron (`aria-expanded`). Messages au **pattern « fumi »** de la
  page du sujet (`section.sg-review.sg-fumi` : le CSS des messages vise `:is(#topic, .sg-fumi)`), préférences
  « Position du profil » et « Densité » comprises, couleur de la catégorie, mais un profil réduit à **l'avatar et au
  pseudo** (ni rôle ni fiche ; la page du sujet n'est pas touchée). Forumactif n'y donne que portrait, pseudo coloré
  (parfois absent : repli sur le texte alternatif du portrait), date et contenu ; ses détails, parfois glissés dans le
  contenu (`.block-footer`), sont retirés. Pas de J'aime ni de menu (aucun lien natif).
  **« Lire la suite »** gardé, **centré** (`.sg-rev__more`, « Réduire » une fois déplié) : le message est coupé à la
  hauteur du profil (`--rev-clamp`, 240px au moins, 240px sur mobile), avec un fondu ; calculé à l'ouverture et au
  redimensionnement. Le bouton n'apparaît que si le texte dépasse : sa hauteur est mesurée sur le contenu (`Range`),
  car la boîte du message est étirée à la hauteur du profil et AwesomeBB anime tout changement de style. En bas : séparateur de fin et fil d'Ariane repris. Non testés faute d'envoyer un formulaire :
  aperçu, modification, erreurs, pièces jointes.
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
- **Page de confirmation ou d'information : sceau « hanko »** 判子 (`layout.js`, fonction `noticePage`, +
  `61-notice.css`) : pattern **réservé aux pages où Forumactif n'affiche qu'un message** (template `message_body` :
  un seul `.block` « Informations » dans `#wrap`, sans formulaire ; les autres enfants ne peuvent être que des
  emplacements publicitaires de Forumactif, des `div` sans classe, comme sur `/modcp`) : message publié, modifié, supprimé, sujet
  verrouillé ou déplacé, profil enregistré, erreur de droits… Le bloc natif est masqué. Séparateur avec le logo en
  haut (comme l'écriture), puis une **carte centrée** (560px, fond de surface, sans contour ni ombre) : **sceau carré**
  au kanji, à double filet, incliné comme un tampon, qui **se pose avec un rebond** (sans animation si le système le
  demande) — ton d'après le message (`NOTICE_TONES`) : **済** fait (Asagi), **否** refusé (Ume), **報** avis (Hagane) ;
  **titre court** en Zen Antique avec un filet de 40px au ton (tiré du message par `NOTICE_TITLES` quand Forumactif
  écrit « Informations » : « Message publié », « Sujet verrouillé », « Action impossible »…, repris dans l'onglet) ;
  le message en texte discret ; les **liens natifs** (« Cliquez ici pour… », lus ligne par ligne entre les `<br>`)
  **déplacés** et devenus **boutons** aux libellés courts (`NOTICE_LINKS` : « Voir le message », « Retour au sujet »,
  « Retour au forum »…, phrase native en infobulle) : le premier plein (`.sg-action`), les autres au contour. Pas de
  redirection (`noForcedRedirect`) ; **défilement doux jusqu'au message** à l'arrivée (la bannière occupe le haut de
  l'écran ; rien si le lecteur a déjà défilé, sans animation si le système le demande). Vérifié sur une vraie erreur (« Action impossible ») et sur une confirmation
  reconstituée (« Message publié ») ; libellés et titres des autres cas à ajuster au fil des pages rencontrées.
  **Erreurs de saisie** (template `error_body` : `.block.block-error`, ex. « Vous devez entrer un message avant de
  poster. ») : même famille (`errorBlocks()`, `61-notice.css`) : encart `.sg-alert` sur fond teinté d'Ume, sans
  contour ni ombre, **petit sceau 否** (40px, même rebond), message en gras, `role="alert"` ; sur la page d'écriture
  il rejoint la colonne de la lettre, juste au-dessus d'elle (inséré avant `#postingbox`, qui ne bouge pas).
- **Sondage affiché : carte « tōhyō »** 投票 (le vote) (`layout.js`, fonction `pollCards`, + `62-poll.css`) :
  pattern **réservé aux sondages**, partout où Forumactif les affiche (`.block` avec `form.poll` ou `dl.poll`) :
  carte de surface sans contour sur **motif shippō** (communauté : votes), net à droite et estompé vers la gauche ;
  en tête « Sondage » en petites capitales (icône `ballot` en Asagi), la **question en Zen Antique**, et pour le staff
  un bouton rond **« Clore le sondage »** (cadenas, Ume au survol, confirmation par `confirmModal`) ; **vote** : une
  ligne par choix (fond `--sg-surface-2`, pastille ronde — carrée si choix multiple —, coche Asagi et fond teinté
  une fois choisi ; radios natives déplacées et masquées), **« Voter »** plein (désactivé tant que rien n'est
  choisi ; le bouton natif devient un `<button>` de même nom et valeur) et « Voir les résultats » au contour ;
  **résultats** (`?vote=viewresult`) : une barre arrondie par choix (Asagi, plus soutenue pour le choix en tête,
  qui grandit à l'affichage), « N votes · P % », « Revenir au vote » et le total ; **mentions** natives (votes publics,
  fin du sondage) en ligne discrète avec icône, sous un filet pointillé.
- **Paramètres du profil : registre « ninbetsu-chō »** 人別帳 (le registre des habitants d'Edo) (`layout.js`, fonctions
  `profilePage`, `cpField`, `cpRadioWrap`, + `63-profile.css`) : pattern **réservé au panneau de l'utilisateur**
  (`#wrap > .cp` avec ses onglets `.cp-sidebar` : `/profile?mode=editprofile&page_profil=…`, sujets surveillés,
  favoris). Haut : séparateur avec le logo (sans widgets, comme l'écriture), en-tête au pattern des forums (fil
  d'Ariane **« Accueil › Profil › onglet »**, onglet non cliquable ; sur l'onglet « Profil » lui-même, **« Accueil ›
  Profil »** (demande de Vinny) ; « Profil » mène au profil affiché `/uN` —, **titre = l'onglet**,
  une action « Voir mon profil » (absente sur les pages `/uN`, qui ont aussi la colonne `.cp-sidebar` : Profil, Groupes,
  Récompenses, et reçoivent pour l'instant le même habillage), description propre à l'onglet, `CP_TABS`). **Onglets collants** (demande de Vinny) :
  colonne de 248px (comme la colonne de l'auteur des messages), `position: sticky` à 24px du haut, carte de surface,
  icône Material Symbols par onglet (`CP_TABS`), onglet actif plein en sumi et gofun (icône pleine) ; ≤ 900px, **bande
  collante en haut d'écran** qui défile à l'horizontale (onglet actif amené en vue). Les onglets natifs (colonne et
  menu mobile) sont masqués. **Blocs natifs en cartes** `.sg-pcard` (fond de surface, sans contour ni ombre, titre
  en Zen Antique avec icône dans un cercle teinté : Compte, Profil, Contact, Mes données — `CP_BLOCKS`), champs en
  grille de 2 colonnes (1 sur mobile ; zone de texte et choix en pleine largeur). **Champs** (`cpField`, depuis chaque
  `<label>` natif) : libellé en petites capitales (`CP_LABELS` : « Pseudo », « Mot de passe » ; astérisque
  « obligatoire » en Ume), champ arrondi au style des listes personnalisées (`.sg-pinput`), aide discrète ; genre
  (radios à image) et groupes Oui / Non des autres onglets (`.radio-wrap`, `cpRadioWrap`) en **contrôle segmenté**
  `.sg-seg--auto` (une colonne par choix ; libellés longs sur plusieurs lignes) ; date de naissance : jour et mois en
  `combo`, année en champ court, sur une ligne (« Jour », « Mois », « Année » natifs gardés en noms accessibles) ;
  « Modifier le mot de passe » et « Exporter mes données » en boutons au contour (sans libellé en doublon au-dessus de
  l'export) ; champs de mot de passe avec l'œil natif dans le champ ; un bloc sans titre qui suit une carte la rejoint.
  **Boutons** à droite sous un filet : « Réinitialiser » (contour) puis « Enregistrer » (plein ; `<button>` de même nom
  et valeur que le bouton natif). Envoi normal : page de confirmation « Profil enregistré » (« Modifier mon profil » en
  premier). En bas : séparateur de fin et fil d'Ariane repris. Les autres onglets reçoivent l'habillage générique
  (onglets, cartes, champs, radios) ; leurs contenus particuliers (listes) restent à reprendre.
  **Ordre des onglets** (`CP_ORDER`) : Informations, Avatar, Signature | Préférences, Notifications | Sujets surveillés,
  Favoris, un filet entre les groupes (`.sg-ptabs__sep`, vertical dans la bande mobile) ; onglet inconnu après, dans
  l'ordre natif (les pages `/uN` ne sont pas réordonnées).
- **Onglet « Signature »** (`layout.js`, fonction `sigPanel`, + `68-signature.css`) : carte « Ta signature » (icône
  `draw`) dont l'**éditeur reprend celui de l'écritoire « suzuri »** : `form.sg-sigform` partage les règles de
  l'éditeur de `60-write.css` (sélecteurs `:is(.sg-writeform, .sg-sigform)` : barre d'outils posée sur la carte, icônes
  Material Symbols, infobulles, fenêtres des outils, couleurs de la refonte, mode texte bloqué, zone de saisie sur
  `--sg-surface-2` arrondie à 12px) et appelle `editorToolbar(form)` et `editorFrameTheme(form)`. `#postingbox`
  n'est jamais déplacé. Zone de saisie de 220px au moins. **Aperçu** (après « Prévisualiser », bloc natif `#preview`
  dans le formulaire) : encart `--sg-surface-2` « Aperçu, pas encore enregistré » (Asagi, petites capitales), la
  signature sous un filet pointillé comme sous un message. Aide native (`#smiley-box` : HTML, BBCode, smileys) en ligne
  discrète sous l'éditeur (coche Asagi activé, icône `block` désactivé). Boutons au pattern du profil (`.sg-pactions`) :
  « Prévisualiser » (contour) puis « Enregistrer » (plein) ; les espaces insécables natifs entre eux sont retirés.
  Attention : le `fieldset.fields1` natif garde `min-width: min-content` (débordement de l'éditeur sur mobile) : remis
  à 0. Pour tester une page `/post` dans une iframe, `history.replaceState` doit venir **après** `document.open()`
  (qui remet l'adresse de la page parente). Non testé : l'enregistrement réel.
- **Onglet « Avatar » : portrait « nigao-e »** 似顔絵 (`layout.js`, fonction `avatarPanel`, + `67-avatar.css`) : pattern
  **réservé au choix de l'avatar** (`page_profil=avatars`). Carte « Ton portrait » : **portrait 200 × 400** au style
  de l'avatar des messages (arrondi 12px, sans cadre, `object-fit: cover`) | **« Nouveau portrait »** en contrôle
  segmenté **Fichier** (zone de dépôt : clic ou glisser-déposer, nom et poids du fichier, ✕ pour le retirer) /
  **Importer** (adresse copiée sur le forum, `avatarurl`) / **Lier** (adresse liée, `avatarremoteurl`), puis le rappel
  du format (200 × 400 conseillé ; maximum et poids lus dans la consigne native : 200 × 600 px, 64 Ko).
  **Aucun champ natif à l'écran** : la case `avatardel`, l'`<input type="file">` et les deux adresses restent dans
  le formulaire, hors de l'écran (`.sg-avatar__native`) ; radios du contrôle segmenté hors formulaire
  (`form="sg-none"`). **Une seule source** : en remplir une vide les autres et annule le retrait. **Aperçu** immédiat
  (fichier par `URL.createObjectURL`, adresse après 350ms) avec liseré Asagi et « Aperçu, pas encore enregistré » ;
  sous le portrait, les dimensions (« format idéal » à 200 × 400, « bonnes proportions » en 1:2, sinon « recadrée à
  l'affichage »), « Trop grande » / « Trop lourde » en Ume, « Image introuvable » (cadre en pointillé). **« Retirer mon
  portrait »** (bouton au contour, Ume au survol) coche `avatardel`, vide les sources, cadre « Sans portrait » ;
  « Garder mon portrait » l'annule. « Réinitialiser » remet l'écran d'après les champs natifs. Boutons du bas
  inchangés (demande de Vinny). Attention : le bouton natif s'appelle `reset`, donc `form.reset` est masqué
  (`HTMLFormElement.prototype.reset.call(form)`). Non testé : l'enregistrement réel (envoi, copie, erreurs de taille).
- **Inscription : serment « kishōmon »** 起請文 (le serment écrit qu'on scellait de son sceau) (`layout.js`, fonctions
  `regPage`, `regOath`, `regAccount`, `sealCheck`, `regDivider`, + `65-register.css`) : pattern **réservé à
  l'inscription** (`/register`). Étape 1 : `form#frmAgreement` (GET `/register`, `step=2`, cases `agreement=1` et
  `privacy=1`) ; étape 2 : `form#ucp` avec `#username_reg` (pseudo, e-mail, mot de passe, case `wantsnews`, POST). Les
  formulaires natifs restent en place (noms, valeurs, envoi). Haut : séparateur avec le logo, en-tête au pattern des
  forums (« Accueil › Inscription », titre **« Rejoindre le Sekai »**, description propre à l'étape). Grille comme le
  profil : **colonne des étapes collante** (248px ; « 誓 Serment », « 名 Compte » en mon reliés par un fil ; étape
  faite : coche Asagi ; en cours : sumi et gofun ; puis « Déjà un compte ? Se connecter ») | contenu ; ≤ 900px, étapes
  côte à côte en haut, sans aide. **Étape 1** : carte du règlement sur **kikkō** (références durables) en haut, surtitre
  « 起請文 · Règlement », « Conditions d'utilisation » + filet de 56px ; paragraphes natifs regroupés en **articles
  numérotés en kanji** (一 二 三 四, cercle teinté Hagane) : un paragraphe qui commence par un `<strong>` ouvre un
  article (intitulé court retiré du texte et pris pour titre ; long : gardé, titre court tiré de `OATH_TITLES`) ;
  l'engagement natif (texte rouge, lignes entre `<br>`) devient « Ton engagement » (fond `--sg-surface-2`, coches
  Asagi) ; les deux cases deviennent des **sceaux à apposer** (`.sg-sealchk` : carré en pointillé, puis sceau 印 à
  double filet Asagi posé avec le rebond des confirmations) ; « J'accepte le règlement » désactivé tant que les deux
  sceaux ne sont pas posés. La case native est placée **après** le sceau et le texte : AwesomeBB dessine sa propre case
  (avec un contour rouge en erreur) sur le `span` qui suit une case (`input + span::before`) ; états par
  `.sg-sealchk:has(input:checked)`. La validation de Forumactif (`form-validator`, à la soumission et au changement
  d'une case) ajoute `has-error` et un message `.help-block.form-error` : **message sous le libellé** (demande de Vinny ;
  le sceau est une grille sceau | texte, le message en 2e rangée de la colonne du texte), en Ume (`!important` : le
  validateur impose son rouge), emplacement du sceau en pointillé Ume ; il disparaît une fois le sceau posé. La case
  native est rendue invisible quoi qu'impose AwesomeBB (`!important`) **et glissée sous le sceau** (même place, plan
  inférieur ; sceau à `z-index: 1` et fond plein, demande de Vinny), et la case qu'AwesomeBB dessine sur
  tout `span` suivant une case (ici le message) est retirée (`.help-block::before`). Règle demandée par Vinny en plus : `#frmAgreement input[type=checkbox]:checked + span::before` sorti de l'écran
  (`position: absolute; left: -9999999px`). **Étape 2** : carte « Ton compte » au **pattern du profil** (`cpField`, `.sg-pcard`,
  `.sg-pinput`), aides sous le pseudo et l'e-mail, **œil natif** de Forumactif dans le champ du mot de passe (il
  enveloppe le champ dans `.password-container` avec une `<i>` « visibility », après nos scripts ; un second œil ajouté
  par nos soins faisait doublon : l'icône native est seulement rendue accessible au clavier), **jauge** de
  trois traits (Ume faible, Hagane moyen, Asagi fort) calculée par `passwordStrength()` de Forumactif (la jauge native
  `#cont_pwd` est masquée), actualités en interrupteur `.sg-opt`, « Réinitialiser » puis « Créer mon compte ».
  AwesomeBB pose une coche de validation (`label.has-success::after`) et une case dessinée (`span::before`) : retirées.
  Erreurs de Forumactif (`.block-error`) remontées au-dessus du formulaire. **Vérification en visiteur** sans se
  déconnecter : la page est lue en visiteur (`fetch('/register', {credentials: 'omit'})`, étape 2 :
  `/register?step=2&agreement=1&privacy=1`), puis écrite dans l'onglet (`document.open/write/close`, après
  `history.replaceState` vers `/register`) ; pour une version pas encore publiée, remplacer dans ce HTML le SHA du CSS
  et le `/NNNNN.js` par `layout.js` sur jsDelivr. Mobile vérifié par mesures dans une iframe de 390px (les captures
  masquent les iframes et les champs de mot de passe). Non testé : l'envoi (création d'un compte), les erreurs, une
  éventuelle étape suivante (champs de profil obligatoires, captcha).
- **Connexion et mot de passe oublié : poste-frontière « sekisho »** 関所 (où l'on présentait son laissez-passer)
  (`layout.js`, fonctions `authPage`, `authField`, + `66-auth.css`) : pattern **réservé à `/login`** (`.block-login`
  avec `form#panel-password`) **et à `/profile?mode=sendpassword`** (`form[name="form_recupmdp"]`). Formulaires natifs
  gardés (noms, champs cachés `redirect` / `query`, envoi). Haut : séparateur avec le logo, en-tête au pattern des
  forums (« Accueil › Connexion » / « Accueil › Connexion › Mot de passe oublié », titre, description). Grille : **carte
  du formulaire** (`.sg-authcard`, titre au pattern des cartes du profil : `login` « Tes identifiants » / `lock_reset`
  « Ton compte » ; champs au pattern du profil, `authField` : libellé en petites capitales, `.sg-pinput` ; « Connexion
  automatique » en interrupteur `.sg-opt` « Rester connecté sur cet appareil » ; pied sous un filet : lien discret à
  gauche — « Mot de passe oublié ? » / « Retour à la connexion » — et bouton plein à droite — « Se connecter » /
  « Recevoir un nouveau mot de passe ») | **carte d'à-côté** sur **seigaiha** (parcours ; `.sg-authside`, surtitre au
  kanji, titre en Zen Antique + filet de 40px, texte, bouton au contour) : « Rejoindre le Sekai » (vers `/register`) ou
  « Revenir au poste » (vers `/login`) ; ≤ 900px une colonne ; ≤ 768px bouton plein au-dessus du lien, en pleine
  largeur. **Onglet « Lien par e-mail » retiré** (demande de Vinny) : `.login-tabs` et `#panel-magic` masqués,
  `#panel-password` forcé visible et `localStorage` `fa_login_tab` remis sur `tab-password` (le script natif rouvrait
  le dernier onglet choisi). L'œil natif du mot de passe est déjà posé quand nos scripts passent : `authField` déplace
  le `.password-container` entier. Saisie automatique du navigateur ramenée aux couleurs du thème (`:-webkit-autofill`).
  Non testés : l'envoi (connexion, mot de passe oublié), les erreurs.
- **Codes des membres** (HTML collé dans un message, `64-codes.css`, modèles dans `src/codes/`) : le membre ne colle
  que du HTML à classes **`.sgc-…`**, tout le style vit dans le thème (tokens : clair et sombre sans rien changer ; pas
  de `<style>`, d'attribut `style` ni de `data-*` dans les codes). Le message est lu comme du **BBCode** : chaque retour
  à la ligne devient un `<br>`, donc les codes passent à la ligne **dans des commentaires** (`<!--` en fin de ligne,
  `-->` en début de la suivante, indentation comprise) ; par sécurité `.sgc br` est masqué, sauf dans les textes
  (`.sgc-text`, `.sgc-quote`, `.sgc-step__text`, `.sgc-qa__a`, où une ligne vide fait un paragraphe). « Dernier
  élément » en `:last-of-type` ; les images du message ont `height: auto` imposé par un sélecteur à id, d'où les tailles
  en `!important`. Mise en page selon la largeur du message (`container-type`, `@container ≤ 640px`), pas de l'écran.
  **Un premier essai reprenait la mise en page de l'ancienne fiche (sections numérotées, libellés à filet, losanges) :
  refusé par Vinny** — la capture d'une ancienne fiche ne donne que les informations demandées, jamais le design.
  **Fiche de personnage « jinbutsu »** 人物 (`src/codes/fiche-personnage.html`), patterns réutilisables : `.sgc` (racine ;
  accent = pays avec `.sgc--hi|mizu|kaze|kaminari|tsuchi|shokoku`, sinon couleur primaire) ; **héros** `.sgc-hero`
  (carte `--sg-surface-2` sur **kikkō** — référence durable —, net à droite, `.sgc-pat--kikko`, kanji du pays en
  filigrane `.sgc-hero__kanji`) : **portrait 200 × 400** (format des avatars du forum) `.sgc-portrait` avec le **rang en
  sceau hanko** `.sgc-seal` (carré à double filet incliné, comme les confirmations) ; surtitre `.sgc-eyebrow` (kanji +
  petites capitales), nom `.sgc-name` en Zen Antique avec le filet d'accent de 56px (comme les en-têtes ; `.sgc-rule`
  seul), **fuda** `.sgc-tags` / `.sgc-tag` (étiquettes libellé / valeur en Zen Antique, `--wide` sur 2 colonnes) ; le rang
  n'est pas répété dans les étiquettes. **Séparateur de la refonte** `.sgc-notch` (filet en V, `--logo` avec le logo au
  trait, `--up` pointe en haut pour fermer). **Parties** `.sgc-part` : **mon** `.sgc-mon` (kanji dans un cercle teinté),
  titre en Zen Antique, filet qui file vers la droite. `.sgc-duo` : **grands chiffres** `.sgc-stats` (taille, poids ;
  unité à la couleur d'accent) | texte. `.sgc-quote` : texte entre **crochets japonais 「 」**. **Chronologie**
  `.sgc-chrono` / `.sgc-step` : « An » en petites capitales et l'année en grand chiffre Zen Antique, **tomoe du logo de
  SnJ** (trois magatama, `.sgc-step__mark`) sur un fil, titre à la couleur d'accent ; en largeur réduite, tomoe et fil à
  gauche, année sur une ligne. **Coulisses** `.sgc-backstage` (hors RP, « Derrière le shinobi ») sur **shippō**
  (communauté), en Hagane, avatar rond, questions `.sgc-qa`. Vérifié en injectant le code dans un message (retours à la
  ligne changés en `<br>`), clair, sombre, largeur réduite ; **pas encore posté pour de vrai** (un élément vide comme
  `.sgc-notch` ou `.sgc-step__mark` pourrait être retiré par Forumactif).
  Récapitulatif des patterns : **forum** (accueil) = image en fond + panneau + kanji ; **sous-forum** = ema
  (image en toit) ; **sujet** = motif yagasuri, sans image ; **message** = fumi (profil collant + lettre) ; **écriture** = suzuri (la lettre en cours d'écriture) ; **confirmation** = hanko (sceau au kanji) ; **paramètres du profil** = ninbetsu-chō (onglets collants + cartes) ; **avatar** = nigao-e (portrait 200 × 400 + sources) ; **signature** = éditeur de l'écritoire suzuri ; **inscription** = kishōmon (étapes collantes, articles en kanji, sceaux à apposer) ; **connexion** = sekisho (formulaire | carte d'à-côté sur seigaiha) ; **sondage** = tōhyō (carte sur shippō) ; **fiche de personnage** = jinbutsu (codes `.sgc-`) ;
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
  mon kanji ou icône, nom vertical, effectif, ondulation au survol ; étoffe de 280px sur tous les formats, pour que « Kaminari no Kuni » tienne au-dessus de la queue d'aronde). Nombre de messages, de membres et dernier inscrit :
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
- **Confirmations en fenêtre, action par action** (`layout.js`, `showNotice(data)` + `noticeRead(doc)` +
  `noticeCard`, + `61-notice.css`) : le sceau hanko dans une modale (`.sg-modal--notice` : même carte, boutons de la
  modale, « Fermer », Échap, clic sur le voile, focus gardé ; les liens qui ramènent à la page affichée sont retirés).
  Une action passée en fenêtre est **envoyée en arrière-plan** (`fetch`), la réponse de Forumactif est lue par
  `noticeRead(doc)` (même lecture que la page de confirmation) puis affichée par `showNotice`, sans quitter la page.
  **Une solution générique a été essayée puis abandonnée** (demande de Vinny, « trop de problèmes ») : traverser la
  page de confirmation, revenir à la page précédente par `location.replace` et y ouvrir la modale (position de
  défilement comprise). Ne pas la reproduire. Vinny accepte le **risque de double envoi** propre à l'envoi en
  arrière-plan. **Brique** `bgAction({ url, body }, { done(doc), other(doc) })` (envoi, lecture, fenêtre ; GET qui
  échoue → navigation normale ; curseur d'attente `html.sg-busy`), avec `freshPage()` (page relue pour mettre à jour un
  morceau), `retitleItem(menuId, ancienLibellé, icône, libellé)` et `watchItem(href, 'topic'|'forum', menuId)`.
  **Actions passées en fenêtre** (choix de Vinny) : modération du sujet (**Verrouiller / Déverrouiller** : l'entrée du
  menu et l'en-tête « Répondre au sujet » ↔ « Sujet verrouillé » se mettent à jour d'après la page relue,
  `headAction()` partagée avec `pageHead`) ; actions du sujet (**Ajouter à mes favoris**, qui devient ensuite « Voir mes
  favoris » ; **Suivre / Ne plus suivre ce sujet**, qui bascule) ; actions du forum (**Marquer tous les sujets comme
  lus**, qui retire les pastilles « Nouveau » ; **Suivre / Ne plus suivre les sujets de ce forum**) ; **sondage** (vote
  et « Clore le sondage » : la carte est relue ensuite, `refreshPoll`). L'envoi d'un message (écritoire) garde la page
  de confirmation (choix de Vinny). Réponses de Forumactif relevées : suivre / ne plus suivre, marquer comme lus,
  verrouiller / déverrouiller (GET `/modcp?mode=lock|unlock&t=N&tid=…`) et favoris (GET
  `/search?add_favourite=N&search_id=favouritesearch`, titre « Favoris ») répondent toutes par une page
  `message_body`. Ton lu **sans les passages entre guillemets** (« Test | Présentation refusée » passait en erreur). Textes normalisés en NFC (les accents de « mis à jour » arrivaient
  décomposés : « Profil mis à jour » passait en « Information »). Libellé d'un lien d'abord d'après son adresse : un lien
  vers `mode=editprofile` (ou « retourner … profil ») devient **« Modifier mon profil »** (icône `edit`) et passe en
  premier, en bouton plein (demande de Vinny).
  **Autres actions en fenêtre** : **Supprimer le sujet** (`deleteTopic` : `confirmModal`, puis la page « Êtes-vous
  sûr ? » de `/modcp?mode=delete&t=N` validée en arrière-plan, option `autoConfirm` de `bgAction` qui renvoie les champs
  cachés + `confirm` ; en fermant la confirmation on rejoint le forum du fil d'Ariane ; non essayé jusqu'au bout pour
  ne rien supprimer) ; **Déplacer le sujet** (`moveTopic` : la liste `new_forum` de `/modcp?mode=move` passe dans une
  fenêtre en liste personnalisée à saisie, POST `/modcp` avec les champs cachés + `new_forum` + `confirm` ; page
  relue en fermant, le fil d'Ariane change ; vérifié aller-retour Présentations → Archivées → Présentations) ;
  **Adresse IP** du menu d'un message (`ipModal` : adresse, hôte, membres ayant posté depuis cette adresse, autres
  adresses du membre, liens « Page complète » et « Chercher l'adresse ») ; **Clore le sondage** (`autoConfirm`).
  `confirmModal` accepte `body` (contenu, ex. un formulaire) et `wide` ; Tab parcourt tous ses champs, Échap ferme
  d'abord une liste ouverte ; les styles des listes personnalisées visent `:is(#wrap, .sg-modal) .sg-combo…`.
  `showNotice` accepte `extra` (contenu) et `onClose`. **Sondage sur place** (`pollSwap`) : « Voir les résultats »
  (`?vote=viewresult`), « Revenir au vote » et **« Annuler mon vote »** (`?action=cancel_vote` : Forumactif renvoie la
  page du sujet sans confirmation ; bouton ajouté aux actions, fenêtre « Vote annulé ») ; vote vérifié (« Votre vote
  a été pris en compte » → résultats) puis annulé.
  **Inventaire** (relevé sur l'index, un forum, un sujet avec sondage, profil, membres, MP, favoris, sujets suivis,
  groupes, qui est en ligne) : **en fenêtre** — `?watch|unwatch=topic|forum`, `?mark=topics`, `add_favourite`,
  `/modcp?mode=lock|unlock|delete|move`, `/post?mode=delete` (message), `/post?mode=vote` (POST),
  `/post?mode=close_vote`, `?action=cancel_vote`, `?vote=viewresult`, `/modcp?mode=ip`. **Gardent leur page** —
  écriture (`/post?mode=reply|quote|editpost|newtopic`, choix de Vinny), `/modcp?mode=split` (choix des messages),
  `/merge?t=N` (choix du sujet en plusieurs écrans), `/modcp?f=N` (modération du forum), `mode=trash` (retiré).
  **À traiter avec leurs pages, pas encore refaites** — `?mark=forums` (index, barre masquée), favoris
  (`delete_favourite[N]` + page « Êtes-vous sûr ? »), sujets suivis (`mark[]` + `valid`), messages privés (supprimer,
  archiver, marquer lu / non lu), profil (`/profile` POST, « Profil mis à jour »), groupes (adhérer / quitter,
  ajouter / retirer un membre), `/?mode=delete_cookies`, `/rgpd.php?view=send_confirm` ; profil d'un autre membre
  (suivre, ami / ignoré, signaler) à relever quand le forum de test aura un second membre.
- **Pages de confirmation sans redirection forcée** (`layout.js`, `noForcedRedirect`, en tête du module 10, toutes
  les pages) : après un envoi (message posté ou modifié, profil enregistré…), Forumactif affiche une confirmation
  qui renvoie d'office ailleurs après quelques secondes (`<meta http-equiv="refresh" content="N;url=…">` posée par
  `{META}` dans `overall_header`, template `message_body`). La page **reste affichée** : une fois la page chargée,
  `window.stop()` annule la redirection en attente (vérifié sur une redirection injectée) et la balise est retirée ;
  on continue par les liens de la confirmation. Demande de Vinny : ni délai ni redirection (une redirection
  immédiate a été essayée puis abandonnée).
- **Suppression d'un message en fenêtre** (`layout.js`, `deletePost` + `confirmModal`, + `59-topic.css`) : l'entrée
  « Supprimer le message » (en Ume) du menu trois points ouvre une **modale** `.sg-modal` au lieu de la page native
  `/post?p=N&mode=delete` : icône dans un cercle teinté, « Supprimer ce message ? » en Zen Antique, avertissement,
  « Annuler » (contour) et « Supprimer » (Ume plein) ; Échap, clic sur le voile, focus gardé dans la fenêtre et rendu
  ensuite. À la confirmation, le formulaire natif est lu sur la page de suppression puis envoyé en arrière-plan
  (POST `/post` : `p`, `mode=delete`, `confirm`) ; le message s'efface de la page (toast « Message supprimé ») ; s'il
  n'en reste aucun, on rejoint le forum (lien de la réponse). Erreur de Forumactif : affichée dans la fenêtre ; échec
  réseau : la page native prend le relais. `confirmModal(opts)` est réutilisable pour toute confirmation.
- **Modules JavaScript** : Forumactif les charge dans le `<head>` ; tout script attend `DOMContentLoaded`.
  Ils sont regroupés dans un fichier `/NNNNN.js` mis en cache très longtemps. Il arrive que Forumactif réutilise le même
  nom de fichier après une modification, **même un nom déjà servi plus tôt** : le navigateur exécute alors la version
  qu'il a en cache. Vérifier après chaque mise à jour avec **`fetch('/NNNNN.js', {cache: 'force-cache'})`** (ce que
  le navigateur exécute) et pas seulement `no-store` (ce que le serveur renvoie) ; si la nouveauté manque, revalider le
  module sans rien changer, ce qui produit un nouveau nom de fichier.
- **Transitions** : AwesomeBB applique `* { transition: 0.16s }`. Un texte placé dans un enfant d'un élément dont la
  couleur s'anime saute pendant l'animation : mettre `transition: none` sur ces enfants (voir `40-zones.css`).
- **Variables CSS** préfixées `--sg-*`. On rebranche les `--t_*` d'AwesomeBB sur nos tokens.
- **CSS hors forum** : servi par jsDelivr depuis ce dépôt, avec une adresse versionnée (SHA de commit ou tag).
  Le CSS indispensable reste dans le CSS principal du forum pour que le forum reste lisible si le CDN tombe.
- **Messages libres** (sans modèle) : doivent rester lisibles et épurés.
- **Migration** : bascule de tout le forum en une fois.
  **HTML dans les messages** (PA › Général › Messages et e-mails › Configuration) : « Autoriser le HTML » sur **Oui**,
  « HTML non protégé » (scripts) réservé aux **Administrateurs** ; à reporter en production. Chaque membre a aussi
  « Toujours autoriser le HTML » dans ses préférences de profil : sur Non (défaut), l'interrupteur « Désactiver le
  HTML » de l'écritoire est coché d'office.
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
