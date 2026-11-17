/* ==========================================================================
   NOUVEL TECHNO — Administration (js/admin.js)
   --------------------------------------------------------------------------
   Fonctionnement :
   - Accès protégé par mot de passe (stocké dans le navigateur).
     ⚠ Sécurité de démonstration : côté client uniquement. Pour une
     protection réelle, héberger l'admin derrière un serveur avec
     authentification (ex. .htaccess + .htpasswd, ou backend).
   - Les modifications de contenu sont enregistrées dans localStorage
     (clé partagée avec js/data.js) et prises en compte immédiatement
     par le site public.
   - Export / import JSON + génération du miroir texte
     data/site-content.txt.
   ========================================================================== */

"use strict";

const CLE_MDP = "nouvel_techno_mdp_admin";
const MDP_DEFAUT = "nouvel2026";
const CLE_SESSION = "nouvel_techno_admin_connecte";

/* Collections éditables : nom -> clé dans les données */
const COLLECTIONS = ["formations", "sessions", "formateurs", "temoignages", "articles"];

/* Modèles vides pour le bouton "+ Ajouter" */
const MODELES = {
  formations: { id: "nouvelle-formation", titre: "Nouvelle formation", categorie: "ia", niveau: "debutant", duree: "1 mois", format: "presentiel", prix: "Sur demande", resume: "Description courte…", competences: ["Compétence 1"], prerequis: "Aucun", certificat: "Certificat de fin de formation", icone: "📘" },
  sessions: { id: "nouvelle-session", formationId: "ia-ml", date: "2026-06-01", horaire: "18h00 – 21h00", lieu: "Centre de Médenine", places: 15 },
  formateurs: { id: "nouveau-formateur", nom: "Prénom NOM", specialite: "Spécialité", experience: "X ans d'expérience", bio: "Brève biographie…", initiales: "PN" },
  temoignages: { id: "nouveau-temoignage", nom: "Prénom NOM", role: "Étudiant", formation: "Formation suivie", note: 5, texte: "Témoignage…" },
  articles: { id: "nouvel-article", titre: "Titre de l'article", categorie: "ia", date: "2026-01-01", extrait: "Résumé court…", contenu: "Premier paragraphe.\n\nDeuxième paragraphe." }
};

/* --------------------------------------------------------------------------
   Utilitaires
   -------------------------------------------------------------------------- */
function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("visible");
  setTimeout(() => el.classList.remove("visible"), 3200);
}

function motDePasseActuel() {
  return localStorage.getItem(CLE_MDP) || MDP_DEFAUT;
}

/* Fusion : données locales (modifiées) par-dessus les données par défaut */
function donneesCompletes() {
  const defaut = DONNEES_DEFAUT;
  let locales = {};
  try { locales = JSON.parse(localStorage.getItem(CLE_STOCKAGE)) || {}; } catch (e) { /* ignore */ }
  return { ...defaut, ...locales };
}

/* Sauvegarde d'une clé de contenu dans localStorage */
function sauverCle(cle, valeur) {
  const locales = JSON.parse(localStorage.getItem(CLE_STOCKAGE) || "{}");
  locales[cle] = valeur;
  localStorage.setItem(CLE_STOCKAGE, JSON.stringify(locales));
}

/* --------------------------------------------------------------------------
   Connexion / déconnexion
   -------------------------------------------------------------------------- */
