# 🍋 Zest Lab - Cocktail Factory

Bienvenue dans **Zest Lab**, un projet pédagogique développé par un groupe de 7 étudiants en 1ère et 2ème année de Bachelor Informatique dans le cadre de l’année scolaire 2024–2025.

Ce projet vous plonge dans un univers rafraîchissant où vous pouvez **découvrir, créer et personnaliser des cocktails** à partir d’une base de données d’ingrédients, le tout dans une interface mobile-first fun et intuitive !

---

## 🧑‍💻 Équipe

- Groupe de 7 étudiants
- Bachelor Informatique – Année 2024–2025
- Répartition front/back et base de données collaborative

---

## 🔧 Technologies utilisées

### Frontend
- HTML5 / CSS3
- JavaScript Vanilla
- Design Mobile first
- UI/UX personnalisée

### Backend
- Node.js + Express
- API REST développée sur mesure
- Base de données **SQLite**

---

## 📸 Aperçu visuel

### Écrans principaux :

| Accueil                  | Match Cocktails           | Recherche               |
|--------------------------|--------------------------|--------------------------|
| ![Accueil](screens/1.png) | ![Match](screens/2.png) | ![Recherche](screens/4.png) |

| Sélection d’ingrédients       | Résultats recommandés         | Fiche cocktail détaillée|
|-------------------------------|-------------------------------|-------------------------|
| ![Ingrédients](screens/5.png) | ![Recommandés](screens/7.png) | ![Fiche](screens/8.png) |

---

## 🧪 Fonctionnalités principales

- 🔍 **Recherche de cocktails par nom**  
  Trouvez rapidement un cocktail en tapant son nom.

- 🍸 **Découverte aléatoire de cocktails**  
  Parcourez des cocktails proposés au hasard, avec possibilité de passer ou d’afficher la recette.

- 🧠 **Suggestion intelligente**  
  Sélectionnez les ingrédients que vous possédez et obtenez la liste des cocktails réalisables.

- 📋 **Fiche détaillée de cocktail**  
  Consultez la fiche complète d’un cocktail : ingrédients, recette, instructions, photo.

- 📝 **Ajout de cocktails (admin)**  
  Ajoutez un nouveau cocktail via le dashboard admin, avec gestion de la photo et des ingrédients.

- 🧂 **Gestion des ingrédients**  
  Ajoutez, recherchez et sélectionnez des ingrédients pour personnaliser vos recherches.

- 📷 **Upload de photo pour chaque cocktail**  
  Lors de l’ajout d’un cocktail, une photo peut être téléchargée et sera affichée dans la fiche.

- 🗂️ **Documentation API Swagger**  
  Accédez à la documentation interactive de l’API pour tester toutes les routes.

---

## 🚀 Comment utiliser le site

### 1. Lancer le backend

```bash
cd backend
npm install
node api.js
```
L’API est exposée sur [http://localhost:3000](http://localhost:3000).

### 2. Lancer le frontend

Ouvrez le fichier `frontend/index.html` dans votre navigateur (ou servez le dossier avec Live Server).

### 3. Utilisation des pages

- **Accueil** : Choisissez entre découvrir des cocktails ou ajouter vos ingrédients.
- **Découvrir** : Parcourez des cocktails proposés aléatoirement, affichez la recette ou passez au suivant.
- **Ajouter** : Sélectionnez vos ingrédients, puis découvrez les cocktails réalisables.
- **Recherche** : Recherchez un cocktail par nom ou par ingrédients.
- **Fiche cocktail** : Consultez la fiche détaillée d’un cocktail.
- **Admin** : Accédez à `/admin.html` pour ajouter un nouveau cocktail (nom, ingrédients, instructions, photo).

---

## 📚 Accéder à la documentation Swagger

La documentation interactive de l’API est disponible à l’adresse suivante :  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Vous pouvez aussi obtenir le JSON Swagger brut sur :  
[http://localhost:3000/swagger.json](http://localhost:3000/swagger.json)

---

## 📁 Structure du projet
```
.
├── backend/               → Serveur Express + API + SQLite
├── frontend/              → HTML/CSS/JS (pages + composants)
├── public/img             → Illustrations, photos de cocktails
├── README.md              → Vous êtes ici 🍹
```

---

## 📌 Objectifs pédagogiques
- 💡 Apprentissage du modèle client/serveur
- 🔄 Compréhension du fonctionnement d’une API REST
- 🎨 Développement d’un frontend interactif sans framework
- 🧩 Gestion de projet en équipe et intégration continue





