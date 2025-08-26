import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Box,
  Paper,
  Chip,
  Alert,
  Card,
  CardContent,
  TableContainer,
  ThemeProvider,
  createTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Tooltip,
  IconButton,
  styled,
  useTheme,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Comment as CommentIcon,
  AddComment as AddCommentIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";
import ExportToExcelButton from "./ExportToExcelButton";
import UnpointedSites from "./UnpointedSites";
import PointageTechnicienModal from "./pointageTechnicienModel";
import ConfigActifDialog from "./ConfigActifsDialog";

// --- Configuration ---
// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL;

const regions = {
  "Tanger-Tétouan-Al Hoceïma": [
    "Tanger", "Tétouan", "Al Hoceïma", "Chefchaouen",
    "Larache", "Ouezzane", "Fahs-Anjra",
  ],
  "L'Oriental": [
    "Oujda-Angad", "Nador", "Berkane", "Driouch",
    "Taourirt", "Jerada", "Guercif", "Figuig",
  ],
  "Fès-Meknès": [
    "Fès", "Meknès", "Ifrane", "Taza", "Sefrou",
    "Boulemane", "El Hajeb", "Moulay Yacoub", "Taounate",
  ],
  "Rabat-Salé-Kénitra": [
    "Rabat", "Salé", "Kénitra", "Sidi Kacem", "Sidi Slimane",
    "Khémisset",
  ],
  "Béni Mellal-Khénifra": [
    "Béni Mellal", "Khénifra", "Azilal", "Fquih Ben Salah", "Kasba Tadla",
  ],
  "Casablanca-Settat": [
    "Casablanca", "Mohammedia", "Settat", "El Jadida", "Berrechid",
    "Nouaceur", "Médiouna", "Sidi Bennour", "Benslimane",
  ],
  "Marrakech-Safi": [
    "Marrakech", "Safi", "Essaouira", "Rehamna", "Chichaoua",
    "Al Haouz", "Youssoufia", "El Kelaâ des Sraghna",
  ],
  "Drâa-Tafilalet": ["Errachidia", "Ouarzazate", "Zagora", "Tinghir", "Midelt"],
  "Souss-Massa": [
    "Agadir Ida-Outanane", "Taroudant", "TATA", "Tiznit",
    "Chtouka Aït Baha", "Inezgane-Aït Melloul",
  ],
  "Guelmim-Oued Noun": ["Guelmim", "Tan-Tan", "Sidi Ifni", "Assa-Zag"],
  "Laâyoune-Sakia El Hamra": ["Laâyoune", "Boujdour", "Tarfaya", "Es-Semara"],
  "Dakhla-Oued Ed-Dahab": ["Dakhla", "Oued Ed-Dahab", "Aousserd"],
};

const motifsAbsence = [
  "Maladie", "Congé annuel", "Congé exceptionnel", "Raison familiale",
  "Retard", "Absence non justifiée", "Mission professionnelle", "Autre",
];

