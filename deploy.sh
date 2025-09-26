#!/bin/bash

# Script de déploiement pour Render
# Ce script peut être utilisé pour préparer le déploiement localement

echo "🚀 Préparation du déploiement sur Render..."

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ Node.js et npm sont installés"

# Installation des dépendances pour chaque projet
echo "📦 Installation des dépendances..."

echo "  - API Backend..."
cd api && npm install --production=false
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances de l'API"
    exit 1
fi
cd ..

echo "  - Application Client..."
cd web-client && npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances du client"
    exit 1
fi
cd ..

echo "  - Application Admin..."
cd admin-web && npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances de l'admin"
    exit 1
fi
cd ..

echo "✅ Toutes les dépendances sont installées"

# Test de build pour les applications frontend
echo "🔨 Test de build des applications frontend..."

echo "  - Build du client..."
cd web-client && npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build du client"
    exit 1
fi
cd ..

echo "  - Build de l'admin..."
cd admin-web && npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build de l'admin"
    exit 1
fi
cd ..

echo "✅ Tous les builds sont réussis"

echo ""
echo "🎉 Préparation terminée !"
echo ""
echo "📝 Prochaines étapes :"
echo "1. Poussez votre code sur GitHub"
echo "2. Connectez votre repository à Render"
echo "3. Déployez en utilisant le fichier render.yaml"
echo "4. Configurez les variables d'environnement SMTP"
echo "5. Testez votre application déployée"
echo ""
echo "📖 Consultez DEPLOYMENT.md pour plus de détails"
