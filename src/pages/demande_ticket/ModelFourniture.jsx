import React, { useEffect, useState } from "react";
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
    customBesoin: "",
    status: "", // Pour le champ personnalisé besoin
    province: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "Structure Bâtiment",
    "Dispositif Médicaux",
    "Matériel Informatique",
  ];

  // Define the needs for each category
  const categoryNeeds = {
    "Structure Bâtiment": [
      "CAMERA SURVILLANCE",
      "CLIMATISATION",
      "GROUPE ÉLECTROGÈNE",
    ],
    "Dispositif Médicaux": [
      "STETHOSCOPE",
      "CABLE HDMI",
      "CÂBLE RÉSEAU",
      "REFRIGERATEUR",
    ],
    "Matériel Informatique": ["ORDINATEUR", "ÉCRAN", "CLAVIER", "CÂBLE"],
  };

  const [besoins, setBesoins] = useState([]);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo); // Parse the stored JSON object
      if (userInfo.province) {
        setFormData((prevData) => ({
          ...prevData,
          province: userInfo.province,
          site: userInfo.site,
          technicien: userInfo.nomComplet,
        }));
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "categorie") {
      setBesoins(categoryNeeds[value] || []); // Update needs based on selected category
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

    try {
      const response = await axios.post(
        "https://maintenance-4-0-backend-9.onrender.com/api/v1/fournitureRoutes",
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
        status,
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
        {/* Province */}
        <TextField
          fullWidth
          label="Province"
          variant="outlined"
          name="province"
          value={formData.province}
          onChange={handleChange}
          margin="normal"
          disabled // Lecture seule
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
          disabled
        />
        {/* Status */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={handleChange}
            label="Status"
            name="status"
          >
            {["pending", "in-progress", "completed"].map((status, index) => (
              <MenuItem key={index} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
                {/* Capitalize first letter */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
