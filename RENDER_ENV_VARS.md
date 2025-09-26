# Variables d'Environnement pour Render

## 🔧 Configuration des Variables d'Environnement

Voici les variables d'environnement à configurer dans Render pour chaque service :

### 📡 API Backend (reservation-api)

#### Variables Automatiques
- `NODE_ENV` = `production`
- `PORT` = `10000`
- `MONGODB_URI` = *(Généré automatiquement par la base de données)*
- `JWT_SECRET` = *(Généré automatiquement par Render)*

#### Variables à Configurer Manuellement
- `CLIENT_URL` = `https://reservation-client.netlify.app`
- `SMTP_HOST` = `smtp.gmail.com`
- `SMTP_PORT` = `587`
- `SMTP_USER` = `votre_email@gmail.com`
- `SMTP_PASS` = `votre_mot_de_passe_application_gmail`
- `SMTP_FROM` = `"Restaurant <contact@restaurant.fr>"`

### 🌐 Application Client (Netlify)
- `VITE_API_URL` = `https://reservation-api.onrender.com/api`

### 👨‍💼 Application Admin (Netlify)
- `VITE_API_URL` = `https://reservation-api.onrender.com/api`

### 📱 Application Mobile (Expo)
- `EXPO_PUBLIC_API_URL` = `https://reservation-api.onrender.com/api`

## 📧 Configuration SMTP Gmail

Pour configurer l'envoi d'emails :

1. **Créez un compte Gmail dédié** pour votre restaurant
2. **Activez l'authentification à 2 facteurs**
3. **Générez un mot de passe d'application** :
   - Allez dans Paramètres Google > Sécurité
   - Activez la validation en 2 étapes
   - Générez un "mot de passe d'application"
4. **Utilisez ces informations** dans les variables SMTP

## 🔒 Sécurité

- Ne jamais commiter les vraies valeurs dans le code
- Utilisez des mots de passe d'application pour Gmail
- Le JWT_SECRET est généré automatiquement par Render
- La base de données MongoDB est automatiquement sécurisée

## 🚨 Points d'Attention

- Les URLs doivent correspondre exactement aux noms de services Render
- Vérifiez que CORS est correctement configuré
- Testez l'envoi d'emails après le déploiement
- Sauvegardez régulièrement votre base de données
