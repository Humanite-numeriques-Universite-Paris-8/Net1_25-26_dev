# Instructions pour les agents (Copilot / AI)

But : aider un agent à être productif immédiatement dans ce dépôt statique de cours/TP.

- **Nature du projet**: site statique composé principalement de pages HTML (cours1..4, projets/), d'une librairie D3 (assets/d3.v7.min.js) et de fichiers CSV dans `data/` qui alimentent les visualisations.
- **Pas de build**: il n'y a pas de `package.json` ni de pipeline de build. Tester localement se fait en ouvrant les fichiers via un serveur statique (ex. `python -m http.server 8000`) ou l'extension "Live Server".

Exemples de points d'intégration découverts :
- Les pages chargent D3 depuis `assets/d3.v7.min.js` (ex: [assets/d3.v7.min.js](assets/d3.v7.min.js)).
- Les visualisations lisent des CSV distants ou locaux via `d3.csv(...)`. Exemples observés dans [cours4.html](cours4.html#L1): `d3.csv(urlCSVevals)` et `d3.csv(urlCSVetus)` pour charger `EvaluationProjetsEtudiants.csv` / listes d'étudiants.

Conventions spécifiques au dépôt :
- Emplacement des données : `data/` (ex. [data/ListeEtudiants.csv](data/ListeEtudiants.csv), [data/EvaluationProjetsEtudiants.csv](data/EvaluationProjetsEtudiants.csv)).
- Librairies JS : placer les bibliothèques dans `assets/` et référencer depuis les pages HTML.
- Projets étudiants : chaque projet est un fichier HTML dans `projets/` (noms ressemblant à `prenomnom-projet1.html`).

Patterns de code récurrents à respecter :
- Chargement CSV via D3 puis traitement avec `d3.group`, `d3.select(...).data(...)` et fonctions de calcul centralisées (voir les fonctions `calculerNoteProjet` / `calculerNoteEvaluateur` dans [cours4.html](cours4.html#L1)).
- Manipulation de dates et filtrage: attention aux formats locaux dans `Date.parse()` (ex: filtre sur "16/12/2025 15:00:00").

Conseils pratiques pour l'agent :
- Pour tester les pages localement, lancer : `python -m http.server 8000` depuis la racine puis ouvrir `http://localhost:8000/cours4.html`.
- Ne pas modifier `assets/d3.v7.min.js` — plutôt ajouter une copie si besoin d'une version différente.
- Quand vous modifiez une page, vérifier les chemins relatifs (ex. `assets/` et `data/`) et tester via serveur local (les chargements CSV échouent souvent en `file://` à cause de CORS).
- Respecter les noms de colonnes des CSVs — les scripts font beaucoup de recherche par nom de colonne (ex: `d['Votre compte GitHub']`, `d['Nom du créateur']`).

Exemples de tâches guidées que l'agent peut effectuer :
- Ajouter une nouvelle visualisation : créer `projets/nom-prenom-projet1.html`, inclure `assets/d3.v7.min.js`, charger `data/...csv` avec `d3.csv(...)` et utiliser `d3.select(...).data(...).enter()`.
- Corriger un calcul : localiser la fonction (ex. `calculerNoteProjet` dans [cours4.html](cours4.html#L1)), ajouter tests manuels via navigateur et valider contre un sous-ensemble du CSV.

PR & style :
- Faire de petits commits ciblés (une page / un CSV modifié par PR). Décrire dans la PR le fichier CSV mis à jour et pourquoi (format/colonnes impactées).

Questions ouvertes (demander au mainteneur si besoin) :
- Existe-t-il une source unique des CSV (Google Sheets publique vs copies locales) à privilégier pour tests automatisés ?
- Y a-t-il une convention stricte de nommage pour les fichiers HTML des projets (ordre prénom/nom, séparateurs) ?

Si tu veux, je peux : lancer un serveur local ici, ajouter des exemples de snippets prêts à coller (chargement CSV + graphique simple), ou adapter ce document selon vos préférences.
