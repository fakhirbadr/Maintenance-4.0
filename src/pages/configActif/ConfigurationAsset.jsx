import React, { useEffect, useState } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Ajout jsPDF et JsBarcode pour génération PDF de code-barres
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";

import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  useTheme
} from "@mui/material";

import HistoryIcon from "@mui/icons-material/History";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// -- VARIABLE D'ENV POUR L'API --
const API_URL = import.meta.env.VITE_API_URL;

// --- UTILS BARCODE PDF ---
function generateBarcodeImage(code) {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, code, { format: "CODE128" });
  return canvas.toDataURL("image/png");
}

function downloadBarcodePdf(code, label = "") {
  const pdf = new jsPDF();
  const imgData = generateBarcodeImage(code);
  if (label) pdf.text(label, 10, 10);
  pdf.addImage(imgData, "PNG", 10, 20, 100, 30);
  pdf.save(`${code}.pdf`);
}

function downloadMultipleBarcodesPdf(barcodes, title = "") {
  const pdf = new jsPDF();
  let y = 10;
  if (title) {
    pdf.text(title, 10, y);
    y += 10;
  }
  barcodes.forEach(({ code, label }, idx) => {
    const imgData = generateBarcodeImage(code);
    pdf.text(`${label || ""} (${code})`, 10, y + 5);
    pdf.addImage(imgData, "PNG", 10, y + 10, 100, 30);
    y += 45;
    if (y > 260 && idx !== barcodes.length - 1) {
      pdf.addPage();
      y = 10;
    }
  });
  pdf.save(`${title || "codes_barres"}.pdf`);
}

