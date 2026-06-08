import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const NetworkReclamationsTable = ({ gestion = false }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const [editLoading, setEditLoading] = useState(false);
  const [editStatutId, setEditStatutId] = useState(null);
  const [statutAnchorEl, setStatutAnchorEl] = useState(null);
  const [selectedStatut, setSelectedStatut] = useState("");
  const [editResponsableId, setEditResponsableId] = useState(null);
  const [editCommentResponsable, setEditCommentResponsable] = useState("");
  const [updateStatutId, setUpdateStatutId] = useState(null);
  const [updateStatutAnchorEl, setUpdateStatutAnchorEl] = useState(null);

  // Gestion du changement de statut
  const handleOpenStatutMenu = (event, row) => {
    setEditStatutId(row._id);
    setSelectedStatut(row.statut);
    setStatutAnchorEl(event.currentTarget);
  };
  const handleCloseStatutMenu = () => {
    setEditStatutId(null);
    setStatutAnchorEl(null);
  };
  const handleChangeStatut = async (row, newStatut) => {
    setEditLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(
        `${apiUrl}/api/v1/reclamationsReseau/${row._id}`,
        { statut: newStatut },
        { headers },
      );
      fetchReclamations();
    } catch (err) {
      alert("Erreur lors du changement de statut.");
    }
    setEditStatutId(null);
    setStatutAnchorEl(null);
    setEditLoading(false);
  };

  const handleEditResponsable = (row) => {
    setEditResponsableId(row._id);
    setEditCommentResponsable(row.commentaireResponsable || "");
  };

  const handleSaveCommentResponsable = async (row) => {
    setEditLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(
        `${apiUrl}/api/v1/reclamationsReseau/${row._id}`,
        { commentaireResponsable: editCommentResponsable },
        { headers },
      );
      setEditResponsableId(null);
      setEditCommentResponsable("");
      fetchReclamations();
    } catch (err) {
      alert("Erreur lors de la mise à jour du commentaire responsable.");
    }
    setEditLoading(false);
  };

  const handleCloturer = async (row) => {
    if (!window.confirm("Voulez-vous vraiment clôturer ce ticket ?")) return;
    setEditLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(
        `${apiUrl}/api/v1/reclamationsReseau/${row._id}`,
        { etatTicket: "clôturé", statut: "résolue" },
        { headers },
      );
      fetchReclamations();
    } catch (err) {
      alert("Erreur lors de la clôture du ticket.");
    }
    setEditLoading(false);
  };

  // Gestion du menu Update pour changer le statut
  const handleOpenUpdateMenu = (event, row) => {
    setUpdateStatutId(row._id);
    setUpdateStatutAnchorEl(event.currentTarget);
  };

  const handleCloseUpdateMenu = () => {
    setUpdateStatutId(null);
    setUpdateStatutAnchorEl(null);
  };

  const handleUpdateStatut = async (row, newStatut) => {
    setEditLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(
        `${apiUrl}/api/v1/reclamationsReseau/${row._id}`,
        { statut: newStatut },
        { headers },
      );
      fetchReclamations();
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut.");
    }
    setUpdateStatutId(null);
    setUpdateStatutAnchorEl(null);
    setEditLoading(false);
  };

  // Export des réclamations clôturées en Excel
  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(
        `${apiUrl}/api/v1/reclamationsReseau/closed`,
        {
          headers,
        },
      );

      const closedReclamations = res.data || [];

      if (closedReclamations.length === 0) {
        alert("Aucune réclamation clôturée à exporter.");
        return;
      }

      // Préparer les données pour Excel
      const excelData = closedReclamations.map((item) => ({
        Utilisateur: item.nomComplet,
        "Site (UMMC)": item.site,
        Région: item.region,
        Province: item.province,
        "Download (Mbps)": item.debitDownload,
        "Upload (Mbps)": item.debitUpload,
        Commentaire: item.commentaire,
        Statut: item.statut,
        "Commentaire Responsable": item.commentaireResponsable || "",
        "Date Création": item.dateCreation
          ? new Date(item.dateCreation).toLocaleString("fr-FR")
          : "",
        "Date Clôture": item.dateCloture
          ? new Date(item.dateCloture).toLocaleString("fr-FR")
          : "",
      }));

      // Créer le fichier Excel avec XLSX
      import("xlsx").then((XLSX) => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Réclamations Clôturées");

        // Télécharger le fichier
        const fileName = `reclamations_cloturees_${new Date().toISOString().split("T")[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
      });
    } catch (err) {
      alert("Erreur lors de l'export des réclamations clôturées.");
    }
  };

  const columns = [
    {
      name: "nomComplet",
      label: "Utilisateur",
      options: { filter: true, sort: true },
    },
    {
      name: "site",
      label: "Site (UMMC)",
      options: { filter: true, sort: true },
    },
    {
      name: "region",
      label: "Région",
      options: { filter: true, sort: true },
    },
    {
      name: "province",
      label: "Province",
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
      name: "commentaireResponsable",
      label: "Commentaire Responsable",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const row = rows[dataIndex];
          if (gestion && editResponsableId === row._id) {
            return (
              <>
                <input
                  type="text"
                  value={editCommentResponsable}
                  onChange={(e) => setEditCommentResponsable(e.target.value)}
                  style={{ width: 120, marginRight: 8 }}
                  disabled={editLoading}
                  placeholder="Commentaire responsable"
                />
                <button
                  onClick={() => handleSaveCommentResponsable(row)}
                  disabled={editLoading}
                  style={{ marginRight: 4 }}
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => setEditResponsableId(null)}
                  disabled={editLoading}
                >
                  Annuler
                </button>
              </>
            );
          }
          return row.commentaireResponsable || "";
        },
      },
    },
    gestion && {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const row = rows[dataIndex];
          const isClotured = row.etatTicket === "clôturé";
          return (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                size="small"
                variant="contained"
                sx={{
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                  minWidth: "80px",
                }}
                onClick={(e) => handleOpenUpdateMenu(e, row)}
                disabled={isClotured || editLoading}
              >
                Update
              </Button>
              <Menu
                anchorEl={updateStatutAnchorEl}
                open={
                  updateStatutId === row._id && Boolean(updateStatutAnchorEl)
                }
                onClose={handleCloseUpdateMenu}
              >
                {["en attente", "en cours", "résolue"].map((statut) => (
                  <MenuItem
                    key={statut}
                    selected={row.statut === statut}
                    onClick={() => handleUpdateStatut(row, statut)}
                  >
                    {statut}
                  </MenuItem>
                ))}
              </Menu>
              <Button
                size="small"
                variant="contained"
                sx={{
                  bgcolor: "#2e7d32",
                  "&:hover": { bgcolor: "#1b5e20" },
                  minWidth: "90px",
                }}
                onClick={() => handleCloturer(row)}
                disabled={isClotured || editLoading}
              >
                Clôturer
              </Button>
              <IconButton
                size="small"
                onClick={() => handleEditResponsable(row)}
                disabled={isClotured}
                sx={{ ml: 0.5 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={statutAnchorEl}
                open={editStatutId === row._id && Boolean(statutAnchorEl)}
                onClose={handleCloseStatutMenu}
              >
                {["en attente", "en cours", "résolue"].map((statut) => (
                  <MenuItem
                    key={statut}
                    selected={row.statut === statut}
                    onClick={() => handleChangeStatut(row, statut)}
                  >
                    {statut}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          );
        },
      },
    },
  ];

  // Filtre les colonnes nulles (pour éviter la colonne action si gestion=false)
  const filteredColumns = columns.filter(Boolean);

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
    <Box p={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Réclamations réseau</Typography>
        {gestion && (
          <Button
            variant="contained"
            color="success"
            onClick={handleExportExcel}
            sx={{ textTransform: "none" }}
          >
            Exporter les opérations clôturées (Excel)
          </Button>
        )}
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={"Réclamations réseau"}
          data={rows}
          columns={filteredColumns}
          options={options}
        />
      </ThemeProvider>
    </Box>
  );
};

export default NetworkReclamationsTable;
