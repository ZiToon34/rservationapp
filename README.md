# Plateforme complète de réservation de restaurant

Ce monorepo contient :
- **api/** : API Express + PostgreSQL + Nodemailer
- **web-client/** : site public React (Vite + Bootstrap)
- **admin-web/** : tableau de bord administrateur (React)
- **mobile-admin/** : application mobile admin (Expo / React Native)

## Prérequis généraux
- Node.js 20 LTS et npm
- Base PostgreSQL (Render, Supabase ou autre) avec la chaîne `DATABASE_URL`
- Compte SMTP pour l’envoi des e-mails de confirmation
- (Mobile) Expo CLI + application Expo Go ou émulateur Android/iOS

## Premiers pas
1. **API**
   ```bash
   cd api
   npm install
   cp .env.example .env   # renseignez DATABASE_URL, JWT_SECRET, SMTP...
   npm run seed           # crée l’admin et les paramètres par défaut
   npm run dev
   ```
   Identifiants seed : `durand.olivier.34@icloud.com / 11062015Ro.`

2. **Client web**
   ```bash
   cd web-client
   npm install
   echo "VITE_API_URL=https://reservation-api-5sb6.onrender.com/api" > .env
   npm run dev
   ```

3. **Dashboard admin (web)**
   ```bash
   cd admin-web
   npm install
   echo "VITE_API_URL=https://reservation-api-5sb6.onrender.com/api" > .env
   npm run dev
   ```

4. **Application mobile**
   ```bash
   cd mobile-admin
   npm install
   echo "EXPO_PUBLIC_API_URL=http://10.0.2.2:4000/api" > .env
   npm run start
   ```
   Adaptez l’URL (émulateur iOS : `http://127.0.0.1:4000/api`, appareil réel : IP locale du PC).

## Déploiement rapide
- **API** : Render.com (Web Service Node + base PostgreSQL). Voir `render.yaml` et `RENDER_ENV_VARS.md`.
- **Web (client/admin)** : Netlify (`npm run build`, dossier `dist`). Variable `VITE_API_URL=https://votre-api.onrender.com/api`.
- **Mobile** : Expo Go (dev) ou EAS Build pour générer des APK/IPA.

## Variables d’environnement clés
| Projet | Fichier | Variables |
|--------|---------|-----------|
| api | `.env` | `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `SMTP_*` |
| web-client | `.env` | `VITE_API_URL` |
| admin-web | `.env` | `VITE_API_URL` |
| mobile-admin | `.env` | `EXPO_PUBLIC_API_URL` |

## Ressources complémentaires
- `DEPLOYMENT.md` : guide pas à pas (Render + Netlify + Expo)
- `DEPLOYMENT_CHECKLIST.md` : check-list de production
- `API/README.md`, `admin-web/README.md`, `web-client/README.md`, `mobile-admin/README.md` : instructions détaillées par projet

Bon développement et bonne dégustation !

