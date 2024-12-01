import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const ModelFourniture = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    categorie: "",
    besoin: "",
    quantite: "",
    technicien: "",
    customCategorie: "", // Pour le champ personnalisé catégorie
    customBesoin: "", // Pour le champ personnalisé besoin
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "Structure Bâtiment",
    "Dispositif Médicaux",
    "Matériel Informatique",
  ];

  const besoins = [
    "CAMERA SURVILLANCE",
    "CLIMATISATION",
    "RENDEZ-VOUS",
    "CONNEXION",
    "STETHOSCOPE",
    "CABLE HDMI",
    "CÂBLE RÉSEAU",
    "ORDINATEUR",
    "ÉCRAN",
    "ECG",
    "MIC JABRA",
    "GROUPE ÉLECTROGÈNE",
    "VISIONSTATION",
    "APK ECG",
    "TACTILE",
    "CAMERA WEB",
    "CAMERA MOBILE",
    "NVR",
    "APK ECHOGRAPHIE",
    "BOITIER TELE MEDECINE",
    "HUB",
    "PARTAGER PERIPHERIQUE",
    "SONDE ECHOGRAPHIE",
    "OTOSCOPE",
    "IRISCOPE",
    "DERMATOSCOPE",
    "SANITAIRE",
    "REFRIGERATEUR",
    "SATELLITE",
    "TABLET",
    "DOCLICK",
    "TERMOMETRE",
    "CABLE",
    "OXEMETRE",
    "BOITE ALIMENTATION",
    "NAVIGATEUR",
    "ELECTRICITE",
    "HAUT-PARLEUR JABRA",
    "INVERSEUR",
    "TENSIOMETRE",
    "SATURATION",
    "CLAVIER",
    "Télérupteur",
    "RÉFRIGÉRATEUR",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    } = formData;

    // Si "Autre" est sélectionné pour catégorie ou besoin, utiliser la valeur personnalisée
    const selectedCategorie =
      categorie === "Autre" ? customCategorie : categorie;
    const selectedBesoin = besoin === "Autre" ? customBesoin : besoin;

    // Validation
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

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/fournitureRoutes",
        { ...formData, categorie: selectedCategorie, besoin: selectedBesoin }
      );

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
      });

      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Une erreur s'est produite lors de la création du ticket.");
      console.error("Erreur API :", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Créer un Ticket Fourniture</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <FormControl fullWidth margin="normal">
          <InputLabel>Site</InputLabel>
          <Select
            value={formData.name}
            onChange={handleChange}
            label="Site"
            name="name"
          >
            {["Site 1", "Site 2", "Site 3"].map((site, index) => (
              <MenuItem key={index} value={site}>
                {site}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Catégorie */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Catégorie</InputLabel>
          <Select
            value={formData.categorie}
            onChange={handleChange}
            label="Catégorie"
            name="categorie"
          >
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
            <MenuItem value="Autre">Autre</MenuItem>
          </Select>
        </FormControl>
        {formData.categorie === "Autre" && (
          <TextField
            fullWidth
            label="Nouvelle Catégorie"
            variant="outlined"
            name="customCategorie"
            value={formData.customCategorie}
            onChange={handleChange}
            margin="normal"
          />
        )}

        {/* Besoin */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Besoin</InputLabel>
          <Select
            value={formData.besoin}
            onChange={handleChange}
            label="Besoin"
            name="besoin"
          >
            {besoins.map((need, index) => (
              <MenuItem key={index} value={need}>
                {need}
              </MenuItem>
            ))}
            <MenuItem value="Autre">Autre</MenuItem>
          </Select>
        </FormControl>
        {formData.besoin === "Autre" && (
          <TextField
            fullWidth
            label="Nouveau Besoin"
            variant="outlined"
            name="customBesoin"
            value={formData.customBesoin}
            onChange={handleChange}
            margin="normal"
          />
        )}

        {/* Quantité */}
        <TextField
          fullWidth
          label="Quantité"
          variant="outlined"
          name="quantite"
          value={formData.quantite}
          onChange={handleChange}
          margin="normal"
          type="number"
        />

        {/* Technicien */}
        <TextField
          fullWidth
          label="Technicien"
          variant="outlined"
          name="technicien"
          value={formData.technicien}
          onChange={handleChange}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Soumettre
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModelFourniture;
