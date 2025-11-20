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

const categories = [
  "Structure Bâtiment",
  "Dispositif Médicaux",
  "Matériel Informatique",
  "Fourniture",
  "équipement généreaux",
  "Connexion",
];

const categoryNeeds = {
  "Structure Bâtiment": [
    "ARMOIRE PHARMACEUTIQUE",
    "BACHE PUBLICITAIRE",
    "BANC CHAISE",
    "CACHE GROUPE ELECTROGENE",
    "CHAISE D'ACCUEIL",
    "CITERNE D'EAU EN PLASTIQUE",
    "EXTINCTEUR",
    "FLUXIBLE MELANGEUR",
    "GAZON ARTIFICIEL",
    "MECANISME CHASSE D'EAU (TOILETTE)",
    "MÉLANGEUR",
    "MINI-REFRIGERATEUR",
    "PERGOLA",
    "PORTE D'UNITÉ",
    "PORTRAIT DU ROI",
    "POUBELLE 10L",
    "POUBELLE 5L",
    "POUBELLE 90L",
    "PROJECTEUR EXTERIEUR",
    "PROJECTEUR INTERIEUR",
    "RAYONNAGE",
    "SOL À L'INTÉRIEUR",
    "TABLE",
    "TABOURET",
    "TOIT UNITÉ",
    "VASES PLANTES ARTIFICIELLES",
    "SERRURE INTELLIGENTE",
    "GERFLEX",
    "RAMPES D'ACCES",
  ],
  "Dispositif Médicaux": [
    "BALANCE",
    "BOITIER MEDIOT",
    "BRASSARD TENSIOMETRE",
    "CONCENTRATEUR OXYGENE",
    "DÉBITMÈTRES D'OXYGÈNE",
    "DERMATOSCOPE",
    "DIVAN D'EXAMEN",
    "DOCLICK",
    "ECG 12 Deriviations",
    "ECG 5 Deriviations",
    "GLUCOMETRE",
    "IRISCOPE",
    "LUNETTE OXYGÈNE",
    "MARTEAU REFLEXE",
    "NÉBULISEUR",
    "OTOSCOPE CONNECTÉ",
    "OTOSCOPE MANUEL",
    "OXYMÈTRE CONNECTÉ",
    "OXYMÈTRE MANUEL",
    "PÈSE BÉBÉ",
    "POTENCE",
    "RUBAN METRE TAILLE",
    "SONDE D'ÉCHOGRAPHIE",
    "STÉTHOSCOPE CONNECTÉ",
    "STÉTHOSCOPE MANUEL",
    "TENSIOMETRE CONNECTÉ",
    "TENSIOMETRE DIGITALE",
    "THERMOMÈTRE",
    "TOISE",
  ],
  "équipement généreaux": [
    "BATTERIE GROUPE ELECTROGENE",
    "CABLE LIAISON GROUPE ELECTROGENE",
    "CAISSE OUTILLAGE TECHNICIEN",
    "CAMERA SURVEILLANCE",
    "CANAPÉ",
    "CHAUFFE-EAU ÉLECTRIQUE",
    "CAGE GROUPE ELECTROGENE",
    "CLIMATISEUR",
    "ÉCRAN",
    "ESCABEAU",
    "GROUPE ELECTROGENE",
    "INVERSEUR",
    "ONDULEUR",
    "PRISE RJ45",
    "PRISE MONOPHASE",
    "RALLONGE 10M",
    "RALLONGE 4M",
    "RÉFRIGÉRATEUR",
    "TÉLÉRUPTEUR",
    "TV REMOTE CONTRÔLE",
  ],
  Fourniture: [
    "BLOC NOTE",
    "BLOUSE MEDECIN",
    "CACHET MEDECIN",
    "CACHET UNITE",
    "CARTON D'EMBALLAGE",
    "CELLOPHANE",
    "DRAP D'EXAMEN",
    "FLUORESCENT",
    "GEL D'ÉCHOGRAPHIE",
    "ORDONANCIER",
    "PAPIER A4",
    "PAPIER À BULLES",
    "PILES 2A",
    "PILES 3A",
    "PILES OTOSCOPE LR14-C",
    "GILET",
    "POCHETTE PLASTIQUE",
    "PRODUIT NETTOYAGE",
    "PYJAMA INFIRMIÈRE",
    "STYLO",
    "TONER D'IMPRIMANTE",
    "CARTON",
  ],
  "Matériel Informatique": [
    "ADAPTATEUR DISPLAY/HDMI",
    "ADAPTATEUR DVI",
    "CÂBLE JACK MÂLE-MÂLE",
    "CÂBLE EXTENSION USB 3.0",
    "CÂBLE HDMI 10M",
    "CABLE IMPRIMANTE USB",
    "CÂBLE RJ45",
    "CÂBLE SÉRIE A",
    "CÂBLE TACTILE 10M",
    "CABLE TENSIOMETRE",
    "CAMERA MOBILE",
    "CAMERA WEB",
    "CHARGEUR PC",
    "CHARGEUR SONDE ÉCHOGRAPHIE",
    "CHARGEUR STÉTHOSCOPE",
    "CHARGEUR TENSIOMETRE 6V",
    "CHARGEUR TYPE B",
    "CHARGEUR TYPE C",
    "CLAVIER LOGITECH",
    "CLÉ WIFI 5G",
    "DISQUE DUR",
    "ÉCRAN",
    "HUB USB",
    "IMPRIMANTE",
    "MIC JABRA",
    "MINI PC",
    "NVR",
    "PC PORTABLE",
    "ROUTEUR WIFI",
    "SWITCH",
    "TRANSFORMATEUR NVR 12V",
    "TRANSFORMATEUR NVR 48V",
  ],
  Connexion: ["SATELITE", "IAM", "ORANGE", "INWI", "CÂBLE UTP (ETHERNET)"],
};

