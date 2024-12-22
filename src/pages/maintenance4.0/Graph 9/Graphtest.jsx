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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CategorieMaintenance = ({ region, province, startDate, endDate }) => {
  const [data, setData] = useState([]); // Données pour le PieChart
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs
  const [categories, setCategories] = useState([]); // Toutes les catégories disponibles
  const [selectedCategory, setSelectedCategory] = useState(""); // Catégorie filtrée

  // Fonction pour récupérer les données de l'API
  const fetchData = async () => {
    try {
      // Construction de l'URL avec les filtres
      let url = `https://backend-v1-e3bx.onrender.com/api/v1/ticketMaintenance?isClosed=true`;

      if (region) {
        url += `&region=${region}`;
      }
      if (province) {
        url += `&province=${province}`;
      }
      if (startDate) {
        url += `&startDate=${startDate}`; // Ajout du filtre startDate
      }
      if (endDate) {
        url += `&endDate=${endDate}`; // Ajout du filtre endDate
      }
      const response = await axios.get(url);

      console.log("API Response:", response.data);

      if (Array.isArray(response.data)) {
        const tickets = response.data;

        // Extraire toutes les catégories disponibles
        const uniqueCategories = Array.from(
          new Set(tickets.map((ticket) => ticket.categorie || "Inconnu"))
        );
        setCategories(uniqueCategories);

        // Grouper les tickets par catégorie
        const categoriesData = tickets.reduce((acc, ticket) => {
          const category = ticket.categorie || "Inconnu";
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Calculer le total des tickets pour les pourcentages
        const totalTickets = tickets.length;

        // Transformer les données pour le PieChart
        const chartData = Object.entries(categoriesData).map(
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
  }, [region, province, startDate, endDate]);

  // Filtrer les données en fonction de la catégorie sélectionnée
  const filteredData = selectedCategory
    ? data.filter((item) => item.label.startsWith(selectedCategory))
    : data;

  // Préparer les données pour Chart.js
  const chartData = {
    labels: filteredData.map((item) => item.label),
    datasets: [
      {
        data: filteredData.map((item) => item.value),
        backgroundColor: ["#FFFA8B", "#8BFFF9", "#6CBCFF", "#FF98EF", ""],
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

  // Options pour désactiver la légende par défaut
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Thème Material-UI
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!data || data.length === 0) return <div>Aucune donnée disponible.</div>;

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
            height: "240px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "12px",
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
            sx={{
              mb: 1,
              my: 1,
              mr: 3,
              fontSize: "0.72rem",
              whiteSpace: "nowrap", // Empêche le texte de sauter à la ligne
              overflow: "hidden", // Facultatif : cache le texte qui dépasse
              textOverflow: "ellipsis", // Facultatif : ajoute "..." si le texte est trop long
            }}
          >
            Tickets de Maintenance par Catégorie d'équipment
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

export default CategorieMaintenance;
