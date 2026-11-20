# Décisions

Choix pris sans bloquer le projet. À confirmer avec le client si besoin.

## Assets

Le dépôt ne contenait que `assets/logo.png` et `index.html`. Les photos de services, le portrait « à propos », les logos clients et la galerie étaient chargés depuis l'ancien site `el-baraka-conseil-website.vercel.app`. Ils ont été copiés dans `public/images/` pour ne plus dépendre de ce lien.

Le fond hero d'origine (`exicting-picture.jpeg`) est une photo de caméras. Il a été retiré de `public` et archivé dans `legacy/cctv-hero.jpeg`. Le hero est une vidéo (muette, en boucle) avec affiche de repli. Tant que le fichier n'est pas fourni, l'affiche `public/placeholders/hero-poster.svg` s'affiche. Remplacement dans Admin → Images et médias.

## TODO : photo Escorte

La carte Escorte de l'ancien site réutilisait `about.jpg`. En attendant le visuel du client, la carte pointe vers `public/placeholders/escort.svg`, remplaçable dans l'admin (clé `escort_photo`). **TODO: waiting client photo.**

## « Sécurisation de produits sensibles »

La liste demandée compte déjà « Transport de produits sensibles ». Une neuvième carte presque identique aurait fait doublon, et le compteur demandé au seed est 8. La sécurisation est donc portée par :

- la ligne du hero : *Gardiennage · Sécurisation · Transport de fonds · Produits sensibles*
- le texte de la carte n°3, qui commence par « Sécurisation de produits sensibles »

L'admin peut créer une 9e fiche si le client veut une carte séparée. Le compteur « services » est un réglage indépendant (Paramètres), initialisé à 8.

## « 500 pro »

Interprété comme **500+ professionnels** / « Plus de 500 professionnels à votre service » (compteur employés = 500).

## « Supprimer la question »

L'ancien site avait une FAQ et un assistant (chatbot). Les deux ont été retirés. Pas de page FAQ. Le bouton flottant est WhatsApp, pas un chat. À confirmer si « la question » désignait autre chose (un champ du formulaire, par exemple).

## Formulaire de contact

Champs demandés : nom, e-mail, téléphone facultatif, message, pot de miel, Turnstile optionnel. Un sélecteur de service facultatif a été gardé pour préremplir la demande depuis une fiche service. La case d'accord (loi 18-07) est exigée avant envoi.

## Horaires

Non précisés. Valeur initiale : **Dimanche – Jeudi · 08h00 – 17h00** (semaine ouvrée usuelle en Algérie). Modifiable dans Paramètres.

## Carte

Centre par défaut sur Jijel : **36.8206, 5.7667**. Ce n'est pas une adresse de rue. L'admin peut corriger latitude et longitude.

## WhatsApp

Le numéro public vient de `SiteSettings.whatsappNumber` (ou `NEXT_PUBLIC_WHATSAPP_NUMBER` au seed). S'il est vide, le bouton flottant n'est pas affiché, pour ne pas ouvrir un lien cassé.

L'ancien formulaire passait par FormSubmit vers une adresse Gmail personnelle. Elle n'est pas reprise. L'adresse affichée et la boîte de réception sont `MAIL_TO`.

## Auth

Session JWT (`jose`) dans le cookie httpOnly `eb_session`, plutôt qu'Auth.js, pour un contrôle explicite du cookie et du middleware. Mots de passe `bcryptjs`.

## Fichiers

`lib/storage.ts` envoie vers Cloudinary si les clés sont présentes, sinon Vercel Blob si `BLOB_READ_WRITE_TOKEN` est présent, sinon le disque local (`public/uploads` pour le public, `storage/private` pour les CV). Le disque local convient à un VPS. Sur Vercel et Railway le disque est éphémère : configurer Cloudinary (ou Blob) avant d'uploader en production. Sur Railway, un volume optionnel sur `/app/storage` peut garder les CV privés.

## Railway

Déploiement via Nixpacks (`railway.toml`). `prisma` et `tsx` sont en `dependencies` pour que `preDeployCommand` (`db:deploy` = `prisma db push`) et `railway run npm run db:seed` fonctionnent après prune des devDependencies. Pas de migrations versionnées pour l’instant : on reste sur `db push`, comme en local.

## Logos partenaires

Plus d’écran admin « Entreprises ». Les marques du bandeau viennent de `companySeed` dans `lib/seed-data.ts` et des fichiers sous `public/images/logos/`. À modifier dans le code, puis redéployer (ou `revalidateSite` n’est pas nécessaire si le cache site lit toujours `companySeed` — un redeploy / rebuild suffit pour le SSG).

## Perf (viewer-heavy)

