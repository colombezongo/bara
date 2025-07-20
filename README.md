# Bara - Plateforme d'emploi intelligente

## 🚀 Hackathon Abihack 2025 - Partenariat Google

Bara est une plateforme révolutionnaire de recherche d'emploi qui utilise l'intelligence artificielle pour connecter les chercheurs d'emploi aux meilleures opportunités, que ce soit dans le secteur formel ou informel en Côte d'Ivoire.

## ✨ Fonctionnalités principales

### Module 1 - Emploi Formel

#### 🔍 Recherche intelligente d'emploi
- **Analyse IA du profil** : L'IA analyse votre CV ou description orale pour proposer les meilleures offres
- **Taux de correspondance** : Chaque offre affiche un pourcentage de match avec votre profil
- **Filtres avancés** : Localisation, type de contrat, expérience, salaire
- **Upload de CV** : Analyse automatique de votre CV pour optimiser la recherche

#### 📝 Création de CV assistée par IA
- **Description orale/écrite** : Décrivez votre profil et l'IA génère un CV professionnel
- **Reconnaissance vocale** : Parlez de votre expérience, l'IA transcrit et structure
- **Génération automatique** : CV Word professionnel généré automatiquement
- **Optimisation IA** : Le CV est optimisé pour maximiser vos chances

#### 🎤 Préparation aux entretiens
- **Simulation d'entretien** : L'IA simule un entretien selon le poste visé
- **Questions adaptées** : Questions techniques, comportementales et culturelles
- **Analyse du ton** : Évaluation de la confiance, clarté et enthousiasme
- **Feedback personnalisé** : Retours détaillés pour s'améliorer

### Module 2 - Emploi Informel

#### 🌍 Accessibilité et inclusion
- **Langues locales** : Interface en français, bambara, dioula et anglais
- **Accessibilité universelle** : Conçu pour tous les niveaux d'alphabétisation
- **Interface intuitive** : Navigation simple et claire

#### 💼 Offres accessibles
- **Posting libre** : N'importe qui peut poster ou consulter des offres
- **Catégories variées** : Ménage, cuisine, transport, jardinage, etc.
- **Géolocalisation** : Recherche par localisation précise

#### ⭐ Système de fiabilité
- **Notation employeurs/employés** : Système de reviews pour éviter les arnaques
- **Profils vérifiés** : Identification des opportunités fiables
- **Historique des transactions** : Suivi des expériences passées

## 🛠️ Technologies utilisées

- **Frontend** : React 18 + TypeScript
- **UI Framework** : Material-UI (MUI) v5
- **Animations** : Framer Motion
- **Routing** : React Router v6
- **Formulaires** : React Hook Form + Yup
- **Icons** : Material Icons + Lucide React
- **Responsive Design** : Mobile-first approach

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd bara-app

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

L'application sera accessible sur `http://localhost:3000`

### Scripts disponibles

```bash
# Démarrage en mode développement
npm start

# Build pour la production
npm run build

# Tests
npm test

# Linting
npm run lint
```

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 📱 **Mobile** : Interface adaptée aux smartphones
- 📱 **Tablette** : Navigation optimisée pour les tablettes
- 💻 **Desktop** : Interface complète pour ordinateurs

## 🎨 Design System

### Couleurs principales
- **Primary** : #1976d2 (Bleu)
- **Secondary** : #dc004e (Rose)
- **Success** : #2e7d32 (Vert)
- **Warning** : #ed6c02 (Orange)

### Typographie
- **Font Family** : Roboto, Helvetica, Arial, sans-serif
- **Hiérarchie claire** : H1, H2, H3, Body, Caption

### Composants
- **Cards** : Bordures arrondies, ombres subtiles
- **Buttons** : Coins arrondis, pas de transformation de texte
- **Forms** : Validation en temps réel, feedback visuel

## 🔧 Architecture

```
src/
├── components/          # Composants réutilisables
│   ├── Navigation.tsx   # Navigation principale
│   └── Footer.tsx       # Pied de page
├── pages/              # Pages de l'application
│   ├── HomePage.tsx     # Page d'accueil
│   ├── JobSearchPage.tsx # Recherche d'emploi
│   ├── CVBuilderPage.tsx # Création de CV
│   ├── InterviewPrepPage.tsx # Préparation entretien
│   ├── InformalJobsPage.tsx # Emplois informels
│   └── ProfilePage.tsx  # Profil utilisateur
├── types/              # Types TypeScript
│   └── index.ts        # Définitions des interfaces
├── utils/              # Utilitaires
├── hooks/              # Hooks personnalisés
└── App.tsx             # Composant racine
```

## 🌟 Fonctionnalités IA

### Reconnaissance vocale
- **Web Speech API** : Pour la saisie vocale
- **Transcription automatique** : Conversion parole → texte
- **Analyse sémantique** : Compréhension du contexte

### Analyse de CV
- **Parsing intelligent** : Extraction des informations clés
- **Matching algorithm** : Correspondance avec les offres
- **Optimisation** : Suggestions d'amélioration

### Simulation d'entretien
- **Questions adaptatives** : Selon le poste et l'expérience
- **Analyse du ton** : Confiance, clarté, enthousiasme
- **Feedback IA** : Suggestions personnalisées

## 🔮 Roadmap

### Phase 1 (Actuelle)
- ✅ Interface utilisateur complète
- ✅ Navigation responsive
- ✅ Pages principales
- ✅ Design system

### Phase 2 (Prochaine)
- 🔄 Intégration API backend
- 🔄 Reconnaissance vocale réelle
- 🔄 Génération de CV Word
- 🔄 Système d'authentification

### Phase 3 (Future)
- 📋 IA conversationnelle
- 📋 Matching avancé
- 📋 Analytics et insights
- 📋 Application mobile

## 🤝 Contribution

Ce projet a été développé pour le hackathon Abihack 2025 en partenariat avec Google.

### Équipe
- **Développeur** : Jean Marcel AKPA
- **Design** : Interface moderne et accessible
- **IA** : Intégration d'algorithmes intelligents

## 📄 Licence

Ce projet est développé dans le cadre du hackathon Abihack 2025.

## 📞 Contact

- **Email** : contact@bara.ci
- **Téléphone** : +225 27 22 49 00 00
- **Localisation** : Abidjan, Côte d'Ivoire

---

**Bara** - Votre partenaire pour trouver l'emploi de vos rêves avec l'IA 🚀 