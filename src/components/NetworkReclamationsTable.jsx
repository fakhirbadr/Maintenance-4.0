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

  const [editId, setEditId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editStatutId, setEditStatutId] = useState(null);
  const [statutAnchorEl, setStatutAnchorEl] = useState(null);
  const [selectedStatut, setSelectedStatut] = useState("");

  const handleEdit = (row) => {
    setEditId(row._id);
    setEditComment(row.commentaireAdmin || "");
  };

  const handleSaveComment = async (row) => {
    setEditLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(
        `${apiUrl}/api/v1/reclamationsReseau/${row._id}`,
        { commentaireAdmin: editComment },
        { headers }
      );
      setEditId(null);
      setEditComment("");
      fetchReclamations();
    } catch (err) {
      alert("Erreur lors de la mise à jour du commentaire.");
    }
    setEditLoading(false);
  };

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
        { headers }
      );
      fetchReclamations();
    } catch (err) {
      alert("Erreur lors du changement de statut.");
    }
    setEditStatutId(null);
    setStatutAnchorEl(null);
    setEditLoading(false);
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
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const row = rows[dataIndex];
          if (gestion && editId === row._id) {
            return (
              <>
                <input
                  type="text"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  style={{ width: 120, marginRight: 8 }}
                  disabled={editLoading}
                  placeholder="Commentaire admin"
                />
                <button
                  onClick={() => handleSaveComment(row)}
                  disabled={editLoading}
                  style={{ marginRight: 4 }}
                >
                  Sauvegarder
                </button>
                <button onClick={() => setEditId(null)} disabled={editLoading}>
                  Annuler
                </button>
              </>
            );
          }
          return row.commentaireAdmin || "";
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
          return (
            <>
              <Tooltip title="Modifier le commentaire admin">
                <IconButton size="small" onClick={() => handleEdit(row)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Changer le statut">
                <IconButton
                  size="small"
                  onClick={(e) => handleOpenStatutMenu(e, row)}
                >
                  <SwapHorizIcon fontSize="small" />
                </IconButton>
              </Tooltip>
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
            </>
          );
        },
      },
    },
    gestion && {
      name: "action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const row = rows[dataIndex];
          if (editId === row._id) {
            return (
              <>
                <button
                  onClick={() => handleSave(row)}
                  disabled={editLoading}
                  style={{ marginRight: 4 }}
                >
                  Sauvegarder
                </button>
                <button onClick={() => setEditId(null)} disabled={editLoading}>
                  Annuler
                </button>
              </>
            );
          }
          if (row.statut !== "résolue") {
            return <button onClick={() => handleEdit(row)}>Éditer</button>;
          }
          return null;
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
      <Typography variant="h6" gutterBottom>
        Réclamations réseau
      </Typography>
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
