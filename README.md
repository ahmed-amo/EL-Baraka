# EL BARAKA CONSEIL

Site de S.A.R.L. EL BARAKA CONSEIL (Jijel) : gardiennage, sécurisation, transport de fonds et de produits sensibles. Next.js 15, Prisma, PostgreSQL, espace d'administration.

Les choix de contenu sont notés dans `DECISIONS.md`.

## Installation

```bash
npm install
cp .env.example .env
```

Renseigner au minimum `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `IP_HASH_SALT`, `MAIL_TO` et `NEXT_PUBLIC_SITE_URL`.

PostgreSQL local :

```bash
npm run db:up
npm run db:setup
```

`db:setup` applique le schéma (`prisma db push`) puis crée l'administrateur et le contenu de départ, seulement s'ils n'existent pas encore. Relancer le seed ne réécrit pas les textes déjà en base et ne change pas le mot de passe d'un admin existant.

```bash
npm run dev
```

Production sur le même serveur :

```bash
npm run build
npm run start
```

## Variables

Voir `.env.example`.

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Postgres (Neon, Supabase, ou Docker) |
| `AUTH_SECRET` | Signature du cookie de session |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | **Seed uniquement** |
| `SMTP_*`, `MAIL_FROM`, `MAIL_TO` | Réception des messages et des candidatures |
| `RESEND_API_KEY` | Secours si le SMTP est absent ou échoue |
| `CLOUDINARY_*` ou `BLOB_READ_WRITE_TOKEN` | Fichiers. Sans les deux, stockage disque |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numéro public, sans `+`, repris au seed |
| `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ADMIN_NUMBER` | Alerte admin. Optionnel |
| `WHATSAPP_TEMPLATE_NAME` | Modèle Meta. Sans ce nom, un message texte est tenté (fenêtre de 24 h) |
| `IP_HASH_SALT` | Condensat visiteur. Jamais d'IP en clair |
| `TURNSTILE_*` | Optionnel |
| `UPSTASH_REDIS_REST_*` | Limitation de débit. Sinon Postgres |

## Déployer sur Railway

Fichiers déjà prêts : `railway.toml`, `nixpacks.toml`, healthcheck `/api/health`, build **standalone**.

Le site public est surtout en cache (ISR) : les pages ne re-hitent pas Postgres à chaque visiteur. Un changement admin invalide le cache via `revalidateSite()`. Le tracking est allégé (échantillon anonyme, écritures différées, rate-limit en mémoire).

1. Créer un projet Railway et déployer ce dépôt (GitHub ou CLI).
2. Ajouter un service **PostgreSQL** dans le même projet.
3. Sur le service web, lier la base et définir au minimum :
   - `DATABASE_URL` = `${{Postgres.DATABASE_PRIVATE_URL}}` (ajouter `&connection_limit=2` si besoin)
   - `AUTH_SECRET` (ex. `openssl rand -base64 32`)
   - `IP_HASH_SALT`
   - `NEXT_PUBLIC_SITE_URL` = l’URL publique Railway (ou le domaine custom), sans slash final
   - `MAIL_TO`, et le SMTP ou `RESEND_API_KEY`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` (seed uniquement)
4. Générer un domaine public (Settings → Networking) et mettre la même URL dans `NEXT_PUBLIC_SITE_URL`.
5. Plan / ressources : un **replica** petit suffit (site lecture). Éviter le scaling horizontal sans Redis si le rate-limit mémoire doit rester cohérent.
6. Après le **premier** déploiement réussi, initialiser le contenu :

```bash
railway run npm run db:seed
```

Le schéma est appliqué à chaque deploy via `preDeployCommand` → `npm run db:deploy` (`prisma db push`). Le seed n’est **pas** relancé automatiquement.

7. **Fichiers** : le disque Railway est éphémère. Configurer **Cloudinary** (`CLOUDINARY_*`) pour les médias publics. Les CV privés restent sur disque (`storage/private`) : monter un volume sur `/app/storage` si vous devez les conserver, ou récupérer les candidatures rapidement.

