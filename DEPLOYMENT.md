# Guide de Déploiement - Plateforme de Réservation de Restaurant

Ce guide vous explique comment déployer votre plateforme complète de réservation de restaurant.

## 🏗️ Architecture du Projet

Le projet est composé de 4 parties :
- **API Backend** (`api/`) - Node.js/Express avec MongoDB + Nodemailer
- **Application Client** (`web-client/`) - Site public React pour les réservations
- **Application Admin** (`admin-web/`) - Dashboard admin React (navigateur)
- **Application Mobile** (`mobile-admin/`) - Application mobile admin (Expo)

## 🎯 Stratégie de Déploiement

- **API Backend** → Render.com (avec base de données MongoDB)
- **Applications Web** → Netlify (client public + admin)
- **Application Mobile** → Expo (développement) / EAS Build (production)

## 🚀 Déploiement

### 1. API Backend sur Render

#### Option A : Déploiement Automatique (Recommandé)

1. **Connectez votre repository GitHub à Render**
   - Allez sur [render.com](https://render.com)
   - Connectez votre compte GitHub
   - Sélectionnez votre repository

2. **Déployez avec le fichier render.yaml**
   - Render détectera automatiquement le fichier `render.yaml` à la racine
   - Cliquez sur "Deploy" pour créer l'API et la base de données

#### Option B : Déploiement Manuel

1. Créez un nouveau **Web Service** sur Render
2. Configurez :
   - **Build Command** : `cd api && npm install`
   - **Start Command** : `cd api && npm start`
   - **Environment** : Node
   - **Plan** : Free

3. Variables d'environnement :
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=[Généré automatiquement par la base de données]
   JWT_SECRET=[Généré automatiquement]
   CLIENT_URL=https://reservation-client.netlify.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=[Votre email Gmail]
   SMTP_PASS=[Mot de passe d'application Gmail]
   SMTP_FROM="Restaurant <contact@restaurant.fr>"
   ```

4. **Base de Données MongoDB**
   - Créez une nouvelle **MongoDB Database** sur Render
   - Plan : Free
   - Le nom sera automatiquement lié à l'API

### 2. Applications Web sur Netlify

#### Application Client (Public)

1. Créez un nouveau site sur [Netlify](https://netlify.com)
2. Connectez votre repository GitHub
3. Configurez :
   - **Build Command** : `cd web-client && npm install && npm run build`
   - **Publish Directory** : `web-client/dist`
   - **Environment Variables** :
     ```
     VITE_API_URL=https://reservation-api.onrender.com/api
     ```

#### Application Admin

1. Créez un nouveau site sur [Netlify](https://netlify.com)
2. Connectez votre repository GitHub
3. Configurez :
   - **Build Command** : `cd admin-web && npm install && npm run build`
   - **Publish Directory** : `admin-web/dist`
   - **Environment Variables** :
     ```
     VITE_API_URL=https://reservation-api.onrender.com/api
     ```

### 3. Application Mobile (Expo)

#### Développement
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

## 🔧 Configuration Post-Déploiement

### 1. Configuration SMTP

Pour l'envoi d'emails de confirmation :
1. Créez un compte Gmail dédié
2. Activez l'authentification à 2 facteurs
3. Générez un "mot de passe d'application"
4. Configurez les variables SMTP dans Render

### 2. Initialisation de la Base de Données

Après le déploiement, vous devrez :
1. **Créer un compte administrateur** (ou utiliser les identifiants seed)
   - Email : `admin@example.com`
   - Mot de passe : `ChangeMoi123!`
2. **Configurer les horaires d'ouverture**
3. **Définir les paramètres du restaurant**
4. **Tester l'envoi d'emails de confirmation**

### 3. URLs des Services

Après déploiement, vous aurez :
- **API** : `https://reservation-api.onrender.com`
- **Client Public** : `https://reservation-client.netlify.app`
- **Admin** : `https://reservation-admin.netlify.app`
- **Mobile** : Application Expo (développement) ou APK/IPA (production)

## 🐛 Dépannage

### Problèmes Courants

1. **Erreur de Build** : Vérifiez que tous les `package.json` sont corrects
2. **Erreur CORS** : Vérifiez que `CLIENT_URL` pointe vers la bonne URL
3. **Erreur de Base de Données** : Vérifiez que `MONGODB_URI` est correctement configuré
4. **Emails non envoyés** : Vérifiez la configuration SMTP

### Logs

Consultez les logs dans le dashboard Render pour diagnostiquer les problèmes.

## 📝 Notes Importantes

- Le plan gratuit de Render met les services en veille après 15 minutes d'inactivité
- Le premier démarrage peut prendre quelques secondes
- Les variables d'environnement sensibles doivent être configurées dans Render, pas dans le code
- Sauvegardez régulièrement votre base de données MongoDB

## 🔄 Mise à Jour

Pour mettre à jour l'application :
1. Poussez vos modifications sur GitHub
2. Render redéploiera automatiquement
3. Ou déclenchez manuellement un redéploiement depuis le dashboard
