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
import Autocomplete from "@mui/material/Autocomplete";

const ModelFourniture = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    categorie: null,
    besoin: null,
    quantite: "",
    technicien: "", // Nouveau champ pour le technicien
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Categories list
  const categories = [
    "Structure Bâtiment",
    "Dispositif Médicaux",
    "Matériel Informatique",
  ];
  // Besoin list
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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { name, categorie, besoin, quantite, technicien } = formData;

    // Validation: Check if all fields are filled
    if (!name || !categorie || !besoin || !quantite || !technicien) {
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
        formData
      );

      setSuccess("Ticket créé avec succès !");
      console.log("Réponse de l'API :", response.data);

      setFormData({
        name: "",
        categorie: "",
        besoin: "",
        quantite: "",
        technicien: "", // Réinitialisation du champ technicien
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

        {/* Site (remplacement du champ Technicien) */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Site</InputLabel>
          <Select
            value={formData.name}
            onChange={handleChange}
            label="Site"
            name="name"
          >
            {/* Replace with your list of sites */}
            {[
              "UM ABEDLGHAYA SOUAHEL",
              "UM AIT BOUALI",
              "UM ADASSIL",
              "UM AIT MAJDEN",
              "UM AGHBALA",
              "UM AIT M'HAMED",
              "UM AGUELMAM AZEGZA",
              "UM AGHBALA",
              "UM AIT AYACH",
              "UM BOUTFARDA",
              "UM AIT HANI",
              "UM AGALMAM AZAGZA",
              "UM AIT MAJDEN",
              "UM EL KBAB",
              "UM AIT MHAMED",
              "UM SIDI HSAIN",
              "UM AL KAITOUNE",
              "UM M'GARTO",
              "UM ALLOUGOUM",
              "UM Ouled Hmida Tmassine",
              "UM ALMIS GUIGOU",
              "UM KHMISS KSSIBA",
              "UM AMELLAGOU",
              "UM AMELLAGOU",
              "UM AMIZMIZ",
              "UM MELLAB",
              "UM ARBAA BENI FTAH",
              "UM AIT AYACH",
              "UM ASNI",
              "UM GUIR",
              "UM ASSEBBAB",
              "UM IMI NOULAOUNE",
              "UM BAB BERRED",
              "UM KSAR TOUROUG",
              "UM AIT HANI",
              "UM BNI OUAL",
              "UM HSSIA",
              "UM BOUCHAOUNE",
              "UM IGHIL N'OUMGOUN",
              "UM BOUTIJOUTE",
              "UM FAZOUATA",
              "UM EZZAOUITE",
              "UM TAGHBALT",
              "UM IGHEZREN",
              "UM ALMIS GUIGOU",
              "UM IGHIL NOUMGOUN",
              "UM OUTAT EL HAJ",
              "UM IMI NOULAOUEN",
              "UM SERGHINA",
              "UM OULAD MIMOUN",
              "UM KHMIS KSIBA",
              "UM IGHEZREN",
              "UM MEGARTO",
              "UM TAGHBALT",
              "UM GHAFSSAY",
              "UM MZOUDA",
              "UM RAS EL OUED",
              "UM NZALA AIT IZDEG",
              "UM SIDI YAHYA BNI ZEROUAL",
              "UM OUIRGANE",
              "UM BNI FRASSEN",
              "UM BNI FTAH",
              "UM OULAD GHZYEL",
              "UM BNI BOUFRAH",
              "UM BAB BERRED",
              "UM HAD BNI CHIKER",
              "UM BOUDINAR",
              "UM EL KHERFAN",
              "UM OULED HMIDA TAMASSINE",
              "UM SIDI REDOUANE",
            ].map((site, index) => (
              <MenuItem key={index} value={site}>
                {site}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Catégorie: Autocomplete for typing and selecting options */}
        <Autocomplete
          value={formData.categorie}
          onChange={(event, newValue) => {
            setFormData((prevData) => ({
              ...prevData,
              categorie: newValue,
            }));
          }}
          options={categories}
          isOptionEqualToValue={(option, value) => option === value} // Personnalisation de la comparaison
          renderInput={(params) => (
            <TextField
              {...params}
              label="Catégorie"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          )}
        />

        {/* Besoin: Autocomplete for typing and selecting options */}
        <Autocomplete
          value={formData.besoin}
          onChange={(event, newValue) => {
            setFormData((prevData) => ({
              ...prevData,
              besoin: newValue,
            }));
          }}
          options={besoins}
          isOptionEqualToValue={(option, value) => option === value} // Personnalisation de la comparaison
          renderInput={(params) => (
            <TextField
              {...params}
              label="Besoin"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          )}
        />

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