Variables optionnelles : WhatsApp Cloud, Turnstile, GA, Upstash — même tableau que ci-dessous.

## Déployer sur Vercel

1. Créer une base Postgres (Neon ou Supabase) et coller `DATABASE_URL`.
2. Renseigner les variables d'environnement, dont `AUTH_SECRET` et `NEXT_PUBLIC_SITE_URL`.
3. Build command : `npm run build` (elle lance `prisma generate`).
4. Après le premier déploiement : `npx prisma db push` puis `npx tsx prisma/seed.ts` avec les variables de production (ou `prisma migrate` si vous versionnez une migration).
5. Pour les vidéos et les logos, configurer Cloudinary ou Vercel Blob. Le disque de Vercel ne conserve pas les uploads.

## E-mail (Gmail)

1. Compte Google → Sécurité → validation en deux étapes.
2. Mots de passe des applications → créer un mot de passe pour « Mail ».
3. `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER` = l'adresse Gmail, `SMTP_PASS` = le mot de passe d'application (16 caractères).
4. `MAIL_FROM` peut être `EL BARAKA CONSEIL <cette-adresse>`. `MAIL_TO` est la boîte qui reçoit les demandes.

Brevo, Zoho ou OVH : mêmes champs, avec leur hôte SMTP. Si l'envoi échoue, le message reste en base avec `emailSent = false`. Le bouton **Renvoyer l'e-mail** de l'admin réessaie.

## WhatsApp Cloud API

1. [developers.facebook.com](https://developers.facebook.com) → créer une app → produit WhatsApp.
2. Ajouter un numéro d'entreprise et noter l'identifiant de numéro (`WHATSAPP_PHONE_NUMBER_ID`).
3. Générer un jeton système (`WHATSAPP_CLOUD_TOKEN`).
4. `WHATSAPP_ADMIN_NUMBER` : le mobile qui doit recevoir l'alerte, format international sans `+`.
5. Faire approuver un modèle avec 4 variables de texte (type, nom, téléphone, extrait), puis mettre son nom dans `WHATSAPP_TEMPLATE_NAME` et la langue dans `WHATSAPP_TEMPLATE_LANG` (`fr`).
6. Sans ces variables, l'envoi est ignoré et le site continue.

Le bouton vert du site ouvre `wa.me` avec le numéro et le texte enregistrés dans **Paramètres**. Sur une fiche service, le message cite le service.

## Administration

`/admin/login`

- Aperçu : visites, uniques, messages non lus, visiteurs des 5 dernières minutes, graphiques, export CSV.
- Visiteurs, messages (réponse mailto, renvoi d'e-mail), candidatures et CV.
- Logos partenaires : gérés dans le code (`lib/seed-data.ts` → `companySeed`, fichiers dans `public/images/logos/`), pas dans l’admin.
- Images et médias : vidéo du hero, affiche, photo escorte, image à propos, galerie.
- Services : textes, ordre, visibilité.
- Paramètres : téléphone, fax, Jijel, carte, compteurs, WhatsApp, SEO, mot de passe, autre admin.

Compte local créé par le seed : valeurs `ADMIN_EMAIL` et `ADMIN_PASSWORD` du fichier `.env`.

## Mesure d'audience

Bandeau : tout accepter, refuser, ou personnaliser. Nécessaires toujours actifs. Statistiques seulement avec accord (`eb_vid` 13 mois, `eb_sid` 30 minutes). Marketing réservé, aucun cookie publicitaire. Sans accord : compteurs anonymes, sans cookie et sans IP. `DNT` et Global Privacy Control ne sont pas mesurés.

Pages : `/politique-de-confidentialite`, `/cookies`. Lien **Gérer les cookies** dans le pied de page.

## Tests

```bash
npm test
```

## Ancien site

`legacy/` conserve la page statique d'origine. Elle n'est pas servie par Next.js.
