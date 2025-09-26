# 📱 Déploiement de l'Application Mobile

Guide pour déployer l'application mobile admin (Expo) de votre plateforme de réservation.

## 🏗️ Architecture Mobile

L'application mobile utilise :
- **Expo** pour le développement et le déploiement
- **React Native** avec TypeScript
- **Navigation** avec React Navigation
- **API** : même backend que les applications web

## 🚀 Déploiement

### 1. Développement Local

#### Prérequis
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

# Créer le fichier .env
cp env.example .env

# Éditer .env selon votre environnement
# Pour émulateur Android : http://10.0.2.2:4000/api
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
Dans `app.config.js`, l'URL de l'API est configurée via :
```javascript
extra: {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000/api"
}
```

## 🔧 Configuration

### Variables d'Environnement

| Variable | Développement | Production |
|----------|---------------|------------|
| `EXPO_PUBLIC_API_URL` | `http://10.0.2.2:4000/api` | `https://reservation-api.onrender.com/api` |

### URLs selon l'Environnement

#### Émulateur Android
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

## 📱 Fonctionnalités

L'application mobile inclut :
- **Connexion admin** avec JWT
- **Tableau de bord** avec les réservations du jour
- **Gestion des réservations** (créer, supprimer)
- **Paramètres** du restaurant
- **Jours spéciaux** (ouvrir/fermer)
- **Interface responsive** adaptée au mobile

## 🐛 Dépannage

### Problèmes Courants

1. **Connexion API impossible**
   - Vérifiez l'URL dans `.env`
   - Vérifiez que l'API est accessible
   - Vérifiez les paramètres CORS de l'API

2. **QR Code ne fonctionne pas**
   - Vérifiez que vous êtes sur le même réseau Wi-Fi
   - Redémarrez Expo Go
   - Redémarrez le serveur de développement

3. **Build EAS échoue**
   - Vérifiez votre compte Expo
   - Vérifiez la configuration `app.config.js`
   - Consultez les logs EAS

### Logs et Debug

```bash
# Voir les logs de l'application
expo logs

# Debug avec React Native Debugger
# Installez React Native Debugger
# Puis activez le debug dans l'application
```

## 📦 Distribution

### Android
- **APK** : Téléchargeable directement
- **Google Play Store** : Via EAS Submit

### iOS
- **TestFlight** : Pour les tests
- **App Store** : Via EAS Submit

### Commandes de Distribution
```bash
# Soumettre à Google Play Store
eas submit --platform android

# Soumettre à App Store
eas submit --platform ios
```

## 🔄 Mise à Jour

Pour mettre à jour l'application :
1. Modifiez le code
2. Testez en développement
3. Build avec EAS
4. Distribuez via les stores

## 📚 Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [React Navigation](https://reactnavigation.org/)
