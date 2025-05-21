import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Grid,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

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

const ModalSi = ({ open, onClose, onTicketCreated }) => {
  const [form, setForm] = useState({
    actif: "",
    technicien: "",
    region: "",
    province: "",
    categorie: "",
    probleme: "",
    description: "",
  });

  const [actifs, setActifs] = useState([]); // tableau d'objets { _id, name, region, province }
  const [technicien, setTechnicien] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);

  // Charger la liste des actifs de la même manière que dans tes autres composants
  useEffect(() => {
    const userIds = JSON.parse(localStorage.getItem("userActifs"));
    if (userIds && Array.isArray(userIds)) {
      Promise.all(
        userIds.map(async (id) => {
          try {
            const response = await fetch(`${apiUrl}/api/actifs/${id}`);
            if (response.ok) {
              return await response.json();
            }
          } catch (error) {
            // Optionnel : affiche l'erreur en console
            console.error(error);
          }
          return null;
        })
      ).then((results) => {
        const actifsFetched = results.filter(Boolean);
        setActifs(actifsFetched);
        if (actifsFetched.length > 0) {
          setForm((prev) => ({
            ...prev,
            actif: actifsFetched[0].name,
            region: actifsFetched[0].region || "",
            province: actifsFetched[0].province || "",
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            actif: "",
            region: "",
            province: "",
          }));
        }
      });
    } else {
      setActifs([]);
      setForm((prev) => ({
        ...prev,
        actif: "",
        region: "",
        province: "",
      }));
    }

    // Technicien (nom complet)
    const userRaw = window.localStorage.getItem("userInfo");
    if (userRaw) {
      try {
        const userInfo = JSON.parse(userRaw);
        if (userInfo && userInfo.nomComplet) {
          setTechnicien(userInfo.nomComplet);
          setForm((prev) => ({
            ...prev,
            technicien: userInfo.nomComplet,
          }));
        } else {
          setTechnicien("");
          setForm((prev) => ({
            ...prev,
            technicien: "",
          }));
        }
      } catch (e) {
        setTechnicien("");
        setForm((prev) => ({
          ...prev,
          technicien: "",
        }));
      }
    } else {
      setTechnicien("");
      setForm((prev) => ({
        ...prev,
        technicien: "",
      }));
    }
  }, [open]);

  // Quand l'actif change, on met à jour la région/province
  useEffect(() => {
    if (form.actif && actifs.length > 0) {
      const actifObj = actifs.find((item) => item.name === form.actif);
      setForm((prev) => ({
        ...prev,
        region: actifObj?.region || "",
        province: actifObj?.province || "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        region: "",
        province: "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.actif, actifs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categorie") {
      setForm({ ...form, categorie: value, probleme: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/api/v1/ticketSi`, form);
      setSnackbar({
        open: true,
        message: "Ticket créé avec succès",
        severity: "success",
      });
      if (onTicketCreated) onTicketCreated();
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Erreur lors de la création du ticket",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const problemes =
    form.categorie && problemesParCategorie[form.categorie]
      ? problemesParCategorie[form.categorie]
      : [];

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          Créer un nouveau ticket pour un Problème de SI
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Actif & Technicien */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Actif"
                name="actif"
                value={form.actif}
                onChange={handleChange}
                fullWidth
                margin="dense"
              >
                {actifs.length === 0 ? (
                  <MenuItem value="">Aucun actif disponible</MenuItem>
                ) : (
                  actifs.map((actif) => (
                    <MenuItem key={actif._id} value={actif.name}>
                      {actif.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Technicien"
                name="technicien"
                value={technicien}
                fullWidth
                margin="dense"
                disabled
              />
            </Grid>
            {/* Région & Province : automatiques, disabled */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Région"
                name="region"
                value={form.region}
                fullWidth
                margin="dense"
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Province"
                name="province"
                value={form.province}
                fullWidth
                margin="dense"
                disabled
              />
            </Grid>
            {/* Catégorie & Problème */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Catégorie de problème"
                name="categorie"
                value={form.categorie}
                onChange={handleChange}
                fullWidth
                margin="dense"
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Problème"
                name="probleme"
                value={form.probleme}
                onChange={handleChange}
                fullWidth
                margin="dense"
                disabled={!form.categorie}
              >
                {problemes.length === 0 ? (
                  <MenuItem value="">
                    Sélectionnez d'abord une catégorie
                  </MenuItem>
                ) : (
                  problemes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                margin="dense"
                multiline
                minRows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
            variant="outlined"
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Envoi..." : "Soumettre"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
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
};

export default ModalSi;
