import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import {
  Typography,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const Tr = () => {
  const theme = useTheme();
  const [tr, setTr] = useState([]); // Données brutes
  const [filteredData, setFilteredData] = useState([]); // Données filtrées
  const [selectedName, setSelectedName] = useState(""); // Nom sélectionné
  const [names, setNames] = useState([]); // Liste des noms disponibles

  // Fonction pour convertir un temps formaté (jj/hh/mm) en heures
  const convertToHours = (timeString) => {
    const regex = /(\d+)j\s*(\d+)h\s*(\d+)m/; // Extraction des jours, heures et minutes
    const match = timeString.match(regex);
    if (match) {
      const days = parseInt(match[1], 10) || 0;
      const hours = parseInt(match[2], 10) || 0;
      const minutes = parseInt(match[3], 10) || 0;
      return days * 24 + hours + minutes / 60; // Conversion en heures
    }
    return 0; // Valeur par défaut si le format est incorrect
  };

  // Fonction pour formater un temps en heures vers jj / hh / mm
  const formatTime = (totalHours) => {
    const days = Math.floor(totalHours / 24);
    const hours = Math.floor(totalHours % 24);
    const minutes = Math.round((totalHours % 1) * 60);
    return `${days}j / ${hours}h / ${minutes}m`;
  };

  // Fonction pour calculer la moyenne du temps de réponse
  const calculateAverageResponseTime = (data) => {
    if (data && data.length > 0) {
      const totalResponseTime = data.reduce(
        (acc, item) => acc + convertToHours(item.tempsDeResolutionDetaille),
        0
      );
      const averageTime = totalResponseTime / data.length;
      return formatTime(averageTime); // Moyenne au format jj / hh / mm
    }
    return "0j / 0h / 0m"; // Aucune donnée
  };

  // Effet pour récupérer les données de l'API
  useEffect(() => {
    axios
      .get(
        "https://backend-v1-e3bx.onrender.com/api/v1/fournitureRoutes?isClosed=true"
      )
      .then((response) => {
        console.log("Données brutes reçues de l'API:", response.data);
        const data = response.data; // Utiliser directement les données reçues
        if (data && Array.isArray(data)) {
          setTr(data); // Données brutes
          setFilteredData(data); // Initialiser avec toutes les données

          // Extraire les noms uniques
          const uniqueNames = [...new Set(data.map((item) => item.name))];
          console.log("Noms uniques extraits:", uniqueNames);
          setNames(uniqueNames);
        } else {
          console.error("Structure inattendue dans les données:", data);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données:", error);
      });
  }, []);

  // Temps moyen de réponse global
  const overallAverageResponseTime = calculateAverageResponseTime(filteredData);

  // Fonction pour filtrer par nom
  const handleFilterByName = (event) => {
    const name = event.target.value;
    setSelectedName(name);
    if (name) {
      const filtered = tr.filter((item) => item.name === name);
      console.log(`Données filtrées pour le nom "${name}":`, filtered);
      setFilteredData(filtered);
    } else {
      console.log("Réinitialisation des données filtrées");
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
      <Typography variant="h6" gutterBottom>
        Temps de Réponse Moyen Global
      </Typography>

      {/* Affichage du temps moyen global */}
      <Typography variant="h5" color={theme.palette.primary.main} gutterBottom>
        {overallAverageResponseTime !== "0j / 0h / 0m"
          ? overallAverageResponseTime
          : "Aucune donnée disponible"}
      </Typography>

      {/* Filtre par nom */}
      <FormControl sx={{ mt: 2, minWidth: 200 }}>
        <InputLabel id="filter-by-name-label">Filtrer par Nom</InputLabel>
        <Select
          labelId="filter-by-name-label"
          value={selectedName}
          onChange={handleFilterByName}
          label="Filtrer par Nom"
        >
          <MenuItem value="">Tous les noms</MenuItem>
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Container>
  );
};

export default Tr;
