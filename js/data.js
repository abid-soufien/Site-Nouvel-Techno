/* ==========================================================================
   NOUVEL TECHNO — Données du site (js/data.js)
   --------------------------------------------------------------------------
   Rôle :
   - Source de données unique du site (formations, sessions, formateurs,
     témoignages, articles, coordonnées).
   - L'administration (admin.html) modifie une copie de ces données stockée
     dans le navigateur (localStorage) ; le site public lit toujours
     "localStorage en priorité, sinon les valeurs par défaut ci-dessous".
   - Le fichier texte data/site-content.txt sert de miroir "bloc-notes"
     pour préparer / sauvegarder le contenu à la main.
   ========================================================================== */

/* Clé de stockage navigateur partagée avec l'administration */
const CLE_STOCKAGE = "nouvel_techno_donnees";

/* Données par défaut (utilisées si l'admin n'a rien modifié) */
const DONNEES_DEFAUT = {

  /* ----- Coordonnées de contact (utilisées partout sur le site) ----- */
  infos: {
    nom: "Nouvel Techno",
    email: "contact@nouveltechno.tn",
    telephone: "+216 90 000 000",
    /* WhatsApp au format international sans "+" ni espaces */
    whatsapp: "216900000000",
    adresse: "Avenue Habib Bourguiba, Médenine 4100, Tunisie",
    horaires: "Lundi – Samedi : 08h30 – 18h00"
  },

  /* ----- Formations (6 pôles) -----
     Champs : id, titre, categorie, niveau, duree, format, prix,
     resume, competences[], prerequis, certificat, icone                */
  formations: [
    {
      id: "ia-ml",
      titre: "Intelligence Artificielle & Machine Learning",
      categorie: "ia",
      niveau: "intermediaire",
      duree: "3 mois (72 h)",
      format: "hybride",
      prix: "850 DT",
      resume: "Maîtrisez les fondamentaux de l'IA et du Machine Learning : manipulation de données, entraînement de modèles et mise en production de premiers cas d'usage concrets.",
      competences: ["Python pour la data science", "Régression, classification, clustering", "Réseaux de neurones avec TensorFlow", "Évaluation et déploiement de modèles"],
      prerequis: "Bases de Python recommandées (ou notre module d'initiation offert)",
      certificat: "Certificat de fin de formation Nouvel Techno",
      icone: "🤖"
    },
    {
      id: "dev-web",
      titre: "Développement Web & Applications",
      categorie: "dev",
      niveau: "debutant",
      duree: "4 mois (96 h)",
      format: "presentiel",
      prix: "790 DT",
      resume: "Devenez développeur front-end et back-end : HTML5, CSS3, JavaScript ES6, puis React et Node.js, avec un projet professionnel complet en fin de parcours.",
      competences: ["HTML5 / CSS3 / JavaScript ES6", "React et gestion d'état", "API REST avec Node.js & Express", "Bases de données SQL & Git/GitHub"],
      prerequis: "Aucun prérequis technique — motivation et assiduité",
      certificat: "Certificat de fin de formation + projet portfolio",
      icone: "💻"
    },
    {
      id: "cybersecurite",
      titre: "Cybersécurité",
      categorie: "cyber",
      niveau: "avance",
      duree: "3 mois (72 h)",
      format: "en ligne",
      prix: "990 DT",
      resume: "Protégez systèmes et réseaux : analyse de vulnérabilités, tests d'intrusion éthiques, sécurité des applications et réponse aux incidents.",
      competences: ["Sécurité des réseaux et des systèmes", "Pentesting éthique (Kali Linux)", "Sécurité web (OWASP Top 10)", "Cryptographie appliquée & SOC"],
      prerequis: "Bonnes bases réseaux (TCP/IP) et systèmes Linux",
      certificat: "Certificat de fin de formation — préparation Certification CEH",
      icone: "🛡️"
    },
    {
      id: "cloud",
      titre: "Cloud Computing",
      categorie: "cloud",
      niveau: "intermediaire",
      duree: "2 mois (48 h)",
      format: "hybride",
      prix: "750 DT",
      resume: "Déployez et administrez des infrastructures modernes : machines virtuelles, conteneurs Docker, Kubernetes et automatisation sur AWS et Azure.",
      competences: ["Fondamentaux AWS & Azure", "Virtualisation et conteneurs Docker", "Orchestration Kubernetes", "CI/CD et Infrastructure as Code"],
      prerequis: "Notions de systèmes et de réseaux",
      certificat: "Certificat de fin de formation — préparation AWS Cloud Practitioner",
      icone: "☁️"
    },
    {
      id: "prompt-ia",
      titre: "Prompt Engineering & Outils d'IA pour les entreprises",
      categorie: "ia",
      niveau: "debutant",
      duree: "3 semaines (21 h)",
      format: "en ligne",
      prix: "350 DT",
      resume: "Exploitez ChatGPT, Copilot et les outils d'IA générative au quotidien : rédaction de prompts efficaces, automatisation de tâches et gain de productivité.",
      competences: ["Techniques de prompt engineering", "IA générative texte, image, données", "Automatisation de processus métier", "Éthique et limites de l'IA"],
      prerequis: "Aucun — ouvert à tous les profils",
      certificat: "Certificat de fin de formation",
      icone: "✨"
    },
    {
      id: "entreprises",
      titre: "Formations pour entreprises & équipes",
      categorie: "entreprise",
      niveau: "debutant",
      duree: "Sur mesure",
      format: "presentiel",
      prix: "Sur demande",
      resume: "Parcours personnalisés pour vos équipes : transformation digitale, montée en compétences tech, ateliers intra-entreprise dans vos locaux ou au centre.",
      competences: ["Audit de besoins et plan de formation", "Modules IA, cloud, cybersécurité, data", "Ateliers pratiques sur vos cas réels", "Suivi post-formation et évaluation"],
      prerequis: "Aucun — programme construit après diagnostic",
      certificat: "Attestation + rapport de compétences par équipe",
      icone: "🏢"
    }
  ],

  /* ----- Prochaines sessions (calendrier) -----
     date au format ISO "AAAA-MM-JJ"                                      */
  sessions: [
    { id: "s1", formationId: "prompt-ia", date: "2026-01-12", horaire: "18h00 – 21h00", lieu: "En ligne (Zoom)", places: 20 },
    { id: "s2", formationId: "dev-web", date: "2026-01-19", horaire: "09h00 – 12h00", lieu: "Centre de Médenine", places: 15 },
    { id: "s3", formationId: "ia-ml", date: "2026-02-02", horaire: "17h30 – 20h30", lieu: "Hybride", places: 18 },
    { id: "s4", formationId: "cloud", date: "2026-02-16", horaire: "14h00 – 17h00", lieu: "Hybride", places: 16 },
    { id: "s5", formationId: "cybersecurite", date: "2026-03-02", horaire: "18h00 – 21h00", lieu: "En ligne (Zoom)", places: 14 }
  ],

  /* ----- Formateurs ----- */
  formateurs: [
    {
      id: "f1", nom: "Mehdi Ben Salah",
      specialite: "Intelligence Artificielle & Data",
      experience: "10 ans d'expérience — ex-Data Scientist, doctorat en informatique",
      bio: "Passionné de transmission, Mehdi a accompagné plus de 400 apprenants vers les métiers de la data et de l'IA.",
      initiales: "MS"
    },
    {
      id: "f2", nom: "Amira Trabelsi",
      specialite: "Développement Web Full-Stack",
      experience: "8 ans d'expérience — Lead Developer & mentor technique",
      bio: "Amira conçoit des applications web pour des startups tunisiennes et forme aux technologies JavaScript modernes.",
      initiales: "AT"
    },
    {
      id: "f3", nom: "Karim Jelassi",
      specialite: "Cybersécurité",
      experience: "12 ans d'expérience — Consultant sécurité & auditeur certifié",
      bio: "Karim intervient auprès des entreprises sur la sécurisation des systèmes et l'analyse d'incidents.",
      initiales: "KJ"
    },
    {
      id: "f4", nom: "Sonia Gharbi",
      specialite: "Cloud & DevOps",
      experience: "9 ans d'expérience — Architecte Cloud certifiée AWS & Azure",
      bio: "Sonia accompagne les organisations dans leur migration vers le cloud et l'automatisation des déploiements.",
      initiales: "SG"
    },
    {
      id: "f5", nom: "Yassine Meddeb",
      specialite: "Prompt Engineering & Outils IA",
      experience: "6 ans d'expérience — Consultant en transformation digitale",
      bio: "Yassine aide les équipes à tirer le meilleur des outils d'IA générative dans leur travail quotidien.",
      initiales: "YM"
    },
    {
      id: "f6", nom: "Rania Chaabane",
      specialite: "Pédagogie & accompagnement",
      experience: "7 ans d'expérience — Responsable pédagogique",
      bio: "Rania garantit la qualité des parcours, le suivi individuel et la réussite de chaque apprenant.",
      initiales: "RC"
    }
  ],

  /* ----- Témoignages ----- */
  temoignages: [
    {
      id: "t1", nom: "Ahmed OUESLATI", role: "Développeur Junior — recruté après la formation",
      formation: "Développement Web & Applications",
      note: 5,
      texte: "Une formation très concrète : on code dès la première semaine. Le projet final m'a servi de portfolio et j'ai décroché mon premier poste un mois après la fin du cursus."
    },
    {
      id: "t2", nom: "Fatma BEN AMOR", role: "Étudiante en informatique",
      formation: "Intelligence Artificielle & Machine Learning",
      note: 5,
      texte: "Les explications sont claires et les exercices progressifs. J'ai compris le Machine Learning pour de vrai, pas seulement la théorie. Les formateurs sont très disponibles."
    },
    {
      id: "t3", nom: "Mohamed KHEDHIRI", role: "Responsable IT — PME à Médenine",
      formation: "Cybersécurité",
      note: 4,
      texte: "Formation au top pour sécuriser notre infrastructure. Le formateur a adapté les exemples à notre contexte d'entreprise. Je recommande vivement."
    },
    {
      id: "t4", nom: "Ines MABROUK", role: "Cheffe de projet marketing",
      formation: "Prompt Engineering & Outils d'IA",
      note: 5,
      texte: "En 3 semaines, j'ai automatisé la moitié de mes tâches répétitives. Un investissement rentabilisé dès le premier mois. Format en ligne parfait pour les salariés."
    },
    {
      id: "t5", nom: "Bilel ZORGATI", role: "Administrateur systèmes",
      formation: "Cloud Computing",
      note: 5,
      texte: "Docker, Kubernetes, AWS… tout y passe avec des TP réalistes. J'ai obtenu ma certification AWS peu après la formation. Merci à toute l'équipe !"
    }
  ],

  /* ----- Articles du blog ----- */
  articles: [
    {
      id: "a1",
      titre: "Métiers de l'IA en 2026 : quelles opportunités en Tunisie ?",
      categorie: "ia",
      date: "2025-12-05",
      extrait: "Data analyst, ML engineer, prompt designer… Le marché de l'IA explose. Tour d'horizon des métiers qui recrutent et des compétences attendues.",
      contenu: "L'intelligence artificielle n'est plus un domaine réservé aux grandes capitales technologiques. En Tunisie, les entreprises de tous secteurs — banque, santé, agroalimentaire, services publics — recherchent des profils capables d'exploiter la donnée.\n\nLes postes les plus demandés : data analyst (analyse et visualisation de données), machine learning engineer (conception de modèles), et plus récemment prompt engineer, spécialiste de l'interaction avec les modèles génératifs.\n\nTrois conseils pour vous positionner : maîtrisez Python, construisez un portfolio de projets réels, et restez en veille permanente. Nos formations sont précisément conçues pour vous y aider, avec des cas pratiques issus du marché tunisien."
    },
    {
      id: "a2",
      titre: "Apprendre à coder après 30 ans : c'est possible (et même idéal)",
      categorie: "dev",
      date: "2025-11-18",
      extrait: "Changer de voie vers le développement web n'a pas d'âge. Retour sur les parcours de nos apprenants en reconversion et leurs clés de réussite.",
      contenu: "Contrairement aux idées reçues, la reconversion vers le développement web se réussit très bien après 30 ans. L'expérience professionnelle — gestion de projet, communication, rigueur — devient un atout majeur en entreprise.\n\nNos apprenants en reconversion suivent un simple principe : pratiquer chaque jour, même 45 minutes. La régularité bat l'intensité.\n\nLe marché recherche des profils capables de comprendre le besoin métier autant que le code. C'est exactement ce que valorisent les employeurs face à un développeur junior « classique »."
    },
    {
      id: "a3",
      titre: "Cybersécurité : 5 réflexes simples pour protéger votre PME",
      categorie: "cyber",
      date: "2025-10-30",
      extrait: "Phishing, mots de passe faibles, backups oubliés… La plupart des cyberattaques exploitent des failles basiques. Voici les réflexes essentiels.",
      contenu: "Les PME sont devenues des cibles privilégiées des cyberattaquants, précisément parce qu'elles se croient trop petites pour intéresser qui que ce soit.\n\nLes cinq réflexes essentiels : 1) activer la double authentification partout, 2) former les équipes au phishing, 3) maintenir les systèmes à jour, 4) automatiser des sauvegardes testées régulièrement, 5) limiter les droits d'accès au strict nécessaire.\n\nCes mesures simples bloquent la grande majorité des attaques courantes. Notre formation Cybersécurité vous apprend à les mettre en œuvre et à aller plus loin."
    },
    {
      id: "a4",
      titre: "Prompt engineering : la compétence transversale de la décennie",
      categorie: "ia",
      date: "2025-10-12",
      extrait: "Savoir dialoguer efficacement avec une IA devient aussi stratégique que savoir utiliser un tableur. Explications et exemples concrets.",
      contenu: "Le prompt engineering consiste à formuler des instructions précises pour obtenir le meilleur résultat possible d'un modèle d'IA générative.\n\nLes techniques clés : donner du contexte, préciser le format de sortie attendu, décomposer les tâches complexes, et itérer. Un bon prompt peut faire passer une réponse médiocre à un résultat directement exploitable.\n\nDans nos formations, nous travaillons sur des cas réels : rédaction de contenus, analyse de documents, assistance client, génération de code. Une compétence utile dans tous les métiers, du marketing à la comptabilité."
    },
    {
      id: "a5",
      titre: "Cloud computing : pourquoi les entreprises du Sud tunisien migrent",
      categorie: "cloud",
      date: "2025-09-25",
      extrait: "Réduction des coûts, flexibilité, sécurité… La migration vers le cloud n'est plus une option pour les organisations de la région.",
      contenu: "Le cloud computing permet d'accéder à des serveurs, du stockage et des logiciels via Internet, sans investir dans une infrastructure physique.\n\nPour les entreprises du Sud tunisien, les avantages sont concrets : paiement à l'usage, mise à l'échelle instantanée, continuité de service et accès à des technologies de pointe autrefois réservées aux grands groupes.\n\nNotre formation Cloud Computing couvre AWS, Azure, Docker et Kubernetes, avec des travaux pratiques directement transposables à votre environnement professionnel."
    },
    {
      id: "a6",
      titre: "Data & IA : les compétences les plus demandées par les recruteurs",
      categorie: "ia",
      date: "2025-09-08",
      extrait: "Nous avons analysé des centaines d'offres d'emploi tech. Voici les compétences qui reviennent le plus souvent — et comment les acquérir.",
      contenu: "Python arrive largement en tête des compétences techniques demandées, suivi de SQL, de la visualisation de données et des bases du machine learning.\n\nMais les recruteurs insistent tout autant sur les compétences humaines : communication des résultats, esprit critique face aux données, et capacité à travailler en équipe pluridisciplinaire.\n\nNotre conseil : choisissez un domaine d'application (santé, finance, agriculture…) et construisez trois projets solides autour. C'est ce portfolio qui fera la différence en entretien."
    }
  ]
};

/* ==========================================================================
   Accès aux données — utilisé par le site public ET l'administration
   ========================================================================== */

/**
 * Retourne les données actives du site :
 * celles modifiées via l'admin (localStorage) si elles existent,
 * sinon les données par défaut définies ci-dessus.
 */
function obtenirDonnees() {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    if (brut) return JSON.parse(brut);
  } catch (e) {
    console.warn("Données locales illisibles, retour aux données par défaut.", e);
  }
  return DONNEES_DEFAUT;
}

/** Recherche du libellé d'une formation à partir de son identifiant */
function nomFormation(id) {
  const f = obtenirDonnees().formations.find(f => f.id === id);
  return f ? f.titre : "Formation";
}