// --- Styles & Helpers ---
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9", dark: "#42a5f5", light: "#bbdefb" },
    secondary: { main: "#ce93d8" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#ffffff", secondary: "#b0b0b0" },
    success: { main: "#4caf50", light: "#81c784", dark: "#388e3c" },
    error: { main: "#f44336", light: "#e57373", dark: "#d32f2f" },
    warning: { main: "#ff9800", light: "#ffb74d", dark: "#f57c00" },
    info: { main: "#2196f3", light: "#64b5f6", dark: "#1976d2" },
  },
  components: {
    MuiTableCell: { styleOverrides: { root: { borderColor: "#333" } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
});

const formatDateToInput = (date) => {
  const d = new Date(date);
  const pad = (num) => (num < 10 ? "0" + num : num);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString("fr-FR") : "-";
const formatTime = (timeString) =>
  timeString ? new Date(timeString).toLocaleTimeString("fr-FR", {
    hour: "2-digit", minute: "2-digit",
  }) : "-";

/**
 * Renders a chip based on the 'actif' status.
 * @param {string} actif The status string ("Oui", "Non", "Actif", "Inactif").
 */
const getStatusChip = (actif) => {
  const isActive = actif?.toLowerCase() === "oui" || actif?.toLowerCase() === "actif";
  return (
    <Chip
      label={actif || "Non défini"}
      color={isActive ? "success" : "error"}
      size="small"
      variant="filled"
      sx={{ fontWeight: 600 }}
    />
  );
};

// --- Sub-Components for better readability ---
/**
 * Displays filtering options for the table.
 * @param {object} props - Component props.
 * @param {object} props.filters - Current filter values.
 * @param {function} props.onFilterChange - Handler for filter changes.
 */
const FiltersSection = ({ filters, onFilterChange }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        mb: 3,
        backgroundColor: "background.paper",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterListIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
            Filtres de recherche
          </Typography>
        </Box>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Date"
            type="date"
            size="small"
            value={filters.date}
            onChange={(e) => onFilterChange("date", e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1, "& .MuiInputBase-root": { backgroundColor: "background.default" } }}
          />
          <FormControl fullWidth size="small" sx={{ flex: 1, "& .MuiInputBase-root": { backgroundColor: "background.default" } }}>
            <InputLabel>Région</InputLabel>
            <Select label="Région" value={filters.region} onChange={(e) => onFilterChange("region", e.target.value)}>
              <MenuItem value=""><em>Toutes</em></MenuItem>
              {Object.keys(regions).map((region) => (
                <MenuItem key={region} value={region}>{region}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" disabled={!filters.region} sx={{ flex: 1, "& .MuiInputBase-root": { backgroundColor: "background.default" } }}>
            <InputLabel>Province</InputLabel>
            <Select label="Province" value={filters.province} onChange={(e) => onFilterChange("province", e.target.value)}>
              <MenuItem value=""><em>{filters.region ? "Toutes" : "Sélectionnez une région"}</em></MenuItem>
              {filters.region && regions[filters.region]?.map((province) => (
                <MenuItem key={province} value={province}>{province}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
};

/**
 * Renders a single personnel block with status and actions.
 * @param {object} props - Component props.
 * @param {object} props.personnel - Personnel data.
 * @param {string} props.pointageId - The ID of the pointage record.
 * @param {string} props.role - The role of the personnel (e.g., "medecin").
 * @param {function} props.onUpdatePersonnel - Handler for updating personnel.
 * @param {function} props.onOpenCommentDialog - Handler for opening the comment dialog.
 * @param {boolean} props.isUpdating - Loading state.
 */
const PersonnelBlock = ({ personnel, pointageId, role, onUpdatePersonnel, onOpenCommentDialog, isUpdating }) => {
  if (!personnel) return <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.9rem" }}>-</Typography>;

  const isAbsent = !personnel.titulairePresent;
  const isJustified = personnel.absenceJustifiee === true;

  const getTitulaireChip = () => {
    if (isAbsent) {
      return (
        <Chip
          label={isJustified ? "Absence Justifiée" : "Absent"}
          color={isJustified ? "warning" : "error"}
          size="small"
          variant="filled"
        />
      );
    }
    return <Chip label="Présent" color="success" size="small" variant="filled" />;
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: "primary.light", fontSize: "0.9rem" }}>Titulaire:</Typography>
        <Typography variant="body2" sx={{ fontSize: "0.9rem", color: "text.primary" }}>{personnel.titulaireNom || "-"}</Typography>
        {getTitulaireChip()}
      </Box>

      {isAbsent && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, mb: 1 }}>
          {!isJustified && (
            <Tooltip title="Cliquer pour marquer comme 'Justifiée'">
              <Chip
                label="Non Justifié"
                color="error"
                variant="outlined"
                size="small"
                onClick={() => onUpdatePersonnel({ absenceJustifiee: true }, pointageId, role)}
                disabled={isUpdating}
                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.2)" } }}
              />
            </Tooltip>
          )}
          <Tooltip title="Ajouter/Modifier un commentaire">
            <IconButton
              size="small"
              onClick={() => onOpenCommentDialog("comment", pointageId, role, personnel.commentaireAbsence)}
            >
              <AddCommentIcon fontSize="inherit" color="info" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {isAbsent && personnel.commentaireAbsence && (
        <Tooltip title={personnel.commentaireAbsence} placement="top">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", mt: 0.5, maxWidth: "200px" }}>
            <CommentIcon sx={{ fontSize: "1rem", flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.8rem" }}>
              {personnel.commentaireAbsence}
            </Typography>
          </Box>
        </Tooltip>
      )}

      <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: "primary.light", fontSize: "0.9rem" }}>Remplaçant:</Typography>
        <Typography variant="body2" sx={{ fontSize: "0.9rem", color: "text.primary" }}>{personnel.remplacantNom || "-"}</Typography>
        {personnel.remplacantNom && (
          <Chip
            label={personnel.remplacantPresent ? "Présent" : "Non Présent"}
            color={personnel.remplacantPresent ? "success" : "warning"}
            size="small"
            variant="outlined"
          />
        )}
      </Box>
    </Box>
  );
};

const LoadingIndicator = () => (
  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={4}>
    <CircularProgress size={40} sx={{ color: "primary.main" }} />
    <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
      Chargement des données...
    </Typography>
  </Box>
);

const ErrorMessage = ({ error, onClose }) => (
  error && (
    <Alert severity="error" sx={{ mb: 2 }} onClose={onClose}>
      <Typography variant="body2">{error}</Typography>
    </Alert>
  )
);

const EmptyState = () => (
  <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "background.paper", border: "1px dashed #555", borderRadius: 2 }}>
    <Typography variant="h6" sx={{ color: "text.secondary" }} gutterBottom>
      Aucun pointage trouvé
    </Typography>
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      Aucun pointage ne correspond aux critères de recherche pour cette date.
    </Typography>
  </Paper>
);

const StatsSection = ({ pointages }) => {
  if (!pointages || pointages.length === 0) return null;
  const totalPointages = pointages.length;
  const actifs = pointages.filter(
    (p) => p.actif?.toLowerCase() === "oui" || p.actif?.toLowerCase() === "actif"
  ).length;
  const inactifs = totalPointages - actifs;
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Paper
          sx={{
            p: 2, flex: 1, textAlign: "center",
            backgroundColor: "rgba(33, 150, 243, 0.1)",
            border: `1px solid ${theme.palette.info.light}`, borderRadius: 2,
          }}
        >
          <Typography variant="h4" sx={{ color: "info.main", fontWeight: 700 }}>{totalPointages}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>Unités pointées</Typography>
        </Paper>
        <Paper
          sx={{
            p: 2, flex: 1, textAlign: "center",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            border: `1px solid ${theme.palette.success.light}`, borderRadius: 2,
          }}
        >
          <Typography variant="h4" sx={{ color: "success.main", fontWeight: 700 }}>{actifs}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>Actifs</Typography>
        </Paper>
        <Paper
          sx={{
            p: 2, flex: 1, textAlign: "center",
            backgroundColor: "rgba(244, 67, 54, 0.1)",
            border: `1px solid ${theme.palette.error.light}`, borderRadius: 2,
          }}
        >
          <Typography variant="h4" sx={{ color: "error.main", fontWeight: 700 }}>{inactifs}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>Inactifs</Typography>
        </Paper>
      </Stack>
    </Box>
  );
};

const PointagesTable = ({ pointages, sites, onUpdatePersonnel, onOpenCommentDialog, isUpdating }) => {
  const theme = useTheme();
  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: "70vh", border: `1px solid ${theme.palette.divider}`, backgroundColor: "background.paper", borderRadius: 2 }}
    >
      <Table size="medium" stickyHeader>
        <TableHead>
          <TableRow>
            {["Site", "Heure Début", "Région", "Province", "Statut", "Utilisateur", "Médecin", "Infirmière 1", "Infirmière 2", "Technicien", "Motif Inactivité", "Date Request", "Heure Inactivité", "Heure Ouverture Estimée"].map((headCell) => (
              <TableCell key={headCell} sx={{ backgroundColor: "primary.dark", color: "white", fontWeight: 700, fontSize: "0.9rem" }}>
                {headCell}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {pointages.map((pointage) => (
            <TableRow key={pointage._id} hover>
              <TableCell sx={{ fontWeight: 600, color: "primary.light", fontSize: "0.9rem" }}>{sites[pointage.site] || pointage.site || "-"}</TableCell>
              <TableCell sx={{ fontSize: "0.9rem" }}><Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "inherit" }}>{formatTime(pointage.heureDebut)}</Typography></TableCell>
              <TableCell sx={{ fontSize: "0.9rem" }}>{pointage.region || "-"}</TableCell>
              <TableCell sx={{ fontSize: "0.9rem" }}>{pointage.province || "-"}</TableCell>
              <TableCell>{getStatusChip(pointage.actif)}</TableCell>
              <TableCell sx={{ fontSize: "0.9rem" }}>{pointage.user || "-"}</TableCell>
              <TableCell><PersonnelBlock personnel={pointage.medecin} pointageId={pointage._id} role="medecin" onUpdatePersonnel={onUpdatePersonnel} onOpenCommentDialog={onOpenCommentDialog} isUpdating={isUpdating} /></TableCell>
              <TableCell><PersonnelBlock personnel={pointage.infirmiere1} pointageId={pointage._id} role="infirmiere1" onUpdatePersonnel={onUpdatePersonnel} onOpenCommentDialog={onOpenCommentDialog} isUpdating={isUpdating} /></TableCell>
              <TableCell><PersonnelBlock personnel={pointage.infirmiere2} pointageId={pointage._id} role="infirmiere2" onUpdatePersonnel={onUpdatePersonnel} onOpenCommentDialog={onOpenCommentDialog} isUpdating={isUpdating} /></TableCell>
              <TableCell><PersonnelBlock personnel={pointage.technicien} pointageId={pointage._id} role="technicien" onUpdatePersonnel={onUpdatePersonnel} onOpenCommentDialog={onOpenCommentDialog} isUpdating={isUpdating} /></TableCell>
              <TableCell sx={{ fontSize: "0.9rem" }}>{pointage.motifInactivite || "-"}</TableCell>
              <TableCell sx={{ fontSize: "0.9rem" }}><Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "inherit" }}>{formatDate(pointage.dateRequest)}</Typography></TableCell>
              <TableCell sx={{ fontSize: "0.9rem" }}><Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "inherit" }}>{formatTime(pointage.heureInactivite)}</Typography></TableCell>
              <TableCell sx={{ fontSize: "0.9rem" }}><Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "inherit" }}>{formatTime(pointage.heureOuvertureEstimee)}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// --- Main Component ---
