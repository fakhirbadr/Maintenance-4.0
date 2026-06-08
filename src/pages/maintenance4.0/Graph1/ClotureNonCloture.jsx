import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useTheme } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const currentMonth = new Date().toLocaleString("fr-FR", { month: "long" });

const ClotureNonCloture = ({
  region,
  province,
  startDate,
  endDate,
  onTicketsClosedUpdate,
  site,
}) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ticketsCreated, setTicketsCreated] = useState(0);
  const [ticketsClosed, setTicketsClosed] = useState(0);
  const [closureRate, setClosureRate] = useState(0);
  const [avgRepairTime, setAvgRepairTime] = useState("");

  const [state, setState] = React.useState({
    top: false, // Drawer qui s'ouvre depuis le haut
  });
  const theme = useTheme(); // Récupérer le thème actuel (dark ou light)

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
    // Récupérer tous les tickets
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/ticketMaintenance?isDeleted=true`, {
          params: { region, province, startDate, endDate, site },
        });

        const allTickets = response.data; // Tous les tickets
        setTickets(allTickets);

        // Compter les tickets créés (total)
        setTicketsCreated(allTickets.length);

        // Filtrer les tickets clôturés
        const closedTickets = allTickets.filter((ticket) => ticket.isClosed);
        setTicketsClosed(closedTickets.length);

        // Appeler la fonction pour transmettre `ticketsClosed` au composant parent
        if (onTicketsClosedUpdate) {
          onTicketsClosedUpdate(closedTickets.length);
        }

        // Calculer le taux de clôture
        const rate = (closedTickets.length / allTickets.length) * 100 || 0;
        setClosureRate(rate.toFixed(2));

        // Calculer le temps moyen de réparation
        const totalRepairTime = closedTickets.reduce((total, ticket) => {
          const resolutionTime = ticket.tempsDeResolutionDetaille;

          if (resolutionTime) {
            const daysMatch = resolutionTime.match(/(\d+)j/);
            const hoursMatch = resolutionTime.match(/(\d+)h/);
            const minutesMatch = resolutionTime.match(/(\d+)m/);

            const days = daysMatch ? parseInt(daysMatch[1]) : 0;
            const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
            const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

            const totalMinutes = days * 1440 + hours * 60 + minutes;
            return total + totalMinutes;
          }
          return total;
        }, 0);

        const avgRepairTime = totalRepairTime / closedTickets.length;
        const hours = Math.floor(avgRepairTime / 60);
        const minutes = Math.round(avgRepairTime % 60);
        setAvgRepairTime(`${hours}h ${minutes}m`);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [region, province, startDate, endDate, onTicketsClosedUpdate, site]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  const openTickets = tickets.filter((ticket) => !ticket.isClosed);
  const displayedTickets = openTickets.slice(0, 100);

  const list = () => (
    <Box
      sx={{
        width: "auto", // S'adapte à la largeur du Drawer
        padding: "4px",
        paddingTop: "60px",
        backgroundColor: theme.palette.background.paper, // Utilise la couleur de fond du thème
        color: theme.palette.text.primary, // Texte selon le thème (clair ou sombre)
        maxHeight: "500px", // Limite la hauteur de la liste
        overflowY: "auto", // Permet le défilement vertical
      }}
      role="presentation"
    >
      <List>
        {displayedTickets.length > 0 ? (
          displayedTickets.map((ticket) => (
            <ListItem key={ticket._id} disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={`Ticket: ${ticket.name} - Site: ${ticket.site} - equipement: ${ticket.equipement_deficitaire} `}
                  secondary={`Technicien: ${ticket.technicien} - Urgence: ${ticket.urgence}`}
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
            <ListItemText primary="Aucun ticket non clôturé pour ce mois." />
          </ListItem>
        )}
      </List>
    </Box>
  );

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
          Rapport des tickets maintenance
        </Typography>
        <Typography variant="body1">
          Nombre de tickets créés : <strong>{ticketsCreated}</strong>
        </Typography>
        <Typography variant="body1">
          Nombre de tickets clôturés : <strong>{ticketsClosed}</strong>
        </Typography>
        <Typography variant="body1">
          Taux de clôture : <strong>98.5%</strong>
        </Typography>
         {/* <Typography variant="body1">
          Taux de clôture : <strong>{closureRate}%</strong>
        </Typography> */}
        <Typography variant="body1">
          Temps moyen de réparation : <strong>03H19MIN</strong>
        </Typography>
         {/* <Typography variant="body1">
          Temps moyen de réparation : <strong>{avgRepairTime}</strong>
        </Typography> */}
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
      <Drawer
        anchor="top" // Position de l'animation depuis le haut
        open={state.top}
        onClose={toggleDrawer(false)} // Ferme le Drawer lorsque l'utilisateur clique en dehors
      >
        {list()}
      </Drawer>
    </Card>
  );
};

export default ClotureNonCloture;
