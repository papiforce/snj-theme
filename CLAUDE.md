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
- **Polices** : titres en **Zen Antique**, texte en **Inria Sans** (comme l'annexe). Cinzel abandonnée.
- **Thème** : celui de l'appareil par défaut ; le choix du membre est mémorisé dans le navigateur
  (`localStorage`, clé `snj-theme`). Attribut `data-theme` sur `<html>`.
- **Icônes** : **Material Symbols Outlined uniquement**, partout (c'est la bibliothèque native d'AwesomeBB).
  Jamais de Font Awesome ni d'autre bibliothèque. Seule exception : les logos de marque absents de Material Symbols
  (Discord…), en SVG inline repris de Simple Icons (licence CC0), à la même taille que les icônes.
- **Navigation** : barre latérale fixe à gauche avec icônes et infobulle à droite (inspirée de Themis Trials),
  barre fixe en bas d'écran sur mobile. Elle remplace l'en-tête natif d'AwesomeBB.
  Haut : avatar du membre, ou logo SnJ (`assets/snj-logo.webp`) pour les visiteurs.
  Navigation : Accueil, Membres (masqué sur mobile), Discord, Annexe, Carte.
  Bas : Notifications (avec pastille), Panneau d'administration (admins), Déconnexion, thème clair/sombre.
- **Mise en page** : bannière, catégories et pied de page prennent toute la largeur disponible à droite de la barre
  (inspiré de Themis Trials), coins arrondis.
- **Bannière** : clair = brume au clair de lune, sombre = renard dans les braises (`scripts/grade-banner.py`).
  Pas de logo ; wordmark « Sengoku no Jidai » fondu dans l'image (modes de fusion + dégradé).
- **Accueil** (`home.js` + `30-home.css`) : grille « bento » de 12 colonnes, sans titres de zones, cartes variées
  (illustrées, couverture, motifs Edo seigaiha / kikkō / shippō, carrousels, carte Vote pleine, Discord).
  Visiteur : Onboarding (Guide, Annexe, Fiche, Validation, Configuration du profil) → Contexte + Saison → Guide + Annexe
  → Annonces + Rumeurs + Derniers sujets → Scénarios + Staff + Vote/Discord. Membre : pas d'onboarding, Annonces,
  Rumeurs et Derniers sujets en premier. Illustrations : paysages des nations de l'annexe (`assets/land-*.webp`,
  `scripts/grade-cards.py`). Rumeurs : une illustration et la couleur de la nation (`--sg-nation-*`).
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
