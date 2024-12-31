import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import { useTheme } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";

const currentMonth = new Date().toLocaleString("fr-FR", { month: "long" });

const BesoinVehicule = () => {
  const [ticketVehicules, setTicketVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [state, setState] = useState({
    top: false,
  });

  const theme = useTheme(); // Get current theme (light or dark)

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, top: open });
  };

  useEffect(() => {
    const fetchTicketVehicules = async () => {
      try {
        const response = await axios.get(
          "https://backend-v1-1.onrender.com/api/ticketvehicules"
        );
        setTicketVehicules(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketVehicules();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Calculate statistics
  const ticketsCreated = ticketVehicules.length;
  const ticketsClosed = ticketVehicules.filter(
    (ticket) => ticket.isClosed
  ).length;
  const closureRate = ticketsCreated
    ? ((ticketsClosed / ticketsCreated) * 100).toFixed(2)
    : 0;

  // Filter out closed tickets
  const openTickets = ticketVehicules.filter((ticket) => !ticket.isClosed);

  const list = () => (
    <Box
      sx={{
        width: "auto",
        padding: "4px",
        paddingTop: "60px",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        maxHeight: "500px",
        overflowY: "auto",
      }}
      role="presentation"
    >
      <List>
        {openTickets.length > 0 ? (
          openTickets.map((ticket) => (
            <ListItem key={ticket._id} disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={`Nom complet: ${ticket.technicien} - Catégorie: ${ticket.categorie} - : ${ticket.commande} -immatriculation:${ticket.immatriculation}`}
                  secondary={`Urgence: ${ticket.urgence} - Statut: ${ticket.status}`}
                  sx={{ fontSize: "6px" }}
                />
                {/* Display the time passed since the ticket was created */}
                <span style={{ fontSize: "12px", marginLeft: "auto" }}>
                  {formatDistanceToNow(new Date(ticket.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="Aucun ticket véhicule disponible." />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography
          gutterBottom
          className=" uppercase"
          sx={{ color: "text.secondary", fontSize: 14 }}
        >
          Demande véhicule
        </Typography>
        <Typography
          sx={{ fontSize: "13px", marginBottom: "5px" }}
          component="div"
        >
          Rapport des tickets véhicule
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
        <Typography variant="body1">
          Temps de réponse : <strong> 00h 00m</strong>
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          onClick={toggleDrawer(true)}
          variant="contained"
          color="primary"
        >
          Voir les détails
        </Button>
      </CardActions>
      {/* Drawer qui s'ouvre depuis le haut */}
      <Drawer anchor="top" open={state.top} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </Card>
  );
};

export default BesoinVehicule;
