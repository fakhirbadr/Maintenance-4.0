import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Alert,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import axios from "axios";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

// Liste des besoins pharmaceutiques
const besoinsPharmaceutiques = [
  "Glucomètre",
  "Lunette oxygène",
  "Ordonnanceur",
  "Gel d'échographie",
  "Drap d'examen",
  "Toise",
];

const ModelPharmaceutique = ({ open, onClose }) => {
  const [names, setNames] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitialFormData = (userInfoData = {}) => ({
    name: "",
    region: "",
    province: "",
    besoin: "",
    quantite: 1,
    technicien: userInfoData.nomComplet || "",
    commentaire: "",
    status: "créé",
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [userInfo, setUserInfo] = useState({});
  const [existingTickets, setExistingTickets] = useState([]);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfoData = JSON.parse(storedUserInfo);
      setUserInfo(userInfoData);
      setFormData(getInitialFormData(userInfoData));
    }
  }, []);

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
            console.error(
              `Erreur lors de la récupération des données pour l'ID ${id}:`,
              error
            );
          }
          return null;
        })
      ).then((results) => {
        const actifs = results.filter(Boolean);
        setNames(actifs);
        if (actifs.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            name: actifs[0]?.name || "",
            province: actifs[0]?.province || "",
            region: actifs[0]?.region || "",
          }));
        }
      });
    }
  }, []);

  // Récupère les tickets pharmaceutiques existants pour ce besoin
  const fetchExistingTickets = async (besoinValue) => {
    if (!besoinValue) {
      setExistingTickets([]);
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(
        `${apiUrl}/api/v1/ticketPharmaceutique`,
        { headers }
      );
      
      // Filtrer les tickets pour ce besoin, non supprimés, non clôturés
      const filtered = response.data.filter(
        (t) => t.besoin === besoinValue && !t.isDeleted && !t.isClosed
      );
      setExistingTickets(filtered);
    } catch (error) {
      console.error("Erreur lors de la récupération des tickets:", error);
      setExistingTickets([]);
    }
  };

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      name: value,
    }));
    const selectedActif = names.find((actif) => actif.name === value);
    if (selectedActif) {
      setFormData((prevData) => ({
        ...prevData,
        region: selectedActif.region || "",
        province: selectedActif.province || "",
      }));
    }
    // Si besoin déjà choisi, refetch pour ce nom
    if (formData.besoin) {
      fetchExistingTickets(formData.besoin);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "besoin") {
      fetchExistingTickets(value);
    }
  };

  const handleSubmit = async () => {
    const { name, besoin, quantite, technicien, commentaire } = formData;

    if (!name || !besoin || !quantite || !technicien) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (quantite <= 0) {
      setError("La quantité doit être supérieure à zéro.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(
        `${apiUrl}/api/v1/ticketPharmaceutique`,
        {
          name,
          region: formData.region,
          province: formData.province,
          categorie: "Pharmaceutique",
          besoin,
          quantite,
          technicien,
          commentaire,
          isClosed: false,
          status: formData.status,
          dateCreation: new Date(),
          dateCloture: null,
        },
        { headers }
      );

      setSuccess("Ticket pharmaceutique créé avec succès !");
      setFormData(getInitialFormData(userInfo));

      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Une erreur s'est produite lors de la création du ticket.");
      console.error("Erreur API :", err);
    }
    setIsSubmitting(false);
  };

  // Filtrer les tickets du même site
  const sameSiteTickets =
    formData.besoin && formData.name
      ? existingTickets.filter((t) => t.name === formData.name)
      : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Créer un Besoin Pharmaceutique</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="row" alignItems="flex-start">
          {/* Formulaire à gauche */}
          <Box flex={2}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="select-label">Nom de l'Unité</InputLabel>
                  <Select
                    labelId="select-label"
                    value={formData.name}
                    onChange={handleSelectChange}
                  >
                    {names.map((actif) => (
                      <MenuItem key={actif._id} value={actif.name}>
                        {actif.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Demandeur"
                  name="technicien"
                  value={formData.technicien}
                  onChange={handleChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Région"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="besoin-label">Besoin Pharmaceutique</InputLabel>
                  <Select
                    labelId="besoin-label"
                    value={formData.besoin}
                    name="besoin"
                    onChange={handleChange}
                  >
                    {besoinsPharmaceutiques.map((besoin) => (
                      <MenuItem key={besoin} value={besoin}>
                        {besoin}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Quantité"
                  name="quantite"
                  type="number"
                  value={formData.quantite}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Commentaire"
                  name="commentaire"
                  value={formData.commentaire}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
          {/* Message info à droite si tickets existants pour ce site */}
          {formData.besoin && sameSiteTickets.length > 0 && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 2, bgcolor: "#eee" }}
              />
              <Box width={320}>
                <Paper elevation={3} sx={{ p: 2, bgcolor: "#f5faff" }}>
                  <Alert
                    severity="info"
                    sx={{ bgcolor: "#e3f2fd", color: "#035388" }}
                  >
                    <b>Demandes déjà créées pour ce site et cet équipement :</b>
                    <ul style={{ paddingLeft: 18, margin: 0, marginTop: 8 }}>
                      {sameSiteTickets.map((ticket) => (
                        <li key={ticket._id}>
                          {ticket.name} - {ticket.besoin} - Qté: {ticket.quantite} - Statut: {ticket.status}
                        </li>
                      ))}
                    </ul>
                  </Alert>
                </Paper>
              </Box>
            </>
          )}
        </Box>
        {/* Alertes de validation/erreur */}
        <Box mt={2}>
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 1 }}>
              {success}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} color="primary">
          Soumettre
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModelPharmaceutique;
