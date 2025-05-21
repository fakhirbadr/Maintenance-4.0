import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material";
import * as XLSX from "xlsx";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import dayjs from "dayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

// Pour les listes déroulantes du formulaire
const statusList = [
  { label: "Créé", value: "créé" },
  { label: "En cours", value: "en_cours" },
  { label: "En attente", value: "en_attente" },
  { label: "Résolu", value: "résolu" },
  { label: "Clôturé", value: "cloturé" },
  { label: "Rejeté", value: "rejeté" },
];
const categories = [
  { label: "Réseau", value: "reseau" },
  { label: "Logiciel", value: "logiciel" },
  { label: "Matériel", value: "materiel" },
  { label: "Sécurité", value: "securite" },
];
const problemesParCategorie = {
  reseau: [
    { label: "Connexion lente", value: "connexion_lente" },
    { label: "Perte de connexion", value: "perte_connexion" },
    { label: "Coupure Internet", value: "coupure_internet" },
  ],
  logiciel: [
    { label: "Application plante", value: "application_plante" },
    { label: "Erreur de licence", value: "erreur_licence" },
    { label: "Mise à jour impossible", value: "maj_impossible" },
  ],
  materiel: [
    { label: "Écran bleu", value: "ecran_bleu" },
    { label: "Panne d'alimentation", value: "panne_alimentation" },
    { label: "Surchauffe", value: "surchauffe" },
  ],
  securite: [
    { label: "Virus détecté", value: "virus" },
    { label: "Tentative d'intrusion", value: "intrusion" },
    { label: "Mot de passe compromis", value: "mdp_compromis" },
  ],
};

const getMuiTheme = () =>
  createTheme({
    typography: { fontFamily: "sans-serif" },
    palette: {
      background: { paper: "#1E1E1E", default: "#0f172a" },
      mode: "dark",
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: { padding: "10px 4px" },
          body: {
            padding: "7px 15px",
            color: "#e2e8f0",
            textOverflow: "ellipsis",
          },
        },
      },
    },
  });

