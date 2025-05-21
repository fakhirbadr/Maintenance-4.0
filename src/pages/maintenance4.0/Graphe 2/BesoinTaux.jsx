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
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const BesoinTaux = ({
  region,
  province,
  startDate,
  endDate,
  onFournituresClosedUpdate,
}) => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state, setState] = useState({ top: false });

  const theme = useTheme();

  // Fetch merged-data API for global stats
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("isDeleted", "false");
        if (region) params.append("region", region);
        if (province) params.append("province", province);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const url = `${apiUrl}/api/v1/merged-data?${params.toString()}`;
        const response = await axios.get(url);
        setApiData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [region, province, startDate, endDate]);

  // Drawer
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, top: open });
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  // Use stats from /api/v1/merged-data
  const globalStats = apiData?.globalStats || {};
  // Default fallback
  const totalTickets = globalStats.totalTickets ?? "-";
  const totalClosed = globalStats.totalClosed ?? "-";
  const avgResolutionTime = globalStats.avgResolutionTime ?? "-";
  const satisfactionRate =
    typeof globalStats.satisfactionRate === "number"
      ? globalStats.satisfactionRate.toFixed(2) + "%"
      : globalStats.satisfactionRate || "-";

  // You can customize the Drawer list here if needed
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
        <ListItem>
          <ListItemText
            primary="Détails des métriques globales"
            sx={{ fontWeight: "bold" }}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={`Besoin exprimé : ${totalTickets}`}
            secondary="Nombre de tickets créés"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Besoin satisfait : ${totalClosed}`}
            secondary="Nombre de tickets clôturés"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Délai en jours (Besoin satisfait) : ${avgResolutionTime}`}
            secondary="Temps moyen de résolution"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Taux de satisfaction : ${satisfactionRate}`}
            secondary="(clôturés/exprimés)"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          SYNTHÈSE DES BESOINS
        </Typography>
        <Typography
          sx={{ fontSize: "13px", marginBottom: "5px" }}
          component="div"
        >
          Rapport global des demandes
        </Typography>
        <Typography variant="body1">
          Besoin exprimé : <strong>{totalTickets}</strong>
        </Typography>
        <Typography variant="body1">
          Besoin satisfait : <strong>{totalClosed}</strong>
        </Typography>
        <Typography variant="body1">
          Délai en jours (Besoin satisfait) :{" "}
          <strong>{avgResolutionTime}</strong>
        </Typography>
        <Typography variant="body1">
          Taux de satisfaction : <strong>{satisfactionRate}</strong>
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
      <Drawer anchor="top" open={state.top} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </Card>
  );
};

export default BesoinTaux;
