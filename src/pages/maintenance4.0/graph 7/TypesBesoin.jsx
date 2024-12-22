import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { Typography, Container, Button, Box } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components of Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TypesBesoin = ({ region, province, startDate, endDate }) => {
  const theme = useTheme();
  const [besoinData, setBesoinData] = useState([]);
  const [showAll, setShowAll] = useState(false); // État pour basculer entre top 10 et tous les éléments

  // Récupérer les données de l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construction de l'URL avec les filtres
        let url = `https://backend-v1-e3bx.onrender.com/api/v1/fournitureRoutes?isClosed=true`;

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

        // Attente de la réponse de l'API
        const response = await axios.get(url);
        console.log("Données de l'API:", response.data);

        // Vérification que la réponse est un tableau
        if (response.data && Array.isArray(response.data)) {
          // Regrouper les données par label et cumuler les quantités
          const groupedData = response.data.reduce((acc, item) => {
            const existingItem = acc.find((i) => i.label === item.besoin);
            if (existingItem) {
              existingItem.quantity += item.quantite; // Cumul des quantités
            } else {
              acc.push({ label: item.besoin, quantity: item.quantite });
            }
            return acc;
          }, []);

          // Trier par quantité décroissante
          const sortedData = groupedData.sort(
            (a, b) => b.quantity - a.quantity
          );

          setBesoinData(sortedData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData(); // Appeler la fonction de récupération des données
  }, [region, province, startDate, endDate]); // Dépendances mises à jour pour prendre en compte les filtres

  // Limiter l'affichage à 10 éléments ou tous les éléments
  const displayedData = showAll ? besoinData : besoinData.slice(0, 10);

  // Préparer les données pour le graphique
  const labels = displayedData.map((item) => item.label);
  const quantities = displayedData.map((item) => item.quantity);

  // Options pour le graphique avec les labels en blanc
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Analyse des Quantités des Besoins selon les Types",
        data: quantities,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.dark,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "hidden" } },
    scales: {
      x: {
        ticks: {
          color: "#FFFFFF", // Couleur blanche pour les ticks de l'axe X
          font: {
            size: 10, // Taille de la police des labels sur l'axe X
          },
          maxRotation: 90, // Angle maximum pour la rotation des labels (en degrés)
          minRotation: 90, // Angle minimum pour la rotation des labels (en degrés)
        },
      },
      y: {
        ticks: {
          color: "#FFFFFF", // Couleur blanche pour les ticks de l'axe Y
        },
      },
    },
  };

  return (
    <Container
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF",
        color: theme.palette.text.primary,
        minHeight: 300,
        borderRadius: 2,
        width: "100%",
        position: "relative", // Ajouté pour positionner le bouton de manière absolue par rapport au conteneur
      }}
    >
      <Typography variant="h6" gutterBottom>
        Analyse des Quantités des Besoins selon les Types
      </Typography>
      {besoinData.length > 0 ? (
        <>
          <Bar
            data={chartData}
            options={chartOptions}
            height={320}
            width={1200} // Ajuste la largeur à 100% du conteneur
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowAll(!showAll)} // Bascule entre top 10 et tous les éléments
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: "0.75rem", // Taille de police réduite
              padding: "6px 12px", // Espacement interne réduit
            }}
          >
            {showAll ? "Afficher les 10 premiers" : "Afficher tout"}
          </Button>
        </>
      ) : (
        <Typography variant="h6">Aucune donnée disponible</Typography>
      )}
    </Container>
  );
};

export default TypesBesoin;
