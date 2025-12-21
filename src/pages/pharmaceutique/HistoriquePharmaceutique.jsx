import React, { useEffect, useState } from "react";
import { Typography, Box, Chip, Alert } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;


const HistoriquePharmaceutique = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${apiUrl}/api/v1/ticketPharmaceutique`, { headers });
      // Filtrer pour n'afficher que les tickets clôturés
      setRows((res.data || []).filter(t => t.isClosed));
    } catch (err) {
      setError("Erreur lors du chargement de l'historique.");
    }
    setLoading(false);
  };

  const columns = [
    { name: "name", label: "Nom unité", options: { filter: true, sort: true } },
    { name: "region", label: "Région", options: { filter: true, sort: true } },
    { name: "province", label: "Province", options: { filter: true, sort: true } },
    { name: "besoin", label: "Besoin", options: { filter: true, sort: true } },
    { name: "quantite", label: "Quantité", options: { filter: true, sort: true } },
    { name: "technicien", label: "Demandeur", options: { filter: true, sort: true } },
    { name: "status", label: "Statut", options: { filter: true, sort: true,
      customBodyRender: (value) => <Chip label={value} color={value === "clôturé" ? "success" : value === "rejeté" ? "error" : "primary"} size="small" />
    } },
    { name: "commentaire", label: "Commentaire", options: { filter: false, sort: false } },
    { name: "dateCreation", label: "Date de création", options: {
        filter: false, sort: true,
        customBodyRender: (value) => value ? new Date(value).toLocaleString("fr-FR") : ""
      }
    },
    { name: "dateCloture", label: "Date clôture", options: {
        filter: false, sort: true,
        customBodyRender: (value) => value ? new Date(value).toLocaleString("fr-FR") : ""
      }
    },
  ];

  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 50, 100],
    search: true,
    download: false,
    print: false,
    textLabels: {
      body: { noMatch: loading ? "Chargement..." : "Aucune donnée" },
    },
  };

  const getMuiTheme = () =>
    createTheme({
      typography: { fontFamily: "sans-serif" },
      palette: { mode: "dark" },
    });

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Historique des Besoins Pharmaceutiques
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={"Historique Pharmaceutique"}
          data={rows}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </Box>
  );
};

export default HistoriquePharmaceutique;