function initialiserConnexion() {
  const ecran = document.getElementById("ecran-connexion");
  const interface_ = document.getElementById("interface-admin");
  const formulaire = document.getElementById("form-connexion");
  const erreur = document.getElementById("erreur-connexion");

  /* Session déjà ouverte dans cet onglet ? */
  if (sessionStorage.getItem(CLE_SESSION) === "1") {
    ecran.hidden = true;
    interface_.hidden = false;
    remplirEditeurs();
  }

  formulaire.addEventListener("submit", e => {
    e.preventDefault();
    const saisi = document.getElementById("motdepasse").value;
    if (saisi === motDePasseActuel()) {
      sessionStorage.setItem(CLE_SESSION, "1");
      ecran.hidden = true;
      interface_.hidden = false;
      erreur.classList.remove("visible");
      remplirEditeurs();
    } else {
      erreur.classList.add("visible");
    }
  });

  document.getElementById("btn-deconnexion").addEventListener("click", () => {
    sessionStorage.removeItem(CLE_SESSION);
    location.reload();
  });
}

/* --------------------------------------------------------------------------
   Onglets
   -------------------------------------------------------------------------- */
function initialiserOnglets() {
  document.querySelectorAll(".onglet").forEach(bouton =>
    bouton.addEventListener("click", () => {
      document.querySelectorAll(".onglet").forEach(b => b.classList.remove("actif"));
      document.querySelectorAll(".panneau").forEach(p => p.classList.remove("actif"));
      bouton.classList.add("actif");
      document.getElementById("panneau-" + bouton.dataset.onglet).classList.add("actif");

      /* Contenus dynamiques selon l'onglet ouvert */
      if (bouton.dataset.onglet === "messages") afficherMessages();
      if (bouton.dataset.onglet === "parametres") remplirParametres();
      if (bouton.dataset.onglet === "fichier") remplirFichierTxt();
    })
  );
}

/* --------------------------------------------------------------------------
   Éditeurs de contenu (JSON)
   -------------------------------------------------------------------------- */
function remplirEditeurs() {
  const donnees = donneesCompletes();
  COLLECTIONS.forEach(cle => {
    const editeur = document.getElementById("editeur-" + cle);
    editeur.value = JSON.stringify(donnees[cle], null, 2);
    editeur.classList.remove("invalide");
  });
}

function initialiserEditeurs() {
  /* Enregistrement d'une collection */
  document.querySelectorAll("[data-sauver]").forEach(bouton =>
    bouton.addEventListener("click", () => {
      const cle = bouton.dataset.sauver;
      const editeur = document.getElementById("editeur-" + cle);
      try {
        const valeur = JSON.parse(editeur.value);
        if (!Array.isArray(valeur)) throw new Error("Un tableau est attendu");
        sauverCle(cle, valeur);
        editeur.classList.remove("invalide");
        toast(`✅ ${cle} enregistré — le site est à jour.`);
      } catch (err) {
        editeur.classList.add("invalide");
        toast("❌ JSON invalide : " + err.message);
      }
    })
  );

  /* Annulation : recharge depuis le stockage */
  document.querySelectorAll("[data-restaurer]").forEach(bouton =>
    bouton.addEventListener("click", () => {
      remplirEditeurs();
      toast("Modifications annulées.");
    })
  );

  /* Ajout d'un élément vide au début de la collection */
  document.querySelectorAll("[data-ajouter]").forEach(bouton =>
    bouton.addEventListener("click", () => {
      const cle = bouton.dataset.ajouter;
      const editeur = document.getElementById("editeur-" + cle);
      try {
        const tableau = JSON.parse(editeur.value);
        tableau.unshift(MODELES[cle]);
        editeur.value = JSON.stringify(tableau, null, 2);
        toast("Élément ajouté dans l'éditeur — pensez à Enregistrer.");
      } catch (err) {
        toast("❌ Corrigez d'abord le JSON avant d'ajouter.");
      }
    })
  );
}

/* --------------------------------------------------------------------------
   Messages reçus (inscriptions, contacts, devis, newsletter)
   -------------------------------------------------------------------------- */
function lireMessages() {
  try { return JSON.parse(localStorage.getItem("nouvel_techno_messages")) || []; }
  catch (e) { return []; }
}

