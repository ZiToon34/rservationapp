# Web client – Réservations en ligne

Application React + Vite + Bootstrap pour que les clients réservent directement en ligne.

## Installation
```bash
cd web-client
npm install
cp .env.example .env    # à créer : voir ci-dessous
npm run dev             # http://localhost:5173
```

Ajoutez un fichier `.env` (non versionné) :
```
VITE_API_URL=http://localhost:4000/api
```

## Scripts utiles
- `npm run dev` : serveur Vite + hot reload
- `npm run build` : build production (`dist/`)
- `npm run preview` : prévisualisation du build
- `npm run lint` / `npm run format` : qualité du code

## Fonctionnalités
- Calendrier responsive (jours ouverts grisés via l’API)
- Formulaire complet (nom, email, téléphone, commentaire)
- Vérification live du nombre de convives (`Au-dessus, merci de nous contacter par appel.`)
- Liste des créneaux valides (15 min, capacité respectée)
- Page de confirmation + e-mail automatique
- Accessibilité : labels, focus visible, aria-live pour les erreurs

## Déploiement Netlify
1. Connectez le dépôt Git.
2. Commande : `npm run build`
3. Dossier de publication : `dist`
4. Variables : `VITE_API_URL=https://votre-api.onrender.com/api`

## Astuces débutant
- Les composants principaux se trouvent dans `src/pages/HomePage.tsx` et `src/components/`.
- Toutes les requêtes passent par `src/services/api.ts`.
- Pour ajuster la charte graphique, modifiez `src/styles/global.css` ou rajoutez vos propres classes Bootstrap.
