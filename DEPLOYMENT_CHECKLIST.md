# ✅ Checklist de Déploiement Render

## 📋 Préparation (Terminée)

- [x] ✅ Fichier `render.yaml` créé à la racine
- [x] ✅ Configuration API prête (`api/render.yaml`)
- [x] ✅ Configuration Client prête (`web-client/render.yaml`)
- [x] ✅ Configuration Admin prête (`admin-web/render.yaml`)
- [x] ✅ Variables d'environnement documentées
- [x] ✅ Guide de déploiement créé
- [x] ✅ Script de préparation créé
- [x] ✅ Fichier `.gitignore` global créé

## 🚀 Étapes de Déploiement

### 1. Préparation du Repository
- [ ] Pousser le code sur GitHub
- [ ] Vérifier que tous les fichiers sont committés
- [ ] S'assurer que les secrets ne sont pas dans le code

### 2. Configuration Render
- [ ] Créer un compte sur [render.com](https://render.com)
- [ ] Connecter le compte GitHub
- [ ] Sélectionner le repository

### 3. Déploiement API sur Render
- [ ] Utiliser le fichier `render.yaml` pour déployer l'API et la base de données
- [ ] OU déployer manuellement l'API et la base de données

### 4. Déploiement Applications Web sur Netlify
- [ ] Déployer l'application client sur Netlify
- [ ] Déployer l'application admin sur Netlify
- [ ] Configurer les variables d'environnement sur Netlify

### 5. Configuration des Variables d'Environnement
- [ ] Configurer les variables SMTP dans l'API sur Render
- [ ] Configurer les variables d'environnement sur Netlify
- [ ] Vérifier que les URLs sont correctes
- [ ] Tester la connexion à la base de données

### 6. Tests Post-Déploiement
- [ ] Tester l'API : `https://reservation-api.onrender.com`
- [ ] Tester le client public : `https://reservation-client.netlify.app`
- [ ] Tester l'admin : `https://reservation-admin.netlify.app`
- [ ] Tester l'application mobile avec Expo
- [ ] Tester l'envoi d'emails
- [ ] Se connecter avec les identifiants seed : `admin@example.com` / `ChangeMoi123!`
- [ ] Configurer les horaires d'ouverture

## 🔧 Configuration SMTP (Important)

### Gmail Configuration
1. [ ] Créer un compte Gmail dédié
2. [ ] Activer l'authentification à 2 facteurs
3. [ ] Générer un mot de passe d'application
4. [ ] Configurer dans Render :
   - `SMTP_USER` = email Gmail
   - `SMTP_PASS` = mot de passe d'application
   - `SMTP_FROM` = email de l'expéditeur

## 📱 URLs Finales

Après déploiement, vous aurez :
- **API** : `https://reservation-api.onrender.com`
- **Client Public** : `https://reservation-client.netlify.app`
- **Admin** : `https://reservation-admin.netlify.app`
- **Mobile** : Application Expo (développement) ou APK/IPA (production)

## 🐛 Dépannage

### Problèmes Courants
- [ ] Vérifier les logs dans le dashboard Render
- [ ] S'assurer que les URLs CORS sont correctes
- [ ] Vérifier la configuration SMTP
- [ ] Tester la connexion à la base de données

### Commandes Utiles
```bash
# Test local avant déploiement
./deploy.sh

# Vérifier les builds
cd web-client && npm run build
cd admin-web && npm run build
```

## 📞 Support

- Documentation Render : [render.com/docs](https://render.com/docs)
- Guide complet : `DEPLOYMENT.md`
- Variables d'environnement : `RENDER_ENV_VARS.md`
