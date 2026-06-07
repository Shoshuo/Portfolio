<div align="center">

# Portfolio — Joshua

**Portfolio personnel statique — Analyste d'Exploitation @ Le Groupe La Poste**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

[![Site](https://img.shields.io/badge/Site-lanua.fr%2Fportfolio-7C3AED?style=flat-square)](https://lanua.fr/portfolio)
[![License](https://img.shields.io/badge/Licence-Personnel-blue?style=flat-square)](#)
[![Status](https://img.shields.io/badge/Statut-Actif-success?style=flat-square)](#)

> 🔄 **Projet vivant** — ce portfolio est mis à jour et maintenu régulièrement.

</div>

---

## ✨ À propos

Portfolio personnel présentant mon parcours, mes expériences et mes compétences techniques.

Diplômé du **BTS SIO** (Services Informatiques aux Organisations) option **SLAM** — Solutions Logicielles et Applications Métiers, je travaille aujourd'hui en tant qu'**Analyste d'Exploitation** chez **Le Groupe La Poste**.

Le site retrace mon parcours scolaire et professionnel, le détail de mes **6 stages** (de la 3ème au BTS2), mes compétences techniques, ainsi que les projets réalisés en formation et à titre personnel.

Il est entièrement statique, sans framework lourd ni étape de build — tout est chargé directement par le navigateur, ce qui en fait un bon exemple de maîtrise des fondamentaux du web.

---

## 🎯 Caractéristiques

- 🌙 **Dark / light mode** — toggle persistant via `localStorage`
- 🎨 **Design system custom** — tokens CSS, palette violette/cyan, typographie Poppins
- ⚡ **Animations fluides** — IntersectionObserver, scroll progress, parallax, scramble text
- 📱 **Responsive** — adapté mobile, tablette et desktop via media queries
- ♿ **Accessible** — sémantique HTML, contraste, navigation clavier
- 🚫 **Zéro bundler** — pas de Node, pas de Webpack, pas de Vite

---

## 📑 Pages

| Page | Description |
|------|-------------|
| 🏠 `index.html` | Accueil — présentation, domaines de prédilection, hero animé |
| 🛤️ `parcours.html` | Parcours scolaire et professionnel sur timeline interactive |
| 💼 `stages.html` | Détail des **6 stages** (Broussaud Textile, LC-Network, Arène Info, Micro-Rezo, Safran...) |
| 🛠️ `competences.html` | Stack technique et compétences maîtrisées |
| 🚀 `projet.html` | Projets de formation et projets personnels |
| 📄 `documents.html` | CV, certifications, documents téléchargeables |
| 📰 `veille.html` | Veille technologique |

---

## 🧰 Stack technique

<div align="center">

| Frontend | Outils | Hébergement |
|:--:|:--:|:--:|
| HTML5 · CSS3 · JS vanilla | Git · PhpStorm · VS Code | NAS Synology · Cloudflare |
| Bootstrap 4 · Font Awesome | Gitea (auto-sync GitHub) | Domaine custom |

</div>

**Détails :**

- **HTML5 / CSS3** — design system custom (variables CSS, `@property`, dark/light mode)
- **JavaScript vanilla** — `IntersectionObserver`, `requestAnimationFrame`, scroll progress, scramble text
- **Bootstrap 4 alpha** — grille et navbar de base
- **Font Awesome** — iconographie
- **Poppins** (Google Fonts) — typographie

---

## 📂 Structure du projet

```
portfolio/
├── *.html                  # 7 pages principales
├── style.css               # Styles base hérités
├── css/
│   ├── new-design.css      # Design system principal (tokens, navbar, hero)
│   ├── index.css           # Styles spécifiques à l'accueil
│   ├── parcours.css        # Timeline parcours
│   ├── stages.css          # Cards stages, filtres, reading bar
│   ├── competences.css     # Grille compétences
│   ├── projet.css          # Showcase projets
│   ├── responsive.css      # Media queries
│   └── atom.css            # Animation atome (hero)
├── js/
│   ├── theme.js            # Toggle dark/light mode + persistance
│   ├── index.js            # Scramble text, animations hero, RAF loop
│   ├── stages.js           # Filtres, count-up, reading bar
│   ├── parcours.js         # Timeline interactive
│   └── responsive.js       # Comportement mobile
├── images/                 # Logos entreprises, screenshots projets, icônes
└── upload/                 # CV et documents
```

---

## 🚀 Lancer en local

Aucune installation requise — juste un serveur HTTP statique :

```bash
# Avec Python (recommandé)
python -m http.server 8000

# Avec Node
npx serve

# Ou ouvrir directement index.html dans le navigateur
```

Puis ouvrez **http://localhost:8000** dans votre navigateur.

---

## 🔄 Maintenance

Ce portfolio est **activement maintenu** et **mis à jour régulièrement** au fil de mes nouveaux projets, expériences professionnelles et compétences acquises.

---

## 👨‍💻 Auteur

<div align="center">

**Joshua / Shoshuo**

</div>

---

<div align="center">

*Conçu et développé avec ❤️ — sans framework, sans build, juste du web qui marche.*
</div>
