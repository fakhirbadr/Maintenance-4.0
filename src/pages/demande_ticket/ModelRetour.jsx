import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  TextField,
} from "@mui/material";
import Barcode from "react-barcode";
import EventNoteIcon from '@mui/icons-material/EventNote';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const DestinationStep = ({ userActifs, currentActifId, onDestinationSelected, loading }) => {
  const [selectedDestinationActif, setSelectedDestinationActif] = React.useState("");
  const [selectedDestinationCategory, setSelectedDestinationCategory] = React.useState("");

  const handleDestinationActifChange = (event) => {
    setSelectedDestinationActif(event.target.value);
    setSelectedDestinationCategory("");
  };

  const handleDestinationCategoryChange = (event) => {
    setSelectedDestinationCategory(event.target.value);
  };

  const getSelectedDestinationActif = () =>
    userActifs.find(actif => actif._id === selectedDestinationActif);

  const getDestinationCategories = () =>
    getSelectedDestinationActif()?.categories || [];

  React.useEffect(() => {
    if (selectedDestinationActif && selectedDestinationCategory) {
      onDestinationSelected({
        actifId: selectedDestinationActif,
        categoryId: selectedDestinationCategory
      });
    }
  }, [selectedDestinationActif, selectedDestinationCategory, onDestinationSelected]);

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth disabled={loading}>
          <InputLabel id="destination-actif-label">Unité de destination *</InputLabel>
          <Select
            labelId="destination-actif-label"
            value={selectedDestinationActif}
            onChange={handleDestinationActifChange}
            label="Unité de destination *"
          >
            {userActifs
              .filter(actif => actif._id !== currentActifId)
              .map(actif => (
                <MenuItem key={actif._id} value={actif._id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{actif.name}</Typography>
                    <Chip label={actif.region} size="small" color="primary" variant="outlined" />
                    {actif.province && (
                      <Chip label={actif.province} size="small" color="secondary" variant="outlined" />
                    )}
                  </Box>
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>

      {selectedDestinationActif && (
        <Grid item xs={12} md={6}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel id="destination-category-label">Catégorie de destination *</InputLabel>
            <Select
              labelId="destination-category-label"
              value={selectedDestinationCategory}
              onChange={handleDestinationCategoryChange}
              label="Catégorie de destination *"
            >
              {getDestinationCategories().map(category => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
};

const HistoryStep = ({ equipment, currentActifName, currentCategoryName }) => {
  if (!equipment || !equipment.history || equipment.history.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
        <EventNoteIcon color="disabled" sx={{ fontSize: 60, mb: 1 }} />
        <Typography variant="h6" color="textSecondary">
          Aucun historique de transfert disponible
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Cet équipement n'a pas encore été transféré.
        </Typography>
      </Paper>
    );
  }

  const sortedHistory = [...equipment.history].sort((a, b) =>
    new Date(b.movedAt) - new Date(a.movedAt)
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <SwapHorizIcon sx={{ mr: 1 }} />
        Historique des transferts
      </Typography>
      <List sx={{ maxHeight: 400, overflow: 'auto', bgcolor: 'background.paper', borderRadius: 1 }}>
        {sortedHistory.map((record, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography variant="subtitle1" color="primary">
                    Transfert #{sortedHistory.length - index}
                  </Typography>
                }
                secondary={
                  <>
                    <Box sx={{ display: 'flex', mt: 1, flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EventNoteIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.primary">
                          {new Date(record.movedAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" component="div">
                          <Box component="span" fontWeight="bold">Source:</Box>
                          <Box component="span" ml={1}>
                            {record.fromActifName} / {record.fromCategoryName}
                          </Box>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                        <Typography variant="body2" component="div">
                          <Box component="span" fontWeight="bold">Destination:</Box>
                          <Box component="span" ml={1}>
                            {record.toActifName} / {record.toCategoryName}
                          </Box>
                        </Typography>
                      </Box>
                    </Box>
                  </>
                }
              />
            </ListItem>
            {index < sortedHistory.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      <Paper sx={{ p: 2, mt: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon sx={{ mr: 1 }} />
          Emplacement actuel
        </Typography>
        <Typography variant="body1" sx={{ ml: 3, mt: 1 }}>
          {currentActifName} / {currentCategoryName}
        </Typography>
      </Paper>
    </Box>
  );
};

const ModelRetour = ({ open, onClose }) => {
  const [userInfo, setUserInfo] = React.useState(null);
  const [userActifs, setUserActifs] = React.useState([]);
  const [userActifsIds, setUserActifsIds] = React.useState([]);
  const [selectedActif, setSelectedActif] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedEquipment, setSelectedEquipment] = React.useState("");
  const [destination, setDestination] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [barcodeValue, setBarcodeValue] = React.useState("");
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [transferredEquipment, setTransferredEquipment] = React.useState(null);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState({ actif: "", category: "" });

  // Ajout pour scan
  const [barcodeInput, setBarcodeInput] = React.useState("");
  const [scanError, setScanError] = React.useState("");

  const steps = ['Sélection équipement', 'Choix destination', 'Historique des transferts'];

  const getCurrentActif = () => userActifs.find(actif => actif._id === selectedActif);
  const getCurrentCategory = () => getCurrentActif()?.categories?.find(cat => cat._id === selectedCategory);
  const getAvailableEquipments = () => getCurrentCategory()?.equipments || [];
  const getSelectedEquipment = () => getAvailableEquipments().find(eq => eq._id === selectedEquipment);

  React.useEffect(() => {
    if (selectedEquipment) {
      const equipment = getSelectedEquipment();
      if (equipment) {
        setBarcodeValue(equipment.description || equipment._id);
      }
    } else {
      setBarcodeValue("");
    }
  }, [selectedEquipment]);

  const fetchActifsDetails = async (actifIds) => {
    setInitialLoading(true);
    setError("");
    try {
      const actifPromises = actifIds.map(async (id) => {
        const response = await fetch(`${apiUrl}/api/actifs/${id}`);
        return response.ok ? await response.json() : null;
      });

      const actifs = await Promise.all(actifPromises);
      setUserActifs(actifs.filter(actif => actif !== null));
    } catch (error) {
      console.error("Erreur lors de la récupération des actifs:", error);
      setError("Erreur lors de la récupération des actifs. Veuillez réessayer.");
      setUserActifs([]);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      setActiveStep(0);
      setError("");
      setSuccessMessage("");
      setDestination(null);
      setSelectedActif("");
      setSelectedCategory("");
      setSelectedEquipment("");
      setTransferredEquipment(null);
      setCurrentLocation({ actif: "", category: "" });
      setBarcodeInput("");
      setScanError("");

      const userInfoData = localStorage.getItem("userInfo");
      const userActifsData = localStorage.getItem("userActifs");

      if (userInfoData) {
        try {
          setUserInfo(JSON.parse(userInfoData));
        } catch {
          setError("Erreur lors du chargement des informations utilisateur.");
        }
      }

      if (userActifsData) {
        try {
          const parsedUserActifs = JSON.parse(userActifsData);
          const actifIds = Array.isArray(parsedUserActifs) ? parsedUserActifs : [];
          setUserActifsIds(actifIds);
          if (actifIds.length > 0) {
            fetchActifsDetails(actifIds);
          } else {
            setInitialLoading(false);
          }
        } catch {
          setError("Erreur lors du chargement des actifs utilisateur.");
          setUserActifsIds([]);
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
      }
    }
  }, [open]);

  // Recherche équipement par code-barres (description)
  const findEquipmentByBarcode = (barcode) => {
    for (const actif of userActifs) {
      for (const category of actif.categories || []) {
        for (const equipment of category.equipments || []) {
          if (
            equipment.description === barcode ||
            equipment._id === barcode
          ) {
            return { actifId: actif._id, categoryId: category._id, equipmentId: equipment._id };
          }
        }
      }
    }
    return null;
  };

  // Gérer le scan
  React.useEffect(() => {
    if (barcodeInput && barcodeInput.length > 0) {
      const match = findEquipmentByBarcode(barcodeInput.trim());
      if (match) {
        setSelectedActif(match.actifId);
        setSelectedCategory(match.categoryId);
        setSelectedEquipment(match.equipmentId);
        setScanError("");
      } else {
        setScanError("Aucun équipement trouvé pour ce code-barres.");
      }
    } else {
      setScanError("");
    }
    // eslint-disable-next-line
  }, [barcodeInput, userActifs]);

  const handleNext = () => {
    if (activeStep === 0 && selectedEquipment) {
      setActiveStep(1);
    } else if (activeStep === 1 && destination) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (activeStep === 2) {
      setActiveStep(0);
      setTransferredEquipment(null);
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const handleActifChange = (event) => {
    setSelectedActif(event.target.value);
    setSelectedCategory("");
    setSelectedEquipment("");
    setBarcodeInput("");
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedEquipment("");
    setBarcodeInput("");
  };

  const handleEquipmentChange = (event) => {
    setSelectedEquipment(event.target.value);
    setBarcodeInput("");
  };

  const fetchEquipmentDetails = async (equipmentId) => {
    setHistoryLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/equipments/${equipmentId}`);
      if (!response.ok) {
        throw new Error("Équipement introuvable");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors du chargement des détails de l'équipement:", error);
      return null;
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    if (!selectedEquipment || !destination) {
      setError("Veuillez compléter toutes les sélections.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/v1/gestionRetour/move-equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId: selectedEquipment,
          sourceActifId: selectedActif,
          sourceCategoryId: selectedCategory,
          destinationActifId: destination.actifId,
          destinationCategoryId: destination.categoryId
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors du transfert");
      }

      const data = await response.json();
      setSuccessMessage(data.message || "Transfert confirmé avec succès !");

      const equipmentDetails = await fetchEquipmentDetails(selectedEquipment);
      if (equipmentDetails) {
        setTransferredEquipment(equipmentDetails);

        const destinationActif = userActifs.find(a => a._id === destination.actifId);
        const destinationCategory = destinationActif?.categories.find(c => c._id === destination.categoryId);

        if (destinationActif && destinationCategory) {
          setCurrentLocation({
            actif: destinationActif.name,
            category: destinationCategory.name
          });
        }
      }

      setActiveStep(2);

    } catch (err) {
      setError(err.message || "Erreur réseau ou serveur.");
      console.error("Erreur détaillée:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setSuccessMessage("");
    setSelectedActif("");
    setSelectedCategory("");
    setSelectedEquipment("");
    setDestination(null);
    setBarcodeValue("");
    setLoading(false);
    setActiveStep(0);
    setTransferredEquipment(null);
    setCurrentLocation({ actif: "", category: "" });
    setBarcodeInput("");
    setScanError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5">Retour / Déplacement d'Équipement</Typography>
          <Stepper activeStep={activeStep} sx={{ mt: 2, bgcolor: 'transparent' }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ '& .MuiStepLabel-label': { color: 'white' } }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: 'background.default' }}>
        {userInfo && activeStep !== 2 && (
          <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Informations Utilisateur
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}><Typography><strong>Nom:</strong> {userInfo.nomComplet}</Typography></Grid>
              <Grid item xs={12} md={6}><Typography><strong>Email:</strong> {userInfo.email}</Typography></Grid>
              <Grid item xs={12} md={6}><Typography><strong>Région:</strong> {userInfo.region}</Typography></Grid>
              <Grid item xs={12} md={6}><Typography><strong>Province:</strong> {userInfo.province || 'Non spécifié'}</Typography></Grid>
            </Grid>
          </Paper>
        )}

        {activeStep === 0 && (
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Scanner le code-barres"
              variant="outlined"
              fullWidth
              value={barcodeInput}
              onChange={e => setBarcodeInput(e.target.value)}
              disabled={loading || initialLoading}
              sx={{ mb: 1 }}
              placeholder="Scannez ou saisissez le code-barres ici"
            />
            {scanError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {scanError}
              </Alert>
            )}
            <Typography variant="body2" color="textSecondary">
              Vous pouvez scanner le code-barres de l'équipement ou sélectionner manuellement.
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {successMessage}
          </Alert>
        )}

        {initialLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {activeStep === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                    <FormControl fullWidth disabled={loading}>
                      <InputLabel id="label-actif">Actif actuel *</InputLabel>
                      <Select
                        labelId="label-actif"
                        value={selectedActif}
                        onChange={handleActifChange}
                        label="Actif actuel *"
                      >
                        {userActifs.length === 0 ? (
                          <MenuItem disabled>Aucun actif disponible</MenuItem>
                        ) : (
                          userActifs.map(actif => (
                            <MenuItem key={actif._id} value={actif._id}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>{actif.name}</Typography>
                                <Chip label={actif.region} size="small" color="primary" variant="outlined" />
                                {actif.province && (
                                  <Chip label={actif.province} size="small" color="secondary" variant="outlined" />
                                )}
                              </Box>
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </Paper>
                </Grid>
                {selectedActif && (
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1, height: '100%' }}>
                      <FormControl fullWidth disabled={loading}>
                        <InputLabel id="label-category">Catégorie *</InputLabel>
                        <Select
                          labelId="label-category"
                          value={selectedCategory}
                          onChange={handleCategoryChange}
                          label="Catégorie *"
                        >
                          {getCurrentActif()?.categories?.map(category => (
                            <MenuItem key={category._id} value={category._id}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {category.name}
                                <Chip
                                  label={`${category.equipments?.length || 0} équip.`}
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Paper>
                  </Grid>
                )}
                {selectedCategory && (
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1, height: '100%' }}>
                      <FormControl fullWidth disabled={loading}>
                        <InputLabel id="label-equipment">Équipement *</InputLabel>
                        <Select
                          labelId="label-equipment"
                          value={selectedEquipment}
                          onChange={handleEquipmentChange}
                          label="Équipement *"
                        >
                          {getAvailableEquipments().map(equipment => (
                            <MenuItem key={equipment._id} value={equipment._id}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {equipment.name}
                                <Chip
                                  label={equipment.isFunctionel ? "Fonctionnel" : "Défaillant"}
                                  size="small"
                                  color={equipment.isFunctionel ? "success" : "error"}
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Paper>
                  </Grid>
                )}
                {selectedEquipment && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Identification de l'équipement
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: 1,
                        p: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 1
                      }}>
                        <Box sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          p: 2,
                          backgroundColor: 'white',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          {barcodeValue ? (
                            <Barcode
                              value={barcodeValue}
                              format="CODE128"
                              width={1.5}
                              height={50}
                              fontSize={14}
                              displayValue={true}
                            />
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              Aucun code-barres disponible
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ mt: 2, width: '100%' }}>
                          <Typography variant="body2" gutterBottom>
                            <strong>ID de l'équipement:</strong> {selectedEquipment}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Description:</strong> {barcodeValue || "Non disponible"}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}
            {activeStep === 1 && (
              <>
                <Paper sx={{ mb: 3, p: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Équipement sélectionné
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}><Typography><strong>Actif:</strong> {getCurrentActif()?.name}</Typography></Grid>
                    <Grid item xs={4}><Typography><strong>Catégorie:</strong> {getCurrentCategory()?.name}</Typography></Grid>
                    <Grid item xs={4}><Typography><strong>Équipement:</strong> {getSelectedEquipment()?.name}</Typography></Grid>
                  </Grid>
                </Paper>
                <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Destination du transfert
                  </Typography>
                  <DestinationStep
                    userActifs={userActifs}
                    currentActifId={selectedActif}
                    onDestinationSelected={setDestination}
                    loading={loading}
                  />
                </Paper>
                <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                  <strong>Attention:</strong> Vérifiez bien les informations avant de confirmer le transfert.
                  Cette action est irréversible.
                </Alert>
              </>
            )}
            {activeStep === 2 && (
              <Box>
                <Paper sx={{ mb: 3, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <SwapHorizIcon sx={{ mr: 1 }} />
                    Transfert confirmé avec succès!
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    L'équipement a été déplacé vers sa nouvelle destination.
                  </Typography>
                </Paper>
                <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Détails de l'équipement
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography><strong>Nom:</strong> {getSelectedEquipment()?.name}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography>
                        <strong>État:</strong>
                        <Chip
                          label={getSelectedEquipment()?.isFunctionel ? "Fonctionnel" : "Défaillant"}
                          size="small"
                          color={getSelectedEquipment()?.isFunctionel ? "success" : "error"}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography><strong>ID:</strong> {selectedEquipment}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography><strong>Description:</strong> {getSelectedEquipment()?.description || "Aucune description"}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
                {historyLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Chargement de l'historique...</Typography>
                  </Box>
                ) : (
                  <HistoryStep
                    equipment={transferredEquipment || getSelectedEquipment()}
                    currentActifName={currentLocation.actif || getCurrentActif()?.name}
                    currentCategoryName={currentLocation.category || getCurrentCategory()?.name}
                  />
                )}
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: 'grey.100', p: 2 }}>
        {activeStep < 2 && (
          <Button
            onClick={activeStep === 0 ? handleClose : handleBack}
            color="secondary"
            disabled={loading}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            {activeStep === 0 ? 'Annuler' : 'Retour'}
          </Button>
        )}
        {activeStep === 0 && (
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            disabled={loading || initialLoading || !selectedEquipment}
            sx={{ borderRadius: 2 }}
          >
            Suivant
          </Button>
        )}
        {activeStep === 1 && (
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            disabled={loading || !destination}
            sx={{ borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirmer le Transfert'}
          </Button>
        )}
        {activeStep === 2 && (
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Terminer
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModelRetour;