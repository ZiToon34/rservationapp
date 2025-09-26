# âœ… Checklist de DÃ©ploiement Render

## ðŸ“‹ PrÃ©paration (TerminÃ©e)

- [x] âœ… Fichier `render.yaml` crÃ©Ã© Ã  la racine
- [x] âœ… Configuration API prÃªte (`api/render.yaml`)
- [x] âœ… Configuration Client prÃªte (`web-client/render.yaml`)
- [x] âœ… Configuration Admin prÃªte (`admin-web/render.yaml`)
- [x] âœ… Variables d'environnement documentÃ©es
- [x] âœ… Guide de dÃ©ploiement crÃ©Ã©
- [x] âœ… Script de prÃ©paration crÃ©Ã©
- [x] âœ… Fichier `.gitignore` global crÃ©Ã©

## ðŸš€ Ã‰tapes de DÃ©ploiement

### 1. PrÃ©paration du Repository
- [ ] Pousser le code sur GitHub
- [ ] VÃ©rifier que tous les fichiers sont committÃ©s
- [ ] S'assurer que les secrets ne sont pas dans le code

### 2. Configuration Render
- [ ] CrÃ©er un compte sur [render.com](https://render.com)
- [ ] Connecter le compte GitHub
- [ ] SÃ©lectionner le repository

### 3. DÃ©ploiement API sur Render
- [ ] Utiliser le fichier `render.yaml` pour dÃ©ployer l'API et la base de donnÃ©es
- [ ] OU dÃ©ployer manuellement l'API et la base de donnÃ©es

### 4. DÃ©ploiement Applications Web sur Netlify
- [ ] DÃ©ployer l'application client sur Netlify
- [ ] DÃ©ployer l'application admin sur Netlify
- [ ] Configurer les variables d'environnement sur Netlify

### 5. Configuration des Variables d'Environnement
- [ ] Configurer les variables SMTP dans l'API sur Render
- [ ] Configurer les variables d'environnement sur Netlify
- [ ] VÃ©rifier que les URLs sont correctes
- [ ] Tester la connexion Ã  la base de donnÃ©es

### 6. Tests Post-DÃ©ploiement
- [ ] Tester l'API : `https://reservation-api-5sb6.onrender.com`
- [ ] Tester le client public : `https://reservation-client.netlify.app`
- [ ] Tester l'admin : `https://reservation-admin.netlify.app`
- [ ] Tester l'application mobile avec Expo
- [ ] Tester l'envoi d'emails
- [ ] Se connecter avec les identifiants seed : `admin@example.com` / `ChangeMoi123!`
- [ ] Configurer les horaires d'ouverture

## ðŸ”§ Configuration SMTP (Important)

### Gmail Configuration
1. [ ] CrÃ©er un compte Gmail dÃ©diÃ©
2. [ ] Activer l'authentification Ã  2 facteurs
3. [ ] GÃ©nÃ©rer un mot de passe d'application
4. [ ] Configurer dans Render :
   - `SMTP_USER` = email Gmail
   - `SMTP_PASS` = mot de passe d'application
   - `SMTP_FROM` = email de l'expÃ©diteur

## ðŸ“± URLs Finales

AprÃ¨s dÃ©ploiement, vous aurez :
- **API** : `https://reservation-api.onrender.com`
- **Client Public** : `https://reservation-client.netlify.app`
- **Admin** : `https://reservation-admin.netlify.app`
- **Mobile** : Application Expo (dÃ©veloppement) ou APK/IPA (production)

## ðŸ› DÃ©pannage

### ProblÃ¨mes Courants
- [ ] VÃ©rifier les logs dans le dashboard Render
- [ ] S'assurer que les URLs CORS sont correctes
- [ ] VÃ©rifier la configuration SMTP
- [ ] Tester la connexion Ã  la base de donnÃ©es

### Commandes Utiles
```bash
# Test local avant dÃ©ploiement
./deploy.sh

# VÃ©rifier les builds
cd web-client && npm run build
cd admin-web && npm run build
```

## ðŸ“ž Support

- Documentation Render : [render.com/docs](https://render.com/docs)
- Guide complet : `DEPLOYMENT.md`
- Variables d'environnement : `RENDER_ENV_VARS.md`


