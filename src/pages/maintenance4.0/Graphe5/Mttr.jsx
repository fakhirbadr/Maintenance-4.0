import React, { useState, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const Mttr = ({ region, province, startDate, endDate }) => {
  const theme = useTheme();
  const [mttr, setMttr] = useState(null); // State to store the calculated MTTR
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const [hasError, setHasError] = useState(false); // State to handle errors

  // Fetch data for the region passed as a prop
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    let url =
      "https://backend-v1-1.onrender.com/api/v1/ticketMaintenance?isClosed=true&currentMonth=true";

    // Ajouter la région et la province à l'URL si elles sont fournies
    if (region) {
      url += `&region=${region}`;
    }
    if (province) {
      url += `&province=${province}`;
    }

    // Ajouter startDate et endDate à l'URL si elles sont fournies
    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    if (endDate) {
      url += `&endDate=${endDate}`;
    }

    axios
      .get(url)
      .then((response) => {
        const data = response.data;

        if (data.length === 0) {
          setMttr(0); // Pas de données, définir MTTR à 0
        } else {
          // Filtrer les données pour exclure les tickets sans 'tempsDeResolutionDetaille'
          const validTickets = data.filter(
            (ticket) => ticket.tempsDeResolutionDetaille
          );

          if (validTickets.length === 0) {
            setMttr(0); // Pas de tickets valides, définir MTTR à 0
          } else {
            // Calculer le temps total de résolution
            const totalMinutes = validTickets.reduce((total, ticket) => {
              const resolutionTime =
                ticket.tempsDeResolutionDetaille || "0j 0h 0m";
              const [days, hours, minutes] = resolutionTime
                .split(" ")
                .map((time) => {
                  const value = parseInt(time, 10);
                  return isNaN(value) ? 0 : value;
                });

              const totalTicketMinutes = days * 24 * 60 + hours * 60 + minutes;
              return total + totalTicketMinutes;
            }, 0);

            const averageMttr = totalMinutes / validTickets.length;
            setMttr(averageMttr);

            // Log des calculs dans la console
            console.log("Total Minutes:", totalMinutes);
            console.log("Average MTTR:", averageMttr);
            console.log(data); // Vérifiez ici la structure de vos données
          }
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données", error);
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [region, province, startDate, endDate]); // Ajouter startDate et endDate comme dépendances

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF",
        color: theme.palette.text.primary,
        minHeight: 300,
        borderRadius: 0,
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ textTransform: "uppercase", fontWeight: "bold" }}
        >
          Temps moyen de réparation
        </Typography>
        <Typography variant="body2" textAlign="center" mt={1}>
          Le temps moyen nécessaire pour réparer un système défaillant et le
          restaurer dans toutes ses fonctions
        </Typography>
      </Box>
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading ? (
            <Typography variant="h6" color={theme.palette.primary.main}>
              Chargement...
            </Typography>
          ) : hasError ? (
            <Typography variant="h6" color="error">
              Erreur de chargement
            </Typography>
          ) : (
            <Typography variant="h6" color={theme.palette.primary.main}>
              {mttr
                ? `${Math.floor(mttr / 1440)} j ${Math.floor(
                    (mttr % 1440) / 60
                  )} h ${Math.floor(mttr % 60)} m ${((mttr % 1) * 60).toFixed(
                    0
                  )} s`
                : "00 j : 00 h : 00 m : 00 s"}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Mttr;
