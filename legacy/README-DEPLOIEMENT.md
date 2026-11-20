# EL BARAKA CONSEIL – site statique (proposition)

Contenu : `index.html`, `assets/logo.png`, `vercel.json`, `robots.txt`.

## Déployer sur Vercel
Option A (CLI) : dans ce dossier, `npx vercel login` puis `npx vercel --prod`.
Option B (sans ligne de commande) : vercel.com > Add New > Project > glisser-déposer ce dossier
(ou le pousser sur un dépôt GitHub puis l'importer). Framework : « Other », aucune commande de build.

## Réglages dans index.html (objet CONFIG)
- `LEAD_EMAIL` : boîte de réception des demandes (formulaires + chatbot).
  Au premier envoi, FormSubmit envoie un e-mail d'activation à cette adresse : cliquer sur le lien.
- `ASSET_BASE` : par défaut les photos sont chargées depuis l'ancien site. Pour être autonome,
  copier `public/assetsServer` et `public/gallery` de l'ancien projet dans ce dossier,
  puis mettre `ASSET_BASE: ''`.
- `TRACK_ENDPOINT` : URL d'une API pour enregistrer chaque visite (optionnel).
