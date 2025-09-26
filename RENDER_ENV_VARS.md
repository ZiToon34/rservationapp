# Variables d'Environnement pour Render

## ðŸ”§ Configuration des Variables d'Environnement

Voici les variables d'environnement Ã  configurer dans Render pour chaque service :

### ðŸ“¡ API Backend (reservation-api)

#### Variables Automatiques
- `NODE_ENV` = `production`
- `PORT` = `10000`
- `DATABASE_URL` = *(GÃ©nÃ©rÃ© automatiquement par la base de donnÃ©es)*
- `JWT_SECRET` = *(GÃ©nÃ©rÃ© automatiquement par Render)*

#### Variables Ã  Configurer Manuellement
- `CLIENT_URL` = `https://reservation-client.netlify.app`
- `SMTP_HOST` = `smtp.gmail.com`
- `SMTP_PORT` = `587`
- `SMTP_USER` = `votre_email@gmail.com`
- `SMTP_PASS` = `votre_mot_de_passe_application_gmail`
- `SMTP_FROM` = `"Restaurant <contact@restaurant.fr>"`

### ðŸŒ Application Client (Netlify)
- `VITE_API_URL` = `https://reservation-api.onrender.com/api`

### ðŸ‘¨â€ðŸ’¼ Application Admin (Netlify)
- `VITE_API_URL` = `https://reservation-api.onrender.com/api`

### ðŸ“± Application Mobile (Expo)
- `EXPO_PUBLIC_API_URL` = `https://reservation-api.onrender.com/api`

## ðŸ“§ Configuration SMTP Gmail

Pour configurer l'envoi d'emails :

1. **CrÃ©ez un compte Gmail dÃ©diÃ©** pour votre restaurant
2. **Activez l'authentification Ã  2 facteurs**
3. **GÃ©nÃ©rez un mot de passe d'application** :
   - Allez dans ParamÃ¨tres Google > SÃ©curitÃ©
   - Activez la validation en 2 Ã©tapes
   - GÃ©nÃ©rez un "mot de passe d'application"
4. **Utilisez ces informations** dans les variables SMTP

## ðŸ”’ SÃ©curitÃ©

- Ne jamais commiter les vraies valeurs dans le code
- Utilisez des mots de passe d'application pour Gmail
- Le JWT_SECRET est gÃ©nÃ©rÃ© automatiquement par Render
- La base de donnÃ©es PostgreSQL est automatiquement sÃ©curisÃ©e

## ðŸš¨ Points d'Attention

- Les URLs doivent correspondre exactement aux noms de services Render
- VÃ©rifiez que CORS est correctement configurÃ©
- Testez l'envoi d'emails aprÃ¨s le dÃ©ploiement
- Sauvegardez rÃ©guliÃ¨rement votre base de donnÃ©es