function afficherMessages() {
  const conteneur = document.getElementById("liste-messages");
  const messages = lireMessages().slice().reverse();

  if (!messages.length) {
    conteneur.innerHTML = `<p class="vide">Aucun message pour le moment.</p>`;
    return;
  }

  const etiquettes = {
    inscription: "Inscription", contact: "Contact",
    devis: "Devis entreprise", newsletter: "Newsletter"
  };

  conteneur.innerHTML = messages.map(m => `
    <div class="carte-message">
      <span class="date">${new Date(m.date).toLocaleString("fr-FR")}</span>
      <span class="type ${m.type}">${etiquettes[m.type] || m.type}</span>
      <pre>${JSON.stringify(m, (k, v) => k === "date" || k === "id" || k === "type" ? undefined : v, "\n")
        .replace(/[{}"]/g, "").trim()}</pre>
      <button class="supprimer" data-supprimer="${m.id}">Supprimer</button>
    </div>`).join("");

  conteneur.querySelectorAll("[data-supprimer]").forEach(bouton =>
    bouton.addEventListener("click", () => {
      const restants = lireMessages().filter(m => String(m.id) !== bouton.dataset.supprimer);
      localStorage.setItem("nouvel_techno_messages", JSON.stringify(restants));
      afficherMessages();
    })
  );
}

function initialiserMessages() {
  /* Export CSV des messages */
  document.getElementById("export-messages").addEventListener("click", () => {
    const messages = lireMessages();
    if (!messages.length) { toast("Aucun message à exporter."); return; }

    const colonnes = ["type", "date", ...Object.keys(messages[0]).filter(k => !["type", "date", "id"].includes(k))];
    const csv = [
      colonnes.join(";"),
      ...messages.map(m => colonnes.map(c => `"${String(m[c] ?? "").replace(/"/g, '""')}"`).join(";"))
    ].join("\n");

    telechargerFichier("messages-nouvel-techno.csv", csv, "text/csv");
  });

  /* Suppression totale (avec confirmation) */
  document.getElementById("vider-messages").addEventListener("click", () => {
    if (confirm("Supprimer définitivement tous les messages reçus ?")) {
      localStorage.removeItem("nouvel_techno_messages");
      afficherMessages();
      toast("Messages supprimés.");
    }
  });
}

/* --------------------------------------------------------------------------
   Paramètres (coordonnées + mot de passe)
   -------------------------------------------------------------------------- */
function remplirParametres() {
  const infos = donneesCompletes().infos;
  document.getElementById("p-email").value = infos.email || "";
  document.getElementById("p-telephone").value = infos.telephone || "";
  document.getElementById("p-whatsapp").value = infos.whatsapp || "";
  document.getElementById("p-adresse").value = infos.adresse || "";
  document.getElementById("p-horaires").value = infos.horaires || "";
}

function initialiserParametres() {
  document.getElementById("form-parametres").addEventListener("submit", e => {
    e.preventDefault();
    const donnees = donneesCompletes();

    donnees.infos = {
      ...donnees.infos,
      email: document.getElementById("p-email").value.trim(),
      telephone: document.getElementById("p-telephone").value.trim(),
      whatsapp: document.getElementById("p-whatsapp").value.replace(/\D/g, ""),
      adresse: document.getElementById("p-adresse").value.trim(),
      horaires: document.getElementById("p-horaires").value.trim()
    };

    /* On sauve tout l'état modifié (au moins "infos") */
    sauverCle("infos", donnees.infos);

    /* Changement de mot de passe si renseigné */
    const nouveauMdp = document.getElementById("p-mdp").value;
    if (nouveauMdp) {
      localStorage.setItem(CLE_MDP, nouveauMdp);
      document.getElementById("p-mdp").value = "";
    }

    toast("✅ Paramètres enregistrés.");
  });

  /* Réinitialisation complète du contenu */
  document.getElementById("reinitialiser-donnees").addEventListener("click", () => {
    if (confirm("Réinitialiser TOUT le contenu du site aux valeurs d'origine ?")) {
      localStorage.removeItem(CLE_STOCKAGE);
      remplirEditeurs();
      toast("Contenu réinitialisé.");
    }
  });
}

