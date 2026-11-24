# Variables et données Forumactif — Référence (AwesomeBB)

> Légende : **(vérifié)** = contrôlé sur un forum AwesomeBB en novembre 2026.
> **(à vérifier)** = à tester avant usage.

## Trois sources de données

| Source | Où | Quand l'utiliser |
|---|---|---|
| Variables de template `{NOM}` | Dans les templates (PA › Affichage › Templates) | Données rendues par le serveur : compteurs, liens, boucles |
| Objets JavaScript `_userdata`, `_board`, `_lang` | Partout, en JavaScript | Membre connecté, version du thème, textes de l'interface |
| Le HTML des pages | `document` ou une autre page lue avec `fetch` | Tout ce que les deux premières sources ne donnent pas (avatars, groupes, derniers sujets…) |

## `_userdata` — membre connecté (vérifié)

En AwesomeBB, les variables utilisateur comme `{USERNAME}` ne s'utilisent plus dans les templates : on passe par
`_userdata`.

> ⚠️ Les clés `is_logged_in`, `pm_new`, `rank`, `rank_image`, `post_count`, `registered`, `last_visit`, `birthday`,
> `age` et `group`, citées dans d'anciens tutoriels, **n'existent pas**.

| Clé | Type | Contenu |
|---|---|---|
| `session_logged_in` | nombre | `1` si connecté, `0` sinon |
| `user_id` | nombre | identifiant (profil : `/u` + `user_id`) |
| `username` | texte | pseudo |
| `user_level` | nombre | `1` pour un administrateur (autres valeurs : membre ou modérateur, à vérifier) |
| `user_posts` | nombre | nombre de messages |
| `user_nb_privmsg` | nombre | messages privés non lus |
| `notifications` | nombre | notifications |
| `avatar` | texte | avatar en HTML (`<img …>`) |
| `avatar_link` | texte | adresse de l'image de l'avatar |
| `groupcolor` | texte | couleur du groupe affiché, **sans `#`** (ex. `B5533F`) |
| `user_lang` | texte | langue |
| `tpl_used` | texte | `awesomebb` |
| `tpl_mobile` | texte | version mobile (ex. `mobi_modern`) |
| `darkmode_exist` | nombre | mode sombre natif disponible |
| `discover_active`, `chatbox_activate`, `publication_activate`, `event_activate`, `imagelist_active`, `donate` | nombre | fonctions activées |
| `activate_toolbar`, `fix_toolbar` | nombre | barre d'outils Forumactif |
| `page_login`, `page_logout`, `page_search`, `page_edit_profile`, `page_home`, `notifications_page`, `register`… | texte | adresses utiles |

```javascript
var ud = window._userdata || {};
var connecte = String(ud.session_logged_in) === '1';
var admin = Number(ud.user_level) === 1;
var profil = connecte ? '/u' + ud.user_id : null;
```

> ⚠️ `_userdata` se modifie dans la console du navigateur. Il sert à l'affichage, **jamais** à autoriser une action
> côté serveur.

## `_board` (vérifié)

`tpl_version` (`awesomebb`), `reputation_active`, `Forumotion`, `toolbar_title_url`, `toolbar_logo`.

## Variables de template utiles

### Accueil — `index_body` (vérifié)

| Variable | Présente par défaut | Rendu |
|---|---|---|
| `{TOTAL_USERS_ONLINE}` | oui | « Il y a en tout 2 utilisateurs en ligne :: 1 Enregistré, 0 Invisible et 1 Invité » |
| `{RECORD_USERS}` | oui | « Le record du nombre d'utilisateurs en ligne est de 5 le … » |
| `{LOGGED_IN_USER_LIST}` | oui | « Utilisateurs enregistrés : » + pseudos colorés |
| `{L_CONNECTED_MEMBERS}` | oui | connectés des dernières heures, si l'option est active |
| `{LEGEND}` / `{GROUP_LEGEND}` | oui | légende des groupes |
| `{TOTAL_POSTS}` | **non**, mais fonctionne si ajoutée | « Nos membres ont posté un total de <strong>N</strong> messages » |
| `{TOTAL_USERS}` | **non**, mais fonctionne si ajoutée | « Nous avons <strong>N</strong> membres enregistrés » |
| `{NEWEST_USER}` | **non**, mais fonctionne si ajoutée | « L'utilisateur enregistré le plus récent est » + pseudo coloré |

