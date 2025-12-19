# ProServices - Application Mobile Expo

Application mobile React Native avec Expo pour la plateforme ProServices.

## Installation

```bash
cd e:\essai\mobile_app
npm install
```

## Configuration API

Modifiez l'URL de l'API dans `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://VOTRE_IP:8000/api';
```

Remplacez `VOTRE_IP` par l'adresse IP de votre machine sur le réseau local.

## Démarrage

1. **Backend Laravel** (dans un terminal séparé):
```bash
cd e:\essai\backend_app
php artisan serve --host=0.0.0.0
```

2. **Application Expo**:
```bash
cd e:\essai\mobile_app
npx expo start
```

3. Scannez le QR code avec **Expo Go** sur votre téléphone.

## Structure

```
app/
├── (auth)/          # Écrans d'authentification
│   ├── login.tsx
│   └── register.tsx
├── (user)/          # Espace utilisateur
│   ├── index.tsx    # Accueil + fil d'actualité
│   ├── explorer.tsx # Recherche prestataires
│   ├── messages.tsx # Messagerie
│   └── profile.tsx  # Profil utilisateur
├── (provider)/      # Espace prestataire
│   ├── index.tsx    # Dashboard
│   ├── posts.tsx    # Gestion publications
│   ├── messages.tsx # Messagerie
│   └── profile.tsx  # Profil prestataire
└── _layout.tsx      # Layout racine
```

## Fonctionnalités

### Utilisateur (Client)
- Connexion / Inscription
- Fil d'actualité avec posts
- Recherche de prestataires
- Filtres par domaine
- Messagerie instantanée
- Gestion du profil
- Option "Devenir Prestataire"

### Prestataire
- Dashboard avec statistiques
- Création/suppression de posts
- Upload d'images multiples
- Messagerie avec clients
- Gestion de la bio et domaines
