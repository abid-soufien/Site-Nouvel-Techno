/* ==========================================================================
   NOUVEL TECHNO — JavaScript principal (js/main.js)
   --------------------------------------------------------------------------
   JavaScript ES6 vanilla, sans bibliothèque externe.
   Fonctionnalités :
   1.  Menu mobile (ouverture/fermeture)
   2.  Animations "reveal" au scroll (IntersectionObserver)
   3.  Rendu dynamique : formations, sessions, formateurs, témoignages, blog
   4.  Filtres de formations (catégorie, niveau, format, durée)
   5.  Compte à rebours vers la prochaine session
   6.  Formulaire d'inscription / contact / devis (validation + sauvegarde)
   7.  Newsletter
   8.  Témoignages : carrousel simple
   9.  Blog : lecture d'article dans une modale
   10. Bouton "retour en haut" + toasts
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
   1. MENU MOBILE
   -------------------------------------------------------------------------- */
function initialiserMenuMobile() {
  const bouton = document.querySelector(".btn-menu");
  const panneau = document.querySelector(".nav-mobile");
  if (!bouton || !panneau) return;

  bouton.addEventListener("click", () => {
    const ouvert = panneau.classList.toggle("ouvert");
    bouton.classList.toggle("ouvert", ouvert);
    bouton.setAttribute("aria-expanded", ouvert);
  });

  /* Fermeture du panneau après clic sur un lien */
  panneau.querySelectorAll("a").forEach(lien =>
    lien.addEventListener("click", () => {
      panneau.classList.remove("ouvert");
      bouton.classList.remove("ouvert");
    })
  );
}

/* --------------------------------------------------------------------------
   2. ANIMATIONS AU SCROLL
   -------------------------------------------------------------------------- */
function initialiserReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observateur = new IntersectionObserver(entrees => {
    entrees.forEach(entree => {
      if (entree.isIntersecting) {
        entree.target.classList.add("visible");
        observateur.unobserve(entree.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observateur.observe(el));
}

/* --------------------------------------------------------------------------
   3. RENDU DYNAMIQUE DES CONTENUS
   -------------------------------------------------------------------------- */

/** Échappe le HTML pour éviter toute injection dans les contenus dynamiques */
function echapper(texte) {
  const div = document.createElement("div");
  div.textContent = String(texte);
  return div.innerHTML;
}

/** Badge coloré selon le niveau */
function badgeNiveau(niveau) {
  const libelles = { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" };
  return `<span class="badge badge-${niveau}">${libelles[niveau] || niveau}</span>`;
}

/** Badge du format (présentiel / en ligne / hybride) */
function badgeFormat(format) {
  const libelles = { presentiel: "Présentiel", ligne: "En ligne", hybride: "Hybride" };
  return `<span class="badge badge-format">${libelles[format] || format}</span>`;
}

/** Carte formation complète (utilisée page Formations et page Accueil) */
function carteFormation(f, compacte = false) {
  const donnees = obtenirDonnees();
  const boutonPrincipal = f.prix === "Sur demande"
    ? `<a class="btn btn-contour" href="contact.html?type=devis">Demander un devis</a>`
    : `<a class="btn btn-primaire" href="inscription.html?formation=${f.id}">S'inscrire</a>`;

  return `
  <article class="carte carte-formation reveal">
    <div class="icone">${f.icone}</div>
    <h3>${echapper(f.titre)}</h3>
    <div class="meta">
      <span class="badge badge-categorie">${libelleCategorie(f.categorie)}</span>
      ${badgeNiveau(f.niveau)}
      ${badgeFormat(f.format)}
    </div>
    <p style="color:var(--gris-texte);font-size:.93rem;">${echapper(f.resume)}</p>
    ${compacte ? "" : `
    <ul class="details">
      <li><b>Durée :</b> ${echapper(f.duree)}</li>
      ${f.competences.slice(0, 4).map(c => `<li>${echapper(c)}</li>`).join("")}
    </ul>
    <details>
      <summary>Prérequis & certificat</summary>
      <p><b>Prérequis :</b> ${echapper(f.prerequis)}</p>
      <p><b>Certificat :</b> ${echapper(f.certificat)}</p>
    </details>
    <p class="prix">${f.prix === "Sur demande" ? "Prix : sur demande" : echapper(f.prix)}</p>`}
    <div class="actions">
      ${boutonPrincipal}
      <a class="btn btn-contour" href="contact.html?type=info">En savoir plus</a>
    </div>
  </article>`;
}

/** Libellé lisible d'une catégorie */
function libelleCategorie(cle) {
  const libelles = {
    ia: "IA & Data", dev: "Développement", cyber: "Cybersécurité",
    cloud: "Cloud", entreprise: "Entreprises"
  };
  return libelles[cle] || cle;
}

/** Injecte les formations dans un conteneur (avec filtres optionnels) */
function rendreFormations(idConteneur, filtres = null) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  let formations = obtenirDonnees().formations;

  /* Application des filtres actifs (page Formations) */
  if (filtres) {
    const v = cible => document.getElementById(cible)?.value || "tous";
    const cat = v("filtre-categorie");
    const niv = v("filtre-niveau");
    const fmt = v("filtre-format");
    const dur = v("filtre-duree");

    formations = formations.filter(f =>
      (cat === "tous" || f.categorie === cat) &&
      (niv === "tous" || f.niveau === niv) &&
      (fmt === "tous" || f.format === fmt) &&
      passeFiltreDuree(f.duree, dur)
    );
  }

  conteneur.innerHTML = formations.length
    ? formations.map(f => carteFormation(f, !filtres)).join("")
    : `<p class="resultat-vide">Aucune formation ne correspond à ces critères. Essayez d'élargir votre recherche.</p>`;

  /* Ré-activer les animations sur les cartes nouvellement créées */
  initialiserReveal();
}

/** Test de la durée : court (< 1 mois), moyen (1-3 mois), long (> 3 mois) */
function passeFiltreDuree(duree, filtre) {
  if (filtre === "tous") return true;
  const mois = parseInt(duree, 10) || 0;
  const surMesure = /sur mesure/i.test(duree);
  if (filtre === "court") return surMesure || mois <= 1;
  if (filtre === "moyen") return mois > 1 && mois <= 3;
  if (filtre === "long") return mois > 3;
  return true;
}

/** Calendrier des prochaines sessions */
function rendreSessions(idConteneur, limite = 0) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
                "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const sessions = obtenirDonnees().sessions
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter(s => new Date(s.date) >= new Date(new Date().toDateString()))
    .slice(0, limite || undefined);

  conteneur.innerHTML = sessions.length ? sessions.map(s => {
    const d = new Date(s.date + "T00:00:00");
    return `
    <div class="ligne-session reveal">
      <div class="date">
        <div class="jour">${d.getDate()}</div>
        <div class="mois">${mois[d.getMonth()]}</div>
      </div>
      <div>
        <h3>${echapper(nomFormation(s.formationId))}</h3>
        <p class="infos">${echapper(s.horaire)} • ${echapper(s.lieu)} • ${s.places} places</p>
      </div>
      <a class="btn btn-primaire" href="inscription.html?formation=${s.formationId}">Réserver</a>
    </div>`;
  }).join("") : `<p class="resultat-vide">De nouvelles sessions seront bientôt annoncées.</p>`;

  initialiserReveal();
}

/** Grille complète de témoignages (page Témoignages) */
function rendreGrilleTemoignages(idConteneur) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  conteneur.innerHTML = obtenirDonnees().temoignages.map(t => `
    <article class="carte carte-temoignage reveal">
      <div class="guillemet">“</div>
      <blockquote>${echapper(t.texte)}</blockquote>
      <div class="etoiles">${"★".repeat(t.note)}${"☆".repeat(5 - t.note)}</div>
      <div class="auteur" style="margin-top:14px;">
        <div class="avatar">${echapper(t.nom.split(" ").map(m => m[0]).join("").slice(0, 2))}</div>
        <div>
          <b>${echapper(t.nom)}</b><br>
          <small style="color:var(--gris-texte);">${echapper(t.role)} — ${echapper(t.formation)}</small>
        </div>
      </div>
    </article>`).join("");
  initialiserReveal();
}

/** Cartes formateurs */
function rendreFormateurs(idConteneur) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;
  conteneur.innerHTML = obtenirDonnees().formateurs.map(f => `
    <article class="carte carte-formateur reveal">
      <img src="images/equipe/${f.id}.svg" alt="Portrait de ${echapper(f.nom)}" onerror="this.src='images/equipe/generique.svg'">
      <h3>${echapper(f.nom)}</h3>
      <p class="role">${echapper(f.specialite)}</p>
      <p class="bio">${echapper(f.experience)}</p>
      <p class="bio">${echapper(f.bio)}</p>
      <div class="reseaux">
        <a href="#" aria-label="Profil LinkedIn de ${echapper(f.nom)}" title="LinkedIn">in</a>
        <a href="#" aria-label="Profil GitHub de ${echapper(f.nom)}" title="GitHub">GH</a>
      </div>
    </article>`).join("");
  initialiserReveal();
}

/** Témoignages (carrousel : un témoignage visible à la fois) */
let indexTemoignage = 0;

function rendreTemoignages(idConteneur) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;
  const temoignages = obtenirDonnees().temoignages;
  if (!temoignages.length) { conteneur.innerHTML = ""; return; }

  const t = temoignages[indexTemoignage % temoignages.length];
  conteneur.innerHTML = `
    <article class="carte carte-temoignage">
      <div class="guillemet">“</div>
      <blockquote>${echapper(t.texte)}</blockquote>
      <div class="etoiles">${"★".repeat(t.note)}${"☆".repeat(5 - t.note)}</div>
      <div class="auteur" style="margin-top:14px;">
        <div class="avatar">${echapper(t.nom.split(" ").map(m => m[0]).join("").slice(0, 2))}</div>
        <div>
          <b>${echapper(t.nom)}</b><br>
          <small style="color:var(--gris-texte);">${echapper(t.role)} — ${echapper(t.formation)}</small>
        </div>
      </div>
    </article>
    <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;">
      <button class="btn btn-contour" id="temoin-precedent" aria-label="Témoignage précédent">←</button>
      <button class="btn btn-contour" id="temoin-suivant" aria-label="Témoignage suivant">→</button>
    </div>`;

  document.getElementById("temoin-precedent").addEventListener("click", () => {
    indexTemoignage = (indexTemoignage - 1 + temoignages.length) % temoignages.length;
    rendreTemoignages(idConteneur);
  });
  document.getElementById("temoin-suivant").addEventListener("click", () => {
    indexTemoignage = (indexTemoignage + 1) % temoignages.length;
    rendreTemoignages(idConteneur);
  });
}

