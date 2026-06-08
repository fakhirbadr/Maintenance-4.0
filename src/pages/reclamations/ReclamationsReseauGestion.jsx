import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const statutList = ["en attente", "en cours", "résolue"];

const ReclamationsReseauGestion = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [statut, setStatut] = useState("");
  const [commentaireAdmin, setCommentaireAdmin] = useState("");

  useEffect(() => {
    fetchReclamations();
  }, []);

  const fetchReclamations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${apiUrl}/api/v1/reclamationsReseau`, {
        headers,
      });
      setRows(res.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des réclamations réseau.");
    }
    setLoading(false);
  };

  const handleOpenDialog = (row) => {
    setSelected(row);
    setStatut(row.statut);
    setCommentaireAdmin(row.commentaireAdmin || "");
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelected(null);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(
        `${apiUrl}/api/v1/reclamationsReseau/${selected._id}`,
        { statut, commentaireAdmin },
        { headers }
      );
      handleCloseDialog();
      fetchReclamations();
    } catch (err) {
      setError("Erreur lors de la mise à jour.");
    }
  };

  const columns = [
    {
      name: "nomComplet",
      label: "Utilisateur",
      options: { filter: true, sort: true },
    },
    {
      name: "debitDownload",
      label: "Download (Mbps)",
      options: { filter: false, sort: true },
    },
    {
      name: "debitUpload",
      label: "Upload (Mbps)",
      options: { filter: false, sort: true },
    },
    {
      name: "commentaire",
      label: "Commentaire",
      options: { filter: false, sort: false },
    },
    {
      name: "dateCreation",
      label: "Date",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) =>
          value ? new Date(value).toLocaleString("fr-FR") : "",
      },
    },
    {
      name: "statut",
      label: "Statut",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
          <Chip
            label={value}
            color={
              value === "résolue"
                ? "success"
                : value === "en cours"
                ? "info"
                : "warning"
            }
            size="small"
          />
        ),
      },
    },
    {
      name: "commentaireAdmin",
      label: "Commentaire admin",
      options: { filter: false, sort: false },
    },
    {
      name: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenDialog(rows[dataIndex])}
          >
            Gérer
          </Button>
        ),
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
        Gestion des réclamations réseau
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={"Réclamations réseau"}
          data={rows}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Gérer la réclamation</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2 }}>
            <TextField
              select
              label="Statut"
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              SelectProps={{ native: true }}
            >
              {statutList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </TextField>
            <TextField
              label="Commentaire admin"
              multiline
              minRows={2}
              value={commentaireAdmin}
              onChange={(e) => setCommentaireAdmin(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleUpdate} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReclamationsReseauGestion;
