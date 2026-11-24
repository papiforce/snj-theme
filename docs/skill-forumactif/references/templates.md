# Templates AwesomeBB — Référence

> Légende : **(vérifié)** = contrôlé sur un forum AwesomeBB en novembre 2026.
> **(à vérifier)** = repris de la documentation ou de la communauté, à tester avant de s'en servir.

## Où sont les templates

- **PA › Affichage › Templates**. Onglets : Général, Portail, Galerie, Calendrier, Groupes, Poster & Messages privés,
  Modération, Profil, Version mobile, plus « Templates modifiés et publiés » et « Templates modifiés et en attente ». **(vérifié)**
- Seul le compte **Fondateur** voit les templates.
- Chaque ligne affiche l'état (Publié / En attente), la date de dernière modification (depuis avril 2025) et des actions :
  ouvrir le rendu, **Publier (coche verte)**, Sauvegarder, Modifier (roue), Supprimer (croix). **(vérifié)**

## Enregistrer puis publier (vérifié)

1. Ouvrir le template (lien « Modifier » de sa ligne), modifier le code, cliquer sur **Enregistrer**.
   Message : « Le template a été enregistré. » Le template passe **En attente** : rien n'est encore en ligne.
2. Revenir à la liste et cliquer sur la **coche verte** de la ligne.
   Message : « Le template a été publié avec succès. »
3. Recharger le forum et vérifier que la nouvelle version est bien servie.

Pour revenir à l'original : la croix supprime la version modifiée et rétablit le template par défaut d'AwesomeBB.
**(à vérifier)**

Autres templates de l'onglet Général (vérifié) : `simple_header` (haut de page simple, utilisé sur quelques pages),
`message_body` (message d'erreur), `jumpbox`, `mentions_tooltip`, `greeting_popup`, `images_list`, `footer_widgets`.

> 💡 Garder dans un dépôt Git une copie des templates modifiés, ou au moins des extraits ajoutés et de l'endroit
> où ils sont insérés. Une mise à jour de Forumactif ou un changement de version remet les templates à zéro.

## Structure de la page AwesomeBB (vérifié)

Enfants directs de `<body id="top">` sur l'index :

```
<header>                         ← en-tête natif, FIXÉ en haut par le CSS d'AwesomeBB
  #main-menu-btn, a#logo-link > #logo / #logo-text,
  a#header-user, a#header-notif, form#search-main,
  ul#header-navigation (a#navigation-home, a#navigation-recent…)
div#main-menu.hidden             ← menus construits en JavaScript
div#main-user-menu.hidden
div#notif-menu.hidden
div#live_notif
div#header-banner                ← bannière
div#wrap                         ← contenu (main#index sur l'accueil)
div#emptyidright.wrap
footer                           ← statistiques du forum (index seulement)
div#page-footer                  ← liens du pied de page et crédits
div#dimmer.hidden
```

> ⚠️ Le CSS d'AwesomeBB fixe **tous** les `<header>` en haut de page. Ne jamais utiliser `<header>` dans ses propres
> composants : prendre `<div>`, `<section>` ou `<nav>`. **(vérifié)**

## overall_header

Haut de toutes les pages : `<head>`, en-tête natif, bannière, ouverture de `#wrap`.

Usages courants :
- ajouter une feuille de style externe (`<link rel="stylesheet" href="…">`) dans le `<head>` ;
- remplacer l'en-tête natif par sa propre navigation (le plus simple : la construire en JavaScript et masquer
  `body > header` en CSS, sans toucher au HTML natif).

> 💡 Feuille externe sur un CDN : utiliser une **adresse versionnée** (ex. jsDelivr épinglé sur le SHA d'un commit,
> `https://cdn.jsdelivr.net/gh/compte/depot@<SHA>/dist/theme.min.css`). Attendre qu'elle réponde 200 avant de changer
> le lien, sinon le forum s'affiche sans CSS. Garder dans le CSS principal du PA le minimum pour que le forum reste
> lisible si le CDN tombe.

Variables courantes (à vérifier dans le template par défaut avant usage) : `{U_INDEX}`, `{LOGO}`, `{L_INDEX}`,
`{SITENAME}`, `{U_REGISTER}`, `{U_LOGIN_LOGOUT}`, `{L_LOGIN_LOGOUT}`, `{U_PROFILE}`, `{U_PRIVATEMAIL}`, `{U_SEARCH}`,
`{U_VIEWONLINE}`, `{GENERATED_NAV_BAR}`, `{META_DESCRIPTION}`, `{PAGE_TITLE}`. **(à vérifier)**

## index_body

Page d'accueil du forum : `{BOARD_INDEX}` (catégories, rendues par `index_box`) puis le bloc « Qui est en ligne ».

Bloc « Qui est en ligne » par défaut **(vérifié)** :