const UpdateModal = ({ open, onClose, ticket, onSubmit }) => {
  const [form, setForm] = useState({
    actif: "",
    region: "",
    province: "",
    technicien: "",
    categorie: "",
    probleme: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    if (ticket) {
      setForm({
        actif: ticket.actif || "",
        region: ticket.region || "",
        province: ticket.province || "",
        technicien: ticket.technicien || "",
        categorie: ticket.categorie || "",
        probleme: ticket.probleme || "",
        description: ticket.description || "",
        status: ticket.status || "",
      });
    }
  }, [ticket]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Si la catégorie change, on reset le problème
    if (name === "categorie") {
      setForm((prev) => ({
        ...prev,
        categorie: value,
        probleme: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(form);
  };

  const problemes =
    form.categorie && problemesParCategorie[form.categorie]
      ? problemesParCategorie[form.categorie]
      : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Modifier le ticket</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Actif"
              name="actif"
              value={form.actif}
              onChange={handleChange}
              margin="dense"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Technicien"
              name="technicien"
              value={form.technicien}
              onChange={handleChange}
              margin="dense"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Région"
              name="region"
              value={form.region}
              onChange={handleChange}
              margin="dense"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Province"
              name="province"
              value={form.province}
              onChange={handleChange}
              margin="dense"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Catégorie"
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              margin="dense"
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Problème"
              name="probleme"
              value={form.probleme}
              onChange={handleChange}
              margin="dense"
              fullWidth
              disabled={!form.categorie}
            >
              {problemes.length === 0 ? (
                <MenuItem value="">Sélectionnez d'abord une catégorie</MenuItem>
              ) : (
                problemes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              margin="dense"
              fullWidth
              multiline
              minRows={2}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Statut"
              name="status"
              value={form.status}
              onChange={handleChange}
              margin="dense"
              fullWidth
            >
              {statusList.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const GestionTicketSi = () => {
  const theme = useTheme();
  const textColor =
    theme.palette.mode === "dark" ? "text-orange-500" : "text-blue-500";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pour la modification
  const [modalOpen, setModalOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [error, setError] = useState(null);

  // Rafraîchit la liste des tickets
  const fetchTickets = () => {
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:3000/api/v1/ticketSi?isClosed=false")
      .then((res) => {
        setRows(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des tickets: " + err.message);
        setRows([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Clôturer un ticket par customId
  const handleCloturer = async (customId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/ticketSi/${customId}/close`,
        { dateCloture: new Date().toISOString() }
      );
      fetchTickets();
    } catch (err) {
      setError(`Erreur lors de la clôture du ticket: ${err.message}`);
      console.error("Erreur lors de la clôture:", err);
    }
  };

  // Ouvrir le modal de modification
  const handleModifier = (customId) => {
    const ticket = rows.find((t) => t.customId === customId);
    if (ticket) {
      setTicketToEdit(ticket);
      setModalOpen(true);
    } else {
      setError(`Ticket avec ID ${customId} non trouvé`);
    }
  };

  // Soumission du modal de modification
  const handleUpdateSubmit = async (form) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/ticketSi/${ticketToEdit.customId}`,
        form
      );
      setModalOpen(false);
      setTicketToEdit(null);
      fetchTickets();
    } catch (err) {
      setError(`Erreur lors de la modification: ${err.message}`);
      console.error("Erreur lors de la modification:", err);
    }
  };

  // Supprimer/Rejeter un ticket par customId
  const handleRejeter = async (customId) => {
    if (!window.confirm("Voulez-vous vraiment rejeter ce ticket ?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/ticketSi/${customId}`);
      fetchTickets();
    } catch (err) {
      setError(`Erreur lors du rejet du ticket: ${err.message}`);
      console.error("Erreur lors du rejet:", err);
    }
  };

  const columns = [
    { name: "customId", label: "ID Ticket" },
    { name: "actif", label: "Actif" },
    { name: "region", label: "Région" },
    { name: "province", label: "Province" },
    { name: "technicien", label: "Technicien" },
    { name: "categorie", label: "Catégorie" },
    { name: "probleme", label: "Problème" },
    { name: "status", label: "Statut" },
    { name: "description", label: "description" },
    {
      name: "isClosed",
      label: "Clôturé",
      options: {
        customBodyRender: (value) => (value ? "Oui" : "Non"),
      },
    },
    {
      name: "createdAt",
      label: "Date de création",
      options: {
        customBodyRender: (value) =>
          value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "",
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          const row = rows[dataIndex];
          return (
            <>
              <Tooltip title="Clôturer">
                <IconButton
                  color="success"
                  onClick={() => handleCloturer(row.customId)}
                  disabled={row.isClosed}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Modifier">
                <IconButton
                  color="primary"
                  onClick={() => handleModifier(row.customId)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rejeter">
                <IconButton
                  color="error"
                  onClick={() => handleRejeter(row.customId)}
                  disabled={row.isClosed}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </>
          );
        },
      },
    },
  ];

  // Options de MUIDataTable
  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    setRowProps: (_, dataIndex) => {
      const rowData = rows[dataIndex];
      return {
        style: {
          backgroundColor: rowData.isClosed ? "#8dfc74" : "inherit", // Gris si fermé
        },
      };
    },
  };

  // Export Excel
  const handleDownloadExcel = () => {
    if (!rows || rows.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historique des Besoins");
    XLSX.writeFile(workbook, "SI.xlsx");
  };

  return (
    <div>
      <h1
        className={`mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase ${textColor}`}
      >
        Supervision des dysfonctionnements SI
      </h1>
      <div className="flex justify-end gap-4">
        <Button onClick={handleDownloadExcel} variant="outlined">
          Télécharger Excel
        </Button>
      </div>
      {error && (
        <div
          style={{
            color: "red",
            margin: "10px 0",
            padding: "10px",
            backgroundColor: "#ffeeee",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}
      <div className="w-[100%] py-3">
        {loading ? (
          <p>Chargement des données...</p>
        ) : (
          <ThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title={"Suivi des problèmes SI"}
              data={rows}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
        )}
      </div>
      {/* Modal de modification */}
      <UpdateModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTicketToEdit(null);
        }}
        ticket={ticketToEdit}
        onSubmit={handleUpdateSubmit}
      />
    </div>
  );
};

export default GestionTicketSi;
