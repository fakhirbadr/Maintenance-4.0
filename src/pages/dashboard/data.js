export const rows = [
  {
    id: 1,
    Etat: "actif",
    Nom: "UMMC OUMEJRANE TINGHIR",
    Région: "Drâa-Tafilalet",
    Province: "Tinghir",
    Coordinateur: "LALLALEN Oumaima",
    Chargé_de_suivie: "ANNOUN Anass",
    Technicien: "omar omar",
    Docteur: "DR CHAACHOUE",
    Mail: "UMMC_OUMEJRANE@mediot.io",
    Num: "06-61-00-11-22",
    Position: "33.832992, -5.159987",
    Temps_de_Disponibilité: 420, // en minutes
    Temps_d_Arrêt: 30, // en minutes
    Production_Réelle: 900, // en unités
    Production_Planifiée: 1000, // en unités
    Qualité: 850, // en unités conformes
    Efficacité: ((900 / 1000) * 100).toFixed(2) + "%", // en pourcentage
    MTTR: 30, // Temps d'arrêt en minutes pour MTTR
  },
  {
    id: 2,
    Etat: "actif",
    Nom: "UMMC AGADIR",
    Région: "Souss-Massa",
    Province: "Agadir",
    Coordinateur: "BENSLIMANE Khalid",
    Chargé_de_suivie: "TAOUFIK Zaid",
    Technicien: "mohammed soufi",
    Docteur: "DR EL HABBOU",
    Mail: "UMMC_AGADIR@mediot.io",
    Num: "06-65-00-11-22",
    Position: "30.431559, -9.598618",
    Temps_de_Disponibilité: 390,
    Temps_d_Arrêt: 45,
    Production_Réelle: 750,
    Production_Planifiée: 900,
    Qualité: 700,
    Efficacité: ((750 / 900) * 100).toFixed(2) + "%",
    MTTR: 45, // Temps d'arrêt en minutes pour MTTR
  },
  {
    id: 3,
    Etat: "actif",
    Nom: "UMMC MARRAKECH",
    Région: "Marrakech-Safi",
    Province: "Marrakech",
    Coordinateur: "ELGHISSASI Rachid",
    Chargé_de_suivie: "BENSAID Hicham",
    Technicien: "salah el mrani",
    Docteur: "DR RACHID",
    Mail: "UMMC_MARRAKECH@mediot.io",
    Num: "06-66-00-11-22",
    Position: "31.629472, -8.007969",
    Temps_de_Disponibilité: 400,
    Temps_d_Arrêt: 20,
    Production_Réelle: 800,
    Production_Planifiée: 950,
    Qualité: 780,
    Efficacité: ((800 / 950) * 100).toFixed(2) + "%",
    MTTR: 20, // Temps d'arrêt en minutes pour MTTR
  },
  {
    id: 4,
    Etat: "actif",
    Nom: "UMMC RABAT",
    Région: "Rabat-Salé-Kénitra",
    Province: "Rabat",
    Coordinateur: "EL HARCHI Fatima",
    Chargé_de_suivie: "HASSAN Jalal",
    Technicien: "nabil khouya",
    Docteur: "DR NABIL",
    Mail: "UMMC_RABAT@mediot.io",
    Num: "06-67-00-11-22",
    Position: "34.020882, -6.841650",
    Temps_de_Disponibilité: 410,
    Temps_d_Arrêt: 25,
    Production_Réelle: 850,
    Production_Planifiée: 1000,
    Qualité: 820,
    Efficacité: ((850 / 1000) * 100).toFixed(2) + "%",
    MTTR: 25, // Temps d'arrêt en minutes pour MTTR
  },
  {
    id: 5,
    Etat: "actif",
    Nom: "UMMC TANGER",
    Région: "Tanger-Tétouan-Al Hoceima",
    Province: "Tanger",
    Coordinateur: "AISSOU Mouna",
    Chargé_de_suivie: "BENNANI Youssef",
    Technicien: "yassine elkadi",
    Docteur: "DR MAHFOUD",
    Mail: "UMMC_TANGER@mediot.io",
    Num: "06-68-00-11-22",
    Position: "35.782551, -5.802178",
    Temps_de_Disponibilité: 430,
    Temps_d_Arrêt: 35,
    Production_Réelle: 920,
    Production_Planifiée: 1100,
    Qualité: 900,
    Efficacité: ((920 / 1100) * 100).toFixed(2) + "%",
    MTTR: 35, // Temps d'arrêt en minutes pour MTTR
  },
  {
    id: 6,
    Etat: "actif",
    Nom: "UMMC FES",
    Région: "Fès-Meknès",
    Province: "Fès",
    Coordinateur: "MOURAD Ahmed",
    Chargé_de_suivie: "BERRADA Laila",
    Technicien: "ibrahim lkhoury",
    Docteur: "DR KHALID",
    Mail: "UMMC_FES@mediot.io",
    Num: "06-69-00-11-22",
    Position: "34.037261, -5.007769",
    Temps_de_Disponibilité: 415,
    Temps_d_Arrêt: 55,
    Production_Réelle: 780,
    Production_Planifiée: 950,
    Qualité: 700,
    Efficacité: ((780 / 950) * 100).toFixed(2) + "%",
    MTTR: 55, // Temps d'arrêt en minutes pour MTTR
  },
  {
    id: 7,
    Etat: "actif",
    Nom: "UMMC OUJDA",
    Région: "Oriental",
    Province: "Ouji",
    Coordinateur: "BELHASSEN Youssef",
    Chargé_de_suivie: "DHAOUI Amina",
    Technicien: "ahmed mazraani",
    Docteur: "DR SAID",
    Mail: "UMMC_OUJDA@mediot.io",
    Num: "06-70-00-11-22",
    Position: "34.676256, -1.907091",
    Temps_de_Disponibilité: 440,
    Temps_d_Arrêt: 15,
    Production_Réelle: 950,
    Production_Planifiée: 1200,
    Qualité: 900,
    Efficacité: ((950 / 1200) * 100).toFixed(2) + "%",
    MTTR: 15, // Temps d'arrêt en minutes pour MTTR
  },
  {
    id: 8,
    Etat: "actif",
    Nom: "UMMC LAAYOUNE",
    Région: "Laâyoune-Sakia El Hamra",
    Province: "Laâyoune",
    Coordinateur: "MOUKHLIS Rachid",
    Chargé_de_suivie: "KHALIFI Hanan",
    Technicien: "brahim elidrissi",
    Docteur: "DR KHALID",
    Mail: "UMMC_LAAYOUNE@mediot.io",
    Num: "06-71-00-11-22",
    Position: "29.997570, -13.212108",
    Temps_de_Disponibilité: 360,
    Temps_d_Arrêt: 50,
    Production_Réelle: 700,
    Production_Planifiée: 800,
    Qualité: 650,
    Efficacité: ((700 / 800) * 100).toFixed(2) + "%",
    MTTR: 50, // Temps d'arrêt en minutes pour MTTR
  },
  {
    id: 9,
    Etat: "actif",
    Nom: "UMMC KENITRA",
    Région: "Rabat-Salé-Kénitra",
    Province: "Kénitra",
    Coordinateur: "AISSANI Omar",
    Chargé_de_suivie: "AOUNI Imane",
    Technicien: "simo el marini",
    Docteur: "DR MOUNIA",
    Mail: "UMMC_KENITRA@mediot.io",
    Num: "06-72-00-11-22",
    Position: "34.259142, -6.570023",
    Temps_de_Disponibilité: 380,
    Temps_d_Arrêt: 40,
    Production_Réelle: 800,
    Production_Planifiée: 900,
    Qualité: 780,
    Efficacité: ((800 / 900) * 100).toFixed(2) + "%",
    MTTR: 40, // Temps d'arrêt en minutes pour MTTR
  },
  {
    id: 10,
    Etat: "actif",
    Nom: "UMMC TETOUAN",
    Région: "Tanger-Tétouan-Al Hoceima",
    Province: "Tétouan",
    Coordinateur: "BENDAHMANE Leila",
    Chargé_de_suivie: "SAAIDI Amine",
    Technicien: "yassine balouza",
    Docteur: "DR RACHID",
    Mail: "UMMC_TETOUAN@mediot.io",
    Num: "06-73-00-11-22",
    Position: "35.575887, -5.428331",
    Temps_de_Disponibilité: 370,
    Temps_d_Arrêt: 30,
    Production_Réelle: 760,
    Production_Planifiée: 850,
    Qualité: 720,
    Efficacité: ((760 / 850) * 100).toFixed(2) + "%",
    MTTR: 30, // Temps d'arrêt en minutes pour MTTR
  },
];