```html
<!-- BEGIN disable_viewonline -->
<div id="block-online" class="block-subtle">
  <i class="material-symbols-outlined">assessment</i>
  <div>
    <!-- BEGIN switch_viewonline_link -->
    <span class="headline"><a href="{U_VIEWONLINE}" rel="nofollow">{L_WHO_IS_ONLINE}</a></span>
    <!-- END switch_viewonline_link -->
    {TOTAL_USERS_ONLINE}<br /><br />
    {RECORD_USERS}<br />
    {LOGGED_IN_USER_LIST}<br />
    {L_ONLINE_USERS} {L_CONNECTED_MEMBERS} …
    {LEGEND} {GROUP_LEGEND} …
  </div>
</div>
<!-- END disable_viewonline -->
```

Autres variables présentes : `{CHATBOX_TOP}`, `{CHATBOX_BOTTOM}`, `{SPACE_ROW}`, `{L_WHOSBIRTHDAY_TODAY}`,
`{L_WHOSBIRTHDAY_WEEK}`.

### Statistiques absentes par défaut (vérifié)

`{TOTAL_POSTS}`, `{TOTAL_USERS}` et `{NEWEST_USER}` ne sont **pas** dans l'`index_body` d'AwesomeBB, mais
fonctionnent si on les ajoute. Elles rendent une phrase complète :

| Variable | Rendu |
|---|---|
| `{TOTAL_POSTS}` | `Nos membres ont posté un total de <strong>4</strong> messages` |
| `{TOTAL_USERS}` | `Nous avons <strong>1</strong> membre enregistré` |
| `{NEWEST_USER}` | `L'utilisateur enregistré le plus récent est <strong><a href="/u1"><span class="group-2 usr_grp_clr" style="color:#…"><strong>Pseudo</strong></span></a></strong>` |

Pour les exploiter en JavaScript, les placer dans un conteneur caché, juste avant `{CHATBOX_BOTTOM}` :

```html
<div id="stats-data" hidden><span data-k="posts">{TOTAL_POSTS}</span><span data-k="users">{TOTAL_USERS}</span><span data-k="newest">{NEWEST_USER}</span></div>
```

Le même trio apparaît aussi dans le `<footer>` natif placé avant `#page-footer`, sur l'index seulement.

### Options de l'accueil liées (vérifié)

- PA › Affichage › Page d'accueil › **Généralités** : adresse du forum (index, portail ou page HTML), liste des membres
  connectés au cours des dernières heures (durée réglable).
- PA › Affichage › Page d'accueil › **Structure et hiérarchie** : titre du dernier sujet, avatars dans la colonne
  « Derniers messages », liens vers les sous-forums, modérateurs, module « Qui est en ligne » (jamais / index racine /
  index + catégories), moteurs de recherche dans les statistiques.

## index_box

Rendu des catégories et des forums de l'index (boucles `catrow` / `forum_row`). Pour une refonte complète de l'index,
il est souvent plus robuste de **lire le rendu natif en JavaScript** (voir `javascript.md`, sélecteurs de l'index) et
de construire sa propre interface, en masquant la liste native seulement une fois la nouvelle montée.

Syntaxe des boucles et blocs conditionnels :

```html
<!-- BEGIN catrow -->
  <!-- BEGIN catrow.forumrow -->
    {catrow.forumrow.FORUM_NAME}
  <!-- END catrow.forumrow -->
<!-- END catrow -->
```

Les noms exacts des boucles et variables d'`index_box` sont à relever dans le template par défaut. **(à vérifier)**

## Autres templates

| Template | Onglet | Rôle |
|---|---|---|
| `overall_footer_begin` / `overall_footer_end` | Général | Bas de page (fermeture de `#wrap`, `#page-footer`) |
| `viewforum_body` | Général | Liste des sujets d'un forum |
| `viewtopic_body` | Général | Sujet et messages (boucle `postrow`) |
| `memberlist_body` | Général | Liste des membres |
| `search_body`, `search_results_topics`, `search_results_topics_grid` | Général | Recherche ; vue GRID au choix du membre |
| `topics_list_box`, `topics_grid_box` | Général | Listes de sujets (classique / GRID) |
| `viewonline_body` | Général | Qui est en ligne |
| `profile_view_body` | Profil | Profil d'un membre |
| `profile_advanced_body` | Profil | Profil en mode avancé (à activer : Utilisateurs & Groupes › Utilisateurs › Profils) |
| `discover` | — | Page « Toute l'activité » (`/discover`, depuis sept. 2025) |

Variables de `viewtopic_body` couramment citées (à vérifier) : `{postrow.displayed.POSTER_NAME}`,
`{postrow.displayed.POSTER_AVATAR}`, `{postrow.displayed.POST_DATE}`, `{postrow.displayed.MESSAGE}`,
`{postrow.displayed.SIGNATURE}`. Relever les noms exacts dans le template par défaut avant de le modifier.