/** Grille d'articles de blog */
function rendreArticles(idConteneur, limite = 0) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  const articles = obtenirDonnees().articles
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limite || undefined);

  const optionsDate = { day: "numeric", month: "long", year: "numeric" };

  conteneur.innerHTML = articles.map(a => `
    <article class="carte carte-article reveal">
      <img src="images/blog/${a.id}.svg" alt="Illustration : ${echapper(a.titre)}" onerror="this.style.display='none'">
      <div class="corps">
        <span class="badge badge-categorie">${libelleCategorie(a.categorie)}</span>
        <h3>${echapper(a.titre)}</h3>
        <time datetime="${a.date}">${new Date(a.date + "T00:00:00").toLocaleDateString("fr-FR", optionsDate)}</time>
        <p style="color:var(--gris-texte);font-size:.92rem;">${echapper(a.extrait)}</p>
        <a href="#" class="lire" data-article="${a.id}">Lire l'article →</a>
      </div>
    </article>`).join("");

  /* Ouverture de l'article complet dans une modale */
  conteneur.querySelectorAll("[data-article]").forEach(lien =>
    lien.addEventListener("click", e => {
      e.preventDefault();
      ouvrirArticle(lien.dataset.article);
    })
  );
  initialiserReveal();
}

/** Modale de lecture d'un article */
function ouvrirArticle(id) {
  const article = obtenirDonnees().articles.find(a => a.id === id);
  if (!article) return;

  const fond = document.getElementById("modale-article");
  const boite = document.getElementById("contenu-article");
  if (!fond || !boite) return;

  boite.innerHTML = `
    <span class="badge badge-categorie">${libelleCategorie(article.categorie)}</span>
    <h2 style="margin:12px 0 6px;">${echapper(article.titre)}</h2>
    <time datetime="${article.date}" style="color:var(--gris-texte);font-size:.85rem;">
      Publié le ${new Date(article.date + "T00:00:00").toLocaleDateString("fr-FR")}
    </time>
    ${article.contenu.split("\n\n").map(p => `<p style="margin-top:14px;color:var(--gris-texte);">${echapper(p)}</p>`).join("")}
    <div style="margin-top:24px;">
      <a class="btn btn-primaire" href="formations.html">Découvrir nos formations</a>
    </div>`;

  fond.classList.add("ouverte");
}

