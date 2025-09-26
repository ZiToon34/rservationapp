# Admin Web – Tableau de bord navigateur

Application React + Bootstrap pour les équipes du restaurant.

## Installation
```bash
cd admin-web
npm install
cp .env.example .env     # créez le fichier avec VITE_API_URL
npm run dev              # http://localhost:5174 par défaut
```

`.env` minimal :
```
VITE_API_URL=http://localhost:4000/api
```

## Scripts
- `npm run dev` : serveur Vite
- `npm run build` : build production (`dist/`)
- `npm run preview` : prévisualiser le build
- `npm run lint` : ESLint (0 warning, 0 error)

## Fonctionnalités principales
- Connexion admin (JWT stocké dans `localStorage`)
- Tableau de bord : liste du jour, ajout/suppression de réservations, sélection de date
- Paramètres : capacité (total/tables), délais min/max, horaires midi/soir
- Jours spéciaux : marquage multi-jours, purge manuelle
- Messages d’erreur en français, nombreux commentaires dans le code (`src/pages/`)

## Déploiement Netlify
1. Importez le dossier `admin-web`.
2. Commande : `npm run build`
3. Dossier : `dist`
4. Variables : `VITE_API_URL=https://votre-api.onrender.com/api`

## Organisation du code
- `src/pages` : écrans (login, dashboard, settings, special-days)
- `src/components` : layout et ProtectedRoute
- `src/services/api.ts` : toutes les requêtes HTTP (axios)
- `src/context/AuthContext.tsx` : gestion du JWT

Conseil : exécutez `npm run build` avant Netlify pour vérifier qu’il n’y a pas d’erreurs TypeScript.
