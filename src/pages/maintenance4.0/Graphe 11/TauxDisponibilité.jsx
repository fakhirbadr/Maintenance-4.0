import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  ThemeProvider,
  CssBaseline,
  createTheme,
  Stack,
  LinearProgress,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const TauxDisponibilité = () => {
  const [data, setData] = useState(null);

  const getCumulativeEquipmentsStatusCount = (data) => {
    const categories = [
      "Dispositif Médicaux",
      "Équipement Généraux",
      "Matériel Informatique",
      "Structure",
    ];

    const cumulativeData = categories.reduce((acc, categoryName) => {
      acc[categoryName] = { fonctionnelsCount: 0, nonFonctionnelsCount: 0 };
      return acc;
    }, {});

    data.forEach((um) => {
      um.categories.forEach((category) => {
        if (categories.includes(category.name)) {
          const fonctionnels = category.equipments.filter(
            (equip) => equip.isFunctionel === true
          );
          const nonFonctionnels = category.equipments.filter(
            (equip) => equip.isFunctionel === false
          );
          cumulativeData[category.name].fonctionnelsCount +=
            fonctionnels.length;
          cumulativeData[category.name].nonFonctionnelsCount +=
            nonFonctionnels.length;
        }
      });
    });

    return cumulativeData;
  };

  useEffect(() => {
    fetch("https://backend-v1-1.onrender.com/api/actifs")
      .then((response) => response.json())
      .then((data) => {
        setData(getCumulativeEquipmentsStatusCount(data));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!data) {
    return (
      <div>
        {" "}
        <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
          <LinearProgress color="secondary" />
          <LinearProgress color="success" />
          <LinearProgress color="inherit" />
        </Stack>
      </div>
    );
  }

  // Préparer les données pour le graphique
  const categories = [
    "Dispositif Médicaux",
    "Équipement Généraux",
    "Matériel Informatique",
    "Structure",
  ];

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Disponibilité des équipements",
        data: categories.map((category) => {
          const fonctionnels = data[category].fonctionnelsCount;
          const nonFonctionnels = data[category].nonFonctionnelsCount;
          return (
            (fonctionnels / (fonctionnels + nonFonctionnels)) *
            100
          ).toFixed(2); // Calcul du taux de disponibilité
        }),
        backgroundColor: [
          "#13678A", // Dispositif Médicaux
          "#45C4B0", // Équipement Généraux
          "#9AEBA3", // Matériel Informatique
          "#DAFDBA", // Structure
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Custom legend items with taux de disponibilité
  const legendItems = chartData.datasets[0].backgroundColor.map(
    (color, index) => {
      const taux = chartData.datasets[0].data[index];
      return (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          sx={{ mb: 1, ml: 2 }}
        >
          <Box
            sx={{
              width: 15,
              height: 15,
              backgroundColor: color,
              borderRadius: "50%",
              marginRight: 1,
            }}
          />
          <Typography variant="body2" color="textPrimary">
            {chartData.labels[index]}: {taux}%
          </Typography>
        </Box>
      );
    }
  );

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="left"
        alignItems="center"
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "#1E1E1E", // Black background
        }}
      >
        <Box
          sx={{
            width: "50%",
            height: "240px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "12px",
          }}
        >
          <Pie data={chartData} options={options} width={400} height={200} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            ml: 4,
          }}
        >
          <Typography
            variant="h6"
            color="textPrimary"
            sx={{
              mb: 1,
              my: 1,
              fontSize: "0.74rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Taux de Disponibilité par Catégorie d'équipement
          </Typography>
          {/* Custom Legend with taux next to each item */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {legendItems}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TauxDisponibilité;
