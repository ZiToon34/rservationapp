# Web client â€“ RÃ©servations en ligne

Application React + Vite + Bootstrap pour que les clients rÃ©servent directement en ligne.

## Installation
```bash
cd web-client
npm install
cp .env.example .env    # Ã  crÃ©er : voir ci-dessous
npm run dev             # http://localhost:5173
```

Ajoutez un fichier `.env` (non versionnÃ©) :
```
VITE_API_URL=https://reservation-api-5sb6.onrender.com/api
```

## Scripts utiles
- `npm run dev` : serveur Vite + hot reload
- `npm run build` : build production (`dist/`)
- `npm run preview` : prÃ©visualisation du build
- `npm run lint` / `npm run format` : qualitÃ© du code

## FonctionnalitÃ©s
- Calendrier responsive (jours ouverts grisÃ©s via lâ€™API)
- Formulaire complet (nom, email, tÃ©lÃ©phone, commentaire)
- VÃ©rification live du nombre de convives (`Au-dessus, merci de nous contacter par appel.`)
- Liste des crÃ©neaux valides (15 min, capacitÃ© respectÃ©e)
- Page de confirmation + e-mail automatique
- AccessibilitÃ© : labels, focus visible, aria-live pour les erreurs

## DÃ©ploiement Netlify
1. Connectez le dÃ©pÃ´t Git.
2. Commande : `npm run build`
3. Dossier de publication : `dist`
4. Variables : `VITE_API_URL=https://votre-api.onrender.com/api`

## Astuces dÃ©butant
- Les composants principaux se trouvent dans `src/pages/HomePage.tsx` et `src/components/`.
- Toutes les requÃªtes passent par `src/services/api.ts`.
- Pour ajuster la charte graphique, modifiez `src/styles/global.css` ou rajoutez vos propres classes Bootstrap.

