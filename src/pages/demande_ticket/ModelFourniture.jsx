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
} from "@mui/material";
import axios from "axios";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const ModelFourniture = ({ open, onClose }) => {
  const [names, setNames] = useState([]);
  const [Name, setSelectedName] = useState(""); // Sélection de l'actif
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "", // Ajoutez un champ pour le nom de l'actif
    categorie: "",
    besoin: "",
    quantite: "",
    technicien: "",
    customCategorie: "",
    customBesoin: "",
    status: "créé",
    province: "",
    region: "", // Add region to formData
    commentaire: "", // Ajout du commentaire
  });

  const [besoins, setBesoins] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      // ... autres besoins
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

      // ... autres besoins
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

      // ... autres besoins
    ],
    Fourniture: [
      "BLOC NOTE",
      "BLOUSE MEDECIN",
      "CACHET MEDECIN",
      "CACHET UNITE",
      "CARTON D'EMBALLAGE", // Ajouté ici
      "CELLOPHANE",
      "DRAP D'EXAMEN",
      "FLUORESCENT",
      "GEL D'ÉCHOGRAPHIE",
      "ORDONANCIER",
      "PAPIER A4",
      "PAPIER À BULLES", // Ajouté ici
      "RAMETTE DE PAPIER D'IMPRIMANTE",
      "PILES 2A",
      "PILES 3A",
      "PILES OTOSCOPE LR14-C",
      "POLAIRE",
      "POLO",
      "POCHETTE PLASTIQUE",
      "PRODUIT NETTOYAGE",
      "PYJAMA INFIRMIÈRE",
      "STYLO",
      "TONER D'IMPRIMANTE", // Renommé ici
      "CARTON",
    ],
    "Matériel Informatique": [
      "ADAPTATEUR DISPLAY/HDMI",
      "UNITÉ CENTRALE",
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

      // ... autres besoins
    ],
    Connexion: ["SATELITE", "IAM", "ORANGE", "INWI", "CÂBLE UTP (ETHERNET)"],
  };

  useEffect(() => {
    const userIds = JSON.parse(localStorage.getItem("userActifs"));
    if (userIds && Array.isArray(userIds)) {
      const fetchedNames = [];
      userIds.forEach(async (id) => {
        try {
          const response = await fetch(`${apiUrl}/api/actifs/${id}`);
          if (response.ok) {
            const data = await response.json();
            fetchedNames.push(data);
            if (fetchedNames.length === userIds.length) {
              setNames(fetchedNames);
              setSelectedName(fetchedNames[0]?.name || "");

              // Retrieve region and province from the fetched data
              const siteData = fetchedNames[0]; // Assuming the first result corresponds to the user site
              setFormData((prevData) => ({
                ...prevData,
                province: siteData.province, // Set province from the fetched data
                region: siteData.region, // Set region from the fetched data
              }));
            }
          } else {
            console.error(`Erreur pour l'ID ${id}: ${response.statusText}`);
          }
        } catch (error) {
          console.error(
            `Erreur lors de la récupération des données pour l'ID ${id}:`,
            error
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      if (userInfo.province) {
        setFormData((prevData) => ({
          ...prevData,

          site: userInfo.site,
          technicien: userInfo.nomComplet,
        }));
      }
    }
  }, []);

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setSelectedName(value); // Met à jour la sélection de l'actif
    setFormData((prevData) => ({
      ...prevData,
      name: value, // Mise à jour de l'état formData pour le champ 'name'
    }));

    // Find the selected actif's region and province
    const selectedActif = names.find((actif) => actif.name === value);
    if (selectedActif) {
      setFormData((prevData) => ({
        ...prevData,
        region: selectedActif.region || "", // Set region from the selected actif
        province: selectedActif.province || "", // Set province from the selected actif
      }));
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
    setIsSubmitting(true); // Désactiver le bouton

    try {
      const response = await axios.post(`${apiUrl}/api/v1/fournitureRoutes`, {
        name,
        region: formData.region,
        province: formData.province,
        categorie: selectedCategorie,
        besoin: selectedBesoin,
        quantite,
        technicien,
        commentaire, // Ajout du commentaire
        isClosed: false, // Par défaut à false
        status: formData.status,
        dateCreation: new Date(),
        dateCloture: null, // Par défaut à null
      });

      setSuccess("Ticket créé avec succès !");
      console.log("Réponse de l'API :", response.data);

      setFormData({
        name: "",
        categorie: "",
        besoin: "",
        quantite: "",
        technicien: "",
        customCategorie: "",
        customBesoin: "",
        status: "",
        commentaire: "",
        status: "", // Réinitialisation du champ commentaire
      });

      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Une erreur s'est produite lors de la création du ticket.");
      console.error("Erreur API :", err);
    }
    setIsSubmitting(false); // Désactiver le bouton
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Créer un Ticket Fourniture</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

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

          {/* {formData.besoin === "Autre" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Autre Besoin"
                name="customBesoin"
                value={formData.customBesoin}
                onChange={handleChange}
              />
            </Grid>
          )} */}

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
