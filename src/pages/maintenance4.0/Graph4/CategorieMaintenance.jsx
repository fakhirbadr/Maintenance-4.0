import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart } from "@mui/x-charts";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
} from "@mui/material";

const CategorieMaintenance = () => {
  const [data, setData] = useState([]); // Données pour le PieChart
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs

  // Fonction pour récupérer les données de l'API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/ticketMaintenance?isClosed=true"
      );

      console.log("API Response:", response.data);

      // Vérification du format de la réponse API
      if (Array.isArray(response.data)) {
        const tickets = response.data;

        // Grouper les tickets par catégorie
        const categories = tickets.reduce((acc, ticket) => {
          const category = ticket.name || "Inconnu"; // Utiliser "Inconnu" si le champ est manquant
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Calcul du total des tickets pour le calcul du pourcentage
        const totalTickets = tickets.length;

        // Transformer les données pour le PieChart, incluant le pourcentage
        const chartData = Object.entries(categories).map(
          ([category, count]) => ({
            id: category,
            value: count,
            label: `${category} (${((count / totalTickets) * 100).toFixed(
              1
            )}%) ${count}`, // Ajouter le pourcentage
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
  }, []);

  // Thème Material-UI
  const theme = createTheme({
    palette: {
      mode: "dark", // Dark mode enabled for the whole theme
    },
  });

  // Gestion des états (chargement, erreur, données)
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!data || data.length === 0) return <div>Aucune donnée disponible.</div>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="column" // Stack the title and chart vertically
        justifyContent="center"
        alignItems="center"
        sx={{
          width: "100%",
          height: "100%", // Full height of the screen
          backgroundColor: "#1E1E1E", // Black background
        }}
      >
        {/* Title */}
        <Typography variant="h6" color="textPrimary" sx={{ mb: 2 }}>
          Pourcentage des catégories de maintenance
        </Typography>

        {/* PieChart */}
        <Box
          sx={{
            width: "100%", // Adjust the width if necessary
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PieChart
            series={[{ data }]} // Pass data inside series
            innerRadius={50}
            width={400}
            height={200}
            sx={{
              "& text": {
                fill: theme.palette.text.secondary, // Ensure text is readable in dark mode
                fontSize: "4px", // Adjust the font size of the labels
                textAnchor: "start", // Align text to the center of the slice
                dominantBaseline: "middle", // Vertically center the text
                transform: "translate(-10, -10px)", // Adjust vertical positioning, if needed
              },
            }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CategorieMaintenance;
