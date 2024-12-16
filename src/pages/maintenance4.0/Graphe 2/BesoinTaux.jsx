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
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";

const currentMonth = new Date().toLocaleString("fr-FR", { month: "long" });

const BesoinTaux = () => {
  const [fournitures, setFournitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fournituresCreated, setFournituresCreated] = useState(0);
  const [fournituresClosed, setFournituresClosed] = useState(0);
  const [closureRate, setClosureRate] = useState(0);

  const [state, setState] = useState({
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
    // Récupérer toutes les fournitures
    const fetchFournitures = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/fournitureRoutes",
          {
            params: {
              // Vous pouvez ajuster ce filtre pour obtenir les fournitures ouvertes ou fermées
            },
          }
        );

        const allFournitures = response.data; // Toutes les fournitures
        setFournitures(allFournitures);

        // Compter les fournitures créées (total)
        setFournituresCreated(allFournitures.length);

        // Compter les fournitures fermées
        const closedFournitures = allFournitures.filter(
          (fourniture) => fourniture.isClosed
        );
        setFournituresClosed(closedFournitures.length);

        // Calculer le taux de clôturation
        const rate =
          (closedFournitures.length / allFournitures.length) * 100 || 0;
        setClosureRate(rate.toFixed(2)); // Fixer à 2 décimales
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFournitures(); // Appeler la fonction lors de l'appel du composant
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  const openFournitures = fournitures.filter(
    (fourniture) => !fourniture.isClosed
  );
  const displayedFournitures = openFournitures.slice(0, 100);

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
        {displayedFournitures.length > 0 ? (
          displayedFournitures.map((fourniture) => (
            <ListItem key={fourniture._id} disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={`Site: ${fourniture.name} - Categorie: ${fourniture.categorie} - Equipement: ${fourniture.besoin}`}
                  secondary={`Technicien: ${fourniture.technicien} - Statut: ${fourniture.status}`}
                  sx={{ fontSize: "6px" }}
                />
                {/* Display the time passed since the fourniture was created */}
                <span style={{ fontSize: "12px", marginLeft: "auto" }}>
                  {formatDistanceToNow(new Date(fourniture.dateCreation), {
                    addSuffix: true,
                  })}
                </span>
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="Aucune fourniture non clôturée pour ce mois." />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          FOURNITURES/COMMANDES
        </Typography>
        <Typography
          sx={{ fontSize: "13px", marginBottom: "5px" }}
          component="div"
        >
          Rapport des fournitures/commandes pour le mois de -{" "}
          <span className="text-blue-800 uppercase font-bold">
            {currentMonth}
          </span>
        </Typography>
        <Typography variant="body1">
          Nombre de fournitures créées : <strong>{fournituresCreated}</strong>
        </Typography>
        <Typography variant="body1">
          Nombre de fournitures clôturées : <strong>{fournituresClosed}</strong>
        </Typography>
        <Typography variant="body1">
          Taux de clôturation : <strong>{closureRate}%</strong>
        </Typography>
      </CardContent>
      <CardActions>
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

export default BesoinTaux;
