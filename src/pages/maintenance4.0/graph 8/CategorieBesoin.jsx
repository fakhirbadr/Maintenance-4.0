import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  Stack,
  LinearProgress,
} from "@mui/material";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CategorieBesoin = ({ region, province, startDate, endDate }) => {
  const [data, setData] = useState([]); // Données pour le PieChart
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs

  // Fonction pour récupérer les données de l'API
  const fetchData = async () => {
    try {
      // Construction de l'URL avec les filtres
      let url = `https://backend-v1-1.onrender.com/api/v1/fournitureRoutes?${
        region ? `&region=${region}` : ""
      }${province ? `&province=${province}` : ""}${
        startDate ? `&startDate=${startDate}` : ""
      }${endDate ? `&endDate=${endDate}` : ""}`;

      // Effectuer la requête GET avec l'URL construite
      const response = await axios.get(url);

      console.log("API Response:", response.data);

      // Vérification du format de la réponse API
      if (Array.isArray(response.data.fournitures)) {
        const tickets = response.data.fournitures;

        // Grouper les tickets par catégorie
        const categories = tickets.reduce((acc, ticket) => {
          const category = ticket.categorie || "Inconnu"; // Utiliser "Inconnu" si le champ est manquant
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Calcul du total des tickets pour le calcul du pourcentage
        const totalTickets = tickets.length;

        // Transformer les données pour le PieChart, incluant le pourcentage
        const chartData = Object.entries(categories).map(
          ([category, count]) => ({
            label: `${category} (${((count / totalTickets) * 100).toFixed(
              1
            )}%)`,
            value: count,
          })
        );

        console.log("Transformed Chart Data:", chartData);
        setData(chartData);
      } else {
        setError("Les données retournées ne sont pas au bon format.");
      }
    } catch (err) {
      console.error("Erreur API:", err);
      setError("Erreur lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les données au montage du composant
  useEffect(() => {
    fetchData();
  }, [region, province, startDate, endDate]); // Ajouter startDate et endDate comme dépendances

  // Thème Material-UI
  const theme = createTheme({
    palette: {
      mode: "dark", // Dark mode enabled for the whole theme
    },
  });

  // Gestion des états (chargement, erreur, données)
  if (loading)
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
  if (error) return <div>{error}</div>;
  if (!data || data.length === 0) return <div>Aucune donnée disponible.</div>;

  // Préparer les données pour Chart.js
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: [
          "#F2DCC2",
          "#22CCF2",
          "#1EA4D9",
          "#1A80D9",
          "#A36CD9",
        ], // Customize the colors
      },
    ],
  };

  // Custom legend items
  const legendItems = chartData.datasets[0].backgroundColor.map(
    (color, index) => (
      <Box key={index} display="flex" alignItems="center" sx={{ mb: 1, ml: 2 }}>
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
          {chartData.labels[index]}
        </Typography>
      </Box>
    )
  );

  // Options to disable the default legend
  const options = {
    plugins: {
      legend: {
        display: false, // Disable the default legend
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        display="flex"
        flexDirection="row" // Display the chart and legend in a row
        justifyContent="left"
        alignItems="center"
        sx={{
          width: "100%",
          height: "100%", // Full height of the screen
          backgroundColor: "#1E1E1E", // Black background
        }}
      >
        {/* PieChart using Chart.js */}
        <Box
          sx={{
            width: "50%", // Adjust the width of the pie chart
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingY: "12px",
            paddingLeft: "12px",
          }}
        >
          <Pie data={chartData} options={options} width={400} height={200} />
        </Box>
        {/* Custom Legend */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            ml: 4, // Add space between the chart and the legend
          }}
        >
          {/* Title at the top */}
          <Typography
            variant="h6"
            color="textPrimary"
            sx={{ mb: 1, my: 1, fontSize: "0.77rem" }}
          >
            Analyse des Catégories de Besoins
          </Typography>

          {/* Custom Legend below the title */}
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

export default CategorieBesoin;
