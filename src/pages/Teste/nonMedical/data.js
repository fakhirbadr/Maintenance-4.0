export const data = {
  regions: {
    "Casablanca-Settat": {
      taux: { current: 85, previousWeek: 80, previousMonth: 82 },
      provinces: {
        Casablanca: {
          actifs: ["Hôpital A", "Hôpital B", "Clinique Z"],
          taux: {
            current: [80, 90, 75],
            previousWeek: [78, 88, 72],
            previousMonth: [79, 89, 74],
          },
        },
        Mohammedia: {
          actifs: ["Clinique X", "Clinique Y", "Centre Médical M"],
          taux: {
            current: [70, 85, 78],
            previousWeek: [68, 83, 76],
            previousMonth: [69, 84, 77],
          },
        },
      },
    },
    "Rabat-Salé-Kénitra": {
      taux: { current: 88, previousWeek: 84, previousMonth: 85 },
      provinces: {
        Rabat: {
          actifs: ["Hôpital Central", "Clinique Royale"],
          taux: {
            current: [87, 90],
            previousWeek: [85, 88],
            previousMonth: [86, 89],
          },
        },
        Salé: {
          actifs: ["Centre Médical Salé", "Clinique Prestige"],
          taux: {
            current: [80, 82],
            previousWeek: [78, 80],
            previousMonth: [79, 81],
          },
        },
      },
    },
    "Fès-Meknès": {
      taux: { current: 82, previousWeek: 79, previousMonth: 80 },
      provinces: {
        Fès: {
          actifs: ["Hôpital Ibn Sina", "Clinique Al Farabi"],
          taux: {
            current: [83, 81],
            previousWeek: [80, 78],
            previousMonth: [81, 79],
          },
        },
        Meknès: {
          actifs: ["Centre de Santé Meknès", "Clinique Elite"],
          taux: {
            current: [77, 79],
            previousWeek: [75, 77],
            previousMonth: [76, 78],
          },
        },
      },
    },
    "Marrakech-Safi": {
      taux: { current: 84, previousWeek: 81, previousMonth: 83 },
      provinces: {
        Marrakech: {
          actifs: ["Hôpital Universitaire", "Clinique Menara"],
          taux: {
            current: [86, 85],
            previousWeek: [84, 82],
            previousMonth: [85, 83],
          },
        },
        Safi: {
          actifs: ["Centre Médical Safi", "Clinique Oualidia"],
          taux: {
            current: [78, 80],
            previousWeek: [76, 78],
            previousMonth: [77, 79],
          },
        },
      },
    },
    "Tanger-Tétouan-Al Hoceïma": {
      taux: { current: 79, previousWeek: 76, previousMonth: 77 },
      provinces: {
        Tanger: {
          actifs: ["Hôpital Mohammed V", "Clinique Horizon"],
          taux: {
            current: [80, 78],
            previousWeek: [77, 75],
            previousMonth: [78, 76],
          },
        },
        Tétouan: {
          actifs: ["Centre Médical Tétouan", "Clinique Andalouse"],
          taux: {
            current: [74, 76],
            previousWeek: [72, 74],
            previousMonth: [73, 75],
          },
        },
      },
    },
  },
};
