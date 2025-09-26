# Admin Web â€“ Tableau de bord navigateur

Application React + Bootstrap pour les Ã©quipes du restaurant.

## Installation
```bash
cd admin-web
npm install
cp .env.example .env     # crÃ©ez le fichier avec VITE_API_URL
npm run dev              # http://localhost:5174 par dÃ©faut
```

`.env` minimal :
```
VITE_API_URL=https://reservation-api-5sb6.onrender.com/api
```

## Scripts
- `npm run dev` : serveur Vite
- `npm run build` : build production (`dist/`)
- `npm run preview` : prÃ©visualiser le build
- `npm run lint` : ESLint (0 warning, 0 error)

## FonctionnalitÃ©s principales
- Connexion admin (JWT stockÃ© dans `localStorage`)
- Tableau de bord : liste du jour, ajout/suppression de rÃ©servations, sÃ©lection de date
- ParamÃ¨tres : capacitÃ© (total/tables), dÃ©lais min/max, horaires midi/soir
- Jours spÃ©ciaux : marquage multi-jours, purge manuelle
- Messages dâ€™erreur en franÃ§ais, nombreux commentaires dans le code (`src/pages/`)

## DÃ©ploiement Netlify
1. Importez le dossier `admin-web`.
2. Commande : `npm run build`
3. Dossier : `dist`
4. Variables : `VITE_API_URL=https://votre-api.onrender.com/api`

## Organisation du code
- `src/pages` : Ã©crans (login, dashboard, settings, special-days)
- `src/components` : layout et ProtectedRoute
- `src/services/api.ts` : toutes les requÃªtes HTTP (axios)
- `src/context/AuthContext.tsx` : gestion du JWT

Conseil : exÃ©cutez `npm run build` avant Netlify pour vÃ©rifier quâ€™il nâ€™y a pas dâ€™erreurs TypeScript.

