import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { Button, Typography, Container } from "@mui/material";

const Tr = () => {
  const theme = useTheme();
  const [tr, setTr] = useState([]); // Données brutes
  const [filteredData, setFilteredData] = useState([]); // Données filtrées
  const [isFiltered, setIsFiltered] = useState(false);

  // Fonction pour calculer la moyenne du temps de réponse
  const calculateAverageResponseTime = (data) => {
    if (data && data.length > 0) {
      const totalResponseTime = data.reduce(
        (acc, item) => acc + item.responseTime, // Remplacez par le champ correct
        0
      );
      return totalResponseTime / data.length; // Moyenne
    }
    return 0; // Aucune donnée
  };

  // Effet pour récupérer les données de l'API
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/fournitureRoutes?isClosed=true")
      .then((response) => {
        const data = response.data.tempsDeResolutionDetaille;
        setTr(data); // Données brutes
        setFilteredData(data); // Initialiser avec toutes les données
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données", error);
      });
  }, []);

  // Temps moyen de réponse global
  const overallAverageResponseTime = calculateAverageResponseTime(tr);

  // Fonction de filtre pour les données
  const handleFilter = () => {
    setIsFiltered(!isFiltered);
    if (!isFiltered) {
      // Filtrer les données selon une condition
      const filtered = tr.filter((item) => item.someCondition === true);
      setFilteredData(filtered);
    } else {
      setFilteredData(tr); // Réinitialiser les données filtrées
    }
  };

  return (
    <Container
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF",
        color: theme.palette.text.primary,
        minHeight: 240,
        borderRadius: 0,
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Temps de Réponse Moyen Global
      </Typography>

      {/* Affichage du temps moyen global */}
      <Typography variant="h5" color={theme.palette.primary.main} gutterBottom>
        {overallAverageResponseTime > 0
          ? `${overallAverageResponseTime.toFixed(2)} heures`
          : "Aucune donnée disponible"}
      </Typography>

      {/* Bouton de filtre */}
      <Button variant="contained" onClick={handleFilter} sx={{ mt: 2 }}>
        {isFiltered ? "Afficher toutes les données" : "Filtrer les données"}
      </Button>
    </Container>
  );
};

export default Tr;
