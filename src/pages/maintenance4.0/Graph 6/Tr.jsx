import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { Button, Typography, Container } from "@mui/material";

const Tr = () => {
  const theme = useTheme();
  const [tr, setTr] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  // Fonction pour calculer la moyenne du temps de réponse
  const calculateAverageResponseTime = (data) => {
    if (data && data.length > 0) {
      const totalResponseTime = data.reduce(
        (acc, item) => acc + item.responseTime,
        0
      );
      return totalResponseTime / data.length;
    }
    return 0;
  };

  // Effet pour récupérer les données de l'API
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/fournitureRoutes?isClosed=true")
      .then((response) => {
        const date = response.data;
        setTr(date);
        setFilteredData(date);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données", error);
      });
  }, []);

  // Filtrage des données
  const handleFilter = () => {
    setIsFiltered(!isFiltered);
    if (!isFiltered) {
      // Exemple de filtrage (vous pouvez personnaliser selon vos besoins)
      setFilteredData(tr.filter((item) => item.someCondition === true));
    } else {
      setFilteredData(tr);
    }
  };

  // Calcul de la moyenne du temps de réponse
  const averageResponseTime = calculateAverageResponseTime(filteredData);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Temps de Réponse Moyenne
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        La moyenne du temps de réponse des routes fournies.
      </Typography>

      {/* Affichage de la moyenne du temps de réponse */}
      <Typography variant="h5" color={theme.palette.primary.main} gutterBottom>
        {averageResponseTime > 0
          ? `Moyenne: ${averageResponseTime.toFixed(2)} heures`
          : "Aucune donnée disponible"}
      </Typography>

      {/* Affichage du TR */}
      <Typography variant="body1" gutterBottom>
        {filteredData ? (
          filteredData.map((item, index) => (
            <div key={index}>
              <Typography variant="body2">{` ${item.name}: ${item.responseTime} heures`}</Typography>
            </div>
          ))
        ) : (
          <Typography variant="body2">Chargement des données...</Typography>
        )}
      </Typography>

      {/* Bouton de filtre */}
      <Button variant="contained" onClick={handleFilter}>
        {isFiltered ? "Afficher toutes les données" : "Filtrer les données"}
      </Button>
    </Container>
  );
};

export default Tr;
