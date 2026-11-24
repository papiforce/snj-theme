# JavaScript — Référence AwesomeBB

> Légende : **(vérifié)** = contrôlé sur un forum AwesomeBB en novembre 2026.

## Gestion des codes Javascript (vérifié)

**PA › Modules › HTML & Javascript › Gestion des codes Javascript.**

- **80 scripts maximum** (compteur affiché, depuis déc. 2025).
- Éditeur avec correcteur, fermeture automatique des parenthèses, auto-complétion (Ctrl+Espace), pliage des fonctions.
- Recherche dans le code des scripts.
- Désactiver un script sans le supprimer (case « Désactiver » ou icône dans la liste) ; bouton Télécharger.

Champs d'un script :

| Champ | Valeurs |
|---|---|
| Titre | libre (le préfixer pour s'y retrouver, ex. « SNJ — Barre latérale ») |
| Permissions (depuis juil. 2025) | Administrateurs, Modérateurs, Membres, Invités |
| Placement | Sur l'index, Sur le portail, Sur les sous-forums, Sur les sujets, Sur la galerie, Sur toutes les pages, Sur la ChatBox |
| Désactiver | Oui / Non |

Après **Valider** : « Votre code Javascript a bien été créé » (ou « modifié »). Chaque script a un ID visible dans son
adresse d'édition (`mode=js_edit&id=N`).

> 💡 Garder le code dans un dépôt (un fichier par script, avec son ID et son placement en commentaire d'en-tête),
> et le reporter dans le PA. Le PA n'a pas d'historique des versions.

## Règles de base (vérifié)

### 1. Les scripts se chargent dans le `<head>`

Le DOM n'existe pas encore quand le script s'exécute. Toujours attendre :

```javascript
(function () {
  'use strict';
  function init() {
    if (document.getElementById('mon-composant')) return; // pas de double montage
    // …
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
```

### 2. jQuery est en version 1.7.2

Très ancienne (pas de `.on` moderne complet, pas de promesses natives…). Préférer le JavaScript natif :
`querySelector`, `fetch`, `classList`, `IntersectionObserver`, `requestAnimationFrame`.

### 3. Ne monter son composant que si son CSS est chargé

Si la feuille de style (souvent externe) ne charge pas, mieux vaut garder l'affichage natif :

```css
:root { --mon-composant: 1; } /* dans la feuille du composant */
```

```javascript
var cssPret = getComputedStyle(document.documentElement).getPropertyValue('--mon-composant').trim() !== '';
if (!cssPret) return;
```

Et ne masquer l'élément natif qu'une fois le composant monté (une classe sur `body`, ex. `body.mon-composant-on`).

### 4. Retour arrière

Le navigateur peut réafficher la page depuis son cache sans relancer les scripts. Réappliquer l'état (thème, onglet
actif…) dans `window.addEventListener('pageshow', …)`.

### 5. Défilement doux et focus

Un `element.focus()` interrompt un `scrollIntoView({ behavior: 'smooth' })` en cours. Utiliser
`element.focus({ preventScroll: true })`. Pour enchaîner une action après le défilement (`scrollend` n'existe pas
partout), attendre que `window.scrollY` ne bouge plus pendant quelques images, avec un délai maximal.

### 6. Accessibilité des animations

Vérifier `matchMedia('(prefers-reduced-motion: reduce)')` avant toute animation en JavaScript (compteurs,
défilements, carrousels).

## Lire d'autres pages du forum (vérifié)

Le forum répond aux requêtes de même origine avec la session du membre :

```javascript
function fetchDoc(url) {
  return fetch(url, { credentials: 'same-origin' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (html) { return new DOMParser().parseFromString(html, 'text/html'); });
}
```

- Mettre les résultats en cache dans `sessionStorage`, avec une durée de vie, pour ne pas multiplier les requêtes.
- Exemple : avatar d'un membre → `/memberlist?username=` + `encodeURIComponent(pseudo)`, garder le `.member-block`
  qui contient `a[href="/uN"]`, lire `.avatar-default img`.
- Ne jamais injecter du HTML lu ailleurs avec `innerHTML` : reconstruire avec `textContent` et des attributs choisis.

## Sélecteurs d'AwesomeBB (vérifié, nov. 2026)

| Zone | Sélecteurs |
|---|---|
| En-tête natif | `body > header` : `#logo-link`, `#header-user`, `#header-notif`, `#search-main`, `#header-navigation` ; menus `#main-menu`, `#main-user-menu`, `#notif-menu` |
| Bannière | `#header-banner` |
| Contenu | `#wrap` ; accueil : `main#index` |
| Catégories de l'index | `.forum.type-table-forum` (une par catégorie), titre `.forum-header .category-title h2`, forums `.forum-section`, dernier message `.forum-lastpost`, sous-forums `a.gensmall` |
| Barres de liens de l'index | `.action-bar-top`, `.action-bar-bottom` |
| Qui est en ligne | `#block-online.block-subtle` ; contenu dans `:scope > div`, segments séparés par `<br>` |
| Statistiques du pied de page | `body > footer` (index seulement) |
| Pied de page | `#page-footer .navbar .linklist` → `li.footer-to-top`, `li.footer-home`, `li.rightside` ; lien du PA hors de `.navbar` ; lien Cookies : `javascript:window.Sddan.cmp.displayUI();` |
| Pseudos colorés | `span.usr_grp_clr.group-N[style*="color"]` |
| Légende des groupes | `a.usr_grp_clr[href^="/g"][title*="Membres du groupe"]` |

Pour réorganiser un bloc natif (pied de page, liens…), **déplacer** les nœuds d'origine plutôt que de les copier :
ils gardent leurs gestionnaires d'événements.

## Patrons réutilisables (vérifié)

### Thème clair / sombre mémorisé

```javascript
var KEY = 'mon-theme';
function lireTheme() {
  try { var v = localStorage.getItem(KEY); if (v) return v; } catch (e) {}
  var m = document.cookie.match(/(?:^|;\s*)mon-theme=(light|dark)/); // cookie de secours
  return m ? m[1] : null;
}
function appliquer(theme) { document.documentElement.setAttribute('data-theme', theme); }
appliquer(lireTheme() || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
window.addEventListener('pageshow', function () { appliquer(lireTheme() || 'dark'); });
```

Le script s'exécute dans le `<head>` : le thème est posé avant l'affichage, sans flash.

### État dans l'adresse

```javascript
var url = new URL(location.href);
url.searchParams.set('onglet', slug);
history.replaceState(history.state, '', url);
```

### Fabrique d'éléments

```javascript
function h(tag, attrs, children) {
  var el = document.createElement(tag);
  Object.keys(attrs || {}).forEach(function (k) {
    var v = attrs[k];
    if (v == null || v === false) return;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  });
  (children || []).forEach(function (c) { if (c != null) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
  return el;
}
```

## Automatiser le PA (agents et scripts de navigateur)

- Chaque adresse du PA porte un paramètre de session `tid` : le relire dans un lien de la page plutôt que de le deviner.
- Les éditeurs de code du PA (templates, JS, CSS) sont des CodeMirror exposés en global `editor` :
  `editor.getValue()`, `editor.setValue(code)`, puis **`editor.save()`** avant d'envoyer le formulaire.
- Boutons : « Enregistrer » (templates), « Valider » (JS, CSS), puis **coche verte « Publier »** pour un template.
- Toujours vérifier le message de retour (« … a bien été modifié », « … publié avec succès ») puis le rendu sur le forum.
- Les champs de formulaire obligatoires (ex. modérateur d'un groupe) bloquent l'envoi sans message : vérifier
  `form.checkValidity()`.

## Après une mise à jour de Forumactif

Les sélecteurs et le HTML peuvent changer sans préavis (ex. pagination mobile début 2026). Retester les scripts sur
un forum de test avant la production, et suivre https://forum.forumactif.com/f1-annonces-mises-a-jour.
