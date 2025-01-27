import React, { useState, useEffect } from "react";
import { Box, Typography, Chip } from "@mui/material";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const DataDetails = ({ ticket }) => {
  if (!ticket) return null; // If no ticket is selected, return nothing.

  const [timeElapsed, setTimeElapsed] = useState("");

  // Fonction pour formater la date avec heure et minutes
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleDateString("fr-FR", options);
  };

  // Fonction pour calculer le temps écoulé
  const calculateTimeElapsed = (date) => {
    const now = new Date();
    const startDate = new Date(date);
    const diffInMs = now - startDate; // Différence en millisecondes

    const seconds = Math.floor((diffInMs / 1000) % 60);
    const minutes = Math.floor((diffInMs / (1000 * 60)) % 60);
    const hours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return `${days}j ${hours}h ${minutes}m ${seconds}s`;
  };

  // Mettre à jour dynamiquement le chronomètre
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed(ticket.createdAt));
    }, 1000); // Met à jour chaque seconde

    return () => clearInterval(interval); // Nettoie l'intervalle lors du démontage du composant
  }, [ticket.createdAt]);

  // Fonction pour obtenir la couleur de l'urgence
  const getUrgencyColor = (urgence) => {
    if (urgence === "élevée") {
      return "error"; // Urgence élevée = Rouge
    } else if (urgence === "moyenne") {
      return "warning"; // Urgence modérée = Jaune
    } else {
      return "success"; // Urgence faible = Vert
    }
  };

  return (
    <Box
      sx={{
        fontFamily: "Roboto",
        lineHeight: "1.5",
        spaceY: 3,
        fontSize: "1.25rem",
      }}
    >
      <Typography variant="body1">
        <strong>Site:</strong>
        <span style={{ marginLeft: "8px" }}>{ticket.site}</span>
      </Typography>
      <Typography variant="body1">
        <strong>Province:</strong>
        <span style={{ marginLeft: "8px" }}>{ticket.province}</span>
      </Typography>
      <Typography variant="body1">
        <strong>Nom:</strong>
        <span style={{ marginLeft: "8px" }}>{ticket.name}</span>
      </Typography>
      <Typography variant="body1">
        <strong>Technicien:</strong>
        <span style={{ marginLeft: "8px" }}>{ticket.technicien}</span>
      </Typography>
      <Typography variant="body1">
        <strong>Catégorie:</strong>
        <span style={{ marginLeft: "8px" }}>{ticket.categorie}</span>
      </Typography>
      <Typography variant="body1">
        <strong>Description:</strong>
        <span style={{ marginLeft: "8px" }}>{ticket.description}</span>
      </Typography>
      <Typography variant="body1">
        <strong>Commentaire responsable:</strong>
        <span style={{ marginLeft: "8px" }}>{ticket.commentaire}</span>
      </Typography>
      <Typography variant="body1">
        <strong>Équipement défectueux:</strong>
        <span style={{ marginLeft: "8px" }}>
          {ticket.equipement_deficitaire}
        </span>
      </Typography>
      <Typography variant="body1">
        <strong>Urgence:</strong>
        <Chip
          label={ticket.urgence}
          color={getUrgencyColor(ticket.urgence)}
          sx={{ marginLeft: "8px" }}
        />
      </Typography>
      <Typography variant="body1">
        <strong>Date de création:</strong>
        <span style={{ marginLeft: "8px" }}>
          {formatDate(ticket.createdAt)}
        </span>
        <span style={{ marginLeft: "16px", color: "gray" }}>
          (il y a {timeElapsed})
        </span>
      </Typography>
    </Box>
  );
};

export default DataDetails;
