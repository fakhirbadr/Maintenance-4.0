import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
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

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // État pour basculer entre top 10 et tous les éléments
  const hasFetchedRef = useRef(false); // Référence pour suivre si la requête a déjà été effectuée

  // Récupérer les données de l'API
  useEffect(() => {
    if (hasFetchedRef.current) return; // Ne pas relancer la requête si elle a déjà été effectuée

    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        // Construction de l'URL avec les filtres
        let url = `${apiUrl}/api/v1/fournitureRoutes?isClosed=false&isDeleted=false`;

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
        const response = await axios.get(url, { signal });
        // console.log("Données de l'API:", response.data.fournitures);

        // Vérification que la réponse est un tableau
        if (response.data && Array.isArray(response.data.fournitures)) {
          // Regrouper les données par label et compter les occurrences
          const groupedData = response.data.fournitures.reduce((acc, item) => {
            const existingItem = acc.find((i) => i.label === item.besoin);
            if (existingItem) {
              existingItem.count += 1; // Incrémenter le compteur pour ce besoin
            } else {
              acc.push({ label: item.besoin, count: 1 });
            }
            return acc;
          }, []);

          // Trier par nombre de demandes décroissant
          const sortedData = groupedData.sort((a, b) => b.count - a.count);

          setBesoinData(sortedData);
          setError(null);
          hasFetchedRef.current = true; // Marquer la requête comme effectuée
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Erreur lors de la récupération des données :", error);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Appeler la fonction de récupération des données

    return () => {
      abortController.abort(); // Annuler la requête si le composant est démonté
    };
  }, [region, province, startDate, endDate]); // Dépendances mises à jour pour prendre en compte les filtres

  // Limiter l'affichage à 10 éléments ou tous les éléments
  const displayedData = useMemo(() => {
    return showAll ? besoinData : besoinData.slice(0, 15);
  }, [besoinData, showAll]);

  // Préparer les données pour le graphique
  const chartData = useMemo(() => {
    const labels = displayedData.map((item) => item.label);
    const counts = displayedData.map((item) => item.count);

    return {
      labels: labels,
      datasets: [
        {
          label: "Nombre de demandes",
          data: counts,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.dark,
          borderWidth: 1,
        },
      ],
    };
  }, [displayedData, theme]);

  // Options pour le graphique avec les labels en blanc
  const chartOptions = useMemo(
    () => ({
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
    }),
    []
  );

  // Fonction pour basculer entre afficher tout et afficher les 15 premiers
  const toggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  if (loading) {
    return (
      <Container
        sx={{
          backgroundColor:
            theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF",
          color: theme.palette.text.primary,
          minHeight: 300,
          borderRadius: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Chargement en cours...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        sx={{
          backgroundColor:
            theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF",
          color: theme.palette.text.primary,
          minHeight: 300,
          borderRadius: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="error">
          Erreur : {error}
        </Typography>
      </Container>
    );
  }

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
        Analyse des Quantités des Besoins selon les Types (en cours de
        traitement)
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
            onClick={toggleShowAll} // Bascule entre top 10 et tous les éléments
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: "0.75rem", // Taille de police réduite
              padding: "6px 12px", // Espacement interne réduit
            }}
          >
            {showAll ? "Afficher les 15 premiers" : "Afficher tout"}
          </Button>
        </>
      ) : (
        <Typography variant="h6">Aucune donnée disponible</Typography>
      )}
    </Container>
  );
};

export default TypesBesoin;
