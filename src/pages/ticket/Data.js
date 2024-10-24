export const columns = [
  {
    name: "id",
    label: "ID",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "date",
    label: "Date",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "Site",
    label: "Site",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "technicien",
    label: "Technicien",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "typeIntervention",
    label: "Type d'Intervention",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "statut",
    label: "Statut",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "lieu",
    label: "Lieu",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "description",
    label: "Description",
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: "heureDebut",
    label: "Heure Début",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "heureFin",
    label: "Heure Fin",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "commentaires",
    label: "Commentaires",
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: "priorité",
    label: "Priorité",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "Action",
    label: "Action",
    options: {
      filter: false,
      sort: false,
    },
  },
];

export const rows = [
  {
    id: 1,
    Site: "UMMC OUMEJRANE TINGHIR",
    date: "2024-08-22",
    technicien: "Oumaima LALLALEN",
    typeIntervention: "Réparation",
    statut: "Terminé",
    lieu: "Casablanca",
    description: "Réparation du système de climatisation dans le bâtiment A.",
    heureDebut: "08:00",
    heureFin: "10:00",
    commentaires: "Intervention réussie, le système fonctionne normalement.",
    priorité: "élevée",
    année: "2024",
  },
  {
    id: 2,
    Site: "UMMC TINGHIR",
    date: "2024-08-23",
    technicien: "Mohamed RAZIN",
    typeIntervention: "Maintenance Préventive",
    statut: "En cours",
    lieu: "Rabat",
    description: "Maintenance préventive du générateur électrique.",
    heureDebut: "09:30",
    heureFin: "",
    commentaires: "Vérification des niveaux de carburant et des filtres.",
    priorité: "moyen",
    année: "2024",
  },
  {
    id: 3,
    Site: "UMMC OUMEJRANE",
    date: "2024-08-24",
    technicien: "Ismail BELGHITI",
    typeIntervention: "Dépannage",
    statut: "Annulé",
    lieu: "Marrakech",
    description: "Dépannage du système de plomberie dans le bureau 12.",
    heureDebut: "",
    heureFin: "",
    commentaires: "L'intervention a été annulée par le client.",
    priorité: "basse",
    année: "2024",
  },
  {
    id: 4,
    Site: "UMMC RABAT",
    date: "2024-08-25",
    technicien: "Abderahmen AKRAN",
    typeIntervention: "Installation",
    statut: "Terminé",
    lieu: "Fès",
    description: "Installation d'un nouveau système de sécurité.",
    heureDebut: "14:00",
    heureFin: "17:00",
    commentaires:
      "Installation terminée avec succès, tous les équipements sont fonctionnels.",
    priorité: "critique",
    année: "2024",
  },
  {
    id: 5,
    Site: "UMMC TANGER",
    date: "2024-08-26",
    technicien: "Oumaima LALLALEN",
    typeIntervention: "Inspection",
    statut: "En cours",
    lieu: "Agadir",
    description: "Inspection des équipements de ventilation.",
    heureDebut: "11:00",
    heureFin: "",
    commentaires:
      "L'inspection est en cours, aucune anomalie détectée jusqu'à présent.",
    priorité: "moyen",
    année: "2024",
  },
  {
    id: 6,
    Site: "UMMC CASABLANCA",
    date: "2024-08-27",
    technicien: "Mohamed RAZIN",
    typeIntervention: "Réparation",
    statut: "Terminé",
    lieu: "Tanger",
    description: "Réparation du système de chauffage central.",
    heureDebut: "15:00",
    heureFin: "17:30",
    commentaires: "Réparation effectuée, test complet réalisé avec succès.",
    priorité: "élevée",
    année: "2024",
  },
  {
    id: 7,
    Site: "UMMC MARRAKECH",
    date: "2024-08-27",
    technicien: "Mohamed RAZIN",
    typeIntervention: "Réparation",
    statut: "Terminé",
    lieu: "Tanger",
    description: "Réparation du système de chauffage central.",
    heureDebut: "15:00",
    heureFin: "17:30",
    commentaires: "Réparation effectuée, test complet réalisé avec succès.",
    priorité: "élevée",
    année: "2024",
  },
  {
    id: 8,
    Site: "UMMC SIDI IFNI",
    date: "2024-08-27",
    technicien: "Mohamed RAZIN",
    typeIntervention: "Réparation",
    statut: "Terminé",
    lieu: "Tanger",
    description: "Réparation du système de chauffage central.",
    heureDebut: "15:00",
    heureFin: "17:30",
    commentaires: "Réparation effectuée, test complet réalisé avec succès.",
    priorité: "élevée",
    année: "2024",
  },
  {
    id: 9,
    Site: "UMMC SIDI IFNI",
    date: "2024-08-28",
    technicien: "Mohamed RAZIN",
    typeIntervention: "Réparation",
    statut: "Terminé",
    lieu: "Tanger",
    description: "Réparation du système de chauffage central.",
    heureDebut: "15:00",
    heureFin: "17:30",
    commentaires: "Réparation effectuée, test complet réalisé avec succès.",
    priorité: "basse",
    année: "2024",
  },
];
