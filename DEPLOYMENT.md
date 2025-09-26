# Guide de DÃ©ploiement - Plateforme de RÃ©servation de Restaurant

Ce guide vous explique comment dÃ©ployer votre plateforme complÃ¨te de rÃ©servation de restaurant.

## ðŸ—ï¸ Architecture du Projet

Le projet est composÃ© de 4 parties :
- **API Backend** (`api/`) - Node.js/Express avec PostgreSQL + Nodemailer
- **Application Client** (`web-client/`) - Site public React pour les rÃ©servations
- **Application Admin** (`admin-web/`) - Dashboard admin React (navigateur)
- **Application Mobile** (`mobile-admin/`) - Application mobile admin (Expo)

## ðŸŽ¯ StratÃ©gie de DÃ©ploiement

- **API Backend** â†’ Render.com (avec base de donnÃ©es PostgreSQL)
- **Applications Web** â†’ Netlify (client public + admin)
- **Application Mobile** â†’ Expo (dÃ©veloppement) / EAS Build (production)

## ðŸš€ DÃ©ploiement

### 1. API Backend sur Render

#### Option A : DÃ©ploiement Automatique (RecommandÃ©)

1. **Connectez votre repository GitHub Ã  Render**
   - Allez sur [render.com](https://render.com)
   - Connectez votre compte GitHub
   - SÃ©lectionnez votre repository

2. **DÃ©ployez avec le fichier render.yaml**
   - Render dÃ©tectera automatiquement le fichier `render.yaml` Ã  la racine
   - Cliquez sur "Deploy" pour crÃ©er l'API et la base de donnÃ©es

#### Option B : DÃ©ploiement Manuel

1. CrÃ©ez un nouveau **Web Service** sur Render
2. Configurez :
   - **Build Command** : `cd api && npm install`
   - **Start Command** : `cd api && npm start`
   - **Environment** : Node
   - **Plan** : Free

3. Variables d'environnement :
   ```
   NODE_ENV=production
   PORT=10000
   PostgreSQL_URI=[GÃ©nÃ©rÃ© automatiquement par la base de donnÃ©es]
   JWT_SECRET=[GÃ©nÃ©rÃ© automatiquement]
   CLIENT_URL=https://reservation-api-5sb6.onrender.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=[Votre email Gmail]
   SMTP_PASS=[Mot de passe d'application Gmail]
   SMTP_FROM="Restaurant <contact@restaurant.fr>"
   ```

4. **Base de DonnÃ©es PostgreSQL**
   - CrÃ©ez une nouvelle **PostgreSQL Database** sur Render
   - Plan : Free
   - Le nom sera automatiquement liÃ© Ã  l'API

### 2. Applications Web sur Netlify

#### Application Client (Public)

1. CrÃ©ez un nouveau site sur [Netlify](https://netlify.com)
2. Connectez votre repository GitHub
3. Configurez :
   - **Build Command** : `cd web-client && npm install && npm run build`
   - **Publish Directory** : `web-client/dist`
   - **Environment Variables** :
     ```
     VITE_API_URL=https://reservation-api-5sb6.onrender.com/api
     ```

#### Application Admin

1. CrÃ©ez un nouveau site sur [Netlify](https://netlify.com)
2. Connectez votre repository GitHub
3. Configurez :
   - **Build Command** : `cd admin-web && npm install && npm run build`
   - **Publish Directory** : `admin-web/dist`
   - **Environment Variables** :
     ```
     VITE_API_URL=https://reservation-api.onrender.com/api
     ```

### 3. Application Mobile (Expo)

#### DÃ©veloppement
```bash
cd mobile-admin
npm install
echo "EXPO_PUBLIC_API_URL=https://reservation-api.onrender.com/api" > .env
npm run start
```

#### Production (EAS Build)
```bash
cd mobile-admin
npm install -g @expo/cli eas-cli
eas build --platform all
```

## ðŸ”§ Configuration Post-DÃ©ploiement

### 1. Configuration SMTP

Pour l'envoi d'emails de confirmation :
1. CrÃ©ez un compte Gmail dÃ©diÃ©
2. Activez l'authentification Ã  2 facteurs
3. GÃ©nÃ©rez un "mot de passe d'application"
4. Configurez les variables SMTP dans Render

### 2. Initialisation de la Base de DonnÃ©es

AprÃ¨s le dÃ©ploiement, vous devrez :
1. **CrÃ©er un compte administrateur** (ou utiliser les identifiants seed)
   - Email : `admin@example.com`
   - Mot de passe : `ChangeMoi123!`
2. **Configurer les horaires d'ouverture**
3. **DÃ©finir les paramÃ¨tres du restaurant**
4. **Tester l'envoi d'emails de confirmation**

### 3. URLs des Services

AprÃ¨s dÃ©ploiement, vous aurez :
- **API** : `https://reservation-api.onrender.com`
- **Client Public** : `https://reservation-api-5sb6.onrender.com`
- **Admin** : `https://reservation-admin.netlify.app`
- **Mobile** : Application Expo (dÃ©veloppement) ou APK/IPA (production)

## ðŸ› DÃ©pannage

### ProblÃ¨mes Courants

1. **Erreur de Build** : VÃ©rifiez que tous les `package.json` sont corrects
2. **Erreur CORS** : VÃ©rifiez que `CLIENT_URL` pointe vers la bonne URL
3. **Erreur de Base de DonnÃ©es** : VÃ©rifiez que `PostgreSQL_URI` est correctement configurÃ©
4. **Emails non envoyÃ©s** : VÃ©rifiez la configuration SMTP

### Logs

Consultez les logs dans le dashboard Render pour diagnostiquer les problÃ¨mes.

## ðŸ“ Notes Importantes

- Le plan gratuit de Render met les services en veille aprÃ¨s 15 minutes d'inactivitÃ©
- Le premier dÃ©marrage peut prendre quelques secondes
- Les variables d'environnement sensibles doivent Ãªtre configurÃ©es dans Render, pas dans le code
- Sauvegardez rÃ©guliÃ¨rement votre base de donnÃ©es PostgreSQL

## ðŸ”„ Mise Ã  Jour

Pour mettre Ã  jour l'application :
1. Poussez vos modifications sur GitHub
2. Render redÃ©ploiera automatiquement
3. Ou dÃ©clenchez manuellement un redÃ©ploiement depuis le dashboard