function getInitialFormData(userInfo = {}) {
  return {
    name: "",
    categorie: "",
    besoin: "",
    quantite: "",
    technicien: userInfo.nomComplet || "",
    customCategorie: "",
    customBesoin: "",
    status: "créé",
    province: "",
    region: "",
    commentaire: "",
  };
}

const ModelFourniture = ({ open, onClose }) => {
  const [names, setNames] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [besoins, setBesoins] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  // Récupère les tickets pour ce besoin, isDeleted=false, isClosed=false
  const fetchExistingTickets = async (besoinValue) => {
    if (!besoinValue) {
      setExistingTickets([]);
      return;
    }
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/fournitureRoutes?besoin=${encodeURIComponent(
          besoinValue
        )}&isDeleted=false&isClosed=false`
      );
      setExistingTickets(response.data.fournitures || []);
    } catch (error) {
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

    if (name === "categorie") {
      setBesoins(categoryNeeds[value] || []);
    }
    if (name === "besoin") {
      fetchExistingTickets(value);
    }
    // Si on change le site et besoin déjà choisi, refetch pour ce site (déjà fait dans handleSelectChange)
  };

  const handleSubmit = async () => {
    const {
      name,
      categorie,
      besoin,
      quantite,
      technicien,
      customCategorie,
      customBesoin,
      commentaire,
      status,
    } = formData;

    const selectedCategorie =
      categorie === "Autre" ? customCategorie : categorie;
    const selectedBesoin = besoin === "Autre" ? customBesoin : besoin;

    if (
      !name ||
      !selectedCategorie ||
      !selectedBesoin ||
      !quantite ||
      !technicien
    ) {
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
      await axios.post(`${apiUrl}/api/v1/fournitureRoutes`, {
        name,
        region: formData.region,
        province: formData.province,
        categorie: selectedCategorie,
        besoin: selectedBesoin,
        quantite,
        technicien,
        commentaire,
        isClosed: false,
        status: formData.status,
        dateCreation: new Date(),
        dateCloture: null,
      });

      setSuccess("Ticket créé avec succès !");
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

  // Filtre pour billets du même site + besoin
  const sameSiteTickets = formData.besoin && formData.name
    ? existingTickets.filter(
        t => t.name === formData.name
      )
    : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Créer un Ticket Fourniture</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="row" alignItems="flex-start">
          {/* Formulaire à gauche */}
          <Box flex={2}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="select-label">Nom de l'Actif</InputLabel>
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
                  label="Technicien"
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
                  label="Region"
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
                  <InputLabel id="categorie-label">Catégorie</InputLabel>
                  <Select
                    labelId="categorie-label"
                    value={formData.categorie}
                    name="categorie"
                    onChange={handleChange}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="besoin-label">Besoin</InputLabel>
                  <Select
                    labelId="besoin-label"
                    value={formData.besoin}
                    name="besoin"
                    onChange={handleChange}
                  >
                    {besoins.map((besoin) => (
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
              <Grid item xs={12} sm={6}>
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
          {/* Message info à droite, seulement si besoin + tickets sur ce site */}
          {formData.besoin && sameSiteTickets.length > 0 && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: "#eee" }} />
              <Box width={320}>
                <Paper elevation={3} sx={{ p: 2, bgcolor: "#f5faff" }}>
                  <Alert severity="info" sx={{ bgcolor: "#e3f2fd", color: "#035388" }}>
                    <b>Commandes déjà créées pour ce site et cet équipement :</b>
                    <ul style={{ paddingLeft: 18, margin: 0, marginTop: 8 }}>
                      {sameSiteTickets.map((ticket) => (
                        <li key={ticket.id}>
                          {ticket.name} - {ticket.categorie} - Qté: {ticket.quantite} - Statut: {ticket.status}
                        </li>
                      ))}
                    </ul>
                  </Alert>
                </Paper>
              </Box>
            </>
          )}
        </Box>
        {/* Les alertes de validation/erreur sont flottantes en dessous */}
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

export default ModelFourniture;