/** Fermeture des modales (croix + clic extérieur + touche Échap) */
function initialiserModales() {
  document.querySelectorAll(".modale-fond").forEach(fond => {
    fond.addEventListener("click", e => {
      if (e.target === fond || e.target.closest(".fermer")) fond.classList.remove("ouverte");
    });
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") document.querySelectorAll(".modale-fond.ouverte")
      .forEach(fond => fond.classList.remove("ouverte"));
  });
}

/* --------------------------------------------------------------------------
   4. COMPTE À REBOURS (prochaine session)
   -------------------------------------------------------------------------- */
function initialiserCompteARebours() {
  const cadran = document.getElementById("compte-a-rebours");
  if (!cadran) return;

  const prochaine = obtenirDonnees().sessions
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .find(s => new Date(s.date + "T00:00:00") >= new Date(new Date().toDateString()));

  const cible = document.getElementById("session-cible");
  if (prochaine && cible) {
    const d = new Date(prochaine.date + "T00:00:00");
    cible.textContent = `Prochaine session : ${nomFormation(prochaine.formationId)} — ${d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
  }
  if (!prochaine) { cadran.closest(".section")?.style.setProperty("display", "none"); return; }

  const echeance = new Date(prochaine.date + "T08:00:00").getTime();

  const maj = () => {
    const reste = Math.max(0, echeance - Date.now());
    const jours = Math.floor(reste / 86400000);
    const heures = Math.floor(reste % 86400000 / 3600000);
    const minutes = Math.floor(reste % 3600000 / 60000);
    const secondes = Math.floor(reste % 60000 / 1000);

    const valeurs = {
      "car-jours": jours, "car-heures": heures,
      "car-minutes": minutes, "car-secondes": secondes
    };
    Object.entries(valeurs).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val).padStart(2, "0");
    });
  };

  maj();
  setInterval(maj, 1000);
}

/* --------------------------------------------------------------------------
   5. FORMULAIRES (inscription, contact, devis, newsletter)
   --------------------------------------------------------------------------
   Les envois sont sauvegardés dans le navigateur (localStorage, clé
   "nouvel_techno_messages") et consultables depuis l'administration.
   En production, remplacer par un envoi vers votre serveur ou un service
   de type Formspree / EmailJS.
   -------------------------------------------------------------------------- */
function sauverMessage(type, contenu) {
  const cle = "nouvel_techno_messages";
  let messages = [];
  try { messages = JSON.parse(localStorage.getItem(cle)) || []; } catch (e) { messages = []; }
  messages.push({ id: Date.now(), type, date: new Date().toISOString(), ...contenu });
  localStorage.setItem(cle, JSON.stringify(messages));
}

/** Valide un champ obligatoire + format e-mail ; retourne true si tout est bon */
function validerFormulaire(formulaire) {
  let valide = true;

  formulaire.querySelectorAll("[required]").forEach(champ => {
    const groupe = champ.closest(".groupe");
    const ok = champ.value.trim() !== "" &&
      (champ.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champ.value));
    groupe?.classList.toggle("invalide", !ok);
    if (!ok) valide = false;
  });

  return valide;
}

/** Branche commune : intercepte l'envoi, valide, sauvegarde, confirme */
function brancherFormulaire(id, type, transformation) {
  const formulaire = document.getElementById(id);
  if (!formulaire) return;

  formulaire.addEventListener("submit", e => {
    e.preventDefault();
    if (!validerFormulaire(formulaire)) {
      afficherToast("Veuillez corriger les champs en rouge.");
      return;
    }

    sauverMessage(type, transformation(formulaire));

    /* Confirmation visuelle + réinitialisation */
    const succes = formulaire.querySelector(".message-succes");
    if (succes) {
      succes.classList.add("visible");
      succes.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    afficherToast("Votre message a bien été envoyé. Merci !");
    formulaire.reset();
    setTimeout(() => succes?.classList.remove("visible"), 8000);
  });
}

/** Pré-remplit la formation choisie depuis l'URL (?formation=dev-web) */
function preRemplirInscription() {
  const select = document.getElementById("ins-formation");
  if (!select) return;

  const idFormation = new URLSearchParams(location.search).get("formation");
  if (idFormation) select.value = idFormation;

  /* Remplit le menu déroulant avec les formations actives */
  select.innerHTML = `<option value="">— Choisir une formation —</option>` +
    obtenirDonnees().formations.map(f =>
      `<option value="${f.id}" ${f.id === idFormation ? "selected" : ""}>${echapper(f.titre)}</option>`
    ).join("");
}

/* --------------------------------------------------------------------------
   6. NEWSLETTER
   -------------------------------------------------------------------------- */
function initialiserNewsletter() {
  document.querySelectorAll("form[data-newsletter]").forEach(formulaire =>
    formulaire.addEventListener("submit", e => {
      e.preventDefault();
      const champ = formulaire.querySelector("input[type='email']");
      if (!champ || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champ.value)) {
        afficherToast("Merci de saisir une adresse e-mail valide.");
        return;
      }
      sauverMessage("newsletter", { email: champ.value });
      afficherToast("Inscription à la newsletter confirmée !");
      formulaire.reset();
    })
  );
}

/* --------------------------------------------------------------------------
   7. TOASTS & BOUTON RETOUR EN HAUT
   -------------------------------------------------------------------------- */
let minuteurToast = null;

function afficherToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(minuteurToast);
  minuteurToast = setTimeout(() => toast.classList.remove("visible"), 4000);
}

function initialiserRetourHaut() {
  const bouton = document.querySelector(".btn-haut");
  if (!bouton) return;
  window.addEventListener("scroll", () =>
    bouton.classList.toggle("visible", window.scrollY > 500), { passive: true });
  bouton.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* --------------------------------------------------------------------------
   INITIALISATION GLOBALE
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initialiserMenuMobile();
  initialiserReveal();
  initialiserModales();
  initialiserCompteARebours();
  initialiserNewsletter();
  initialiserRetourHaut();
  preRemplirInscription();

  /* Rendus conditionnels selon les conteneurs présents dans la page */
  rendreFormations("liste-formations", document.getElementById("filtre-categorie"));
  rendreFormations("accueil-formations");
  rendreSessions("liste-sessions");
  rendreSessions("accueil-sessions", 3);
  rendreFormateurs("liste-formateurs");
  rendreTemoignages("accueil-temoignage");
  rendreGrilleTemoignages("grille-temoignages");
  rendreArticles("accueil-articles", 3);
  rendreArticles("liste-articles");

  /* Filtres de la page Formations */
  ["filtre-categorie", "filtre-niveau", "filtre-format", "filtre-duree"].forEach(id =>
    document.getElementById(id)?.addEventListener("change",
      () => rendreFormations("liste-formations", true))
  );

  /* Formulaires */
  brancherFormulaire("form-inscription", "inscription", f => ({
    nom: f.nom.value, email: f.email.value, telephone: f.telephone.value,
    formation: nomFormation(f.formation.value), niveau: f.niveau.value, message: f.message.value
  }));
  brancherFormulaire("form-contact", "contact", f => ({
    nom: f.nom.value, email: f.email.value, sujet: f.sujet.value, message: f.message.value
  }));
  brancherFormulaire("form-devis", "devis", f => ({
    entreprise: f.entreprise.value, contact: f.contact.value, email: f.email.value,
    telephone: f.telephone.value, besoins: f.besoins.value, effectif: f.effectif.value
  }));
});
