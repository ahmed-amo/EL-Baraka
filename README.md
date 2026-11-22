# EL BARAKA CONSEIL

Site de S.A.R.L. EL BARAKA CONSEIL (Jijel) : gardiennage, sécurisation, transport de fonds et de produits sensibles. Next.js 15, Prisma, MariaDB, espace d'administration.

Les choix de contenu sont notés dans `DECISIONS.md`.

## Installation

```bash
npm install
cp .env.example .env
```

Renseigner au minimum `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `IP_HASH_SALT`, `MAIL_TO` et `NEXT_PUBLIC_SITE_URL`.

MariaDB local (Docker) :

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
| `DATABASE_URL` | MariaDB (cPanel) ou Docker local — URL `mysql://…` |
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
| `UPSTASH_REDIS_REST_*` | Limitation de débit. Sinon mémoire |

## Déployer sur cPanel (Node.js + MySQL)

1. **MySQL** → Database Wizard : créer la base, l’utilisateur, et tous les privilèges. Noter les noms exacts (souvent préfixés `elbarakaconseil_…`).
2. **Setup Node.js App** :
   - Mode **Production**, Node **22+** / **24**
   - Racine : `EL-Baraka`
   - URL : `elbarakaconseil.dz` (chemin vide)
   - Fichier de démarrage : `app.js`
3. Terminal cPanel (ou environnement virtuel Node) :

```bash
cd ~/EL-Baraka
git clone https://github.com/ahmed-amo/EL-Baraka.git .
npm ci
```

4. Créer `.env` (ou variables dans Setup Node.js App) avec au minimum :

```bash
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DBNAME"
AUTH_SECRET="…"
IP_HASH_SALT="…"
NEXT_PUBLIC_SITE_URL="https://elbarakaconseil.dz"
ADMIN_EMAIL="…"
ADMIN_PASSWORD="…"
MAIL_TO="…"
```

Si le mot de passe MySQL contient `@ # %` etc., l’encoder dans l’URL.

5. Initialiser puis build :

```bash
npx prisma db push
npm run db:seed
npm run build
```

6. Dans Setup Node.js App → **Restart**.

Mises à jour : `git pull` → `npm ci` → `npx prisma db push` → `npm run build` → Restart.

Les vidéos hero (>100 Mo) ne sont pas dans Git : uploade-les dans `public/videos/` sur le serveur, ou mets une URL Cloudinary dans **Paramètres**.

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
- Logos, services et médias : gérés dans le code / seed, pas dans l’admin.
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
