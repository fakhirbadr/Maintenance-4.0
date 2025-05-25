import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stack,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  InputLabel,
} from "@mui/material";

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

// Utils
function getTodayDateString() {
  // Format 'YYYY-MM-DD' en local
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Force minuit UTC (et non local)
function getDateRequestUtc(dateStr) {
  // dateStr au format 'YYYY-MM-DD'
  return new Date(dateStr + "T00:00:00Z");
}

// Convertit "HH:mm" + "YYYY-MM-DD" en Date (sans 'Z' pour éviter le décalage d'heure)
function timeStringToDate(timeStr, dateStr = getTodayDateString()) {
  if (!timeStr) return null;
  return new Date(`${dateStr}T${timeStr}:00`);
}

const motifInactiviteList = [
  "Maintenance",
  "Manque de personnel",
  "Problème technique",
  "Travaux",
  "Autre",
];

const personnelRoles = [
  { key: "medecin", label: "Médecin" },
  { key: "infirmiere1", label: "Infirmière 1" },
  { key: "infirmiere2", label: "Infirmière 2" },
];

export default function UniteEtatModal({ open, onClose, onSave }) {
  // Stocke la correspondance unité -> région/province
  const [unitesInfos, setUnitesInfos] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [actifsList, setActifsList] = useState([]);
  const [selectedUnitName, setSelectedUnitName] = useState("");
  const [regionCurrent, setRegionCurrent] = useState("");
  const [provinceCurrent, setProvinceCurrent] = useState("");

  useEffect(() => {
    if (open) {
      fetch(`${apiUrl}/api/actifs/nameRegionProvince`)
        .then((res) => res.json())
        .then((data) => setUnitesInfos(data || []))
        .catch(() => setUnitesInfos([]));
    }
  }, [open]);

  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem("userInfo");
      const storedActifsList = localStorage.getItem("nameActifUser");

      const parsedUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : {};
      const parsedActifsList = storedActifsList
        ? JSON.parse(storedActifsList)
        : [];

      setUserInfo(parsedUserInfo);
      setActifsList(parsedActifsList);
    } catch (error) {
      setUserInfo({});
      setActifsList([]);
    }
  }, [open]);

  useEffect(() => {
    if (open && actifsList.length === 1) {
      setSelectedUnitName(actifsList[0]);
    } else if (open) {
      setSelectedUnitName("");
    }
  }, [open, actifsList]);

  // Met à jour la région & province selon l'unité choisie
  useEffect(() => {
    if (selectedUnitName && unitesInfos.length > 0) {
      const found = unitesInfos.find(
        (u) =>
          u.name &&
          u.name.trim().toLowerCase() === selectedUnitName.trim().toLowerCase()
      );
      setRegionCurrent(found?.region || "");
      setProvinceCurrent(found?.province || "");
    } else {
      setRegionCurrent("");
      setProvinceCurrent("");
    }
  }, [selectedUnitName, unitesInfos]);

  const [etat, setEtat] = useState(""); // "actif" | "inactif"
  const [heureOuverture, setHeureOuverture] = useState("");
  const [personnel, setPersonnel] = useState({
    medecin: { present: null },
    infirmiere1: { present: null },
    infirmiere2: { present: null },
  });
  const [motifInactivite, setMotifInactivite] = useState(""); // select
  const [dateInactivite, setDateInactivite] = useState(getTodayDateString());
  const [heureInactivite, setHeureInactivite] = useState("");
  const [heureOuvertureEstimee, setHeureOuvertureEstimee] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Validation
  const isActifValid =
    etat === "actif" &&
    heureOuverture &&
    Object.values(personnel).every((p) => p.present !== null) &&
    selectedUnitName;

  const isInactifValid =
    etat === "inactif" &&
    motifInactivite &&
    dateInactivite &&
    heureInactivite &&
    heureOuvertureEstimee &&
    heureOuvertureEstimee > heureInactivite &&
    selectedUnitName;

  const handlePersonnelPresence = (role, present) => {
    setPersonnel((prev) => ({
      ...prev,
      [role]: { present },
    }));
  };

  const resetForm = () => {
    setEtat("");
    setHeureOuverture("");
    setPersonnel({
      medecin: { present: null },
      infirmiere1: { present: null },
      infirmiere2: { present: null },
    });
    setMotifInactivite("");
    setDateInactivite(getTodayDateString());
    setHeureInactivite("");
    setHeureOuvertureEstimee("");
    setSelectedUnitName("");
  };

  function buildPayload() {
    const base = {
      region: regionCurrent || "",
      province: provinceCurrent || "",
      user: userInfo.nomComplet || "",
      site: selectedUnitName,
      isClosed: false,
      isDeleted: false,
      siteActif: etat === "actif", // True si l'unité est active
    };

    const todayStr = getTodayDateString();

    if (etat === "actif") {
      return {
        ...base,
        actif: "actif",
        heureDebut: timeStringToDate(heureOuverture),
        medcinPresent: personnel.medecin.present,
        infirmiere1Present: personnel.infirmiere1.present,
        infirmiere2Present: personnel.infirmiere2.present,
        motifInactivite: null,
        dateRequest: getDateRequestUtc(todayStr), // CORRECTION ICI
        heureInactivite: null,
        heureOuvertureEstimee: null,
      };
    } else if (etat === "inactif") {
      return {
        ...base,
        actif: "inactif",
        heureDebut: null,
        medcinPresent: null,
        infirmiere1Present: null,
        infirmiere2Present: null,
        motifInactivite,
        dateRequest: getDateRequestUtc(dateInactivite), // CORRECTION ICI
        heureInactivite: timeStringToDate(heureInactivite, dateInactivite),
        heureOuvertureEstimee: timeStringToDate(
          heureOuvertureEstimee,
          dateInactivite
        ),
      };
    }
    return base;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = buildPayload();

    console.log("Payload envoyé au backend :", payload);

    try {
      const response = await fetch(`${apiUrl}/api/v1/pointage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur backend:", response.status, errorText, payload);
        throw new Error(
          `Erreur lors de l'enregistrement du pointage (${response.status}): ${errorText}`
        );
      }
      setSnackbar({
        open: true,
        message:
          etat === "actif"
            ? `Unité ACTIVE (${selectedUnitName}) — Ouverture: ${heureOuverture} | Médecin: ${
                personnel.medecin.present ? "Présent" : "Absent"
              }, Infirmière 1: ${
                personnel.infirmiere1.present ? "Présente" : "Absente"
              }, Infirmière 2: ${
                personnel.infirmiere2.present ? "Présente" : "Absente"
              }`
            : `Unité INACTIVE (${selectedUnitName}) — Motif: ${motifInactivite} | Depuis: ${dateInactivite} ${heureInactivite} | Ouverture estimée: ${heureOuvertureEstimee}`,
        severity: etat === "actif" ? "success" : "info",
      });

      if (onSave) onSave(payload);

      resetForm();
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleUnitNameChange = (e) => {
    setSelectedUnitName(e.target.value);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="unite-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="unite-modal-title" variant="h6" mb={2}>
            Saisir l'état de l'unité
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Select unité */}
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel id="unite-label">Unité</InputLabel>
              <Select
                labelId="unite-label"
                id="unite-select"
                value={selectedUnitName}
                label="Unité"
                onChange={handleUnitNameChange}
                disabled={actifsList.length === 1}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Choisir une unité...</em>
                </MenuItem>
                {actifsList.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Affiche région/province trouvées */}
            {regionCurrent && provinceCurrent && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Région : <b>{regionCurrent}</b> | Province :{" "}
                <b>{provinceCurrent}</b>
              </Typography>
            )}

            <FormControl required>
              <FormLabel id="etat-unite-label">État de l'unité</FormLabel>
              <RadioGroup
                row
                value={etat}
                onChange={(e) => setEtat(e.target.value)}
                name="etat-unite"
              >
                <FormControlLabel
                  value="actif"
                  control={<Radio color="success" />}
                  label="Actif"
                />
                <FormControlLabel
                  value="inactif"
                  control={<Radio color="error" />}
                  label="Inactif"
                />
              </RadioGroup>
            </FormControl>

            {/* Si actif */}
            {etat === "actif" && (
              <Box mt={2}>
                <TextField
                  label="Heure d'ouverture"
                  type="time"
                  fullWidth
                  value={heureOuverture}
                  onChange={(e) => setHeureOuverture(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    État de présence du personnel
                  </Typography>
                  {personnelRoles.map(({ key, label }) => (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={1}
                      key={key}
                    >
                      <Typography sx={{ width: 120 }}>{label}</Typography>
                      <RadioGroup
                        row
                        value={
                          personnel[key].present === null
                            ? ""
                            : personnel[key].present
                            ? "present"
                            : "absent"
                        }
                        onChange={(e) =>
                          handlePersonnelPresence(
                            key,
                            e.target.value === "present"
                              ? true
                              : e.target.value === "absent"
                              ? false
                              : null
                          )
                        }
                        name={`${key}-presence`}
                      >
                        <FormControlLabel
                          value="present"
                          control={<Radio color="success" />}
                          label={label === "Médecin" ? "Présent" : "Présente"}
                        />
                        <FormControlLabel
                          value="absent"
                          control={<Radio color="error" />}
                          label={label === "Médecin" ? "Absent" : "Absente"}
                        />
                      </RadioGroup>
                    </Stack>
                  ))}
                </Box>
              </Box>
            )}

            {/* Si inactif */}
            {etat === "inactif" && (
              <Box mt={2}>
                <FormControl fullWidth required margin="normal" size="small">
                  <InputLabel id="motif-label">Motif d'inactivité</InputLabel>
                  <Select
                    labelId="motif-label"
                    value={motifInactivite}
                    onChange={(e) => setMotifInactivite(e.target.value)}
                    label="Motif d'inactivité"
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Choisir un motif...</em>
                    </MenuItem>
                    {motifInactiviteList.map((motif) => (
                      <MenuItem key={motif} value={motif}>
                        {motif}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Stack direction="row" spacing={2} mt={1}>
                  <TextField
                    label="Date d'inactivité"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={dateInactivite}
                    onChange={(e) => setDateInactivite(e.target.value)}
                    required
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Heure d'inactivité"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    value={heureInactivite}
                    onChange={(e) => setHeureInactivite(e.target.value)}
                    required
                    sx={{ flex: 1 }}
                  />
                </Stack>
                <TextField
                  label="Heure d'ouverture estimée"
                  type="time"
                  fullWidth
                  value={heureOuvertureEstimee}
                  onChange={(e) => setHeureOuvertureEstimee(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{ mt: 2 }}
                />
              </Box>
            )}

            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 4, justifyContent: "flex-end" }}
            >
              <Button onClick={handleClose}>Annuler</Button>
              <Button
                type="submit"
                disabled={etat === "actif" ? !isActifValid : !isInactifValid}
                variant="contained"
              >
                Valider
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
