# 🛒 Boutique MR – Application e-commerce

Application e-commerce front-end en **HTML / CSS / JavaScript vanilla**

## 📌 À propos

**Boutique MR** est une application e-commerce sans framework ni backend, démontrant :
- Une architecture claire et maintenable
- Gestion complète des données côté front
- Système de panier, authentification et administration
- Logique proche d'une vraie application e-commerce

> Toutes les données sont stockées en **localStorage** (simulation de base de données).

---

## 🚀 Fonctionnalités principales

### 👤 Authentification
- Connexion utilisateur / administrateur
- Session stockée en localStorage
- Accès admin protégé
- Déconnexion

### 🛍️ Produits
- Affichage dynamique des produits
- Page produit dédiée (`product.html?id=...`)
- Gestion du stock avec suppression automatique
- Filtrage par catégories

### 🛒 Panier
- Ajout/suppression de produits
- Gestion des quantités
- Calcul automatique du total
- Validation de commande avec vérification et décrémentation du stock

### 🔐 Administration (Admin uniquement)
- **CRUD complet** : ajout, modification, suppression de produits
- Gestion du stock et des catégories
- Interface dédiée

---

## 🧑‍💻 Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@mr.com` | `admin123` |
| User | Quelconque | `password123` |

---

## 🧱 Structure du projet

```
boutique-MR/
├── index.html          # Accueil / listing produits
├── product.html        # Détail produit
├── cart.html           # Panier
├── login.html          # Connexion
├── account.html        # Compte utilisateur
├── admin.html          # Interface admin
├── products.json       # Données initiales
├── styles.css          # Styles globaux
└── js/
  ├── auth.js         # Authentification + guards
  ├── db.js           # localStorage
  ├── cart.js         # Logique panier
  ├── index.js        # Page accueil
  ├── product.js      # Page produit
  ├── cart-page.js    # Page panier
  └── admin.js        # CRUD admin
```

---

## 🗃️ Gestion des données

**Base de données** : Produits initialisés depuis `products.json`, puis stockés en localStorage

**Structure panier** :
```json
{
  "id": "aj4",
  "name": "Air Jordan 4",
  "price": 29.99,
  "qty": 2
}
```

---

## 🔐 Sécurité (Front-end)

⚠️ **Note** : Ce projet est **100% front-end** (pas de backend, pas de vraie sécurité serveur).

- Accès admin/utilisateur protégés par guards
- Redirections automatiques si accès non autorisé
- Validation des champs côté admin

---

## 🛠️ Technologies

- **HTML5** • **CSS3** • **JavaScript (ES Modules)**
- **localStorage** • **Git / GitHub**

---

## 📈 Objectifs pédagogiques

✅ Architecture front-end claire  
✅ Gestion de données sans backend  
✅ Patterns proches du backend (CRUD, guards)  
✅ JavaScript vanilla  
✅ Structuration d'un projet réel

---

## 💡 Améliorations possibles

- [ ] Gestion avancée des quantités
- [ ] Recherche et tri (prix, nom)
- [ ] Upload d'images
- [ ] Backend (Node.js / API REST)
- [ ] Authentification sécurisée


---

## 👨‍💻 Auteur

Développé par **Marty Rabord**  
Projet pédagogique – Montée en compétence JavaScript & architecture front-end

