import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";

// --- MODIFICATION : Utilisation de la variable d'environnement ---
// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- NOUVELLE FONCTION : Pour formater la date locale correctement ---
/**
 * Crée une chaîne de caractères date-heure au format YYYY-MM-DDTHH:mm
 * à partir de la date locale actuelle de l'utilisateur.
 * @returns {string} La date et l'heure formatées pour un input datetime-local.
 */
function getLocalDateTimeForInput() {
  const date = new Date();
  const year = date.getFullYear();
  // getMonth() est 0-indexé (0 pour Janvier), donc on ajoute 1.
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// --- Sous-formulaire personnel ---
function PersonnelForm({ label, value, onChange }) {
  if (!value.titulaireNom) {
    return (
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ color: "text.disabled" }}
        >
          {label} (Aucun titulaire assigné)
        </Typography>{" "}
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      {" "}
      <Typography variant="subtitle1" gutterBottom>
        {label}:{" "}
        <Typography component="span" sx={{ color: "primary.light" }}>
          {value.titulaireNom}
        </Typography>{" "}
      </Typography>{" "}
      <FormControlLabel
        control={
          <Checkbox
            checked={value.titulairePresent}
            onChange={(e) =>
              onChange({ ...value, titulairePresent: e.target.checked })
            }
          />
        }
        label="Titulaire présent"
      />{" "}
      {!value.titulairePresent && (
        <Stack spacing={1} sx={{ mt: 1, ml: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={value.remplacantPresent || false}
                onChange={(e) => {
                  const isPresent = e.target.checked;
                  onChange({
                    ...value,
                    remplacantPresent: isPresent,
                    remplacantNom: isPresent ? value.remplacantNom : "",
                  });
                }}
              />
            }
            label="Remplaçant présent"
          />

          <TextField
            label="Nom remplaçant"
            fullWidth
            size="small"
            value={value.remplacantNom || ""}
            onChange={(e) =>
              onChange({ ...value, remplacantNom: e.target.value })
            }
            disabled={!value.remplacantPresent}
          />
        </Stack>
      )}{" "}
    </Paper>
  );
}

// --- Composant principal du dialogue ---
export default function PointageTechnicienModel({ open, onClose }) {
  const initialFormState = {
    actif: "actif",
    site: "",
    region: "",
    province: "",
    user: "",
    heureDebut: "",
    medecin: {
      titulaireNom: "",
      titulairePresent: true,
      remplacantNom: "",
      remplacantPresent: false,
    },
    infirmiere1: {
      titulaireNom: "",
      titulairePresent: true,
      remplacantNom: "",
      remplacantPresent: false,
    },
    infirmiere2: {
      titulaireNom: "",
      titulairePresent: true,
      remplacantNom: "",
      remplacantPresent: false,
    },
    technicien: {
      titulaireNom: "",
      titulairePresent: true,
      remplacantNom: "",
      remplacantPresent: false,
    },
    motifInactivite: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialFormState);
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        setForm((f) => ({
          ...initialFormState,
          user: JSON.parse(storedUser).nomComplet || "Admin",
        }));
      }
      const actifsIds = JSON.parse(localStorage.getItem("userActifs") || "[]");

      axios
        .get(`${API_BASE_URL}/api/actifs`)
        .then(({ data }) => {
          const filteredSites = Array.isArray(data)
            ? data.filter((site) => actifsIds.includes(site._id))
            : [];
          setSites(filteredSites);
        })
        .catch(() => {
          setError("Impossible de charger la liste des sites.");
          setSites([]);
        });
    }
  }, [open]);

  const handleSiteChange = async (e) => {
    const siteId = e.target.value;
    const selectedSite = sites.find((s) => s._id === siteId);
    setForm((prev) => ({
      ...initialFormState,
      user: prev.user,
      site: siteId,
      region: selectedSite?.region || "",
      province: selectedSite?.province || "",
    }));

    if (siteId) {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/personnel/${siteId}`);
        const personnelData = res.data?.personnel || [];
        const getPersonnel = (role) => {
          const p = personnelData.find((p) => p.role === role);
          return p ? p.nom : "";
        };
        setForm((prev) => ({
          ...prev,
          medecin: {
            ...prev.medecin,
            titulaireNom: getPersonnel("medecin"),
            titulairePresent: !!getPersonnel("medecin"),
          },
          infirmiere1: {
            ...prev.infirmiere1,
            titulaireNom: getPersonnel("infirmiere1"),
            titulairePresent: !!getPersonnel("infirmiere1"),
          },
          infirmiere2: {
            ...prev.infirmiere2,
            titulaireNom: getPersonnel("infirmiere2"),
            titulairePresent: !!getPersonnel("infirmiere2"),
          },
          technicien: {
            ...prev.technicien,
            titulaireNom: getPersonnel("technicien"),
            titulairePresent: !!getPersonnel("technicien"),
          },
        }));
      } catch (error) {
        console.error("Aucun personnel trouvé pour ce site.", error);
      }
    }
  };

  const handlePersonnelChange = (role, value) =>
    setForm((prev) => ({ ...prev, [role]: value }));
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_BASE_URL}/api/v1/pointagevfinal`, {
        ...form,
        dateRequest: new Date(),
        heureDebut: form.heureDebut || new Date(),
      });
      setLoading(false);
      setSuccess("Pointage enregistré avec succès !");
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Une erreur est survenue.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Mode Admin : Pointage Manuel</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Stack spacing={2}>
            <FormControl fullWidth required>
              <InputLabel>Site</InputLabel>
              <Select
                name="site"
                value={form.site}
                label="Site"
                onChange={handleSiteChange}
              >
                {sites.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              select
              label="État de l'unité"
              name="actif"
              value={form.actif}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="actif">Actif</MenuItem>
              <MenuItem value="inactif">Inactif</MenuItem>
            </TextField>

            {form.actif === "actif" ? (
              <>
                <TextField
                  label="Heure de début"
                  name="heureDebut"
                  type="datetime-local"
                  // --- MODIFICATION APPLIQUÉE ICI ---
                  defaultValue={getLocalDateTimeForInput()}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />

                <PersonnelForm
                  label="Médecin"
                  value={form.medecin}
                  onChange={(v) => handlePersonnelChange("medecin", v)}
                />

                <PersonnelForm
                  label="Infirmière 1"
                  value={form.infirmiere1}
                  onChange={(v) => handlePersonnelChange("infirmiere1", v)}
                />

                <PersonnelForm
                  label="Infirmière 2"
                  value={form.infirmiere2}
                  onChange={(v) => handlePersonnelChange("infirmiere2", v)}
                />

                <PersonnelForm
                  label="Technicien"
                  value={form.technicien}
                  onChange={(v) => handlePersonnelChange("technicien", v)}
                />
              </>
            ) : (
              <TextField
                label="Motif d'inactivité"
                name="motifInactivite"
                value={form.motifInactivite}
                onChange={handleChange}
                fullWidth
                required
              />
            )}
          </Stack>
        </Box>{" "}
      </DialogContent>{" "}
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Fermer
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !form.site}
        >
          {loading ? <CircularProgress size={24} /> : "Enregistrer"}{" "}
        </Button>{" "}
      </DialogActions>{" "}
    </Dialog>
  );
}