const PointagevFinalAdmin = ({ open, onClose }) => {
  const [pointages, setPointages] = useState([]);
  const [sites, setSites] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingSites, setLoadingSites] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    region: "",
    province: "",
    date: formatDateToInput(new Date()),
  });
  const [allActifs, setAllActifs] = useState([]);
  const [unpointedSites, setUnpointedSites] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editInfo, setEditInfo] = useState({
    dialogOpen: false, type: null, pointageId: null, role: null, currentComment: "",
  });
  const [technicienModalOpen, setTechnicienModalOpen] = useState(false);
  const [selectedMotif, setSelectedMotif] = useState("");
  const [customMotifText, setCustomMotifText] = useState("");
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  
  const theme = useTheme();

  /** Fetches all sites to create a map for display. */
  const fetchSitesForMap = async () => {
    setLoadingSites(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/actifs`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des sites");
      const data = await response.json();
      if (Array.isArray(data)) {
        setSites(data.reduce((acc, site) => ({ ...acc, [site._id]: site.name }), {}));
        setAllActifs(data);
      } else {
        setSites({});
        setAllActifs([]);
      }
    } catch (err) {
      console.error("Erreur fetchSites:", err);
      setError(prev => prev || err.message);
    } finally {
      setLoadingSites(false);
    }
  };

  /** Fetches pointage data based on current filters. */
  const fetchPointages = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/api/v1/pointagevfinal?${params.toString()}`);
      if (!response.ok) throw new Error(`Erreur lors de la récupération des pointages: ${response.statusText}`);
      const data = await response.json();
      setPointages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur fetchPointages:", err);
      setError(err.message);
      setPointages([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates a personnel record in the database.
   * @param {object} updateData - Data to update.
   * @param {string} pointageId - ID of the pointage record.
   * @param {string} role - Role of the personnel to update.
   */
  const handleUpdatePersonnel = async (updateData, pointageId, role) => {
    if (!pointageId || !role) return;
    setIsUpdating(true);
    setError(null);
    const pointageToUpdate = pointages.find(p => p._id === pointageId);
    if (!pointageToUpdate) {
      setError("Erreur: Impossible de trouver l'enregistrement.");
      setIsUpdating(false);
      return;
    }
    const mergedData = { ...(pointageToUpdate[role] || {}), ...updateData };
    const body = { [role]: mergedData };
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pointagevfinal/${pointageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "La mise à jour a échoué.");
      }
      const updatedPointage = await response.json();
      setPointages(prev => prev.map(p => (p._id === updatedPointage._id ? updatedPointage : p)));
      handleCloseEditDialog();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  /** Saves a comment after selection or input. */
  const handleCommentSave = () => {
    const finalComment = selectedMotif === "Autre" ? customMotifText : selectedMotif;
    handleUpdatePersonnel({ commentaireAbsence: finalComment, absenceJustifiee: true }, editInfo.pointageId, editInfo.role);
  };
  
  /** Resets component state when the dialog closes. */
  const resetStates = () => {
    setPointages([]);
    setSites({});
    setAllActifs([]);
    setUnpointedSites([]);
    setError(null);
    setLoading(false);
    setLoadingSites(false);
    setFilters({ region: "", province: "", date: formatDateToInput(new Date()) });
    setEditInfo({ dialogOpen: false, type: null, pointageId: null, role: null, currentComment: "" });
  };

  const handleOpenEditDialog = (type, pointageId, role, currentComment = "") => {
    setEditInfo({ dialogOpen: true, type, pointageId, role, currentComment });
    if (type === "comment") {
      const isPredefined = motifsAbsence.includes(currentComment);
      if (isPredefined && currentComment !== "Autre") {
        setSelectedMotif(currentComment);
        setCustomMotifText("");
      } else if (currentComment) {
        setSelectedMotif("Autre");
        setCustomMotifText(currentComment);
      } else {
        setSelectedMotif("");
        setCustomMotifText("");
      }
    }
  };

  const handleCloseEditDialog = () => {
    if (isUpdating) return;
    setEditInfo({ dialogOpen: false, type: null, pointageId: null, role: null, currentComment: "" });
    setSelectedMotif("");
    setCustomMotifText("");
  };

  // --- Effects ---
  useEffect(() => {
    if (open) {
      fetchSitesForMap();
    } else {
      resetStates();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchPointages();
    }
  }, [open, filters.date, filters.region, filters.province]);

  useEffect(() => {
    if (allActifs.length > 0) {
      const potentialSites = allActifs.filter(s =>
        (!filters.region || s.region === filters.region) &&
        (!filters.province || s.province === filters.province)
      );
      const pointedSiteIds = new Set(pointages.map(p => p.site));
      const missingSites = potentialSites.filter(actif => !pointedSiteIds.has(actif._id));
      setUnpointedSites(missingSites);
    }
  }, [pointages, allActifs, filters]);

  // --- Render logic ---
  const DialogContentSection = () => {
    if (loading || loadingSites) return <LoadingIndicator />;
    if (pointages.length === 0) return <EmptyState />;
    return (
      <>
        <StatsSection pointages={pointages} />
        <PointagesTable
          pointages={pointages}
          sites={sites}
          onUpdatePersonnel={handleUpdatePersonnel}
          onOpenCommentDialog={handleOpenEditDialog}
          isUpdating={isUpdating}
        />
        <UnpointedSites sites={unpointedSites} loading={loading || loadingSites} />
      </>
    );
  };
  
  const CommentDialog = () => (
    <Dialog
      open={editInfo.dialogOpen && editInfo.type === "comment"}
      onClose={handleCloseEditDialog}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Ajouter / Modifier le Commentaire</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
          <InputLabel>Motif</InputLabel>
          <Select label="Motif" value={selectedMotif} onChange={(e) => setSelectedMotif(e.target.value)}>
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {motifsAbsence.map(motif => (<MenuItem key={motif} value={motif}>{motif}</MenuItem>))}
          </Select>
        </FormControl>
        {selectedMotif === "Autre" && (
          <TextField
            autoFocus margin="dense" label="Précisez le motif" type="text" fullWidth variant="outlined" multiline rows={2}
            value={customMotifText} onChange={(e) => setCustomMotifText(e.target.value)} sx={{ mt: 2 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditDialog} color="inherit" disabled={isUpdating}>Annuler</Button>
        <Button onClick={handleCommentSave} color="primary" variant="contained" disabled={isUpdating || (!selectedMotif && !customMotifText)}>
          {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Enregistrer"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const excelData = pointages.map(p => ({
    Site: sites[p.site] || p.site || "-",
    Région: p.region || "-",
    Province: p.province || "-",
    Statut: p.actif || "-",
    "Heure Début": formatTime(p.heureDebut),
    Utilisateur: p.user || "-",
    "Médecin (Titulaire)": p.medecin?.titulaireNom || "-",
    "Médecin (Présence)": p.medecin ? (!p.medecin.titulairePresent ? "Absent" : "Présent") : "-",
    "Médecin (Absence Justifiée)": p.medecin ? (p.medecin.absenceJustifiee ? "Oui" : "Non") : "N/A",
    "Médecin (Commentaire)": p.medecin?.commentaireAbsence || "-",
    "Médecin (Remplaçant)": p.medecin?.remplacantNom || "-",
    "Infirmière 1 (Titulaire)": p.infirmiere1?.titulaireNom || "-",
    // ... add all other fields similarly for a flat data structure
    "Motif Inactivité": p.motifInactivite || "-",
    "Date Requête": formatDate(p.dateRequest),
    "Heure Inactivité": formatTime(p.heureInactivite),
    "Heure Ouverture Estimée": formatTime(p.heureOuvertureEstimee),
  }));

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            height: "98vh",
            maxHeight: "98vh",
            backgroundColor: "background.default",
            minWidth: { xs: "95vw", sm: "90vw" },
            maxWidth: "98vw",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.dark", color: "white", textAlign: "center", fontWeight: 700,
            fontSize: "1.3rem", borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          🌙 Suivi des Pointages - Administration
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: { xs: 1, sm: 3 }, backgroundColor: "background.default", borderColor: theme.palette.divider,
            overflowY: "auto",
          }}
        >
          <FiltersSection filters={filters} onFilterChange={setFilters} />
          <ErrorMessage error={error} onClose={() => setError(null)} />
          <DialogContentSection />
        </DialogContent>

        <DialogActions
          sx={{
            p: 2, backgroundColor: "background.paper", justifyContent: "space-between",
            borderTop: `1px solid ${theme.palette.divider}`, flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary", mb: { xs: 1, sm: 0 }, textAlign: { xs: "center", sm: "left" } }}>
            Données pour le: {new Date(filters.date.replace(/-/g, "/")).toLocaleDateString("fr-FR")}
          </Typography>
          <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Button onClick={() => setIsConfigDialogOpen(true)} color="info" variant="outlined" startIcon={<ManageAccountsIcon />}>Gérer Personnel</Button>
            <Button onClick={() => setTechnicienModalOpen(true)} color="secondary" variant="outlined" startIcon={<AdminPanelSettingsIcon />}>Mode Admin</Button>
            <Button onClick={onClose} color="inherit" variant="outlined" fullWidth>Fermer</Button>
            <ExportToExcelButton
              data={excelData}
              filename={`Pointages_${filters.date}_${filters.region || "Global"}_${filters.province || ""}`}
              loading={loading}
              disabled={!pointages || pointages.length === 0}
            />
            <Button onClick={() => { fetchPointages(); fetchSitesForMap(); }} color="primary" variant="contained" startIcon={<RefreshIcon />} disabled={loading || loadingSites} fullWidth>
              Recharger
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
      <CommentDialog />
      <PointageTechnicienModal open={technicienModalOpen} onClose={() => { setTechnicienModalOpen(false); fetchPointages(); }} />
      <ConfigActifDialog open={isConfigDialogOpen} onClose={() => { setIsConfigDialogOpen(false); fetchPointages(); }} />
    </ThemeProvider>
  );
};

export default PointagevFinalAdmin;