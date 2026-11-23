# Liaison forum ↔ annexe

L'annexe (Next.js sur Vercel, MongoDB Atlas gratuit) expose une petite API publique en lecture.
Le forum ne détient jamais d'identifiants : il ne fait que lire.

## Cas d'usage retenus

### 1. Fiche personnage sur le forum (annexe → forum)
Les personnages sont saisis et tenus à jour dans l'annexe. Le forum les affiche
(profil, à côté des messages).

- Annexe : `GET /api/forum/characters/:forumUserId` → JSON public du personnage.
- Forum : un script lit l'identifiant du membre dans la page, appelle l'API, injecte la fiche.
- Il faut une correspondance **id membre Forumactif ↔ personnage** stockée dans MongoDB.

### 2. Expérience (points Forumactif) synchronisée sur l'annexe (forum → annexe)
Les points ne doivent **pas** être envoyés par le navigateur (falsifiable).
C'est l'annexe qui va les chercher :

- Une route serveur de l'annexe lit la page publique du profil Forumactif (ou la liste des membres)
  et en extrait les points, puis met à jour MongoDB.
- Déclenchement : à la consultation d'une fiche sur l'annexe (avec cache), et/ou tâche planifiée.
- Le champ « points » doit être visible publiquement sur les profils du forum.

### 3. Technique au survol dans les messages (annexe → forum)
- Annexe : `GET /api/forum/techniques/:slug` (ou un index léger de toutes les techniques).
- Forum : un script repère les techniques dans les messages (balise dédiée, ex. `[tech=slug]`)
  et affiche une infobulle au survol / au toucher sur mobile.

## Contraintes techniques

- CORS côté annexe : autoriser uniquement `https://alendria.forumactif.com` et
  `https://sengoku-no-jidai.forumactif.com`.
- Cache : `Cache-Control: public, s-maxage=…, stale-while-revalidate=…` sur les routes publiques
  pour ménager MongoDB gratuit (limite de connexions) ; client MongoDB réutilisé entre appels.
- Côté forum : mise en cache des réponses en `sessionStorage` pour éviter les appels répétés.