// --- DIALOG POUR AFFICHER L'HISTORIQUE ---
const HistoryDialog = ({ open, onClose, equipment }) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: theme.palette.primary.dark,
          color: theme.palette.primary.contrastText
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <HistoryIcon />
          <span>
            Historique de {equipment?.name}
            {equipment?.description && (
              <span style={{ color: theme.palette.grey[300], fontSize: 14, marginLeft: 8 }}>
                (Code: {equipment.description})
              </span>
            )}
          </span>
        </Box>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: 180,
          maxHeight: 500
        }}
      >
        {!equipment?.history || equipment.history.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%"
            }}
          >
            <Typography color="text.secondary" sx={{ mt: 4, mb: 2 }}>
              Aucun historique de mouvement pour cet équipement
            </Typography>
          </Box>
        ) : (
          <List sx={{ bgcolor: "transparent", maxHeight: 400, overflow: "auto" }}>
            {equipment.history.map((h, index) => (
              <React.Fragment key={h._id || index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ArrowForwardIcon fontSize="small" color="primary" />
                        <Typography component="span" variant="subtitle2" color="primary">
                          {h.fromActifName}
                        </Typography>
                        <span style={{ color: theme.palette.text.secondary }}>→</span>
                        <Typography component="span" variant="subtitle2" color="success.main">
                          {h.toActifName}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ marginLeft: 2, color: theme.palette.text.secondary }}
                        >
                          {new Date(h.movedAt).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {h.fromCategoryName}
                        </Typography>
                        <span style={{ color: theme.palette.text.secondary }}>→</span>
                        <Typography variant="caption" color="text.secondary">
                          {h.toCategoryName}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < equipment.history.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: theme.palette.background.default }}>
        <Button onClick={onClose} color="primary" variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// --- DIALOG POUR MODIFIER L'EQUIPEMENT ---
const EquipmentConfigDialog = ({
  open,
  onClose,
  onSave,
  equipment,
}) => {
  const [name, setName] = useState("");
  const [isFunctionel, setIsFunctionel] = useState(true);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (equipment) {
      setName(equipment.name || "");
      setIsFunctionel(equipment.isFunctionel ?? true);
      setDescription(equipment.description || "");
    }
  }, [equipment, open]);

  const handleSave = () => {
    onSave({
      name,
      isFunctionel,
      description,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Modifier l'équipement</DialogTitle>
      <DialogContent>
        <TextField
          label="Nom de l'équipement"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={isFunctionel}
              onChange={(e) => setIsFunctionel(e.target.checked)}
              color="primary"
            />
          }
          label={isFunctionel ? "Fonctionnel" : "Défectueux"}
        />
        <TextField
          label="Code à barre"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          minRows={2}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const ConfigurationAsset = () => {
  const [actifs, setActifs] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [actifsInRegion, setActifsInRegion] = useState([]);
  const [selectedActif, setSelectedActif] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [newActif, setNewActif] = useState({ name: "", region: "", province: "" });

  // Pour la modification d'équipement
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [equipmentToEdit, setEquipmentToEdit] = useState(null);
  const [editIds, setEditIds] = useState({ actifId: null, categoryId: null, equipmentId: null });

  // Pour l'historique
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [equipmentForHistory, setEquipmentForHistory] = useState(null);

  // Charger tous les actifs au démarrage
  useEffect(() => {
    const fetchActifs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/actifs`);
        setActifs(res.data);

        // Extraire les régions uniques
        const uniqueRegions = [...new Set(res.data.map(a => a.region))].filter(Boolean);
        setRegions(uniqueRegions);
      } catch (error) {
        console.error("Erreur lors du chargement des actifs :", error);
      }
    };
    fetchActifs();
  }, []);

  // Filtrer les actifs par région sélectionnée
  useEffect(() => {
    if (selectedRegion) {
      const filtered = actifs.filter(a => a.region === selectedRegion);
      setActifsInRegion(filtered);
      setSelectedActif(null);
    } else {
      setActifsInRegion([]);
      setSelectedActif(null);
    }
  }, [selectedRegion, actifs]);

  // Pour debug : voir toutes les descriptions existantes
  useEffect(() => {
    const allDescriptions = [];
    actifs.forEach(actif => {
      actif.categories?.forEach(cat => {
        cat.equipments?.forEach(eq => {
          if (eq.description) {
            allDescriptions.push(eq.description);
          }
        });
      });
    });
    console.log("Descriptions existantes des équipements:", allDescriptions);
  }, [actifs]);

  // --- AJOUTER ACTIF ---
  const handleAddActif = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/actifs`, {
        name: newActif.name,
        region: newActif.region,
        province: newActif.province,
        categories: [],
      });
      setActifs([...actifs, res.data]);

      if (!regions.includes(newActif.region)) {
        setRegions([...regions, newActif.region]);
      }

      setNewActif({ name: "", region: "", province: "" });
      setOpenDialog(false);
    } catch (error) {
      alert("Erreur lors de la création: " + (error.response?.data?.error || error.message));
    }
  };

  // --- AJOUTER CATEGORIE ---
  const handleAddCategory = async (actifId) => {
    const name = prompt("Nom de la nouvelle catégorie :");
    if (!name) return;
    try {
      const res = await axios.post(
        `${API_URL}/api/actifs/${actifId}/categories`,
        { category: { name, equipments: [] } }
      );
      setActifs(actifs.map((a) => (a._id === actifId ? res.data : a)));
      if (selectedActif?._id === actifId) {
        setSelectedActif(res.data);
      }
    } catch (error) {
      alert("Erreur lors de l'ajout de la catégorie");
    }
  };

  // --- AJOUTER EQUIPEMENT ---
  const handleAddEquipment = async (actifId, categoryId) => {
    const name = prompt("Nom de l'équipement :");
    if (!name) return;
    try {
      const res = await axios.post(
        `${API_URL}/api/actifs/${actifId}/categories/${categoryId}/equipments`,
        { equipment: { name, isFunctionel: true, description: "" } }
      );
      setActifs(actifs.map((a) => (a._id === actifId ? res.data : a)));
      if (selectedActif?._id === actifId) {
        setSelectedActif(res.data);
      }
    } catch (error) {
      alert("Erreur lors de l'ajout de l'équipement");
    }
  };

  // --- OUVERTURE DU DIALOG CONFIG ---
  const openEquipmentConfigDialog = (actifId, categoryId, equipmentId, eq) => {
    setEditIds({ actifId, categoryId, equipmentId });
    setEquipmentToEdit(eq);
    setConfigDialogOpen(true);
  };

  // --- OUVERTURE DU DIALOG HISTORIQUE ---
  const openHistoryDialog = (eq) => {
    setEquipmentForHistory(eq);
    setHistoryDialogOpen(true);
  };

  // --- SAUVEGARDE MODIFICATION EQUIPEMENT ---
  const handleSaveEquipmentConfig = async (updatedEquipment) => {
    const { actifId, categoryId, equipmentId } = editIds;
    try {
      await axios.put(
        `${API_URL}/api/actifs/${actifId}/categories/${categoryId}/equipments/${equipmentId}`,
        updatedEquipment
      );
      setActifs(
        actifs.map((actif) => {
          if (actif._id === actifId) {
            const updatedActif = {
              ...actif,
              categories: actif.categories.map((category) => {
                if (category._id === categoryId) {
                  return {
                    ...category,
                    equipments: category.equipments.map((equipment) => {
                      if (equipment._id === equipmentId) {
                        return {
                          ...equipment,
                          ...updatedEquipment,
                        };
                      }
                      return equipment;
                    }),
                  };
                }
                return category;
              }),
            };
            if (selectedActif?._id === actifId) {
              setSelectedActif(updatedActif);
            }
            return updatedActif;
          }
          return actif;
        })
      );
    } catch (error) {
      alert("Erreur lors de la mise à jour: " + (error.response?.data?.error || error.message));
    } finally {
      setConfigDialogOpen(false);
      setEquipmentToEdit(null);
      setEditIds({ actifId: null, categoryId: null, equipmentId: null });
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="p-4">
        {/* AJOUTER ACTIF DIALOG */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Ajouter un Actif</DialogTitle>
          <DialogContent>
            <TextField
              label="Nom"
              value={newActif.name}
              onChange={(e) => setNewActif({ ...newActif, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Région"
              value={newActif.region}
              onChange={(e) => setNewActif({ ...newActif, region: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Province"
              value={newActif.province}
              onChange={(e) => setNewActif({ ...newActif, province: e.target.value })}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
            <Button onClick={handleAddActif} variant="contained" color="primary">
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Configuration des Actifs</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setOpenDialog(true)}
          >
            ➕ Ajouter un Actif
          </button>
        </div>

        {/* SÉLECTION DE LA RÉGION */}
        <div className="mb-6 bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Étape 1 : Sélectionnez une région</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedRegion === region
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-800 text-gray-200 border-gray-700 hover:border-blue-400"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
          {selectedRegion && (
            <button
              onClick={() => setSelectedRegion(null)}
              className="mt-4 text-sm text-blue-300 hover:underline"
            >
              ✕ Effacer la sélection
            </button>
          )}
        </div>

        {/* SÉLECTION DE L'ACTIF */}
        {selectedRegion && (
          <div className="mb-6 bg-gray-900 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">
              Étape 2 : Sélectionnez un actif dans {selectedRegion}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {actifsInRegion.map((actif) => (
                <button
                  key={actif._id}
                  onClick={() => setSelectedActif(actif)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedActif?._id === actif._id
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-800 text-gray-200 border-gray-700 hover:border-green-400"
                  }`}
                >
                  <div className="font-semibold">{actif.name}</div>
                  {actif.province && (
                    <div className="text-sm opacity-90 mt-1">{actif.province}</div>
                  )}
                </button>
              ))}
            </div>
            {actifsInRegion.length === 0 && (
              <p className="text-gray-400 text-center py-4">
                Aucun actif trouvé dans cette région
              </p>
            )}
            {selectedActif && (
              <button
                onClick={() => setSelectedActif(null)}
                className="mt-4 text-sm text-green-300 hover:underline"
              >
                ✕ Effacer la sélection
              </button>
            )}
          </div>
        )}

        {/* DÉTAILS DE L'ACTIF SÉLECTIONNÉ */}
        {selectedActif && (
          <div className="bg-gray-900 p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedActif.name}</h3>
                <p className="text-sm text-gray-400">
                  {selectedActif.region} {selectedActif.province && `- ${selectedActif.province}`}
                </p>
              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleAddCategory(selectedActif._id)}
              >
                ➕ Ajouter une Catégorie
              </button>
            </div>

            {/* Bouton pour tous les codes-barres de l'actif */}
            {selectedActif.categories && selectedActif.categories.some(cat => cat.equipments && cat.equipments.length > 0) && (
              <button
                className="mb-4 px-3 py-2 bg-green-700 text-white rounded text-sm hover:bg-green-800"
                onClick={() =>
                  downloadMultipleBarcodesPdf(
                    selectedActif.categories
                      .flatMap(cat =>
                        (cat.equipments || [])
                          .filter(eq => eq.description)
                          .map(eq => ({ code: eq.description, label: eq.name }))
                      ),
                    `actif_${selectedActif.name}_codes_barres`
                  )
                }
              >
                Télécharger tous les codes-barres de cet actif
              </button>
            )}

            {selectedActif.categories?.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                Aucune catégorie. Ajoutez-en une pour commencer.
              </p>
            )}

            {selectedActif.categories?.map((cat) => (
              <div key={cat._id} className="border-l-4 border-blue-500 pl-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold">{cat.name}</h4>
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    onClick={() => handleAddEquipment(selectedActif._id, cat._id)}
                  >
                    ➕ Ajouter Équipement
                  </button>
                </div>

                {/* Bouton pour tous les codes-barres de la catégorie */}
                {cat.equipments && cat.equipments.length > 0 && (
                  <button
                    className="mb-2 px-2 py-1 bg-blue-700 text-white rounded text-xs hover:bg-blue-800"
                    onClick={() =>
                      downloadMultipleBarcodesPdf(
                        cat.equipments
                          .filter(eq => eq.description)
                          .map(eq => ({ code: eq.description, label: eq.name })),
                        `cat_${cat.name}_codes_barres`
                      )
                    }
                  >
                    Télécharger tous les codes-barres de cette catégorie
                  </button>
                )}

                {cat.equipments?.length === 0 && (
                  <p className="text-gray-500 text-sm ml-2 mb-3">Aucun équipement</p>
                )}

                <ul className="space-y-2">
                  {cat.equipments?.map((eq) => (
                    <li
                      key={eq._id}
                      className="bg-gray-800 p-3 rounded"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className={`font-medium ${
                                eq.isFunctionel ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {eq.name}
                            </span>
                            {/* Description cliquable pour télécharger le code-barres */}
                            {eq.description && (
                              <button
                                type="button"
                                className="text-sm text-blue-300 font-mono bg-blue-900/30 px-2 py-0.5 rounded border border-blue-700/50 hover:underline cursor-pointer"
                                onClick={() => downloadBarcodePdf(eq.description, eq.name)}
                                title="Télécharger le code-barres PDF"
                              >
                                [{eq.description}]
                              </button>
                            )}
                            <span className="text-sm text-gray-400">
                              {eq.isFunctionel ? "✓ Fonctionnel" : "✗ Défectueux"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span>ID: {eq._id}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            className="text-blue-400 hover:text-blue-200 text-sm font-medium px-2 py-1 rounded hover:bg-gray-700"
                            onClick={() =>
                              openEquipmentConfigDialog(selectedActif._id, cat._id, eq._id, eq)
                            }
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button
                            className="text-yellow-400 hover:text-yellow-200 text-sm font-medium px-2 py-1 rounded hover:bg-gray-700"
                            onClick={() => openHistoryDialog(eq)}
                            title="Voir l'historique"
                          >
                            🕐
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* DIALOG MODIFICATION EQUIPEMENT */}
        <EquipmentConfigDialog
          open={configDialogOpen}
          onClose={() => setConfigDialogOpen(false)}
          onSave={handleSaveEquipmentConfig}
          equipment={equipmentToEdit}
        />

        {/* DIALOG HISTORIQUE */}
        <HistoryDialog
          open={historyDialogOpen}
          onClose={() => setHistoryDialogOpen(false)}
          equipment={equipmentForHistory}
        />
      </div>
    </ThemeProvider>
  );
};

export default ConfigurationAsset;