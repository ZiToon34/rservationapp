# ðŸ“± DÃ©ploiement de l'Application Mobile

Guide pour dÃ©ployer l'application mobile admin (Expo) de votre plateforme de rÃ©servation.

## ðŸ—ï¸ Architecture Mobile

L'application mobile utilise :
- **Expo** pour le dÃ©veloppement et le dÃ©ploiement
- **React Native** avec TypeScript
- **Navigation** avec React Navigation
- **API** : mÃªme backend que les applications web

## ðŸš€ DÃ©ploiement

### 1. DÃ©veloppement Local

#### PrÃ©requis
```bash
# Installer Expo CLI
npm install -g @expo/cli

# Installer Expo Go sur votre smartphone
# Android : Google Play Store
# iOS : App Store
```

#### Configuration
```bash
cd mobile-admin
npm install

# CrÃ©er le fichier .env
cp env.example .env

# Ã‰diter .env selon votre environnement
# Pour Ã©mulateur Android : http://10.0.2.2:4000/api
# Pour appareil physique : http://[IP_DE_VOTRE_PC]:4000/api
# Pour production : https://reservation-api.onrender.com/api
```

#### Lancement
```bash
npm run start
# Scannez le QR code avec Expo Go
```

### 2. Production avec EAS Build

#### Installation EAS CLI
```bash
npm install -g eas-cli
```

#### Configuration EAS
```bash
cd mobile-admin
eas login
eas build:configure
```

#### Build pour Production
```bash
# Build pour Android
eas build --platform android

# Build pour iOS
eas build --platform ios

# Build pour les deux plateformes
eas build --platform all
```

#### Configuration des Variables d'Environnement
Dans `app.config.js`, l'URL de l'API est configurÃ©e via :
```javascript
extra: {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000/api"
}
```

## ðŸ”§ Configuration

### Variables d'Environnement

| Variable | DÃ©veloppement | Production |
|----------|---------------|------------|
| `EXPO_PUBLIC_API_URL` | `http://10.0.2.2:4000/api` | `https://reservation-api.onrender.com/api` |

### URLs selon l'Environnement

#### Ã‰mulateur Android
```
EXPO_PUBLIC_API_URL=http://10.0.2.2:4000/api
```

#### Appareil Physique
```
EXPO_PUBLIC_API_URL=http://192.168.1.100:4000/api
```
*Remplacez `192.168.1.100` par l'IP de votre PC*

#### Production
```
EXPO_PUBLIC_API_URL=https://reservation-api.onrender.com/api
```

## ðŸ“± FonctionnalitÃ©s

L'application mobile inclut :
- **Connexion admin** avec JWT
- **Tableau de bord** avec les rÃ©servations du jour
- **Gestion des rÃ©servations** (crÃ©er, supprimer)
- **ParamÃ¨tres** du restaurant
- **Jours spÃ©ciaux** (ouvrir/fermer)
- **Interface responsive** adaptÃ©e au mobile

## ðŸ› DÃ©pannage

### ProblÃ¨mes Courants

1. **Connexion API impossible**
   - VÃ©rifiez l'URL dans `.env`
   - VÃ©rifiez que l'API est accessible
   - VÃ©rifiez les paramÃ¨tres CORS de l'API

2. **QR Code ne fonctionne pas**
   - VÃ©rifiez que vous Ãªtes sur le mÃªme rÃ©seau Wi-Fi
   - RedÃ©marrez Expo Go
   - RedÃ©marrez le serveur de dÃ©veloppement

3. **Build EAS Ã©choue**
   - VÃ©rifiez votre compte Expo
   - VÃ©rifiez la configuration `app.config.js`
   - Consultez les logs EAS

### Logs et Debug

```bash
# Voir les logs de l'application
expo logs

# Debug avec React Native Debugger
# Installez React Native Debugger
# Puis activez le debug dans l'application
```

## ðŸ“¦ Distribution

### Android
- **APK** : TÃ©lÃ©chargeable directement
- **Google Play Store** : Via EAS Submit

### iOS
- **TestFlight** : Pour les tests
- **App Store** : Via EAS Submit

### Commandes de Distribution
```bash
# Soumettre Ã  Google Play Store
eas submit --platform android

# Soumettre Ã  App Store
eas submit --platform ios
```

## ðŸ”„ Mise Ã  Jour

Pour mettre Ã  jour l'application :
1. Modifiez le code
2. Testez en dÃ©veloppement
3. Build avec EAS
4. Distribuez via les stores

## ðŸ“š Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [React Navigation](https://reactnavigation.org/)


