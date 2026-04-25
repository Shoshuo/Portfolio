# Portfolio — Joshua Bethoule-Voisin

Portfolio personnel statique présentant mon parcours, mes stages, mes compétences et mes projets dans le cadre du **BTS SIO** (Services Informatiques aux Organisations).

🔗 **Site en ligne :** [joshuabv.fr](https://joshuabv.fr) <!-- adapte si besoin -->

---

## Aperçu

Site multi-pages en HTML/CSS/JS vanilla, sans build system. Design dark-first avec mode clair, animations CSS soignées, et accent sur la lisibilité du contenu technique.

## Pages

| Page | Contenu |
|------|---------|
| `index.html` | Profil — accueil, présentation, domaines |
| `parcours.html` | Parcours scolaire et professionnel (timeline) |
| `stages.html` | Détail des 6 stages effectués (3ème → BTS2) |
| `competences.html` | Stack technique et compétences maîtrisées |
| `projet.html` | Projets réalisés en formation et personnels |
| `documents.html` | CV, certifications, documents téléchargeables |
| `veille.html` | Veille technologique |

## Stack

- **HTML5 / CSS3** — sans framework, design system custom (variables CSS, dark/light mode)
- **JavaScript vanilla** — animations légères, IntersectionObserver, scroll progress
- **Bootstrap 4 alpha** — grille et navbar de base
- **Font Awesome** — iconographie
- **Poppins** (Google Fonts) — typographie

Pas de bundler, pas de Node — tout est chargé directement par le navigateur.

## Structure

```
portfolio/
├── *.html                # Pages
├── style.css             # Styles base hérités
├── css/
│   ├── new-design.css    # Design system principal (tokens, navbar, hero, sections)
│   ├── index.css         # Styles spécifiques à index.html
│   ├── parcours.css      # Spécifiques parcours
│   ├── stages.css        # Spécifiques stages
│   ├── responsive.css    # Media queries
│   └── ...
├── js/
│   ├── theme.js          # Toggle dark/light mode
│   ├── index.js          # Scramble text, animations hero
│   ├── stages.js         # Filtres, count-up, reading bar
│   ├── parcours.js       # Timeline interactive
│   └── ...
└── images/               # Assets visuels
```

## Lancer en local

Aucune installation, juste un serveur HTTP statique :

```bash
# Avec Python
python -m http.server 8000

# Avec Node (si installé)
npx serve

# Ou ouvrir directement index.html dans le navigateur
```

Puis : `http://localhost:8000`

## Auteur

**Joshua Bethoule-Voisin** — Étudiant BTS SIO option SLAM

- LinkedIn : [linkedin.com/in/joshua-bethoule-voisin](https://www.linkedin.com/in/joshua-bethoule-voisin-097549292/)
- GitHub : [@Shoshuo](https://github.com/Shoshuo)
- Email : joshuabv2005@gmail.com