Les compteurs sont dans un `<strong>` : les lire avec `el.querySelector('strong').textContent`.

### Navigation (à vérifier dans le template avant usage)

`{U_INDEX}`, `{U_REGISTER}`, `{U_LOGIN_LOGOUT}`, `{L_LOGIN_LOGOUT}`, `{U_PROFILE}`, `{U_PRIVATEMAIL}`, `{U_SEARCH}`,
`{U_VIEWONLINE}`, `{U_FAQ}`, `{GENERATED_NAV_BAR}`, `{SITENAME}`, `{PAGE_TITLE}`, `{META_DESCRIPTION}`.

### Pages HTML et portail (à vérifier)

Dans les pages HTML du portail, des variables comme `{USERNAME}`, `{TOTAL_POSTS}` ou `{TOTAL_USERS}` sont rendues
directement.

## Ce que le HTML des pages fournit (vérifié)

### Pseudos et couleurs de groupe

```html
<a href="/u1"><span class="group-3 usr_grp_clr" style="color:#B5533F"><strong>Admin</strong></span></a>
```

- `group-N` : ID du groupe d'affichage (différent d'un forum à l'autre).
- `style="color:#…"` : couleur du groupe, en dur.
- Un membre de plusieurs groupes prend la couleur du groupe à l'**ordre le plus faible**
  (PA › Utilisateurs & Groupes › Groupes, champ « Ordre du groupe »).

### Légende des groupes (bloc « Qui est en ligne »)

```html
<a style="color: #B5533F" class="gensmall usr_grp_clr" href="/g3-hi-no-kuni"
   title="Groupe fermé - Membres du groupe : 1">Hi no Kuni <i class="group-icon"></i></a>
```

- L'effectif est dans le `title`. Il **compte le modérateur du groupe**, même s'il n'en est pas membre.
- Un modérateur est obligatoire pour chaque groupe : prévoir un compte du staff dédié, et retirer 1 à l'effectif.
- Les groupes invisibles ne figurent pas dans la légende.

### Pages lisibles en JavaScript (même domaine)

| Page | Contenu utile |
|---|---|
| `/latest` | derniers sujets : `.block-topics-details` → `a.topictitle`, `.block-topics-author`, `.block-topics-lastpost` (dernier posteur `strong a`, date après la virgule) ; forum du sujet : `.block-topics-category` (lien et nom) |
| `/memberlist?username=PSEUDO` | `.member-block` → lien `a[href="/uN"]`, avatar `.avatar-default img` ; un pseudo inexistant renvoie un bloc sans lien |
| `/memberlist` | tri : `mode` = `lastvisit`, `joined`, `username`, `posts`… ; `order` = vide ou `DESC` ; pas de filtre par groupe |
| `/gN-slug` | page d'un groupe : modérateur puis membres, en lignes `tr` ; le modérateur n'apparaît pas dans la liste des membres |
| `/groups` | tous les groupes visibles, avec leur couleur |
| `/uN` | profil ; **n'affiche pas les groupes du membre** |
| `/discover` | toute l'activité de la communauté (si le module est actif) |
| `/viewonline`, `/statistics` | qui est en ligne, statistiques |

## Classes d'état (à vérifier sur AwesomeBB)

Classes souvent citées pour les dossiers et icônes : `.cat_new`, `.cat_no_new`, `.forum_new`, `.forum_no_new`,
`.post_new`, `.post_no_new`, `.folder_locked`, `.folder_sticky`, `.folder_announce`, `.folder_global`.
Les relever dans le HTML réel avant de s'en servir.
