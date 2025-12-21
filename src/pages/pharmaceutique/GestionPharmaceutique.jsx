
import React, { useEffect, useState } from "react";
import { Typography, Box, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const GestionPharmaceutique = () => {
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
      // Filtrer pour n'afficher que les tickets non clôturés
      setRows((res.data || []).filter(t => !t.isClosed));
    } catch (err) {
      setError("Erreur lors du chargement des tickets pharmaceutiques.");
    }
    setLoading(false);
  };

  // Statuts possibles
  const statusList = [
    "créé", "Ouvert", "En cours", "Achat par le support", "En attendant le déblocage de la caisse",
    "Reçu par le support", "Expédié", "Demandé aux achats", "Demandé à Biopetra", "Demandé à la pharmacie",
    "En cours de livraison", "Achat sur place", "Livré"
  ];

  // Dialog état
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Ouvre le dialog de changement de statut
  const handleOpenStatusDialog = (row) => {
    setSelectedRow(row);
    setNewStatus(row.status);
    setOpenStatusDialog(true);
    setActionError("");
    setActionSuccess("");
  };
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedRow(null);
    setNewStatus("");
    setActionError("");
    setActionSuccess("");
  };

  // Envoie la modification de statut
  const handleStatusUpdate = async () => {
    if (!selectedRow) return;
    setIsActionLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(`${apiUrl}/api/v1/ticketPharmaceutique/${selectedRow._id}`, { status: newStatus }, { headers });
      setActionSuccess("Statut mis à jour.");
      fetchTickets();
      setTimeout(() => handleCloseStatusDialog(), 1000);
    } catch (err) {
      setActionError("Erreur lors de la mise à jour du statut.");
    }
    setIsActionLoading(false);
  };

  // Clôturer une demande
  const handleCloture = async (row) => {
    setIsActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(`${apiUrl}/api/v1/ticketPharmaceutique/${row._id}/close`, {}, { headers });
      setActionSuccess("Demande clôturée.");
      fetchTickets();
      setTimeout(() => setActionSuccess(""), 1200);
    } catch (err) {
      setActionError("Erreur lors de la clôture.");
    }
    setIsActionLoading(false);
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
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const row = rows[dataIndex];
          return (
            <Box display="flex" gap={1}>
              <Button size="small" variant="outlined" color="primary" onClick={() => handleOpenStatusDialog(row)} disabled={row.status === "clôturé" || row.isClosed}>
                Changer statut
              </Button>
              <Button size="small" variant="contained" color="success" onClick={() => handleCloture(row)} disabled={row.status === "clôturé" || row.isClosed}>
                Clôturer
              </Button>
            </Box>
          );
        },
      },
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
        Gestion des Besoins Pharmaceutiques
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {actionError && <Alert severity="error">{actionError}</Alert>}
      {actionSuccess && <Alert severity="success">{actionSuccess}</Alert>}
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={"Tickets Pharmaceutiques"}
          data={rows}
          columns={columns}
          options={options}
        />
      </ThemeProvider>

      {/* Dialog changement de statut */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Changer le statut</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Nouveau statut</InputLabel>
            <Select
              value={newStatus}
              label="Nouveau statut"
              onChange={e => setNewStatus(e.target.value)}
            >
              {statusList.map((status, idx) => (
                <MenuItem key={idx} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Annuler</Button>
          <Button onClick={handleStatusUpdate} disabled={isActionLoading} variant="contained">Valider</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionPharmaceutique;