/* --------------------------------------------------------------------------
   Fichier texte (miroir bloc-notes : data/site-content.txt)
   -------------------------------------------------------------------------- */
function genererTexteContenu() {
  const d = donneesCompletes();
  return [
    "==============================================================",
    " NOUVEL TECHNO — CONTENU DU SITE (fichier d'administration)",
    " Médenine, Tunisie — " + new Date().toLocaleDateString("fr-FR"),
    "--------------------------------------------------------------",
    " Ce fichier est le « bloc-notes » d'administration du site.",
    " 1. Modifiez les sections ci-dessous (ou via admin.html).",
    " 2. Le bloc JSON de la fin peut être copié/collé dans",
    "    admin.html > onglet « Fichier texte » > Importer.",
    "==============================================================",
    "",
    "COORDONNÉES",
    "-----------",
    `E-mail    : ${d.infos.email}`,
    `Téléphone : ${d.infos.telephone}`,
    `WhatsApp  : +${d.infos.whatsapp}`,
    `Adresse   : ${d.infos.adresse}`,
    `Horaires  : ${d.infos.horaires}`,
    "",
    "FORMATIONS (" + d.formations.length + ")",
    "----------",
    ...d.formations.flatMap(f => [
      `• ${f.titre}`,
      `  Niveau : ${f.niveau} | Durée : ${f.duree} | Format : ${f.format} | Prix : ${f.prix}`,
      `  ${f.resume}`,
      ""
    ]),
    "SESSIONS À VENIR",
    "----------------",
    ...d.sessions.map(s => `• ${s.date} — ${s.horaire} — ${s.lieu} (${s.places} places)`),
    "",
    "BLOC JSON (à copier dans admin.html pour import)",
    "------------------------------------------------",
    JSON.stringify({ formations: d.formations, sessions: d.sessions, formateurs: d.formateurs, temoignages: d.temoignages, articles: d.articles, infos: d.infos }, null, 2)
  ].join("\n");
}

function remplirFichierTxt() {
  document.getElementById("editeur-txt").value = genererTexteContenu();
}

function initialiserFichierTxt() {
  /* Téléchargement du miroir texte */
  document.getElementById("export-txt").addEventListener("click", () => {
    telechargerFichier("site-content.txt", genererTexteContenu(), "text/plain");
  });

  /* Import : le JSON collé dans la zone remplace le contenu du site */
  document.getElementById("importer-txt").addEventListener("click", () => {
    const texte = document.getElementById("editeur-txt").value;
    const debut = texte.indexOf("{");
    const fin = texte.lastIndexOf("}");
    if (debut === -1 || fin === -1) { toast("❌ Aucun bloc JSON trouvé."); return; }

    try {
      const donnees = JSON.parse(texte.slice(debut, fin + 1));
      Object.keys(donnees).forEach(cle => sauverCle(cle, donnees[cle]));
      remplirEditeurs();
      toast("✅ Contenu importé — le site est à jour.");
    } catch (err) {
      toast("❌ JSON invalide : " + err.message);
    }
  });
}

/* --------------------------------------------------------------------------
   Téléchargement de fichier (utilitaire commun)
   -------------------------------------------------------------------------- */
function telechargerFichier(nom, contenu, type) {
  const lien = document.createElement("a");
  lien.href = URL.createObjectURL(new Blob([contenu], { type }));
  lien.download = nom;
  lien.click();
  URL.revokeObjectURL(lien.href);
}

/* --------------------------------------------------------------------------
   INITIALISATION
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initialiserConnexion();
  initialiserOnglets();
  initialiserEditeurs();
  initialiserMessages();
  initialiserParametres();
  initialiserFichierTxt();
  remplirEditeurs();
});
