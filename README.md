# Application Multiservices

Cette application est une plateforme complète permettant de connecter des prestataires de services locaux avec des clients. Elle se compose d'un backend robuste, d'une version web (PWA) et d'une application mobile native.

## Architecture du Projet

Le projet est divisé en trois composants principaux :

1.  **`backend_app`** : API REST développée avec Laravel.
2.  **`frontend_mobile`** : Interface web responsive et Progressive Web App (PWA) développée avec React et Vite.
3.  **`mobile_app`** : Application mobile native développée avec Expo (React Native).

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

-   [PHP](https://www.php.net/downloads.php) (>= 8.2)
-   [Composer](https://getcomposer.org/)
-   [Node.js](https://nodejs.org/) (LTS recommandé)
-   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
-   [Expo CLI](https://docs.expo.dev/get-started/installation/) (pour le mobile)

---

## Installation et Exécution

### 1. Backend (`backend_app`)

Le backend gère l'authentification, la base de données et la logique métier.

```bash
cd backend_app

# Installation des dépendances PHP
composer install

# Configuration de l'environnement
cp .env.example .env

# Génération de la clé d'application
php artisan key:generate

# Création de la base de données (SQLite par défaut)
touch database/database.sqlite
php artisan migrate

# Lancer le serveur de développement
php artisan serve
```

### 2. Frontend PWA (`frontend_mobile`)

L'interface web optimisée pour mobile et installable comme application.

```bash
cd frontend_mobile

# Installation des dépendances
npm install

# Lancer l'application en mode développement
npm run dev
```

### 3. Application Mobile (`mobile_app`)

L'application mobile native utilisant Expo.

```bash
cd mobile_app

# Installation des dépendances
npm install

# Lancer Expo Go
npx expo start
```

---

## Fonctionnalités Principales

-   **Authentification** : Inscription et connexion pour les clients et prestataires.
-   **Exploration** : Recherche de prestataires par catégorie et localisation.
-   **Profils** : Gestion des profils utilisateurs et prestataires (tarifs, disponibilités, avis).
-   **Messagerie** : Communication en temps réel entre clients et prestataires.
-   **Évaluations** : Système de notation et avis pour les services rendus.

---

## Licence

Ce projet est sous licence MIT.