Le root layout ne lit plus `headers()` pour rester statique. `getSiteData` est en cache tagué (`revalidate: false`) jusqu’à `revalidateSite()` côté admin. `/api/track` écrit en `after()`, échantillonne les vues anonymes, ignore les durées courtes, et rate-limite en mémoire (ou Upstash) plutôt qu’en Postgres. Build `output: "standalone"` pour un runtime plus léger. Paquets morts retirés (leaflet, framer-motion, lenis, next-themes).

## Analytique sans consentement

Refus ou absence de choix : pas de cookie visiteur. Un compteur anonyme (page, jour, pays) est enregistré. Le condensat IP+UA+sel du jour est effacé au bout de 24 h. Les volumes de pages peuvent rester. `DNT: 1` et `Sec-GPC: 1` ne sont pas mesurés du tout. Les messages et candidatures restent enregistrés : ce sont des demandes, pas de la mesure d'audience.

## Langue arabe

`next-intl` est en place (`/` en français, `/ar` en arabe, RTL). L'interface est traduite. Les textes éditables en base (services, jalons, réglages) restent en français tant qu'ils n'ont pas de traduction.

## Jalons

1996, 2005, 2012, 2018, 2024 et « Aujourd'hui » sont des **repères de démonstration**, pas un historique validé par le client. Ils vivent dans `SiteSettings.milestones` (JSON). L'écran Paramètres ne les édite pas encore champ par champ ; un développeur peut les mettre à jour en base.

## Curseur

Anneau doré discret en plus du curseur système (desktop, sans `prefers-reduced-motion`). Le curseur natif reste visible.

## Animation

Le hero et la frise utilisent Framer Motion. GSAP n'a pas été ajouté : le rendu demandé tient sans cette librairie.

## Postes ouverts

La table `JobOpening` existe. Aucune offre n'est seedée, pour ne pas inventer de recrutement. L'admin en ajoute dans Candidatures.

## Direction visuelle « bowl-glow »

Le site public suit maintenant la direction v3 : Poppins partout, navbar en pastille, lueur en canvas, révélation des lettres au défilement, panneau sombre avec la photo du portail. Le logo est `public/Elbaraka-Logo.png` (PNG transparent). Le backend, l'admin, les cookies, l'e-mail et WhatsApp ne changent pas. Les 12 corrections client restent (30+ ans, 500+, 100+, Transport des fonds, véhicule aménagé, coordonnées, pas d'Incendie).

## Direction visuelle « Le Portail »

Le premier habillage (marine, or, pastilles, grille, particules, compteurs en cartes) a été retiré. Les couleurs viennent des photos : bleu du portail `#0B5199` (la barre au soleil est `#0090FD`, trop claire pour le texte), kaki de la tenue `#B2A390`, béton clair pour le fond. Détail dans `DESIGN.md`.

Ce qui a été coupé, et pourquoi :

- L'or, le verre, les pastilles, le curseur rond, les particules et les apparitions au défilement. Ce sont les signes d'un modèle générique, pas de cette société.
- La ligne en capitales `Gardiennage · Sécurisation · …`. Les mêmes mots sont une phrase normale sous le titre.
- La rangée `30+ 500+ 100+ 8+`. Les chiffres sont une phrase : « Depuis 1996, plus de 500 professionnels… ».
- Le bandeau « réactivité 24/7 ». Le client ne l'a pas confirmé. Le point ambre « En service » existe dans Paramètres (`showLiveDot`) et reste éteint.
- Le défilement infini des logos. Les logos sont une grille, grands, en niveaux de gris, en couleur au survol. Le dernier cadre dit « + 100 partenaires ».
- L'affiche hero vide. Sans vidéo, le hero est la photo du portail bleu (`IMG_2665.jpg`).

Le logo actuel a un fond. Il est posé tel quel sur la barre claire, sans pastille blanche. **TODO : fournir un SVG ou un PNG transparent.**

Les neuf barres du portail se déplacent d'une largeur d'écran (`100vw`). Un pourcentage dans `translateX` ne déplace chaque barre que de sa propre largeur, et le portail restait fermé. Le voile sombre du hero monte à 78 % pour que le titre blanc reste lisible sur le bleu clair de la photo. Le bandeau de barres est dans le premier écran, légèrement sous le titre.

## Sécurisation, fiche à part

La direction visuelle demande une ligne propre pour « Sécurisation de produits sensibles », distincte de « Transport de produits sensibles ». La fiche a été ajoutée. Le compteur de services suit le nombre réel (9). Les jalons autres que 1996 portent `{{À CONFIRMER}}` et vivent dans la table `Milestone` (année, titre, texte, image).

## Photo Escorte

Toujours en attente du client. **TODO: waiting client photo.**
