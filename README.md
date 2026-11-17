# Nouvel Techno — Site web du centre de formation

Site statique complet (HTML5 / CSS3 / JavaScript ES6, sans framework ni dépendance)
pour le centre de formation **Nouvel Techno** — Médenine, Tunisie.

## Démarrage rapide

Aucune installation nécessaire : ouvrez `index.html` dans un navigateur.
(recommandé : servir via un petit serveur local, ex. `python3 -m http.server`)

## Structure du projet

```
nouvel-techno/
├── index.html            Page d'accueil
├── formations.html       Catalogue filtrable + calendrier des sessions
├── a-propos.html         Mission, valeurs, méthode, FAQ
├── formateurs.html       Équipe pédagogique
├── temoignages.html      Retours des apprenants
├── blog.html             Actualités IA / data / dev / métiers tech
├── contact.html          Contact + devis entreprise + Google Maps
├── inscription.html      Formulaire d'inscription
├── admin.html            ⚠ ADMINISTRATION CACHÉE (non liée au site public)
├── css/
│   ├── style.css         Design system du site public
│   └── admin.css         Styles de l'administration
├── js/
│   ├── data.js           Données du site (source unique)
│   ├── main.js           Interactions du site public
│   └── admin.js          Logique de l'administration
├── data/
│   └── site-content.txt  Fichier texte d'administration (bloc-notes)
├── images/               Logo, illustrations, avatars, couvertures (SVG)
├── videos/               Emplacement réservé aux vidéos du centre
└── documents/            Brochure PDF téléchargeable
```

## Administration

- **Page cachée** : `admin.html` — mot de passe par défaut **`nouvel2026`**
  (modifiable dans l'onglet Paramètres). Cette page n'est liée depuis aucune
  page publique ; pensez à la protéger côté serveur en production
  (ex. `.htaccess` + `.htpasswd`).
- **Fichier texte** : `data/site-content.txt` — miroir « bloc-notes » du
  contenu ; le bloc JSON qu'il contient peut être importé via l'admin.
- Les modifications faites dans l'admin sont stockées dans le navigateur
  (localStorage) et visibles immédiatement. Pour les rendre permanentes pour
  tous les visiteurs, reportez-les dans `js/data.js`.

## À personnaliser avant mise en ligne

1. Numéro de téléphone / WhatsApp : `js/data.js` (clé `infos`) **et** les liens
   `wa.me/216900000000` dans les pages HTML.
2. E-mail de contact : `js/data.js` + formulaires (brancher un service d'envoi
   réel : Formspree, EmailJS ou votre backend — voir `sauverMessage` dans
   `js/main.js`).
3. Liens réseaux sociaux dans les pieds de page.
4. Photos réelles des formateurs : remplacer les SVG dans `images/equipe/`.
5. Coordonnées GPS exactes de l'iframe Google Maps dans `contact.html`.
