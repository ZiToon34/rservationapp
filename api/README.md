# API – Réservations de restaurant

API REST en Node.js/Express connectée à MongoDB. Toutes les routes sont commentées dans le code source (`src/routes`).

## Installation

```bash
cd api
npm install
cp .env.example .env   # puis complétez les variables
npm run seed           # crée un admin, des horaires et des tables de base
npm run dev            # démarre le serveur en mode développement
```

### Variables `.env`
- `MONGODB_URI` : URI MongoDB Atlas
- `JWT_SECRET` : clé secrète pour les tokens (HS256)
- `PORT` : port HTTP (par défaut 4000)
- `CLIENT_URL` : origine autorisée pour CORS (Netlify)
- `SMTP_*` : paramètres SMTP pour l’envoi des e-mails de confirmation

### Scripts npm
- `npm run dev` : nodemon + logs détaillés
- `npm run start` : exécution en production
- `npm run lint` : vérification ESLint
- `npm run lint:fix` : corrections automatiques
- `npm run seed` : insère l’admin `admin@example.com / ChangeMoi123!`, des réglages et les horaires classiques

## Principales routes

Préfixe : `/api`

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/auth/login` | Connexion admin (JWT 24h) |
| `GET` | `/public/settings` | Paramètres publics (max, délais) |
| `GET` | `/public/calendar` | Horaires + jours spéciaux |
| `GET` | `/public/availability` | Créneaux disponibles (15 min) |
| `POST` | `/public/reservations` | Réservation côté client + e-mail |
| `GET` | `/admin/reservations` | Réservations du jour (auth requise) |
| `POST` | `/admin/reservations` | Création manuelle (admin) |
| `DELETE` | `/admin/reservations/:id` | Suppression |
| `GET/PUT` | `/admin/settings` | Gestion capacité et délais |
| `GET/PUT` | `/admin/schedules` | Horaires midi/soir |
| `GET/POST/DELETE` | `/admin/special-days` | Jours exceptionnels |
| `POST` | `/admin/maintenance/purge` | Purge manuelle (réservations passées) |

## Règles métier
- Créneaux toutes les 15 minutes
- Capacité "total" ou "tables" (allocation gloutonne)
- Validation stricte (Zod) + messages en français
- Rate limiting (`express-rate-limit`) sur `/auth/login` et `/public/reservations`
- Cron `node-cron` à 03:00 Europe/Paris (`src/jobs/purgeJob.js`)
- Email de confirmation via `nodemailer` (fallback console si SMTP vide)

## Déploiement Render
1. Créez un service “Web Service” et pointez sur **`api`**.
2. Build command : `npm install`
3. Start command : `npm run start`
4. Renseignez les variables d’environnement (voir `.env`).
5. Activez un health check `/api/health` si besoin.

## Structure des fichiers
```
src/
├── app.js           # Configuration Express
├── server.js        # Lancement + connexion Mongo + cron
├── controllers/     # Logique des routes (auth, réservations, settings)
├── services/        # Règles métier (capacité, disponibilités)
├── models/          # Schémas Mongoose
├── routes/          # Déclaration des endpoints
├── middlewares/     # Validation, auth, errors
├── jobs/            # Cron de purge
└── scripts/seed.js  # Script d’initialisation
```

Bon développement !
