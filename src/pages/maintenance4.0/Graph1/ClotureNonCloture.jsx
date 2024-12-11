import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);
const currentMonth = new Date().toLocaleString("fr-FR", { month: "long" });
const ticketsCreated = Math.floor(Math.random() * 100); // Génère un nombre entier entre 0 et 99
const ticketsClosed = Math.floor(Math.random() * 100);
const closureRate = Math.floor(Math.random() * 100);
const ClotureNonCloture = () => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          TICKET DE MAINTENANCE{" "}
        </Typography>
        <Typography
          sx={{ fontSize: "13px", marginBottom: "5px" }}
          component="div"
        >
          Rapport des tickets maintenance pour le mois de -{" "}
          {
            <span className="text-blue-800 uppercase font-bold">
              {currentMonth}
            </span>
          }
        </Typography>
        <Typography variant="body1">
          Nombre de tickets créés : <strong>{ticketsCreated}</strong>
        </Typography>
        <Typography variant="body1">
          Nombre de tickets clôturés : <strong>{ticketsClosed}</strong>
        </Typography>
        <Typography variant="body1">
          Taux de clôturation : <strong>{closureRate}%</strong>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default ClotureNonCloture;
