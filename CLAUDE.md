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
| `src/css/components/` | CSS des composants (catégories, sujets, messages…) | Servi par CDN, chargé depuis `overall_header` |
| `src/templates/` | Templates HTML et extraits à insérer | PA › Affichage › Templates |
| `src/js/` | Un fichier par script | PA › Modules › Gestion des codes JavaScript |
| `docs/` | Décisions, notes de migration | — |

## Décisions

- **Version** : AwesomeBB (même version que le forum de production).
- **Ambiance** : japonaise médiévale sombre.
- **Couleur primaire** : Hagane (acier bleuté) — `#9fb0c3` en sombre, `#3e5266` en clair.
  Toutes les autres couleurs existantes (nations, clans, or de Kaminari `#c9a558`) sont conservées.
- **Polices** : titres en **Zen Antique**, texte en **Inria Sans** (comme l'annexe). Cinzel abandonnée.
- **Thème** : celui de l'appareil par défaut ; le choix du membre est mémorisé dans le navigateur
  (`localStorage`, clé `snj-theme`). Attribut `data-theme` sur `<html>`.
- **Variables CSS** préfixées `--sg-*`. On rebranche les `--t_*` d'AwesomeBB sur nos tokens.
- **CSS hors forum** : servi par jsDelivr depuis ce dépôt, avec une adresse versionnée (tag).
  Le CSS indispensable reste dans le CSS principal du forum pour que le forum reste lisible si le CDN tombe.
- **Messages libres** (sans modèle) : doivent rester lisibles et épurés.
- **Migration** : bascule de tout le forum en une fois.

## Règles

- Ne jamais mettre de secret (identifiants MongoDB, tokens) dans ce dépôt : tout ce qui est ici finit public.
- Le code du forum ne fait que **lire** l'API de l'annexe. Toute écriture doit être revérifiée côté serveur
  (les données `_userdata` côté navigateur sont falsifiables).
- Après une mise à jour de Forumactif, retester les scripts sur le forum de test avant la production.
- Templates : après enregistrement dans le PA, penser à **valider/publier** le template.
